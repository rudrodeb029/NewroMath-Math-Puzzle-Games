import 'dart:async';
import 'dart:math' as math;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_database/firebase_database.dart';

import '../data/levels_catalog.dart';
import '../models/game_models.dart';
import 'cache_service.dart';
import 'security_service.dart';
import 'storage_service.dart';

/// Firebase Realtime Database + Cloud Firestore sync service with 30-min SWR
/// leaderboard caching and safe graceful no-op fallback when Firebase isn't
/// configured or initialized.
class FirebaseSyncService {
  FirebaseSyncService._();

  static final FirebaseSyncService instance = FirebaseSyncService._();

  static const String _playerIdKey = 'newromath_player_id';
  static const String _milestoneSigKey = 'newromath_fs_milestone_sig';
  static const String _lastFsSyncTsKey = 'newromath_fs_last_sync_ts';
  static const Duration _firestoreMinInterval = Duration(minutes: 15);
  static const Duration leaderboardSwrTtl = Duration(minutes: 30);

  Timer? _syncDebounceTimer;
  bool _initializedAttempted = false;

  /// Returns `true` if at least one [FirebaseApp] is configured and active.
  bool get isConfigured {
    try {
      return Firebase.apps.isNotEmpty;
    } catch (_) {
      return false;
    }
  }

  /// Safely initializes Firebase if configured on the current platform.
  /// Returns `false` without throwing when unconfigured (e.g. tests/desktop).
  Future<bool> initialize() async {
    if (_initializedAttempted) return isConfigured;
    _initializedAttempted = true;
    try {
      if (Firebase.apps.isEmpty) {
        await Firebase.initializeApp();
      }
      return Firebase.apps.isNotEmpty;
    } catch (_) {
      return false;
    }
  }

  /// Returns the persisted player ID or generates a new deterministic-format ID.
  Future<String> getOrCreatePlayerId(StorageService storage) async {
    final existing = storage.getString(_playerIdKey);
    if (existing != null && existing.trim().length > 4) {
      return existing.trim();
    }
    final rng = math.Random();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    final suffix =
        List<String>.generate(8, (_) => chars[rng.nextInt(chars.length)]).join();
    final ts = DateTime.now().millisecondsSinceEpoch.toRadixString(36);
    final newId = 'player_${ts}_$suffix';
    await storage.setString(_playerIdKey, newId);
    return newId;
  }

  /// Builds a normalized player cloud snapshot from [StorageService].
  Future<Map<String, dynamic>> buildSnapshotFromStorage(
    StorageService storage,
  ) async {
    final playerId = await getOrCreatePlayerId(storage);
    final nowMs = DateTime.now().millisecondsSinceEpoch;
    final security = SecurityService.instance;
    final econ = security.readEconomyFromStorage(storage);

    final playerName =
        (storage.getString('newromath_player_name') ?? GameDefaults.defaultPlayerName)
            .trim();
    final playerCountry = (storage.getString('newromath_player_country') ??
            GameDefaults.defaultPlayerCountry)
        .trim();
    final countryFlag = playerCountries
            .where((c) => c.name == playerCountry)
            .map((c) => c.flag)
            .firstOrNull ??
        '🌐';
    final playerPhone = (storage.getString('newromath_player_phone') ?? '').trim();
    final playerEmail = (storage.getString('newromath_player_email') ?? '').trim();
    final equippedAvatar =
        storage.getString('newromath_player_avatar') ?? AppAssets.robotAvatar;

    final selectedLevelNum = security.clampPlayerLevel(
      storage.getInt(SecurityService.keySelectedLevel, defaultValue: 1),
    );
    final dailyCrateLastClaimed =
        storage.getString('newromath_daily_crate_last_claimed') ?? '';

    final dailyChallenges = <String, List<int>>{};
    for (final key in storage.keysWithPrefix('newromath_daily_completed_')) {
      final seasonKey = key.replaceFirst('newromath_daily_completed_', '');
      dailyChallenges[seasonKey] = storage.getIntList(key);
    }

    final rawRecords = storage.getJson('newromath_puzzle_records');
    final puzzleRecords = rawRecords is List
        ? rawRecords.take(50).toList()
        : <dynamic>[];
    final savedPuzzles = storage.getStringList('newromath_saved_puzzles');

    return <String, dynamic>{
      'playerId': playerId,
      'updatedAt': nowMs,
      'profile': <String, dynamic>{
        'playerId': playerId,
        'playerName': playerName,
        'playerCountry': playerCountry,
        'countryFlag': countryFlag,
        'playerPhone': playerPhone,
        'playerEmail': playerEmail,
        'equippedAvatar': equippedAvatar,
        'updatedAt': nowMs,
      },
      'progress': <String, dynamic>{
        'unlockedLevelMax': econ.unlockedLevel,
        'playerLevel': econ.playerLevel,
        'selectedLevelNum': selectedLevelNum,
        'playerXp': econ.xp,
        'coins': econ.coins,
        'gems': econ.gems,
        'isProUser': econ.isPro,
        'dailyCrateLastClaimed': dailyCrateLastClaimed,
        'updatedAt': nowMs,
      },
      'settings': <String, dynamic>{
        'isDarkMode': storage.getBool('newromath_dark_mode', defaultValue: false),
        'soundEnabled': storage.getBool('newromath_sound', defaultValue: true),
        'hapticsEnabled': storage.getBool('newromath_haptics', defaultValue: true),
        'notificationsEnabled':
            storage.getBool('newromath_notifications', defaultValue: true),
        'timerEnabled': storage.getBool('newromath_timer', defaultValue: true),
        'explanationEnabled':
            storage.getBool('newromath_explanation', defaultValue: true),
        'autoSubmitEnabled':
            storage.getBool('newromath_autosubmit', defaultValue: false),
        'largeFontEnabled':
            storage.getBool('newromath_largefont', defaultValue: true),
        'divisionSymbol': storage.getString('newromath_div_symbol') ?? '÷',
      },
      'dailyChallenges': dailyChallenges,
      'puzzleRecords': puzzleRecords,
      'savedPuzzles': savedPuzzles,
    };
  }

  /// Debounces cloud sync by 3.5 seconds when `newromath_*` storage keys mutate.
  void scheduleSync({String? changedKey}) {
    if (changedKey != null && !changedKey.startsWith('newromath_')) return;
    _syncDebounceTimer?.cancel();
    _syncDebounceTimer = Timer(const Duration(milliseconds: 3500), () {
      unawaited(syncPlayerNow());
    });
  }

  bool _shouldWriteFirestoreMilestone(
    StorageService storage,
    Map<String, dynamic> snapshot,
    bool force,
  ) {
    if (force) return true;
    final profile = snapshot['profile'] as Map<String, dynamic>? ?? const {};
    final progress = snapshot['progress'] as Map<String, dynamic>? ?? const {};

    final currentSig = [
      progress['unlockedLevelMax'],
      progress['playerLevel'],
      progress['isProUser'],
      profile['playerName'],
      profile['playerCountry'],
      profile['playerPhone'],
      profile['playerEmail'],
      profile['equippedAvatar'],
    ].join('|');

    final prevSig = storage.getString(_milestoneSigKey) ?? '';
    final lastTs = storage.getInt(_lastFsSyncTsKey, defaultValue: 0);
    final nowMs = DateTime.now().millisecondsSinceEpoch;

    if (currentSig != prevSig ||
        nowMs - lastTs >= _firestoreMinInterval.inMilliseconds) {
      unawaited(storage.setString(_milestoneSigKey, currentSig));
      unawaited(storage.setInt(_lastFsSyncTsKey, nowMs));
      return true;
    }
    return false;
  }

  /// Syncs the player snapshot to Realtime DB + milestone-throttled Firestore.
  /// Safe no-op (returns `false`) when Firebase is not configured.
  Future<bool> syncPlayerNow({
    bool forceFirestore = false,
    Map<String, dynamic>? customSnapshot,
  }) async {
    final storage = StorageService.instance;
    final security = SecurityService.instance;
    await security.verifyAndSanitizeStorage(storage);

    final snapshot =
        customSnapshot ?? await buildSnapshotFromStorage(storage);
    final playerId = (snapshot['playerId'] ?? 'player_guest_default').toString();
    final profile =
        Map<String, dynamic>.from(snapshot['profile'] as Map? ?? const {});
    final progress =
        Map<String, dynamic>.from(snapshot['progress'] as Map? ?? const {});

    await CacheService.instance.setSwr<Map<String, dynamic>>(
      'user_$playerId',
      snapshot,
      ttl: leaderboardSwrTtl,
    );

    if (!isConfigured) {
      return false;
    }

    final unlockedMax = (progress['unlockedLevelMax'] as num?)?.toInt() ?? 1;
    final playerLvl = (progress['playerLevel'] as num?)?.toInt() ?? 1;
    final xp = (progress['playerXp'] as num?)?.toInt() ?? 0;
    final coins = (progress['coins'] as num?)?.toInt() ?? 500;
    final isPro = progress['isProUser'] == true;
    final score = xp + unlockedMax * 500 + coins;

    final leaderboardEntry = <String, dynamic>{
      'playerId': playerId,
      'name': profile['playerName'] ?? GameDefaults.defaultPlayerName,
      'country': profile['playerCountry'] ?? GameDefaults.defaultPlayerCountry,
      'flag': profile['countryFlag'] ?? '🌐',
      'avatar': profile['equippedAvatar'] ?? AppAssets.robotAvatar,
      'level': math.max(playerLvl, unlockedMax),
      'xp': xp,
      'score': score,
      'coins': coins,
      'isProUser': isPro,
      'updatedAt': snapshot['updatedAt'],
    };

    var rtdbOk = false;
    var fsOk = false;

    try {
      final db = FirebaseDatabase.instance;
      await db.ref('users/$playerId').set(snapshot);
      await db.ref('leaderboard/$playerId').set(leaderboardEntry);
      rtdbOk = true;
    } catch (_) {
      await CacheService.instance.enqueueOfflineWrite(
        OfflineWriteItem(
          id: 'rtdb_user_$playerId',
          target: 'rtdb:users/$playerId',
          payload: snapshot,
          createdAtMs: DateTime.now().millisecondsSinceEpoch,
        ),
      );
    }

    if (_shouldWriteFirestoreMilestone(storage, snapshot, forceFirestore)) {
      try {
        final fs = FirebaseFirestore.instance;
        await fs
            .collection('users')
            .doc(playerId)
            .set(snapshot, SetOptions(merge: true));
        await fs
            .collection('leaderboard')
            .doc(playerId)
            .set(leaderboardEntry, SetOptions(merge: true));
        fsOk = true;
      } catch (_) {
        await CacheService.instance.enqueueOfflineWrite(
          OfflineWriteItem(
            id: 'fs_user_$playerId',
            target: 'firestore:users/$playerId',
            payload: snapshot,
            createdAtMs: DateTime.now().millisecondsSinceEpoch,
          ),
        );
      }
    }

    return rtdbOk || fsOk;
  }

  /// Pulls a cloud snapshot for [playerId] using 30-min SWR cache + RTDB/Firestore.
  Future<Map<String, dynamic>?> pullCloudSnapshot(String playerId) async {
    final cached = await CacheService.instance.getSwr<Map<String, dynamic>>(
      'user_$playerId',
      (raw) => raw is Map
          ? Map<String, dynamic>.from(raw)
          : <String, dynamic>{},
    );
    if (cached.hasData && cached.isFresh) {
      return cached.data;
    }

    if (!isConfigured) {
      return cached.data;
    }

    try {
      final rtdbSnap = await FirebaseDatabase.instance.ref('users/$playerId').get();
      if (rtdbSnap.exists && rtdbSnap.value is Map) {
        final map = Map<String, dynamic>.from(rtdbSnap.value! as Map);
        await CacheService.instance.setSwr(
          'user_$playerId',
          map,
          ttl: leaderboardSwrTtl,
        );
        return map;
      }
    } catch (_) {
      // Fallback to Firestore below.
    }

    try {
      final doc = await FirebaseFirestore.instance
          .collection('users')
          .doc(playerId)
          .get();
      if (doc.exists && doc.data() != null) {
        final map = doc.data()!;
        await CacheService.instance.setSwr(
          'user_$playerId',
          map,
          ttl: leaderboardSwrTtl,
        );
        return map;
      }
    } catch (_) {
      // Offline / unconfigured fallback.
    }

    return cached.data;
  }

  /// Fetches the global leaderboard using 30-min SWR caching.
  /// Returns cached/fallback entries smoothly if Firebase isn't configured or offline.
  Future<List<LeaderboardEntry>> fetchLeaderboard({
    bool forceRefresh = false,
    String? currentPlayerId,
  }) async {
    if (!forceRefresh) {
      final cached = await CacheService.instance.getSwr<List<LeaderboardEntry>>(
        'global_leaderboard',
        (raw) => _decodeLeaderboardList(raw, currentPlayerId: currentPlayerId),
      );
      if (cached.hasData && cached.isFresh && cached.data!.isNotEmpty) {
        return cached.data!;
      }
      if (cached.hasData && !cached.isFresh && cached.data!.isNotEmpty) {
        unawaited(_refreshLeaderboardInBackground(currentPlayerId: currentPlayerId));
        return cached.data!;
      }
    }

    final remote = await _refreshLeaderboardInBackground(
      currentPlayerId: currentPlayerId,
    );
    if (remote.isNotEmpty) return remote;
    return fallbackLeaderboard;
  }

  Future<List<LeaderboardEntry>> _refreshLeaderboardInBackground({
    String? currentPlayerId,
  }) async {
    if (!isConfigured) {
      return <LeaderboardEntry>[];
    }

    try {
      final snap = await FirebaseDatabase.instance.ref('leaderboard').get();
      if (snap.exists && snap.value is Map) {
        final rawMap = snap.value! as Map;
        final rawList = rawMap.values
            .whereType<Map>()
            .map((e) => Map<String, dynamic>.from(e))
            .toList()
          ..sort(
            (a, b) => ((b['score'] ?? b['xp'] ?? 0) as num)
                .compareTo((a['score'] ?? a['xp'] ?? 0) as num),
          );
        await CacheService.instance.setSwr(
          'global_leaderboard',
          rawList,
          ttl: leaderboardSwrTtl,
        );
        return _decodeLeaderboardList(rawList, currentPlayerId: currentPlayerId);
      }
    } catch (_) {
      // Try Firestore fallback below.
    }

    try {
      final query = await FirebaseFirestore.instance
          .collection('leaderboard')
          .orderBy('score', descending: true)
          .limit(50)
          .get();
      if (query.docs.isNotEmpty) {
        final rawList = query.docs.map((d) => d.data()).toList();
        await CacheService.instance.setSwr(
          'global_leaderboard',
          rawList,
          ttl: leaderboardSwrTtl,
        );
        return _decodeLeaderboardList(rawList, currentPlayerId: currentPlayerId);
      }
    } catch (_) {
      // Offline fallback.
    }

    return <LeaderboardEntry>[];
  }

  List<LeaderboardEntry> _decodeLeaderboardList(
    dynamic raw, {
    String? currentPlayerId,
  }) {
    if (raw is! List) return <LeaderboardEntry>[];
    final entries = <LeaderboardEntry>[];
    var rank = 1;
    for (final item in raw) {
      if (item is! Map) continue;
      final map = Map<String, dynamic>.from(item);
      final id = (map['playerId'] ?? '').toString();
      final level = (map['level'] as num?)?.toInt() ?? 1;
      final avatarRaw = (map['avatar'] ?? AppAssets.robotAvatar).toString();
      final avatarAsset = avatarRaw.startsWith('/assets/')
          ? avatarRaw.replaceFirst('/assets/', 'assets/images/')
          : avatarRaw;
      entries.add(
        LeaderboardEntry(
          rank: rank++,
          playerId: id,
          name: (map['name'] ?? GameDefaults.defaultPlayerName).toString(),
          country: (map['country'] ?? GameDefaults.defaultPlayerCountry).toString(),
          flag: (map['flag'] ?? '🌐').toString(),
          avatarAsset: avatarAsset,
          level: level,
          xp: (map['xp'] as num?)?.toInt() ?? 0,
          score: (map['score'] as num?)?.toInt() ?? 0,
          coins: (map['coins'] as num?)?.toInt() ?? 0,
          isProUser: map['isProUser'] == true,
          title: level >= 20
              ? 'Apex Sovereign'
              : level >= 12
                  ? 'Cyber Master'
                  : 'Math Explorer',
          isCurrentUser: currentPlayerId != null && id == currentPlayerId,
        ),
      );
    }
    return entries;
  }

  /// Submits a support/feedback ticket to Firestore and Realtime DB.
  Future<bool> submitFeedbackTicket({
    required String category,
    required String message,
    String email = '',
  }) async {
    final storage = StorageService.instance;
    final playerId = await getOrCreatePlayerId(storage);
    final nowMs = DateTime.now().millisecondsSinceEpoch;
    final ticketId = 'ticket_${nowMs}_${math.Random().nextInt(99999)}';

    final ticket = <String, dynamic>{
      'ticketId': ticketId,
      'playerId': playerId,
      'playerName':
          storage.getString('newromath_player_name') ?? GameDefaults.defaultPlayerName,
      'playerCountry': storage.getString('newromath_player_country') ??
          GameDefaults.defaultPlayerCountry,
      'email': email.isNotEmpty
          ? email
          : (storage.getString('newromath_player_email') ?? ''),
      'category': category.isNotEmpty ? category : 'General',
      'message': message,
      'playerLevel': storage.getInt(SecurityService.keyPlayerLevel, defaultValue: 1),
      'isProUser': storage.getBool(SecurityService.keyIsPro, defaultValue: false),
      'status': 'open',
      'createdAt': nowMs,
    };

    if (!isConfigured) return false;

    var ok = false;
    try {
      await FirebaseFirestore.instance
          .collection('feedback_tickets')
          .doc(ticketId)
          .set(ticket);
      ok = true;
    } catch (_) {
      // Queue or ignore.
    }

    try {
      await FirebaseDatabase.instance.ref('feedback_tickets/$ticketId').set(ticket);
      ok = true;
    } catch (_) {
      // Ignore.
    }

    return ok;
  }

  /// Records a completed IAP purchase to Firestore and Realtime DB.
  Future<bool> recordPurchase({
    required String productId,
    String? title,
    String? price,
    int rewardCoins = 0,
    int rewardGems = 0,
    bool grantPro = false,
  }) async {
    if (!isConfigured) return false;

    final storage = StorageService.instance;
    final playerId = await getOrCreatePlayerId(storage);
    final nowMs = DateTime.now().millisecondsSinceEpoch;
    final purchaseId = 'pur_${nowMs}_${math.Random().nextInt(99999)}';

    final record = <String, dynamic>{
      'purchaseId': purchaseId,
      'playerId': playerId,
      'productId': productId,
      'title': title ?? productId,
      'price': price ?? '',
      'rewardCoins': rewardCoins,
      'rewardGems': rewardGems,
      'grantPro': grantPro,
      'createdAt': nowMs,
    };

    var ok = false;
    try {
      await FirebaseFirestore.instance
          .collection('purchases')
          .doc(purchaseId)
          .set(record);
      ok = true;
    } catch (_) {
      // Ignore.
    }

    try {
      await FirebaseDatabase.instance.ref('purchases/$purchaseId').set(record);
      ok = true;
    } catch (_) {
      // Ignore.
    }

    unawaited(syncPlayerNow(forceFirestore: true));
    return ok;
  }

  /// Replays any queued offline writes if Firebase is now available.
  Future<int> flushOfflineQueue() async {
    if (!isConfigured) return 0;
    return CacheService.instance.flushOfflineQueue((item) async {
      try {
        if (item.target.startsWith('rtdb:')) {
          final path = item.target.substring(5);
          await FirebaseDatabase.instance.ref(path).set(item.payload);
          return true;
        }
        if (item.target.startsWith('firestore:')) {
          final path = item.target.substring(10);
          final parts = path.split('/');
          if (parts.length == 2) {
            await FirebaseFirestore.instance
                .collection(parts[0])
                .doc(parts[1])
                .set(item.payload, SetOptions(merge: true));
            return true;
          }
        }
      } catch (_) {
        return false;
      }
      return false;
    });
  }

  void dispose() {
    _syncDebounceTimer?.cancel();
  }
}

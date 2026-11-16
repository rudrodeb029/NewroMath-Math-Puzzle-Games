import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:flutter/foundation.dart';

import '../data/levels_catalog.dart';
import 'storage_service.dart';

/// Immutable snapshot of player economy values protected by integrity sealing.
@immutable
class EconomyState {
  const EconomyState({
    required this.coins,
    required this.gems,
    required this.xp,
    required this.unlockedLevel,
    required this.playerLevel,
    required this.isPro,
  });

  final int coins;
  final int gems;
  final int xp;
  final int unlockedLevel;
  final int playerLevel;
  final bool isPro;

  Map<String, dynamic> toJson() => {
        'coins': coins,
        'gems': gems,
        'xp': xp,
        'unlockedLevel': unlockedLevel,
        'playerLevel': playerLevel,
        'isPro': isPro,
      };
}

/// Economy bounds, starter defaults, and cryptographic integrity seal helpers.
class SecurityService {
  SecurityService._();

  static final SecurityService instance = SecurityService._();

  // Economy hard caps (matching src/services/securityService.ts & GameDefaults)
  static const int maxCoins = GameDefaults.maxCoins; // 5,000,000
  static const int maxGems = GameDefaults.maxGems; // 100,000
  static const int maxXp = GameDefaults.maxXp; // 10,000,000
  static const int maxUnlockedLevel = GameDefaults.maxUnlockedLevel; // 26
  static const int maxPlayerLevel = GameDefaults.maxLevel; // 25

  static const int maxSingleCoinDelta = GameDefaults.maxSingleCoinDelta; // 100,000
  static const int maxSingleGemDelta = GameDefaults.maxSingleGemDelta; // 10,000
  static const int maxSingleXpDelta = GameDefaults.maxSingleXpDelta; // 25,000

  // Starter defaults
  static const int defaultCoins = GameDefaults.defaultCoins; // 500
  static const int defaultGems = GameDefaults.defaultGems; // 50
  static const int defaultXp = GameDefaults.defaultPlayerXp; // 0
  static const int defaultUnlockedLevel = GameDefaults.defaultUnlockedLevel; // 1
  static const int defaultPlayerLevel = GameDefaults.defaultPlayerLevel; // 1

  // Canonical storage keys
  static const String keyCoins = 'newromath_coins';
  static const String keyGems = 'newromath_gems';
  static const String keyXp = 'newromath_player_xp';
  static const String keyUnlockedLevel = 'newromath_unlocked_level';
  static const String keyPlayerLevel = 'newromath_player_level';
  static const String keySelectedLevel = 'newromath_selected_level';
  static const String keyIsPro = 'newromath_is_pro_user';
  static const String sealStorageKey = 'newromath_sec_seal_v1';
  static const String snapshotBackupKey = 'newromath_sec_verified_v1';

  static const String _secretPepper = 'NM_2026_QUANTUM_SHIELD_#9817x!';

  static const Set<String> protectedKeys = <String>{
    keyCoins,
    keyGems,
    keyXp,
    keyUnlockedLevel,
    keyPlayerLevel,
    keyIsPro,
  };

  /// Returns `true` if [key] is a protected economy or VIP key.
  bool isProtectedEconomyKey(String key) => protectedKeys.contains(key);

  int clampCoins(int value) => value.clamp(0, maxCoins);
  int clampGems(int value) => value.clamp(0, maxGems);
  int clampXp(int value) => value.clamp(0, maxXp);
  int clampUnlockedLevel(int value) => value.clamp(1, maxUnlockedLevel);
  int clampPlayerLevel(int value) => value.clamp(1, maxPlayerLevel);

  /// Clamps a single-transaction coin delta within safe anti-cheat bounds.
  int clampCoinDelta(int delta) =>
      delta.clamp(-maxSingleCoinDelta, maxSingleCoinDelta);

  /// Clamps a single-transaction gem delta within safe anti-cheat bounds.
  int clampGemDelta(int delta) =>
      delta.clamp(-maxSingleGemDelta, maxSingleGemDelta);

  /// Clamps a single-transaction XP gain within safe anti-cheat bounds.
  int clampXpDelta(int delta) => delta.clamp(0, maxSingleXpDelta);

  /// Clamps any protected economy value string by its storage [key].
  String clampEconomyValue(String key, Object? rawVal) {
    if (key == keyIsPro) {
      return rawVal?.toString() == 'true' ? 'true' : 'false';
    }
    final parsed = rawVal is num
        ? rawVal.toInt()
        : int.tryParse(rawVal?.toString().trim() ?? '');
    final numVal = parsed ?? 0;

    switch (key) {
      case keyCoins:
        return clampCoins(numVal).toString();
      case keyGems:
        return clampGems(numVal).toString();
      case keyXp:
        return clampXp(numVal).toString();
      case keyUnlockedLevel:
        return clampUnlockedLevel(numVal == 0 ? 1 : numVal).toString();
      case keyPlayerLevel:
      case keySelectedLevel:
        return clampPlayerLevel(numVal == 0 ? 1 : numVal).toString();
      default:
        return rawVal?.toString() ?? '';
    }
  }

  /// Sanitizes an [EconomyState] to guarantee all bounds are respected.
  EconomyState sanitizeEconomyState(EconomyState state) {
    return EconomyState(
      coins: clampCoins(state.coins),
      gems: clampGems(state.gems),
      xp: clampXp(state.xp),
      unlockedLevel: clampUnlockedLevel(state.unlockedLevel),
      playerLevel: clampPlayerLevel(state.playerLevel),
      isPro: state.isPro,
    );
  }

  /// Computes a deterministic HMAC-SHA256 seal for the player's economy state.
  String computeEconomySeal(EconomyState state) {
    final s = sanitizeEconomyState(state);
    final payload =
        '$_secretPepper|c:${s.coins}|g:${s.gems}|x:${s.xp}|u:${s.unlockedLevel}|l:${s.playerLevel}|p:${s.isPro ? 1 : 0}|$_secretPepper';
    final keyBytes = utf8.encode(_secretPepper);
    final dataBytes = utf8.encode(payload);
    final digest = Hmac(sha256, keyBytes).convert(dataBytes);
    return 'nms2_${digest.toString().substring(0, 24)}';
  }

  /// Verifies whether [storedSeal] matches the computed seal for [state].
  bool verifyEconomySeal(EconomyState state, String? storedSeal) {
    if (storedSeal == null || storedSeal.isEmpty) return false;
    return computeEconomySeal(state) == storedSeal;
  }

  /// Reads current economy state from [storage] using safe starter defaults.
  EconomyState readEconomyFromStorage(StorageService storage) {
    int coins = storage.getInt(keyCoins, defaultValue: defaultCoins);
    int gems = storage.getInt(keyGems, defaultValue: defaultGems);
    final xp = storage.getInt(keyXp, defaultValue: defaultXp);
    final unlocked =
        storage.getInt(keyUnlockedLevel, defaultValue: defaultUnlockedLevel);
    final playerLevel =
        storage.getInt(keyPlayerLevel, defaultValue: defaultPlayerLevel);
    final isPro = storage.getBool(keyIsPro, defaultValue: false);

    // Auto-calibrate legacy mock starters (2450 coins & 25 gems) to standard starter (500 coins & 50 gems)
    final bool isCalibrated = storage.getBool('newromath_starter_calibrated_v2', defaultValue: false);
    if (!isCalibrated) {
      if ((coins == 2450 && gems == 25) || (coins == 0 && gems == 0 && xp == 0 && unlocked <= 1)) {
        coins = defaultCoins;
        gems = defaultGems;
      }
      storage.setBool('newromath_starter_calibrated_v2', true);
    }

    return sanitizeEconomyState(
      EconomyState(
        coins: coins,
        gems: gems,
        xp: xp,
        unlockedLevel: unlocked,
        playerLevel: playerLevel,
        isPro: isPro,
      ),
    );
  }

  /// Updates the persisted cryptographic seal and backup snapshot in [storage].
  Future<void> updateEconomySeal(
    StorageService storage, {
    EconomyState? state,
  }) async {
    final current = sanitizeEconomyState(state ?? readEconomyFromStorage(storage));
    final seal = computeEconomySeal(current);
    await storage.setString(sealStorageKey, seal);
    await storage.setJson(snapshotBackupKey, current.toJson());
  }

  /// Clamps out-of-range persisted economy values on startup and refreshes seal.
  Future<EconomyState> verifyAndSanitizeStorage(StorageService storage) async {
    final sanitized = readEconomyFromStorage(storage);
    await storage.setInt(keyCoins, sanitized.coins);
    await storage.setInt(keyGems, sanitized.gems);
    await storage.setInt(keyXp, sanitized.xp);
    await storage.setInt(keyUnlockedLevel, sanitized.unlockedLevel);
    await storage.setInt(keyPlayerLevel, sanitized.playerLevel);
    await updateEconomySeal(storage, state: sanitized);
    return sanitized;
  }
}

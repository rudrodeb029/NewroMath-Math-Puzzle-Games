import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';

import '../data/levels_catalog.dart';
import '../engine/crossmath_generator.dart';
import '../engine/daily_generator.dart';
import '../engine/hint_solver.dart';
import '../models/game_models.dart';
import '../services/admob_service.dart';
import '../services/firebase_sync_service.dart';
import '../services/purchase_service.dart';
import '../services/security_service.dart';
import '../services/sound_service.dart';
import '../services/storage_service.dart';

/// Central application state & gameplay controller for NewroMath.
///
/// Wires together the procedural Cross-Math & Daily Matrix engines,
/// [StorageService], [SecurityService], [SoundService], [AdMobService],
/// [PurchaseService], and [FirebaseSyncService].
class GameController extends ChangeNotifier {
  GameController({
    AppScreen initialScreen = AppScreen.home,
  })  : _currentScreen = initialScreen,
        _navigationStack = [initialScreen] {
    final now = DateTime.now();
    _activeDailyDay = now.day;
    _dailyGameDay = now.day;
    _completedDailyDays = List<int>.generate(
      (now.day - 1).clamp(0, 31),
      (index) => index + 1,
    );
    _stageSeeds = CrossmathGenerator.getStageSeedsForLevel(_selectedLevelNum);
    _puzzleSeed = _stageSeeds.isNotEmpty ? _stageSeeds.first : 101;
    _activePuzzle = CrossmathGenerator.getMemoizedPuzzle(
      _selectedLevelNum,
      seed: _puzzleSeed,
      stageIndex: 0,
    );
    _dailyGamePuzzle = DailyGenerator.generateDailyChallengePuzzle(
      now.year,
      now.month,
      _dailyGameDay,
    );
  }

  final StorageService _storage = StorageService.instance;
  final SecurityService _security = SecurityService.instance;
  final SoundService _sound = SoundService.instance;
  final AdMobService _adMob = AdMobService.instance;
  final PurchaseService _purchase = PurchaseService.instance;
  final FirebaseSyncService _firebase = FirebaseSyncService.instance;

  Timer? _campaignTicker;
  Timer? _dailyTicker;
  bool _serviceListenersAttached = false;

  // ---------------------------------------------------------------------------
  // Lifecycle & Initialization
  // ---------------------------------------------------------------------------

  bool _isInitialized = false;
  bool get isInitialized => _isInitialized;

  bool _isFirebaseReady = false;
  bool get isFirebaseReady => _isFirebaseReady;

  /// Initializes local storage, security seal, audio, AdMob, IAP, and Firebase
  /// cloud sync (with graceful offline/unconfigured fallback).
  Future<void> init() async {
    if (_isInitialized) return;

    await _storage.init();
    _storage.onKeyChanged = (changedKey) {
      _firebase.scheduleSync(changedKey: changedKey);
    };

    await _sound.init();

    // Hydrate economy & clamp any out-of-range values with HMAC seal verification.
    final econ = await _security.verifyAndSanitizeStorage(_storage);
    _coins = econ.coins;
    _gems = econ.gems;
    _playerXp = econ.xp;
    _unlockedLevelMax = econ.unlockedLevel;
    _playerLevel = econ.playerLevel;
    _selectedLevelNum = _security.clampPlayerLevel(
      _storage.getInt(
        SecurityService.keySelectedLevel,
        defaultValue: _unlockedLevelMax,
      ),
    );

    // Hydrate settings.
    _settings = PlayerSettings(
      isDarkMode: _storage.getBool('newromath_dark_mode', defaultValue: false),
      soundEnabled: _storage.getBool('newromath_sound', defaultValue: true),
      hapticsEnabled: _storage.getBool('newromath_haptics', defaultValue: true),
      notificationsEnabled:
          _storage.getBool('newromath_notifications', defaultValue: true),
      timerEnabled: _storage.getBool('newromath_timer', defaultValue: true),
      explanationEnabled:
          _storage.getBool('newromath_explanation', defaultValue: true),
      autoSubmitEnabled:
          _storage.getBool('newromath_autosubmit', defaultValue: false),
      largeFontEnabled:
          _storage.getBool('newromath_largefont', defaultValue: true),
      divisionSymbol: _storage.getString('newromath_div_symbol') ?? '÷',
    );
    _sound.setMuted(!_settings.soundEnabled);

    // Hydrate profile.
    final playerId = await _firebase.getOrCreatePlayerId(_storage);
    final savedName = (_storage.getString('newromath_player_name') ??
            GameDefaults.defaultPlayerName)
        .trim();
    final savedCountry = (_storage.getString('newromath_player_country') ??
            GameDefaults.defaultPlayerCountry)
        .trim();
    final matchedFlag = playerCountries
            .where((c) => c.name == savedCountry)
            .map((c) => c.flag)
            .firstOrNull ??
        '🌐';
    var savedAvatar = _storage.getString('newromath_player_avatar');
    if (savedAvatar != null && savedAvatar.startsWith('/assets/')) {
      savedAvatar = savedAvatar.replaceFirst('/assets/', 'assets/images/');
    }
    if (savedAvatar == null || savedAvatar.isEmpty) {
      savedAvatar = _unlockedLevelMax > 1
          ? AppAssets.awardForLevel((_unlockedLevelMax - 1).clamp(1, 25))
          : GameDefaults.defaultAvatarAsset;
    }

    _profile = PlayerProfile(
      playerId: playerId,
      name: savedName.isEmpty ? GameDefaults.defaultPlayerName : savedName,
      country:
          savedCountry.isEmpty ? GameDefaults.defaultPlayerCountry : savedCountry,
      countryFlag: matchedFlag,
      phone: (_storage.getString('newromath_player_phone') ?? '').trim(),
      email: (_storage.getString('newromath_player_email') ?? '').trim(),
      equippedAvatarAsset: savedAvatar,
      isProUser: econ.isPro,
    );

    // Hydrate Daily Challenge crate & completed calendar days for current month.
    _dailyGiftClaimed =
        _storage.getString('newromath_daily_crate_last_claimed') ==
            _todayCrateKey;
    final dailyKey = _dailyCompletedStorageKey;
    if (_storage.getString(dailyKey) != null) {
      _completedDailyDays = _storage.getIntList(dailyKey);
    }

    // Hydrate puzzle history & pinned archives.
    final rawRecords = _storage.getJson('newromath_puzzle_records');
    if (rawRecords is List && rawRecords.isNotEmpty) {
      final parsed = rawRecords
          .whereType<Map>()
          .map((m) => PuzzleRecord.fromJson(Map<String, dynamic>.from(m)))
          .toList();
      if (parsed.isNotEmpty) {
        _puzzleRecords = parsed;
      }
    }
    if (_storage.getString('newromath_saved_puzzles') != null) {
      _savedPuzzleIds = _storage.getStringList('newromath_saved_puzzles');
    }

    // Refresh initial puzzles for hydrated level.
    _stageSeeds = CrossmathGenerator.getStageSeedsForLevel(_selectedLevelNum);
    _puzzleSeed = _stageSeeds.isNotEmpty ? _stageSeeds.first : 101;
    _activePuzzle = CrossmathGenerator.getMemoizedPuzzle(
      _selectedLevelNum,
      seed: _puzzleSeed,
      stageIndex: _stageNum - 1,
    );
    _gameTimerSeconds = getLevelTimerSeconds(_selectedLevelNum, stage: _stageNum);
    _dailyGamePuzzle = DailyGenerator.generateDailyChallengePuzzle(
      currentCalendarYear,
      currentSeasonNum,
      _dailyGameDay,
    );

    // Attach AdMob & IAP service listeners.
    if (!_serviceListenersAttached) {
      _serviceListenersAttached = true;
      _adMob.addListener(_onAdMobChanged);
      _purchase.addListener(_onPurchaseChanged);
    }

    // Initialize Billing, AdMob, and Firebase safely.
    await _purchase.initialize(storage: _storage);
    if (_purchase.isProUser && !_profile.isProUser) {
      _profile = _profile.copyWith(isProUser: true);
    }
    _syncPurchaseFields();

    await _adMob.initialize(isProUser: _profile.isProUser);
    _syncAdMobFields();

    _isFirebaseReady = await _firebase.initialize();
    if (_isFirebaseReady) {
      unawaited(_firebase.flushOfflineQueue());
      unawaited(refreshLeaderboard());
    }

    _startTickers();
    _isInitialized = true;
    notifyListeners();
  }

  void _onAdMobChanged() {
    _syncAdMobFields();
    notifyListeners();
  }

  void _syncAdMobFields() {
    _isRewardedReady = _adMob.rewardedReady;
    _isInterstitialActive = _adMob.interstitialActive;
  }

  void _onPurchaseChanged() {
    _syncPurchaseFields();
    notifyListeners();
  }

  void _syncPurchaseFields() {
    _isIapLoading = _purchase.isLoading;
    _activePurchaseSku = _purchase.activePurchaseSku;
    _iapErrorMessage = _purchase.errorMessage;
    _iapPrices
      ..clear()
      ..addAll(_purchase.prices);
    if (_purchase.isProUser != _profile.isProUser && _purchase.isProUser) {
      _profile = _profile.copyWith(isProUser: true);
    }
  }

  void _startTickers() {
    _campaignTicker?.cancel();
    _campaignTicker = Timer.periodic(const Duration(seconds: 1), (_) {
      if (_currentScreen == AppScreen.game &&
          !_isGamePaused &&
          !_isTimeOver &&
          !_isCorrectModalOpen &&
          !_isWrongModalOpen &&
          !_isInterstitialActive &&
          _settings.timerEnabled) {
        if (_gameTimerSeconds > 0) {
          _gameTimerSeconds--;
          if (_gameTimerSeconds == 0) {
            _isTimeOver = true;
            unawaited(_sound.playMistake());
            _hapticMedium();
          }
          notifyListeners();
        }
      }
    });

    _dailyTicker?.cancel();
    _dailyTicker = Timer.periodic(const Duration(seconds: 1), (_) {
      if (_currentScreen == AppScreen.dailyGame &&
          !_isDailyGamePaused &&
          !_dailyGameVictoryModal &&
          !_dailyGameDefeatModal &&
          !_dailyGameTimeOver &&
          !_isInterstitialActive &&
          _settings.timerEnabled) {
        if (_dailyGameTimerSeconds > 0) {
          _dailyGameTimerSeconds--;
          if (_dailyGameTimerSeconds == 0) {
            _dailyGameTimeOver = true;
            unawaited(_sound.playMistake());
            _hapticMedium();
          }
          notifyListeners();
        }
      }
    });
  }

  void _hapticLight() {
    if (_settings.hapticsEnabled) {
      unawaited(HapticFeedback.lightImpact());
    }
  }

  void _hapticMedium() {
    if (_settings.hapticsEnabled) {
      unawaited(HapticFeedback.mediumImpact());
    }
  }

  Future<void> _persistEconomy({bool seal = true}) async {
    _coins = _security.clampCoins(_coins);
    _gems = _security.clampGems(_gems);
    _playerXp = _security.clampXp(_playerXp);
    _unlockedLevelMax = _security.clampUnlockedLevel(_unlockedLevelMax);
    _playerLevel = _security.clampPlayerLevel(_playerLevel);
    _selectedLevelNum = _security.clampPlayerLevel(_selectedLevelNum);

    await _storage.setInt(SecurityService.keyCoins, _coins);
    await _storage.setInt(SecurityService.keyGems, _gems);
    await _storage.setInt(SecurityService.keyXp, _playerXp);
    await _storage.setInt(
      SecurityService.keyUnlockedLevel,
      _unlockedLevelMax,
    );
    await _storage.setInt(SecurityService.keyPlayerLevel, _playerLevel);
    await _storage.setInt(
      SecurityService.keySelectedLevel,
      _selectedLevelNum,
    );
    await _storage.setBool(SecurityService.keyIsPro, _profile.isProUser);

    if (seal) {
      await _security.updateEconomySeal(
        _storage,
        state: EconomyState(
          coins: _coins,
          gems: _gems,
          xp: _playerXp,
          unlockedLevel: _unlockedLevelMax,
          playerLevel: _playerLevel,
          isPro: _profile.isProUser,
        ),
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Navigation Stack & Transition Direction
  // ---------------------------------------------------------------------------

  AppScreen _currentScreen;
  AppScreen get currentScreen => _currentScreen;

  TransitionDirection _transitionDirection = TransitionDirection.forward;
  TransitionDirection get transitionDirection => _transitionDirection;

  final List<AppScreen> _navigationStack;
  List<AppScreen> get navigationStack => List.unmodifiable(_navigationStack);

  bool get canGoBack =>
      _navigationStack.length > 1 || _currentScreen != AppScreen.home;

  /// Navigates to [screen], updating [_navigationStack] and [_transitionDirection].
  void navigateTo(AppScreen screen, {bool replaceCurrent = false}) {
    if (screen == _currentScreen) return;
    unawaited(_sound.playClick());

    // Clear active gameplay modal overlays when navigating away from gameplay.
    if (_currentScreen == AppScreen.game &&
        screen != AppScreen.hint &&
        screen != AppScreen.correct &&
        screen != AppScreen.wrong) {
      _isCorrectModalOpen = false;
      _isWrongModalOpen = false;
      _isTimeOver = false;
      _isGamePaused = false;
    }
    if (_currentScreen == AppScreen.dailyGame &&
        screen != AppScreen.dailyGame) {
      _dailyGameVictoryModal = false;
      _dailyGameDefeatModal = false;
      _dailyGameTimeOver = false;
      _isDailyGamePaused = false;
    }

    final prevIndex = _navigationStack.lastIndexOf(screen);
    if (replaceCurrent && _navigationStack.isNotEmpty) {
      _navigationStack[_navigationStack.length - 1] = screen;
      _transitionDirection = TransitionDirection.forward;
    } else if (prevIndex >= 0) {
      _navigationStack.removeRange(prevIndex + 1, _navigationStack.length);
      _transitionDirection = TransitionDirection.back;
    } else {
      _navigationStack.add(screen);
      _transitionDirection = screen == AppScreen.hint
          ? TransitionDirection.hint
          : TransitionDirection.forward;
    }

    _currentScreen = screen;
    notifyListeners();
  }

  /// Navigates back through the stack or returns to [AppScreen.home].
  void navigateBack() {
    if (_navigationStack.length > 1) {
      final target = _navigationStack[_navigationStack.length - 2];
      navigateTo(target);
    } else if (_currentScreen != AppScreen.home) {
      navigateTo(AppScreen.home);
    }
  }

  /// Resets the navigation stack to [root].
  void replaceRootScreen(AppScreen root) {
    _navigationStack
      ..clear()
      ..add(root);
    _transitionDirection = TransitionDirection.fade;
    _currentScreen = root;
    notifyListeners();
  }

  // ---------------------------------------------------------------------------
  // Economy & Campaign Progression
  // ---------------------------------------------------------------------------

  int _coins = GameDefaults.defaultCoins;
  int get coins => _coins;

  int _gems = GameDefaults.defaultGems;
  int get gems => _gems;

  int _playerXp = GameDefaults.defaultPlayerXp;
  int get playerXp => _playerXp;

  int _playerLevel = GameDefaults.defaultPlayerLevel;
  int get playerLevel => _playerLevel;

  int _unlockedLevelMax = GameDefaults.defaultUnlockedLevel;
  int get unlockedLevelMax => _unlockedLevelMax;

  int _selectedLevelNum = GameDefaults.defaultSelectedLevel;
  int get selectedLevelNum => _selectedLevelNum;

  int _lives = GameDefaults.defaultLives;
  int get lives => _lives;

  bool _dailyGiftClaimed = false;
  bool get dailyGiftClaimed => _dailyGiftClaimed;

  String get _todayCrateKey =>
      '$currentCalendarYear-$currentSeasonNum-$todayCalendarDay';

  String get _dailyCompletedStorageKey =>
      'newromath_daily_completed_${currentCalendarYear}_$currentSeasonNum';

  int get activePlayerLevel => _unlockedLevelMax.clamp(1, GameDefaults.maxLevel);
  int get completedLevelsCount =>
      (_unlockedLevelMax - 1).clamp(0, GameDefaults.maxLevel);
  int get dueLevelsCount =>
      (GameDefaults.maxLevel - completedLevelsCount).clamp(0, GameDefaults.maxLevel);
  int get campaignProgressPct =>
      ((completedLevelsCount / GameDefaults.maxLevel) * 100).round().clamp(0, 100);

  int get activeLevelTargetXp => getLevelTargetXp(activePlayerLevel);
  int get activeLevelCurrentXp {
    final target = activeLevelTargetXp;
    if (target <= 0) return 0;
    return (_playerXp % target).clamp(0, target);
  }

  LevelConfig get currentLevelMeta => levelsCatalog.firstWhere(
        (l) => l.num == _selectedLevelNum,
        orElse: () => levelsCatalog.first,
      );

  /// Selects a level card without immediately deducting entry cost.
  void selectLevel(int levelNum) {
    if (levelNum > _unlockedLevelMax) return;
    unawaited(_sound.playClick());
    _selectedLevelNum = levelNum.clamp(1, GameDefaults.maxLevel);
    _playerLevel =
        _playerLevel < _selectedLevelNum ? _selectedLevelNum : _playerLevel;
    unawaited(
      _storage.setInt(SecurityService.keySelectedLevel, _selectedLevelNum),
    );
    notifyListeners();
  }

  /// Claims the once-per-day mystery gift chest (+350 Coins & +5 Diamonds).
  Future<void> claimDailyGift() async {
    if (_dailyGiftClaimed) return;
    _dailyGiftClaimed = true;
    _coins = _security.clampCoins(_coins + 350);
    _gems = _security.clampGems(_gems + 5);
    await _storage.setString(
      'newromath_daily_crate_last_claimed',
      _todayCrateKey,
    );
    await _persistEconomy();
    unawaited(_sound.playVictory());
    unawaited(_sound.playCoin());
    _showToast('🎁 Claimed Daily Gift: +350 Coins & +5 Diamonds!');
    notifyListeners();
  }

  /// Claims the Daily Mystery Chest with a 2X Rewarded Ad multiplier.
  Future<bool> claimDailyGiftWithAd({
    int coinAmount = 700,
    int gemAmount = 15,
  }) async {
    if (_dailyGiftClaimed) return false;
    return watchRewardedAd(
      AdRewardInfo(
        type: 'both',
        amount: 0,
        title: 'Daily 2X Supply Booster',
        coinAmount: coinAmount,
        gemAmount: gemAmount,
      ),
      onComplete: () {
        _dailyGiftClaimed = true;
        unawaited(
          _storage.setString(
            'newromath_daily_crate_last_claimed',
            _todayCrateKey,
          ),
        );
        notifyListeners();
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Campaign Gameplay (Cross-Math 5x5)
  // ---------------------------------------------------------------------------

  CrossmathPuzzle _activePuzzle = CrossmathPuzzle.empty;
  CrossmathPuzzle get activePuzzle => _activePuzzle;

  int _puzzleSeed = 101;
  List<int> _stageSeeds = const [];

  int _stageNum = 1;
  int get stageNum => _stageNum;

  int get stageTotal => getStageCount(_selectedLevelNum);

  final Map<int, int> _puzzleAnswers = {};
  Map<int, int> get puzzleAnswers => Map.unmodifiable(_puzzleAnswers);

  final List<int> _puzzleHistory = [];
  List<int> get puzzleHistory => List.unmodifiable(_puzzleHistory);

  int? _selectedPuzzleSlot;
  int? get selectedPuzzleSlot => _selectedPuzzleSlot;

  int _gameTimerSeconds = 55;
  int get gameTimerSeconds => _gameTimerSeconds;

  bool _isGamePaused = false;
  bool get isGamePaused => _isGamePaused;

  bool _isTimeOver = false;
  bool get isTimeOver => _isTimeOver;

  bool _isCorrectModalOpen = false;
  bool get isCorrectModalOpen => _isCorrectModalOpen;

  bool _isWrongModalOpen = false;
  bool get isWrongModalOpen => _isWrongModalOpen;

  GameResultSummary _lastResult = GameResultSummary.empty;
  GameResultSummary get lastResult => _lastResult;

  InsufficientFundsInfo _insufficientFundsModal = const InsufficientFundsInfo();
  InsufficientFundsInfo get insufficientFundsModal => _insufficientFundsModal;

  /// Step-by-step diagnostic hints for the active Cross-Math puzzle.
  List<HintStep> get currentHintSteps =>
      HintSolver.buildHintSteps(_activePuzzle);

  String get formattedGameTimer {
    final m = (_gameTimerSeconds ~/ 60).toString().padLeft(2, '0');
    final s = (_gameTimerSeconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  /// Checks entry cost for [targetLevel] and starts the puzzle or opens
  /// [insufficientFundsModal].
  Future<bool> attemptStartLevel({
    int? targetLevel,
    bool bypassFee = false,
  }) async {
    final lvl =
        (targetLevel ?? _selectedLevelNum).clamp(1, GameDefaults.maxLevel);
    final cost = getLevelEntryCost(lvl);

    if (!bypassFee && (_coins < cost.coins || _gems < cost.gems)) {
      unawaited(_sound.playMistake());
      _hapticMedium();
      _insufficientFundsModal = InsufficientFundsInfo(
        isOpen: true,
        targetLevel: lvl,
        cost: cost,
        missingCoins: (cost.coins - _coins).clamp(0, cost.coins),
        missingGems: (cost.gems - _gems).clamp(0, cost.gems),
      );
      notifyListeners();
      return false;
    }

    if (!bypassFee) {
      _coins = _security.clampCoins(_coins - cost.coins);
      _gems = _security.clampGems(_gems - cost.gems);
      await _persistEconomy();
      _showToast(
        'Mission L$lvl Entry: -${cost.coins} Coins & -${cost.gems} Diamonds',
      );
    }

    unawaited(_sound.playClick());
    startNewPuzzle(targetLevel: lvl);
    return true;
  }

  /// Starts stage 1 of [targetLevel] and navigates to [AppScreen.game].
  void startNewPuzzle({int? targetLevel}) {
    final lvl =
        (targetLevel ?? _selectedLevelNum).clamp(1, GameDefaults.maxLevel);
    _selectedLevelNum = lvl;
    _playerLevel = math.max(_playerLevel, lvl);
    unawaited(_storage.setInt(SecurityService.keySelectedLevel, lvl));
    unawaited(_storage.setInt(SecurityService.keyPlayerLevel, _playerLevel));

    _stageSeeds = CrossmathGenerator.getStageSeedsForLevel(lvl);
    _puzzleSeed = _stageSeeds.isNotEmpty ? _stageSeeds.first : 101;
    _stageNum = 1;
    _lives = GameDefaults.defaultLives;
    _isTimeOver = false;
    _isGamePaused = false;
    _isCorrectModalOpen = false;
    _isWrongModalOpen = false;
    _puzzleAnswers.clear();
    _puzzleHistory.clear();
    _selectedPuzzleSlot = null;
    _activePuzzle = CrossmathGenerator.getMemoizedPuzzle(
      lvl,
      seed: _puzzleSeed,
      stageIndex: 0,
    );
    _gameTimerSeconds = getLevelTimerSeconds(lvl, stage: 1);

    navigateTo(AppScreen.game);
  }

  /// Selects an empty slot in the active Cross-Math grid.
  void selectPuzzleSlot(int? slotIndex) {
    if (_isTimeOver || _isGamePaused) return;
    unawaited(_sound.playClick());
    _selectedPuzzleSlot = slotIndex;
    notifyListeners();
  }

  /// Places [number] from the tray into the active or next available slot.
  void placePuzzleNumber(int number) {
    if (_isTimeOver || _isGamePaused) return;
    if (_puzzleAnswers.containsValue(number)) return;

    final selected = _selectedPuzzleSlot;
    final targetSlot =
        (selected != null && !_puzzleAnswers.containsKey(selected))
            ? selected
            : _activePuzzle.slots
                .where((s) => !_puzzleAnswers.containsKey(s.slotIndex))
                .map((s) => s.slotIndex)
                .firstOrNull;
    if (targetSlot == null) return;

    _puzzleAnswers[targetSlot] = number;
    _puzzleHistory.add(targetSlot);
    _selectedPuzzleSlot = null;
    unawaited(_sound.playPlace());
    _hapticLight();
    notifyListeners();

    if (_activePuzzle.slots.isNotEmpty &&
        _puzzleAnswers.length == _activePuzzle.slots.length) {
      Future<void>.delayed(const Duration(milliseconds: 280), () {
        if (_currentScreen == AppScreen.game &&
            _puzzleAnswers.length == _activePuzzle.slots.length &&
            !_isCorrectModalOpen &&
            !_isWrongModalOpen) {
          unawaited(submitPuzzle());
        }
      });
    }
  }

  /// Removes the placed number from [slotIndex] and returns it to the tray.
  void removePuzzleNumber(int slotIndex) {
    if (_isTimeOver || _isGamePaused) return;
    if (!_puzzleAnswers.containsKey(slotIndex)) return;
    _puzzleAnswers.remove(slotIndex);
    _puzzleHistory.remove(slotIndex);
    _selectedPuzzleSlot = slotIndex;
    unawaited(_sound.playErase());
    _hapticLight();
    notifyListeners();
  }

  /// Undoes the last placed number in the active Cross-Math puzzle.
  void undoPuzzleNumber() {
    if (_isTimeOver || _isGamePaused) return;
    if (_puzzleHistory.isEmpty) return;
    final lastSlot = _puzzleHistory.removeLast();
    _puzzleAnswers.remove(lastSlot);
    _selectedPuzzleSlot = lastSlot;
    unawaited(_sound.playErase());
    _hapticLight();
    notifyListeners();
  }

  /// Rerolls a fresh procedural puzzle seed for the current level/stage.
  void rerollPuzzle() {
    unawaited(_sound.playClick());
    _puzzleSeed++;
    _activePuzzle = CrossmathGenerator.getMemoizedPuzzle(
      _selectedLevelNum,
      seed: _puzzleSeed,
      stageIndex: _stageNum - 1,
    );
    _puzzleAnswers.clear();
    _puzzleHistory.clear();
    _selectedPuzzleSlot = null;
    _isTimeOver = false;
    _isGamePaused = false;
    _gameTimerSeconds =
        getLevelTimerSeconds(_selectedLevelNum, stage: _stageNum);
    notifyListeners();
  }

  /// Resets answers, history, and timer for [targetLevel] / [targetStage].
  void resetPuzzle({int? targetLevel, int? targetStage}) {
    final lvl =
        (targetLevel ?? _selectedLevelNum).clamp(1, GameDefaults.maxLevel);
    final st = (targetStage ?? _stageNum).clamp(1, getStageCount(lvl));
    if (lvl != _selectedLevelNum || _stageSeeds.isEmpty) {
      _stageSeeds = CrossmathGenerator.getStageSeedsForLevel(lvl);
      _puzzleSeed = (_stageSeeds.length >= st)
          ? _stageSeeds[st - 1]
          : (st - 1) * 1000 + 101;
    }
    _selectedLevelNum = lvl;
    _stageNum = st;
    _activePuzzle = CrossmathGenerator.getMemoizedPuzzle(
      lvl,
      seed: _puzzleSeed,
      stageIndex: st - 1,
    );
    _puzzleAnswers.clear();
    _puzzleHistory.clear();
    _selectedPuzzleSlot = null;
    _isTimeOver = false;
    _isGamePaused = false;
    _gameTimerSeconds = getLevelTimerSeconds(lvl, stage: st);
    notifyListeners();
  }

  /// Evaluates current answers against [_activePuzzle.slots].
  Future<bool> submitPuzzle() async {
    final solved = CrossmathGenerator.isPuzzleSolved(
      _activePuzzle,
      _puzzleAnswers,
    );

    if (solved) {
      unawaited(_sound.playSuccess());
      _hapticLight();

      final solvedLevel = _selectedLevelNum;
      final solvedStage = _stageNum;
      final cost = getLevelEntryCost(solvedLevel);
      final total = getStageCount(solvedLevel);
      final isFinalStage = solvedStage >= total;
      final targetXp = getLevelTargetXp(solvedLevel);
      final earnedXp =
          isFinalStage ? targetXp : math.max(1, (targetXp / total).round());
      final earnedCoins = isFinalStage
          ? (cost.coins * 1.8).round()
          : math.max(15, (cost.coins * 0.15).round());
      final earnedGems = isFinalStage
          ? (cost.gems * 1.3).round() + 2
          : math.max(1, (cost.gems * 0.15).round());

      if (isFinalStage) {
        Future<void>.delayed(
          const Duration(milliseconds: 320),
          () => unawaited(_sound.playVictory()),
        );
      }

      _lastResult = GameResultSummary(
        level: solvedLevel,
        stage: solvedStage,
        totalStages: total,
        levelCleared: isFinalStage,
        solvedText: _activePuzzle.solvedText,
        coinsEarned: earnedCoins,
        gemsEarned: earnedGems,
        xpEarned: earnedXp,
      );

      _coins = _security.clampCoins(_coins + earnedCoins);
      unawaited(_sound.playCoin());
      if (earnedGems > 0) {
        _gems = _security.clampGems(_gems + earnedGems);
        Future<void>.delayed(
          const Duration(milliseconds: 120),
          () => unawaited(_sound.playGem()),
        );
      }

      _playerXp = _security.clampXp(_playerXp + earnedXp);

      if (isFinalStage) {
        final nextUnlocked = math.min(GameDefaults.maxUnlockedLevel, solvedLevel + 1);
        final nextSelected = math.min(GameDefaults.maxLevel, solvedLevel + 1);

        _unlockedLevelMax = math.max(_unlockedLevelMax, nextUnlocked);
        _playerLevel = math.min(
          GameDefaults.maxLevel,
          math.max(_playerLevel, nextSelected),
        );
        _selectedLevelNum = nextSelected;
        _stageNum = 1;
        _stageSeeds = CrossmathGenerator.getStageSeedsForLevel(nextSelected);
        _puzzleSeed = _stageSeeds.isNotEmpty ? _stageSeeds.first : 101;

        final earnedAward =
            levelAwards.where((a) => a.level == solvedLevel).firstOrNull;
        if (earnedAward != null) {
          _profile =
              _profile.copyWith(equippedAvatarAsset: earnedAward.iconAsset);
          await _storage.setString(
            'newromath_player_avatar',
            earnedAward.iconAsset,
          );
          _showToast(
            '🏆 Level $solvedLevel Solved! Awarded 3D Avatar: ${earnedAward.title}!',
          );
        }
      } else {
        final nextStage = solvedStage + 1;
        _stageNum = nextStage;
        _puzzleSeed = (_stageSeeds.length >= nextStage)
            ? _stageSeeds[nextStage - 1]
            : (nextStage - 1) * 1000 + 101;
      }

      if (_activePuzzle.solvedText.isNotEmpty) {
        final nowMs = DateTime.now().millisecondsSinceEpoch;
        final newRec = PuzzleRecord(
          id: 'rec-$nowMs-${math.Random().nextInt(1000)}',
          equation: _activePuzzle.solvedText,
          timeLabel: 'Just Now',
          level: solvedLevel,
          stage: solvedStage,
          mode: 'Main Game',
          solved: true,
          xp: earnedXp,
          timestampMs: nowMs,
        );
        _puzzleRecords = [
          newRec,
          ..._puzzleRecords.where((r) => r.equation != newRec.equation),
        ].take(50).toList();
        await _storage.setJson(
          'newromath_puzzle_records',
          _puzzleRecords.map((r) => r.toJson()).toList(),
        );
      }

      await _persistEconomy();
      _isCorrectModalOpen = true;
      notifyListeners();
      return true;
    } else {
      unawaited(_sound.playMistake());
      _hapticMedium();
      _lives = math.max(0, _lives - 1);
      _isWrongModalOpen = true;
      notifyListeners();
      return false;
    }
  }

  /// Reveals one correct empty slot (or advances an incorrect slot) and submits
  /// automatically if the grid becomes full.
  Future<void> useHint() async {
    final slot = HintSolver.findNextUnsolvedSlot(_activePuzzle, _puzzleAnswers);
    if (slot == null) {
      if (_currentScreen == AppScreen.hint) {
        navigateTo(AppScreen.game);
      }
      return;
    }

    _puzzleAnswers[slot.slotIndex] = slot.answer;
    if (!_puzzleHistory.contains(slot.slotIndex)) {
      _puzzleHistory.add(slot.slotIndex);
    }
    _selectedPuzzleSlot = null;
    unawaited(_sound.playSuccess());
    _showToast(
      '💡 Ad Reward: Slot ${slot.slotIndex + 1} Revealed (${slot.answer})!',
    );
    if (_currentScreen == AppScreen.hint) {
      navigateTo(AppScreen.game);
    } else {
      notifyListeners();
    }

    if (_puzzleAnswers.length == _activePuzzle.slots.length) {
      Future<void>.delayed(const Duration(milliseconds: 350), () {
        if (_currentScreen == AppScreen.game &&
            !_isCorrectModalOpen &&
            !_isWrongModalOpen) {
          unawaited(submitPuzzle());
        }
      });
    }
  }

  void togglePause() {
    unawaited(_sound.playClick());
    _isGamePaused = !_isGamePaused;
    notifyListeners();
  }

  void dismissCorrectModal() {
    if (!_isCorrectModalOpen) return;
    _isCorrectModalOpen = false;
    notifyListeners();
  }

  void dismissWrongModal() {
    if (!_isWrongModalOpen) return;
    _isWrongModalOpen = false;
    notifyListeners();
  }

  void dismissTimeOver() {
    if (!_isTimeOver) return;
    _isTimeOver = false;
    notifyListeners();
  }

  void addExtraTime(int seconds) {
    if (seconds <= 0) return;
    _gameTimerSeconds += seconds;
    _isTimeOver = false;
    _isGamePaused = false;
    unawaited(_sound.playSuccess());
    _showToast('⏱️ Extra Time: +${seconds}s Added! Mission Resumed!');
    notifyListeners();
  }

  void restartLevelAfterTimeout() {
    unawaited(_sound.playClick());
    _isTimeOver = false;
    resetPuzzle(targetLevel: _selectedLevelNum, targetStage: _stageNum);
  }

  Future<void> continueToNextStage() async {
    unawaited(_sound.playClick());
    _isCorrectModalOpen = false;
    notifyListeners();

    await _adMob.showInterstitial(
      onClose: () {
        resetPuzzle(targetLevel: _selectedLevelNum, targetStage: _stageNum);
        navigateTo(AppScreen.game);
      },
    );
  }

  void retryCurrentStage() {
    unawaited(_sound.playClick());
    _isWrongModalOpen = false;
    resetPuzzle(targetLevel: _selectedLevelNum, targetStage: _stageNum);
    navigateTo(AppScreen.game);
  }

  void dismissInsufficientFunds() {
    if (!_insufficientFundsModal.isOpen) return;
    _insufficientFundsModal = const InsufficientFundsInfo();
    notifyListeners();
  }

  Future<void> resetAllProgress() async {
    _unlockedLevelMax = GameDefaults.defaultUnlockedLevel;
    _playerLevel = GameDefaults.defaultPlayerLevel;
    _selectedLevelNum = GameDefaults.defaultSelectedLevel;
    _playerXp = GameDefaults.defaultPlayerXp;
    _stageNum = 1;
    _stageSeeds = CrossmathGenerator.getStageSeedsForLevel(1);
    _puzzleSeed = _stageSeeds.isNotEmpty ? _stageSeeds.first : 101;
    _profile = _profile.copyWith(
      equippedAvatarAsset: GameDefaults.defaultAvatarAsset,
    );
    await _storage.setString(
      'newromath_player_avatar',
      GameDefaults.defaultAvatarAsset,
    );
    await _persistEconomy();
    resetPuzzle(targetLevel: 1, targetStage: 1);
    _showToast('🚀 Campaign reset! Starting fresh from Level 1.');
    notifyListeners();
  }

  // ---------------------------------------------------------------------------
  // Daily Challenge Calendar & 3x3 Interconnected Matrix Gameplay
  // ---------------------------------------------------------------------------

  int get currentCalendarYear => DateTime.now().year;
  int get currentCalendarMonth => DateTime.now().month; // 1..12
  int get currentSeasonNum => currentCalendarMonth;
  String get currentMonthName => DateFormat('MMMM').format(DateTime.now());
  String get currentMonthShort => DateFormat('MMM').format(DateTime.now());
  int get todayCalendarDay => DateTime.now().day;

  int get daysInCurrentMonth =>
      DateTime(currentCalendarYear, currentCalendarMonth + 1, 0).day;

  /// Sunday = 0 .. Saturday = 6 (matches JS `Date.getDay()`).
  int get firstDayOfWeek =>
      DateTime(currentCalendarYear, currentCalendarMonth, 1).weekday % 7;

  int _activeDailyDay = 1;
  int get activeDailyDay => _activeDailyDay;

  List<int> _completedDailyDays = [];
  List<int> get completedDailyDays => List.unmodifiable(_completedDailyDays);

  int get streakDays {
    var count = 0;
    var check = _completedDailyDays.contains(todayCalendarDay)
        ? todayCalendarDay
        : todayCalendarDay - 1;
    while (check >= 1 && _completedDailyDays.contains(check)) {
      count++;
      check--;
    }
    return count;
  }

  int get bestStreakDays {
    var maxStreak = 0;
    var current = 0;
    for (var d = 1; d <= daysInCurrentMonth; d++) {
      if (_completedDailyDays.contains(d)) {
        current++;
        if (current > maxStreak) maxStreak = current;
      } else {
        current = 0;
      }
    }
    return maxStreak;
  }

  List<DailyDayRecord> get dailyCalendarDays {
    final today = todayCalendarDay;
    return List<DailyDayRecord>.generate(daysInCurrentMonth, (index) {
      final day = index + 1;
      final completed = _completedDailyDays.contains(day);
      final isFuture = day > today;
      return DailyDayRecord(
        year: currentCalendarYear,
        month: currentCalendarMonth,
        day: day,
        isCompleted: completed,
        isToday: day == today,
        isFuture: isFuture,
        isMissed: !completed && day < today,
      );
    });
  }

  int _dailyGameDay = 1;
  int get dailyGameDay => _dailyGameDay;

  DailyChallengePuzzle? _dailyGamePuzzle;
  DailyChallengePuzzle? get dailyGamePuzzle => _dailyGamePuzzle;

  final Map<int, int> _dailyGameAnswers = {};
  Map<int, int> get dailyGameAnswers => Map.unmodifiable(_dailyGameAnswers);

  final List<int> _dailyGameHistory = [];
  List<int> get dailyGameHistory => List.unmodifiable(_dailyGameHistory);

  int _dailyGameSelectedSlot = 0;
  int get dailyGameSelectedSlot => _dailyGameSelectedSlot;

  int _dailyGameTimerSeconds = 90;
  int get dailyGameTimerSeconds => _dailyGameTimerSeconds;

  int _dailyGameLives = 3;
  int get dailyGameLives => _dailyGameLives;

  bool _isDailyGamePaused = false;
  bool get isDailyGamePaused => _isDailyGamePaused;

  bool _dailyGameVictoryModal = false;
  bool get dailyGameVictoryModal => _dailyGameVictoryModal;

  bool _dailyGameDefeatModal = false;
  bool get dailyGameDefeatModal => _dailyGameDefeatModal;

  bool _dailyGameTimeOver = false;
  bool get dailyGameTimeOver => _dailyGameTimeOver;

  int _dailyHintUsed = 0;
  int get dailyHintUsed => _dailyHintUsed;

  DailyAdPromptInfo _dailyAdPromptModal = const DailyAdPromptInfo();
  DailyAdPromptInfo get dailyAdPromptModal => _dailyAdPromptModal;

  void selectDailyDay(int day) {
    unawaited(_sound.playClick());
    _activeDailyDay = day.clamp(1, daysInCurrentMonth);
    notifyListeners();
  }

  void startDailyChallenge({int? dayNum}) {
    unawaited(_sound.playClick());
    final targetDay = (dayNum ?? _activeDailyDay).clamp(1, daysInCurrentMonth);
    _dailyGameDay = targetDay;
    _dailyGamePuzzle = DailyGenerator.generateDailyChallengePuzzle(
      currentCalendarYear,
      currentSeasonNum,
      targetDay,
    );
    _dailyGameAnswers.clear();
    _dailyGameHistory.clear();
    _dailyGameSelectedSlot = 0;
    _dailyGameTimerSeconds = 90;
    _dailyGameLives = 3;
    _isDailyGamePaused = false;
    _dailyGameVictoryModal = false;
    _dailyGameDefeatModal = false;
    _dailyGameTimeOver = false;
    _dailyHintUsed = 0;
    navigateTo(AppScreen.dailyGame);
  }

  void selectDailySlot(int slotIndex) {
    if (_isDailyGamePaused || _dailyGameTimeOver) return;
    unawaited(_sound.playClick());
    _dailyGameSelectedSlot = slotIndex.clamp(0, 8);
    notifyListeners();
  }

  void placeDailyNumber(int number) {
    if (_isDailyGamePaused ||
        _dailyGameTimeOver ||
        _dailyGameVictoryModal ||
        _dailyGameDefeatModal) {
      return;
    }
    if (_dailyGameAnswers.containsValue(number)) return;

    var targetSlot = _dailyGameSelectedSlot.clamp(0, 8);
    if (_dailyGameAnswers.containsKey(targetSlot)) {
      final nextEmpty = List<int>.generate(9, (i) => i)
          .where((s) => !_dailyGameAnswers.containsKey(s))
          .firstOrNull;
      targetSlot = nextEmpty ?? 0;
    }

    _dailyGameAnswers[targetSlot] = number;
    _dailyGameHistory.add(targetSlot);

    final nextEmpty = List<int>.generate(9, (i) => i)
        .where((s) => s != targetSlot && !_dailyGameAnswers.containsKey(s))
        .firstOrNull;
    if (nextEmpty != null) {
      _dailyGameSelectedSlot = nextEmpty;
    }

    unawaited(_sound.playPlace());
    _hapticLight();
    notifyListeners();
    _evaluateDailyCompletion();
  }

  void removeDailyNumber(int slotIndex) {
    if (_isDailyGamePaused || _dailyGameTimeOver) return;
    if (!_dailyGameAnswers.containsKey(slotIndex)) return;
    _dailyGameAnswers.remove(slotIndex);
    _dailyGameHistory.remove(slotIndex);
    _dailyGameSelectedSlot = slotIndex;
    unawaited(_sound.playErase());
    _hapticLight();
    notifyListeners();
  }

  void undoDailyNumber() {
    if (_isDailyGamePaused || _dailyGameTimeOver) return;
    if (_dailyGameHistory.isEmpty) return;
    final last = _dailyGameHistory.removeLast();
    _dailyGameAnswers.remove(last);
    _dailyGameSelectedSlot = last;
    unawaited(_sound.playErase());
    _hapticLight();
    notifyListeners();
  }

  Future<void> useDailyHint() async {
    final puzzle = _dailyGamePuzzle;
    if (puzzle == null || _dailyGameTimeOver || _dailyGameVictoryModal) return;

    final targetSlot =
        HintSolver.findNextDailyHintSlot(puzzle, _dailyGameAnswers);
    if (targetSlot == null) return;

    final correctVal = puzzle.answers[targetSlot];
    if (correctVal == null) return;

    // If that number is currently placed in a wrong slot, remove it from there first.
    final conflictSlot = _dailyGameAnswers.entries
        .where((e) => e.value == correctVal && e.key != targetSlot)
        .map((e) => e.key)
        .firstOrNull;
    if (conflictSlot != null) {
      _dailyGameAnswers.remove(conflictSlot);
      _dailyGameHistory.remove(conflictSlot);
    }

    _dailyGameAnswers[targetSlot] = correctVal;
    if (!_dailyGameHistory.contains(targetSlot)) {
      _dailyGameHistory.add(targetSlot);
    }
    _dailyGameSelectedSlot = targetSlot;
    _dailyHintUsed++;
    unawaited(_sound.playSuccess());
    notifyListeners();
    _evaluateDailyCompletion();
  }

  void _evaluateDailyCompletion() {
    final puzzle = _dailyGamePuzzle;
    if (puzzle == null || _dailyGameVictoryModal) return;
    if (!DailyGenerator.isDailyPuzzleSolved(puzzle, _dailyGameAnswers)) return;

    unawaited(_sound.playSuccess());
    unawaited(_sound.playVictory());
    _hapticMedium();

    if (!_completedDailyDays.contains(_dailyGameDay)) {
      _completedDailyDays = ([..._completedDailyDays, _dailyGameDay]..sort());
      unawaited(_storage.setJson(_dailyCompletedStorageKey, _completedDailyDays));
    }

    _coins = _security.clampCoins(_coins + 150);
    _gems = _security.clampGems(_gems + 20);
    unawaited(_persistEconomy());

    final nowMs = DateTime.now().millisecondsSinceEpoch;
    final dailyRec = PuzzleRecord(
      id: 'daily-$nowMs',
      equation:
          'Daily #${puzzle.protocolId} (${puzzle.targetAlpha}/${puzzle.targetBeta}/${puzzle.targetGamma})',
      timeLabel: 'Just Now',
      level: activePlayerLevel,
      mode: 'Daily Matrix',
      solved: true,
      xp: 50,
      timestampMs: nowMs,
    );
    _puzzleRecords = [dailyRec, ..._puzzleRecords].take(50).toList();
    unawaited(
      _storage.setJson(
        'newromath_puzzle_records',
        _puzzleRecords.map((r) => r.toJson()).toList(),
      ),
    );

    _dailyGameVictoryModal = true;
    notifyListeners();
  }

  void toggleDailyPause() {
    unawaited(_sound.playClick());
    _isDailyGamePaused = !_isDailyGamePaused;
    notifyListeners();
  }

  void dismissDailyVictoryModal() {
    if (!_dailyGameVictoryModal) return;
    _dailyGameVictoryModal = false;
    notifyListeners();
  }

  void dismissDailyDefeatModal() {
    if (!_dailyGameDefeatModal) return;
    _dailyGameDefeatModal = false;
    notifyListeners();
  }

  void dismissDailyTimeOver() {
    if (!_dailyGameTimeOver) return;
    _dailyGameTimeOver = false;
    notifyListeners();
  }

  void addDailyExtraTime(int seconds) {
    if (seconds <= 0) return;
    _dailyGameTimerSeconds += seconds;
    _dailyGameTimeOver = false;
    _isDailyGamePaused = false;
    unawaited(_sound.playSuccess());
    _showToast('⏱️ Extra Time: +${seconds}s Added! Daily Matrix Resumed!');
    notifyListeners();
  }

  void retryDailyChallenge() {
    startDailyChallenge(dayNum: _dailyGameDay);
  }

  /// Attempts to unlock a missed calendar day with 50 Coins; if insufficient,
  /// opens [dailyAdPromptModal] so the player can watch a rewarded ad instead.
  Future<bool> startMissedDailyDayWithCoins(int dayNum) async {
    const fee = 50;
    unawaited(_sound.playClick());
    if (_coins >= fee) {
      _coins = _security.clampCoins(_coins - fee);
      await _persistEconomy();
      _showToast('Missed Day $dayNum Unlocked: -$fee Coins');
      startDailyChallenge(dayNum: dayNum);
      return true;
    }

    unawaited(_sound.playMistake());
    _dailyAdPromptModal = DailyAdPromptInfo(
      isOpen: true,
      targetDay: dayNum,
      fee: fee,
      reason: 'missed_day',
    );
    notifyListeners();
    return false;
  }

  Future<void> unlockMissedDailyDayWithAd(int dayNum) async {
    unawaited(_sound.playClick());
    _dailyAdPromptModal = const DailyAdPromptInfo();
    notifyListeners();

    await watchRewardedAd(
      AdRewardInfo(
        type: 'both',
        amount: 0,
        title: 'Unlock Missed Day $dayNum Free',
        coinAmount: 150,
        gemAmount: 10,
      ),
      onComplete: () {
        _showToast('Day $dayNum Unlocked Free + 150 Coins!');
        startDailyChallenge(dayNum: dayNum);
      },
    );
  }

  void dismissDailyAdPrompt() {
    if (!_dailyAdPromptModal.isOpen) return;
    _dailyAdPromptModal = const DailyAdPromptInfo();
    notifyListeners();
  }

  // ---------------------------------------------------------------------------
  // Rewards & In-App Purchases (Google Play Billing)
  // ---------------------------------------------------------------------------

  List<IapProduct> get iapProducts => iapCatalog;

  final Map<String, String> _iapPrices = {
    for (final p in iapCatalog) p.id: p.defaultPrice,
  };
  Map<String, String> get iapPrices => Map.unmodifiable(_iapPrices);

  bool _isIapLoading = false;
  bool get isIapLoading => _isIapLoading;

  String? _activePurchaseSku;
  String? get activePurchaseSku => _activePurchaseSku;

  String? _iapErrorMessage;
  String? get iapErrorMessage => _iapErrorMessage;

  String getProductPrice(String sku) {
    return _iapPrices[sku] ?? _purchase.getPrice(sku);
  }

  Future<bool> purchaseProduct(String sku) async {
    unawaited(_sound.playClick());
    final product = iapCatalog.where((p) => p.id == sku).firstOrNull;
    if (product == null) return false;

    _isIapLoading = true;
    _activePurchaseSku = sku;
    _iapErrorMessage = null;
    _showToast('⏳ Connecting to Google Play Store...');
    notifyListeners();

    final res = await _purchase.purchaseProduct(sku, storage: _storage);
    _syncPurchaseFields();

    if (res.success) {
      unawaited(_sound.playVictory());
      if (product.type == 'coins') {
        _coins = _security.clampCoins(_coins + product.amount);
        unawaited(_sound.playCoin());
        _showToast(
          '🎉 Google Play Purchase: +${NumberFormat.decimalPattern().format(product.amount)} Coins Added!',
        );
      } else if (product.type == 'gems') {
        _gems = _security.clampGems(_gems + product.amount);
        unawaited(_sound.playGem());
        _showToast(
          '💎 Google Play Purchase: +${NumberFormat.decimalPattern().format(product.amount)} Diamonds Added!',
        );
      } else if (product.type == 'pro') {
        _coins = _security.clampCoins(_coins + 2000);
        _gems = _security.clampGems(_gems + 50);
        _profile = _profile.copyWith(isProUser: true);
        _adMob.setAdsDisabled(true);
        _showToast(
          '👑 PRO VIP Pass Activated! Ads Removed + 2,000 🪙 + 50 💎 Added!',
        );
      }
      await _persistEconomy();
      notifyListeners();
      return true;
    } else {
      unawaited(_sound.playMistake());
      _iapErrorMessage = res.error;
      if (res.error != null &&
          !res.error!.toLowerCase().contains('cancel')) {
        _showToast('❌ ${res.error}');
      } else {
        _showToast('Purchase was cancelled.');
      }
      notifyListeners();
      return false;
    }
  }

  Future<bool> exchangeGemsForCoins(String sku) async {
    unawaited(_sound.playClick());
    final product = iapCatalog.where((p) => p.id == sku).firstOrNull;
    final cost = product?.gemsCost;
    if (product == null || cost == null) return false;
    if (_gems < cost) {
      unawaited(_sound.playMistake());
      _showToast(
        '❌ Need more Diamonds! Watch an ad to collect free Diamonds.',
      );
      notifyListeners();
      return false;
    }

    _gems = _security.clampGems(_gems - cost);
    _coins = _security.clampCoins(_coins + product.amount);
    await _persistEconomy();
    unawaited(_sound.playSuccess());
    unawaited(_sound.playCoin());
    _showToast(
      '🪙 Exchanged $cost 💎 for +${NumberFormat.decimalPattern().format(product.amount)} Gold Coins!',
    );
    notifyListeners();
    return true;
  }

  Future<void> restorePurchases() async {
    unawaited(_sound.playClick());
    _showToast('🔄 Connecting to Google Play to restore purchases...');
    notifyListeners();

    final res = await _purchase.restorePurchases(storage: _storage);
    _syncPurchaseFields();

    if (_purchase.isProUser) {
      _profile = _profile.copyWith(isProUser: true);
      _adMob.setAdsDisabled(true);
      await _persistEconomy();
    }

    if (res.success) {
      unawaited(_sound.playSuccess());
    } else {
      unawaited(_sound.playMistake());
    }
    _showToast(res.message);
    notifyListeners();
  }

  // ---------------------------------------------------------------------------
  // Google AdMob
  // ---------------------------------------------------------------------------

  bool get isProUser => _profile.isProUser;
  bool get isAdsDisabled => _profile.isProUser;
  bool get isBannerVisible =>
      !isAdsDisabled &&
      _adMob.bannerVisible &&
      _currentScreen != AppScreen.splash &&
      _currentScreen != AppScreen.onboarding;

  bool _isRewardedReady = false;
  bool get isRewardedReady => _isRewardedReady;

  bool _isInterstitialActive = false;
  bool get isInterstitialActive => _isInterstitialActive;

  String? _rewardToastMessage;
  String? get rewardToastMessage => _rewardToastMessage;

  Timer? _toastTimer;

  void _showToast(String message) {
    _toastTimer?.cancel();
    _rewardToastMessage = message;
    _toastTimer = Timer(const Duration(milliseconds: 3200), clearRewardToast);
  }

  void clearRewardToast() {
    _toastTimer?.cancel();
    if (_rewardToastMessage != null) {
      _rewardToastMessage = null;
      notifyListeners();
    }
  }

  Future<bool> watchRewardedAd(
    AdRewardInfo reward, {
    VoidCallback? onComplete,
  }) async {
    unawaited(_sound.playClick());
    var earned = false;

    await _adMob.showRewarded(
      onReward: (_, _) {
        earned = true;
      },
    );

    if (!earned) {
      notifyListeners();
      return false;
    }

    unawaited(_sound.playSuccess());
    if (reward.type == 'coins') {
      final val = reward.coinAmount > 0
          ? reward.coinAmount
          : (reward.amount > 0 ? reward.amount : 250);
      _coins = _security.clampCoins(_coins + val);
      unawaited(_sound.playCoin());
      _showToast('🎉 Ad Reward: +$val Coins Collected!');
    } else if (reward.type == 'gems') {
      final val = reward.gemAmount > 0
          ? reward.gemAmount
          : (reward.amount > 0 ? reward.amount : 10);
      _gems = _security.clampGems(_gems + val);
      unawaited(_sound.playGem());
      _showToast('💎 Ad Reward: +$val Diamonds Collected!');
    } else if (reward.type == 'hint') {
      _showToast('💡 Quantum Hint Unlocked!');
    } else if (reward.type == 'time') {
      final extraSec = reward.amount > 0 ? reward.amount : 30;
      _gameTimerSeconds += extraSec;
      _isTimeOver = false;
      _showToast('⏱️ Extra Time: +${extraSec}s Added! Mission Resumed!');
    } else if (reward.type == 'daily_time') {
      final extraSec = reward.amount > 0 ? reward.amount : 30;
      _dailyGameTimerSeconds += extraSec;
      _dailyGameTimeOver = false;
      _showToast('⏱️ Extra Time: +${extraSec}s Added! Daily Matrix Resumed!');
    } else {
      final cAmt = reward.coinAmount > 0
          ? reward.coinAmount
          : (reward.type == 'jackpot' ? 600 : 350);
      final gAmt = reward.gemAmount > 0 ? reward.gemAmount : 15;
      _coins = _security.clampCoins(_coins + cAmt);
      _gems = _security.clampGems(_gems + gAmt);
      unawaited(_sound.playCoin());
      _showToast('🎉 Ad Reward: +$cAmt 🪙 & +$gAmt 💎 Added!');
    }

    await _persistEconomy();
    onComplete?.call();
    notifyListeners();
    return true;
  }

  Future<void> showInterstitialAd({
    bool force = false,
    VoidCallback? onClose,
  }) async {
    await _adMob.showInterstitial(force: force, onClose: onClose);
  }

  // ---------------------------------------------------------------------------
  // Settings & Filters
  // ---------------------------------------------------------------------------

  PlayerSettings _settings = const PlayerSettings();
  PlayerSettings get settings => _settings;

  String _levelFilterTab = 'all'; // 'all' | 'easy' | 'medium' | 'hard'
  String get levelFilterTab => _levelFilterTab;

  String _awardFilter = 'all'; // 'all' | 'unlocked' | 'locked'
  String get awardFilter => _awardFilter;

  void setLevelFilterTab(String tab) {
    unawaited(_sound.playClick());
    _levelFilterTab = tab;
    notifyListeners();
  }

  void setAwardFilter(String filter) {
    unawaited(_sound.playClick());
    _awardFilter = filter;
    notifyListeners();
  }

  void updateSettings(PlayerSettings next) {
    _settings = next;
    _sound.setMuted(!next.soundEnabled);
    unawaited(_storage.setBool('newromath_dark_mode', next.isDarkMode));
    unawaited(_storage.setBool('newromath_sound', next.soundEnabled));
    unawaited(_storage.setBool('newromath_haptics', next.hapticsEnabled));
    unawaited(
      _storage.setBool('newromath_notifications', next.notificationsEnabled),
    );
    unawaited(_storage.setBool('newromath_timer', next.timerEnabled));
    unawaited(
      _storage.setBool('newromath_explanation', next.explanationEnabled),
    );
    unawaited(
      _storage.setBool('newromath_autosubmit', next.autoSubmitEnabled),
    );
    unawaited(_storage.setBool('newromath_largefont', next.largeFontEnabled));
    unawaited(_storage.setString('newromath_div_symbol', next.divisionSymbol));
    notifyListeners();
  }

  void toggleDarkMode() =>
      updateSettings(_settings.copyWith(isDarkMode: !_settings.isDarkMode));
  void toggleSound() {
    final nextSound = !_settings.soundEnabled;
    updateSettings(_settings.copyWith(soundEnabled: nextSound));
    if (nextSound) {
      unawaited(_sound.playClick());
    }
  }

  void toggleHaptics() =>
      updateSettings(_settings.copyWith(hapticsEnabled: !_settings.hapticsEnabled));
  void toggleNotifications() => updateSettings(
        _settings.copyWith(notificationsEnabled: !_settings.notificationsEnabled),
      );
  void toggleTimer() =>
      updateSettings(_settings.copyWith(timerEnabled: !_settings.timerEnabled));
  void toggleExplanation() => updateSettings(
        _settings.copyWith(explanationEnabled: !_settings.explanationEnabled),
      );
  void toggleAutoSubmit() => updateSettings(
        _settings.copyWith(autoSubmitEnabled: !_settings.autoSubmitEnabled),
      );
  void toggleLargeFont() => updateSettings(
        _settings.copyWith(largeFontEnabled: !_settings.largeFontEnabled),
      );
  void setDivisionSymbol(String symbol) {
    unawaited(_sound.playClick());
    updateSettings(_settings.copyWith(divisionSymbol: symbol));
  }

  // ---------------------------------------------------------------------------
  // Profile & Support
  // ---------------------------------------------------------------------------

  PlayerProfile _profile = const PlayerProfile(
    playerId: 'player_guest_default',
    name: GameDefaults.defaultPlayerName,
    country: GameDefaults.defaultPlayerCountry,
    countryFlag: '🇺🇸',
    equippedAvatarAsset: GameDefaults.defaultAvatarAsset,
  );
  PlayerProfile get profile => _profile;

  Future<void> updateProfile({
    required String name,
    required String country,
    String phone = '',
    String email = '',
  }) async {
    final trimmedName =
        name.trim().isEmpty ? GameDefaults.defaultPlayerName : name.trim();
    final trimmedCountry = country.trim().isEmpty
        ? GameDefaults.defaultPlayerCountry
        : country.trim();
    final matchedFlag = playerCountries
            .where((c) => c.name == trimmedCountry)
            .map((c) => c.flag)
            .firstOrNull ??
        '🌐';

    _profile = _profile.copyWith(
      name: trimmedName,
      country: trimmedCountry,
      countryFlag: matchedFlag,
      phone: phone.trim(),
      email: email.trim(),
    );

    await _storage.setString('newromath_player_name', trimmedName);
    await _storage.setString('newromath_player_country', trimmedCountry);
    await _storage.setString('newromath_player_phone', phone.trim());
    await _storage.setString('newromath_player_email', email.trim());
    unawaited(_firebase.syncPlayerNow(forceFirestore: true));

    unawaited(_sound.playVictory());
    _showToast('🎉 Player profile updated successfully!');
    notifyListeners();
  }

  Future<void> equipAvatar(String iconAsset) async {
    unawaited(_sound.playClick());
    _profile = _profile.copyWith(equippedAvatarAsset: iconAsset);
    await _storage.setString('newromath_player_avatar', iconAsset);
    unawaited(_firebase.syncPlayerNow(forceFirestore: true));
    _showToast('✨ 3D Avatar equipped!');
    notifyListeners();
  }

  Future<bool> submitFeedbackTicket({
    required String category,
    required String message,
    String email = '',
  }) async {
    if (message.trim().isEmpty) {
      unawaited(_sound.playMistake());
      return false;
    }

    await _firebase.submitFeedbackTicket(
      category: category,
      message: message.trim(),
      email: email.trim(),
    );
    unawaited(_sound.playSuccess());
    _showToast('📩 Support ticket submitted! We will reply shortly.');
    notifyListeners();
    return true;
  }

  // ---------------------------------------------------------------------------
  // Leaderboard & History
  // ---------------------------------------------------------------------------

  String _leaderboardTab = 'global'; // 'global' | 'friends' | 'weekly'
  String get leaderboardTab => _leaderboardTab;

  List<LeaderboardEntry> _leaderboardEntries = fallbackLeaderboard;
  List<LeaderboardEntry> get leaderboardEntries =>
      List.unmodifiable(_leaderboardEntries);

  bool _isLeaderboardLoading = false;
  bool get isLeaderboardLoading => _isLeaderboardLoading;

  int get playerScore =>
      1200000 + activePlayerLevel * 28000 + _playerXp * 300 + _coins * 35;

  int get playerRank =>
      1 + leaderboardBotScores.where((score) => score > playerScore).length;

  String _historyTab = 'history'; // 'history' | 'saved'
  String get historyTab => _historyTab;

  List<PuzzleRecord> _puzzleRecords =
      List<PuzzleRecord>.from(defaultPuzzleRecords);
  List<PuzzleRecord> get puzzleRecords => List.unmodifiable(_puzzleRecords);

  List<String> _savedPuzzleIds = List<String>.from(defaultSavedPuzzleIds);
  List<String> get savedPuzzleIds => List.unmodifiable(_savedPuzzleIds);

  void setLeaderboardTab(String tab) {
    unawaited(_sound.playClick());
    _leaderboardTab = tab;
    notifyListeners();
  }

  Future<void> refreshLeaderboard({bool forceRefresh = false}) async {
    _isLeaderboardLoading = true;
    notifyListeners();
    try {
      final fetched = await _firebase.fetchLeaderboard(
        forceRefresh: forceRefresh,
        currentPlayerId: _profile.playerId,
      );
      if (fetched.isNotEmpty) {
        _leaderboardEntries = fetched;
      }
    } catch (_) {
      _leaderboardEntries = fallbackLeaderboard;
    } finally {
      _isLeaderboardLoading = false;
      notifyListeners();
    }
  }

  void setHistoryTab(String tab) {
    unawaited(_sound.playClick());
    _historyTab = tab;
    notifyListeners();
  }

  void toggleSavePuzzle(String recordId) {
    unawaited(_sound.playClick());
    if (_savedPuzzleIds.contains(recordId)) {
      _savedPuzzleIds.remove(recordId);
      _showToast('Formula unpinned from Saved');
    } else {
      _savedPuzzleIds.add(recordId);
      _showToast('🔖 Formula pinned to your Saved Archives!');
    }
    unawaited(_storage.setJson('newromath_saved_puzzles', _savedPuzzleIds));
    notifyListeners();
  }

  void clearHistory() {
    unawaited(_sound.playClick());
    _puzzleRecords.clear();
    unawaited(_storage.setJson('newromath_puzzle_records', const <dynamic>[]));
    _showToast('🧹 History records cleared');
    notifyListeners();
  }

  @override
  void dispose() {
    _toastTimer?.cancel();
    _campaignTicker?.cancel();
    _dailyTicker?.cancel();
    if (_serviceListenersAttached) {
      _adMob.removeListener(_onAdMobChanged);
      _purchase.removeListener(_onPurchaseChanged);
    }
    super.dispose();
  }
}

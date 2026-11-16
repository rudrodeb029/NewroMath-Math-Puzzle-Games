import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

import '../data/levels_catalog.dart';

/// Immutable snapshot of Google AdMob state.
@immutable
class AdMobState {
  const AdMobState({
    required this.isInitialized,
    required this.isNativeMobile,
    required this.adsDisabled,
    required this.bannerVisible,
    required this.interstitialActive,
    required this.interstitialReady,
    required this.rewardedReady,
    required this.lastInterstitialTimeMs,
  });

  final bool isInitialized;
  final bool isNativeMobile;
  final bool adsDisabled;
  final bool bannerVisible;
  final bool interstitialActive;
  final bool interstitialReady;
  final bool rewardedReady;
  final int lastInterstitialTimeMs;
}

/// Google AdMob service using official Demo/Test Ad Unit IDs, background
/// preloading, 45s interstitial cooldown, and safe web/desktop fallback.
class AdMobService extends ChangeNotifier {
  AdMobService._();

  static final AdMobService instance = AdMobService._();

  static const String appId = AdMobConfig.appId;
  static const String bannerAdUnitId = AdMobConfig.bannerAdUnitId;
  static const String interstitialAdUnitId = AdMobConfig.interstitialAdUnitId;
  static const String rewardedAdUnitId = AdMobConfig.rewardedAdUnitId;
  static const Duration interstitialCooldown =
      Duration(milliseconds: AdMobConfig.interstitialCooldownMs);

  bool _isInitialized = false;
  bool _adsDisabled = false;
  bool _bannerVisible = true;
  bool _interstitialActive = false;
  bool _interstitialReady = false;
  bool _rewardedReady = false;
  bool _isPreloadingInterstitial = false;
  bool _isPreloadingRewarded = false;
  int _lastInterstitialTimeMs = 0;

  InterstitialAd? _interstitialAd;
  RewardedAd? _rewardedAd;
  Completer<bool>? _interstitialPreloadCompleter;
  Completer<bool>? _rewardedPreloadCompleter;

  bool get isNativeMobile =>
      !kIsWeb &&
      (defaultTargetPlatform == TargetPlatform.android ||
          defaultTargetPlatform == TargetPlatform.iOS);

  bool get isInitialized => _isInitialized;
  bool get isAdsDisabled => _adsDisabled;
  bool get bannerVisible => _adsDisabled ? false : _bannerVisible;
  bool get interstitialActive => _adsDisabled ? false : _interstitialActive;
  bool get interstitialReady => _interstitialReady;
  bool get rewardedReady => _rewardedReady;
  int get lastInterstitialTimeMs => _lastInterstitialTimeMs;

  AdMobState get state => AdMobState(
        isInitialized: _isInitialized,
        isNativeMobile: isNativeMobile,
        adsDisabled: _adsDisabled,
        bannerVisible: bannerVisible,
        interstitialActive: interstitialActive,
        interstitialReady: _interstitialReady,
        rewardedReady: _rewardedReady,
        lastInterstitialTimeMs: _lastInterstitialTimeMs,
      );

  /// Initializes the Mobile Ads SDK (on Android/iOS) and preloads Interstitial + Rewarded ads.
  Future<void> initialize({bool isProUser = false}) async {
    _adsDisabled = isProUser;
    _bannerVisible = !isProUser;

    if (_isInitialized) {
      notifyListeners();
      return;
    }

    if (isNativeMobile) {
      try {
        await MobileAds.instance.initialize();
        _isInitialized = true;
        notifyListeners();
        if (!_adsDisabled) {
          unawaited(preloadInterstitial());
        }
        unawaited(preloadRewarded());
        return;
      } catch (_) {
        // Fall back gracefully if MobileAds fails (e.g. test/emulator missing Play Services).
      }
    }

    _isInitialized = true;
    _interstitialReady = !_adsDisabled;
    _rewardedReady = true;
    notifyListeners();
  }

  /// Enables or disables ads globally (e.g. when PRO VIP pass is active).
  void setAdsDisabled(bool disabled) {
    _adsDisabled = disabled;
    _bannerVisible = !disabled;
    if (disabled) {
      _interstitialActive = false;
      _interstitialAd?.dispose();
      _interstitialAd = null;
      _interstitialReady = false;
    } else if (_isInitialized) {
      unawaited(preloadInterstitial());
    }
    notifyListeners();
  }

  void showBanner() {
    if (_adsDisabled) {
      _bannerVisible = false;
    } else {
      _bannerVisible = true;
    }
    notifyListeners();
  }

  void hideBanner() {
    _bannerVisible = false;
    notifyListeners();
  }

  /// Creates and loads a [BannerAd] on Android/iOS, or returns `null` on web/desktop/PRO.
  BannerAd? createBannerAd({
    AdSize size = AdSize.banner,
    void Function(Ad ad)? onLoaded,
    void Function(Ad ad, LoadAdError error)? onFailed,
  }) {
    if (_adsDisabled || !isNativeMobile) return null;
    try {
      final banner = BannerAd(
        adUnitId: bannerAdUnitId,
        size: size,
        request: const AdRequest(),
        listener: BannerAdListener(
          onAdLoaded: (ad) {
            _bannerVisible = !_adsDisabled;
            notifyListeners();
            onLoaded?.call(ad);
          },
          onAdFailedToLoad: (ad, error) {
            ad.dispose();
            onFailed?.call(ad, error);
          },
        ),
      );
      unawaited(banner.load());
      return banner;
    } catch (_) {
      return null;
    }
  }

  /// Preloads an Interstitial Ad in the background.
  Future<bool> preloadInterstitial() async {
    if (_adsDisabled) return false;
    if (!isNativeMobile) {
      _interstitialReady = true;
      notifyListeners();
      return true;
    }
    if (_interstitialReady && _interstitialAd != null) return true;
    if (_isPreloadingInterstitial && _interstitialPreloadCompleter != null) {
      return _interstitialPreloadCompleter!.future;
    }

    _isPreloadingInterstitial = true;
    final completer = Completer<bool>();
    _interstitialPreloadCompleter = completer;

    try {
      await InterstitialAd.load(
        adUnitId: interstitialAdUnitId,
        request: const AdRequest(),
        adLoadCallback: InterstitialAdLoadCallback(
          onAdLoaded: (ad) {
            _interstitialAd = ad;
            _interstitialReady = true;
            _isPreloadingInterstitial = false;
            notifyListeners();
            if (!completer.isCompleted) completer.complete(true);
          },
          onAdFailedToLoad: (_) {
            _interstitialAd = null;
            _interstitialReady = false;
            _isPreloadingInterstitial = false;
            notifyListeners();
            if (!completer.isCompleted) completer.complete(false);
          },
        ),
      );
    } catch (_) {
      _interstitialAd = null;
      _interstitialReady = false;
      _isPreloadingInterstitial = false;
      if (!completer.isCompleted) completer.complete(false);
    }

    return completer.future.whenComplete(() {
      if (identical(_interstitialPreloadCompleter, completer)) {
        _interstitialPreloadCompleter = null;
      }
    });
  }

  /// Preloads a Rewarded Video Ad in the background for zero-latency launch.
  Future<bool> preloadRewarded() async {
    if (!isNativeMobile) {
      _rewardedReady = true;
      notifyListeners();
      return true;
    }
    if (_rewardedReady && _rewardedAd != null) return true;
    if (_isPreloadingRewarded && _rewardedPreloadCompleter != null) {
      return _rewardedPreloadCompleter!.future;
    }

    _isPreloadingRewarded = true;
    final completer = Completer<bool>();
    _rewardedPreloadCompleter = completer;

    try {
      await RewardedAd.load(
        adUnitId: rewardedAdUnitId,
        request: const AdRequest(),
        rewardedAdLoadCallback: RewardedAdLoadCallback(
          onAdLoaded: (ad) {
            _rewardedAd = ad;
            _rewardedReady = true;
            _isPreloadingRewarded = false;
            notifyListeners();
            if (!completer.isCompleted) completer.complete(true);
          },
          onAdFailedToLoad: (_) {
            _rewardedAd = null;
            _rewardedReady = false;
            _isPreloadingRewarded = false;
            notifyListeners();
            if (!completer.isCompleted) completer.complete(false);
          },
        ),
      );
    } catch (_) {
      _rewardedAd = null;
      _rewardedReady = false;
      _isPreloadingRewarded = false;
      if (!completer.isCompleted) completer.complete(false);
    }

    return completer.future.whenComplete(() {
      if (identical(_rewardedPreloadCompleter, completer)) {
        _rewardedPreloadCompleter = null;
      }
    });
  }

  /// Shows an Interstitial Ad respecting PRO ad-free status and the 45s cooldown.
  Future<bool> showInterstitial({
    bool force = false,
    VoidCallback? onClose,
  }) async {
    if (_adsDisabled) {
      onClose?.call();
      return false;
    }

    final nowMs = DateTime.now().millisecondsSinceEpoch;
    final elapsedMs = nowMs - _lastInterstitialTimeMs;
    if (!force &&
        _lastInterstitialTimeMs > 0 &&
        elapsedMs < interstitialCooldown.inMilliseconds) {
      onClose?.call();
      return false;
    }

    if (!isNativeMobile) {
      _lastInterstitialTimeMs = nowMs;
      onClose?.call();
      return true;
    }

    if (!_interstitialReady || _interstitialAd == null) {
      final loaded = await preloadInterstitial().timeout(
        const Duration(milliseconds: 800),
        onTimeout: () => false,
      );
      if (!loaded || _interstitialAd == null) {
        unawaited(preloadInterstitial());
        onClose?.call();
        return false;
      }
    }

    final ad = _interstitialAd!;
    _interstitialAd = null;
    _interstitialReady = false;
    _interstitialActive = true;
    notifyListeners();

    final showCompleter = Completer<bool>();

    ad.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        _interstitialActive = false;
        _lastInterstitialTimeMs = DateTime.now().millisecondsSinceEpoch;
        notifyListeners();
        onClose?.call();
        Future<void>.delayed(const Duration(milliseconds: 400), () {
          unawaited(preloadInterstitial());
        });
        if (!showCompleter.isCompleted) showCompleter.complete(true);
      },
      onAdFailedToShowFullScreenContent: (ad, _) {
        ad.dispose();
        _interstitialActive = false;
        notifyListeners();
        onClose?.call();
        Future<void>.delayed(const Duration(milliseconds: 500), () {
          unawaited(preloadInterstitial());
        });
        if (!showCompleter.isCompleted) showCompleter.complete(false);
      },
    );

    try {
      await ad.show();
    } catch (_) {
      ad.dispose();
      _interstitialActive = false;
      notifyListeners();
      onClose?.call();
      if (!showCompleter.isCompleted) showCompleter.complete(false);
    }

    return showCompleter.future;
  }

  /// Shows a Rewarded Ad (or invokes [onReward] directly in web/fallback mode).
  Future<bool> showRewarded({
    void Function(int amount, String type)? onReward,
    VoidCallback? onDismissed,
  }) async {
    if (!isNativeMobile) {
      onReward?.call(1, 'fallback');
      onDismissed?.call();
      return true;
    }

    if (!_rewardedReady || _rewardedAd == null) {
      final loaded = await preloadRewarded().timeout(
        const Duration(milliseconds: 800),
        onTimeout: () => false,
      );
      if (!loaded || _rewardedAd == null) {
        unawaited(preloadRewarded());
        // Graceful fallback so user is never stuck when test ad isn't cached yet.
        onReward?.call(1, 'fallback');
        onDismissed?.call();
        return false;
      }
    }

    final ad = _rewardedAd!;
    _rewardedAd = null;
    _rewardedReady = false;
    notifyListeners();

    var rewardGranted = false;
    final completer = Completer<bool>();

    ad.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        onDismissed?.call();
        Future<void>.delayed(const Duration(milliseconds: 300), () {
          unawaited(preloadRewarded());
        });
        if (!completer.isCompleted) completer.complete(rewardGranted);
      },
      onAdFailedToShowFullScreenContent: (ad, _) {
        ad.dispose();
        onReward?.call(1, 'fallback');
        onDismissed?.call();
        Future<void>.delayed(const Duration(milliseconds: 500), () {
          unawaited(preloadRewarded());
        });
        if (!completer.isCompleted) completer.complete(false);
      },
    );

    try {
      await ad.show(
        onUserEarnedReward: (_, rewardItem) {
          rewardGranted = true;
          onReward?.call(rewardItem.amount.toInt(), rewardItem.type);
        },
      );
    } catch (_) {
      ad.dispose();
      onReward?.call(1, 'fallback');
      onDismissed?.call();
      if (!completer.isCompleted) completer.complete(false);
    }

    return completer.future;
  }

  @override
  void dispose() {
    _interstitialAd?.dispose();
    _rewardedAd?.dispose();
    super.dispose();
  }
}

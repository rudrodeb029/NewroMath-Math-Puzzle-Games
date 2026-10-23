// Google AdMob Service — Instant Preloaded Rewarded Ads + Fixed-Height Banner Ads
// All unsolicited popup Interstitial Ads remain disabled across the entire app.
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  RewardAdPluginEvents,
  AdMobRewardItem,
} from '@capacitor-community/admob';

// Official Google AdMob Demo/Test Ad Unit IDs (Android)
export const ADMOB_DEMO_IDS = {
  appId: 'ca-app-pub-3940256099942544~3347511713',
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
};

export interface AdMobState {
  isInitialized: boolean;
  isNative: boolean;
  bannerVisible: boolean;
  interstitialActive: boolean;
  lastInterstitialTime: number;
  rewardedReady: boolean;
}

type StateListener = (state: AdMobState) => void;

class AdMobService {
  private isNative: boolean = false;
  private isInitialized: boolean = false;
  private bannerVisible: boolean = true;
  private interstitialActive: boolean = false;
  private lastInterstitialTime: number = 0;
  private adsDisabled: boolean = false;
  private rewardedReady: boolean = false;
  private isPreloadingRewarded: boolean = false;
  private preloadPromise: Promise<boolean> | null = null;
  private listeners: StateListener[] = [];

  constructor() {
    this.isNative = typeof window !== 'undefined' && Capacitor.isNativePlatform();
    if (typeof window !== 'undefined') {
      try {
        if (localStorage.getItem('newromath_is_pro_user') === 'true') {
          this.adsDisabled = true;
        }
      } catch (e) {}
    }
    this.bannerVisible = !this.adsDisabled;
    this.interstitialActive = false;
    this.isInitialized = !this.isNative;
  }

  public setAdsDisabled(disabled: boolean) {
    this.adsDisabled = disabled;
    this.bannerVisible = !disabled;
    this.interstitialActive = false;
    if (disabled && this.isNative) {
      AdMob.hideBanner().catch(() => {});
    }
    this.notify();
  }

  public isAdsDisabled(): boolean {
    return this.adsDisabled;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getState(): AdMobState {
    return {
      isInitialized: this.isInitialized,
      isNative: this.isNative,
      bannerVisible: this.adsDisabled ? false : this.bannerVisible,
      interstitialActive: false,
      lastInterstitialTime: this.lastInterstitialTime,
      rewardedReady: this.rewardedReady,
    };
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach((l) => {
      try {
        l(s);
      } catch (err) {
        console.warn('AdMobService listener error:', err);
      }
    });
  }

  // Initialize AdMob, enable bottom Banner, and immediately preload Rewarded Video Ad in background
  public async initialize(): Promise<void> {
    if (this.isInitialized && this.isNative) return;

    if (this.isNative) {
      try {
        await AdMob.initialize({
          initializeForTesting: true,
        });

        // Automatically warm up the next Rewarded Ad whenever one finishes or fails
        AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
          this.rewardedReady = true;
          this.isPreloadingRewarded = false;
          this.notify();
        });

        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
          this.rewardedReady = false;
          this.notify();
          // Preload next ad immediately in background so next click has 0ms delay
          setTimeout(() => {
            this.preloadRewarded().catch(() => {});
          }, 300);
        });

        AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
          this.rewardedReady = false;
          this.isPreloadingRewarded = false;
          this.notify();
        });

        AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
          this.rewardedReady = false;
          this.isPreloadingRewarded = false;
          this.notify();
          setTimeout(() => {
            this.preloadRewarded().catch(() => {});
          }, 500);
        });

        this.isInitialized = true;
        this.bannerVisible = !this.adsDisabled;
        this.notify();

        // Preload first Rewarded Video Ad right away in the background
        this.preloadRewarded().catch(() => {});
      } catch (e) {
        console.warn('[AdMob] Native initialization fallback:', e);
        this.isNative = false;
        this.isInitialized = true;
        this.bannerVisible = !this.adsDisabled;
        this.notify();
      }
    } else {
      this.isInitialized = true;
      this.bannerVisible = !this.adsDisabled;
      this.rewardedReady = true;
      this.notify();
    }
  }

  // Background preload for Rewarded Video Ads so clicking "Watch Ad" opens with 0ms delay
  public async preloadRewarded(): Promise<boolean> {
    if (!this.isNative) {
      this.rewardedReady = true;
      return true;
    }
    if (this.rewardedReady) return true;
    if (this.isPreloadingRewarded && this.preloadPromise) {
      return this.preloadPromise;
    }

    this.isPreloadingRewarded = true;
    this.preloadPromise = (async () => {
      try {
        await AdMob.prepareRewardVideoAd({
          adId: ADMOB_DEMO_IDS.rewarded,
          isTesting: true,
        });
        this.rewardedReady = true;
        this.isPreloadingRewarded = false;
        this.notify();
        return true;
      } catch (err) {
        console.warn('[AdMob] Background preloadRewarded failed:', err);
        this.rewardedReady = false;
        this.isPreloadingRewarded = false;
        this.notify();
        return false;
      } finally {
        this.preloadPromise = null;
      }
    })();

    return this.preloadPromise;
  }

  // Show fixed-height bottom Banner Ad without resizing the native WebView surface
  public async showBanner(): Promise<boolean> {
    if (this.adsDisabled) {
      this.bannerVisible = false;
      this.notify();
      return false;
    }
    this.bannerVisible = true;
    this.notify();
    return true;
  }

  public async hideBanner(): Promise<boolean> {
    this.bannerVisible = false;
    this.notify();
    if (this.isNative) {
      try {
        await AdMob.hideBanner();
      } catch {}
    }
    return true;
  }

  // Unsolicited popup Interstitial ads remain disabled everywhere; immediately invoke onClose
  public async showInterstitial(options?: { force?: boolean; onClose?: () => void }): Promise<boolean> {
    this.interstitialActive = false;
    if (options?.onClose) {
      options.onClose();
    }
    return false;
  }

  /**
   * Show Rewarded Video Ad immediately.
   * - If native ad is already preloaded (`rewardedReady === true`), launches in 0ms.
   * - If not yet preloaded, waits at most 650ms for preload; if still not ready, returns false
   *   so the caller immediately displays the zero-flash dark in-app Rewarded Ad modal.
   */
  public async showRewarded(onReward?: (reward?: AdMobRewardItem) => void): Promise<boolean> {
    if (!this.isNative) {
      return false; // Caller opens instant in-app AdMobRewardedModal
    }

    try {
      if (!this.rewardedReady) {
        // Wait at most 650ms so user never experiences a multi-second freeze or delay
        const readyInTime = await Promise.race([
          this.preloadRewarded(),
          new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 650)),
        ]);
        if (!readyInTime) {
          // Trigger background preload for next time and fall back to instant in-app modal now
          this.preloadRewarded().catch(() => {});
          return false;
        }
      }

      this.rewardedReady = false;
      const rewardItem = await AdMob.showRewardVideoAd();
      if (rewardItem && onReward) {
        onReward(rewardItem);
      }
      // Warm up next ad in background
      setTimeout(() => {
        this.preloadRewarded().catch(() => {});
      }, 300);
      return true;
    } catch (err) {
      console.warn('[AdMob Native] showRewarded error, falling back to instant modal:', err);
      this.rewardedReady = false;
      setTimeout(() => {
        this.preloadRewarded().catch(() => {});
      }, 500);
      return false;
    }
  }

  public dismissWebInterstitial() {
    this.interstitialActive = false;
    this.notify();
  }

  public async preloadInterstitial(): Promise<void> {
    // No-op: unsolicited interstitials disabled
  }
}

export const adMobService = new AdMobService();

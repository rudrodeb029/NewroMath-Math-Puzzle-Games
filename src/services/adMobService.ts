// Google AdMob Service — Official Demo/Test Banner, Interstitial & Rewarded Video Ads
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  BannerAdPosition,
  BannerAdSize,
  BannerAdPluginEvents,
  InterstitialAdPluginEvents,
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
  private interstitialReady: boolean = false;
  private isPreloadingInterstitial: boolean = false;
  private interstitialPreloadPromise: Promise<boolean> | null = null;
  private lastInterstitialTime: number = 0;
  private readonly INTERSTITIAL_COOLDOWN_MS = 45000;
  private pendingInterstitialCallback: (() => void) | null = null;
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
    if (disabled) {
      this.interstitialActive = false;
      if (this.isNative) {
        AdMob.hideBanner().catch(() => {});
      }
    } else if (this.isNative && this.isInitialized) {
      this.showBanner().catch(() => {});
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
      interstitialActive: this.adsDisabled ? false : this.interstitialActive,
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

  // Initialize AdMob, display Demo Banner at bottom, and preload Interstitial + Rewarded Ads
  public async initialize(): Promise<void> {
    if (this.isInitialized && this.isNative) return;

    if (this.isNative) {
      try {
        await AdMob.initialize({
          initializeForTesting: true,
        });

        // Banner listeners
        AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
          this.bannerVisible = !this.adsDisabled;
          this.notify();
        });

        AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err) => {
          console.warn('[AdMob Native] Banner failed to load:', err);
        });

        // Interstitial listeners
        AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
          this.interstitialReady = true;
          this.isPreloadingInterstitial = false;
        });

        AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
          this.interstitialActive = false;
          this.interstitialReady = false;
          this.lastInterstitialTime = Date.now();
          this.notify();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('nm-webview-repaint'));
          }
          if (this.pendingInterstitialCallback) {
            const cb = this.pendingInterstitialCallback;
            this.pendingInterstitialCallback = null;
            cb();
          }
          setTimeout(() => {
            this.preloadInterstitial().catch(() => {});
          }, 400);
        });

        AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, () => {
          this.interstitialReady = false;
          this.isPreloadingInterstitial = false;
        });

        AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, () => {
          this.interstitialActive = false;
          this.interstitialReady = false;
          this.isPreloadingInterstitial = false;
          this.notify();
          if (this.pendingInterstitialCallback) {
            const cb = this.pendingInterstitialCallback;
            this.pendingInterstitialCallback = null;
            cb();
          }
          setTimeout(() => {
            this.preloadInterstitial().catch(() => {});
          }, 500);
        });

        // Rewarded listeners
        AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
          this.rewardedReady = true;
          this.isPreloadingRewarded = false;
          this.notify();
        });

        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
          this.rewardedReady = false;
          this.notify();
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

        // Show Demo Bottom Banner and preload Demo Interstitial + Rewarded Ads
        if (!this.adsDisabled) {
          this.showBanner().catch(() => {});
          this.preloadInterstitial().catch(() => {});
        }
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
      this.interstitialReady = true;
      this.rewardedReady = true;
      this.notify();
    }
  }

  // Background preload for Interstitial Ads
  public async preloadInterstitial(): Promise<boolean> {
    if (this.adsDisabled) return false;
    if (!this.isNative) {
      this.interstitialReady = true;
      return true;
    }
    if (this.interstitialReady) return true;
    if (this.isPreloadingInterstitial && this.interstitialPreloadPromise) {
      return this.interstitialPreloadPromise;
    }

    this.isPreloadingInterstitial = true;
    this.interstitialPreloadPromise = (async () => {
      try {
        await AdMob.prepareInterstitial({
          adId: ADMOB_DEMO_IDS.interstitial,
          isTesting: true,
        });
        this.interstitialReady = true;
        this.isPreloadingInterstitial = false;
        return true;
      } catch (err) {
        console.warn('[AdMob] Background preloadInterstitial failed:', err);
        this.interstitialReady = false;
        this.isPreloadingInterstitial = false;
        return false;
      } finally {
        this.interstitialPreloadPromise = null;
      }
    })();

    return this.interstitialPreloadPromise;
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

  // Show fixed-height bottom Demo Banner Ad
  public async showBanner(): Promise<boolean> {
    if (this.adsDisabled) {
      this.bannerVisible = false;
      this.notify();
      return false;
    }
    this.bannerVisible = true;
    this.notify();

    if (this.isNative) {
      try {
        await AdMob.showBanner({
          adId: ADMOB_DEMO_IDS.banner,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: true,
        });
        return true;
      } catch (err) {
        console.warn('[AdMob Native] Failed to show banner:', err);
        return false;
      }
    }
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

  // Show Demo AdMob Interstitial Ad (Native or Web Modal fallback)
  public async showInterstitial(options?: { force?: boolean; onClose?: () => void }): Promise<boolean> {
    if (this.adsDisabled) {
      if (options?.onClose) options.onClose();
      return false;
    }

    const now = Date.now();
    const timeSinceLast = now - this.lastInterstitialTime;

    if (!options?.force && this.lastInterstitialTime > 0 && timeSinceLast < this.INTERSTITIAL_COOLDOWN_MS) {
      if (options?.onClose) options.onClose();
      return false;
    }

    if (this.isNative) {
      try {
        if (!this.interstitialReady) {
          const readyInTime = await Promise.race([
            this.preloadInterstitial(),
            new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 650)),
          ]);
          if (!readyInTime) {
            // Fall back to in-app demo interstitial modal if native network is slow
            this.preloadInterstitial().catch(() => {});
            this.pendingInterstitialCallback = options?.onClose || null;
            this.interstitialActive = true;
            this.notify();
            return true;
          }
        }

        this.pendingInterstitialCallback = options?.onClose || null;
        this.interstitialReady = false;
        this.interstitialActive = true;
        this.notify();
        await AdMob.showInterstitial();
        return true;
      } catch (err) {
        console.warn('[AdMob Native] Interstitial display error, using demo modal fallback:', err);
        this.interstitialReady = false;
        this.pendingInterstitialCallback = options?.onClose || null;
        this.interstitialActive = true;
        this.notify();
        return true;
      }
    } else {
      // Web / Demo Preview Mode
      this.pendingInterstitialCallback = options?.onClose || null;
      this.interstitialActive = true;
      this.notify();
      return true;
    }
  }

  public async showRewarded(onReward?: (reward?: AdMobRewardItem) => void): Promise<boolean> {
    if (!this.isNative) {
      return false; // Caller opens instant in-app AdMobRewardedModal
    }

    try {
      if (!this.rewardedReady) {
        const readyInTime = await Promise.race([
          this.preloadRewarded(),
          new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 650)),
        ]);
        if (!readyInTime) {
          this.preloadRewarded().catch(() => {});
          return false;
        }
      }

      this.rewardedReady = false;
      const rewardItem = await AdMob.showRewardVideoAd();
      if (rewardItem && onReward) {
        await new Promise<void>((resolve) => {
          if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(() => setTimeout(resolve, 40));
          } else {
            setTimeout(resolve, 50);
          }
        });
        onReward(rewardItem);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nm-webview-repaint'));
      }
      setTimeout(() => {
        this.preloadRewarded().catch(() => {});
      }, 400);
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
    this.lastInterstitialTime = Date.now();
    this.notify();
    if (this.pendingInterstitialCallback) {
      const cb = this.pendingInterstitialCallback;
      this.pendingInterstitialCallback = null;
      cb();
    }
  }
}

export const adMobService = new AdMobService();

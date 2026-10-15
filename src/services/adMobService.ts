// Google AdMob Service with Official Test Ad Units, Dual Native/Web Fallback & Policy Compliance
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  BannerAdPosition,
  BannerAdSize,
  BannerAdPluginEvents,
  InterstitialAdPluginEvents,
  RewardAdPluginEvents
} from '@capacitor-community/admob';

// Official Google AdMob Demo/Test Ad Unit IDs (Android)
export const ADMOB_DEMO_IDS = {
  appId: 'ca-app-pub-3940256099942544~3347511713',
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917'
};

export interface AdMobState {
  isInitialized: boolean;
  isNative: boolean;
  bannerVisible: boolean;
  interstitialActive: boolean;
  lastInterstitialTime: number;
}

type StateListener = (state: AdMobState) => void;

class AdMobService {
  private isNative: boolean = false;
  private isInitialized: boolean = false;
  private bannerVisible: boolean = false;
  private interstitialActive: boolean = false;
  private lastInterstitialTime: number = 0;
  private adsDisabled: boolean = false;
  // AdMob Policy: Minimum 45 seconds cooldown between interstitials to prevent aggressive ad spamming
  private readonly INTERSTITIAL_COOLDOWN_MS = 45000;
  private pendingInterstitialCallback: (() => void) | null = null;
  private listeners: StateListener[] = [];

  constructor() {
    this.isNative = typeof window !== 'undefined' && Capacitor.isNativePlatform();
    // Check if user has PRO / Remove Ads enabled
    if (typeof window !== 'undefined') {
      try {
        if (localStorage.getItem('newromath_is_pro_user') === 'true') {
          this.adsDisabled = true;
        }
      } catch (e) {}
    }

    // In web/preview environment, auto-enable demo banner by default if ads are not disabled
    if (!this.isNative && !this.adsDisabled) {
      this.bannerVisible = true;
      this.isInitialized = true;
    }
  }

  public setAdsDisabled(disabled: boolean) {
    this.adsDisabled = disabled;
    if (disabled) {
      this.bannerVisible = false;
      this.interstitialActive = false;
      if (this.isNative) {
        AdMob.hideBanner().catch(() => {});
      }
      this.notify();
    }
  }

  public isAdsDisabled(): boolean {
    return this.adsDisabled;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getState(): AdMobState {
    return {
      isInitialized: this.isInitialized,
      isNative: this.isNative,
      bannerVisible: this.bannerVisible,
      interstitialActive: this.interstitialActive,
      lastInterstitialTime: this.lastInterstitialTime
    };
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach(l => {
      try {
        l(s);
      } catch (err) {
        console.warn('AdMobService listener error:', err);
      }
    });
  }

  // Initialize AdMob (request consent/tracking and register native plugin listeners)
  public async initialize(): Promise<void> {
    if (this.isInitialized && this.isNative) return;

    if (this.isNative) {
      try {
        await AdMob.initialize({
          initializeForTesting: true
        });

        AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
          console.log('[AdMob Native] Banner loaded');
          this.bannerVisible = true;
          this.notify();
        });

        AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (err) => {
          console.warn('[AdMob Native] Banner failed to load:', err);
          this.bannerVisible = false;
          this.notify();
        });

        AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
          console.log('[AdMob Native] Interstitial dismissed');
          this.interstitialActive = false;
          this.lastInterstitialTime = Date.now();
          this.notify();
          if (this.pendingInterstitialCallback) {
            const cb = this.pendingInterstitialCallback;
            this.pendingInterstitialCallback = null;
            cb();
          }
        });

        AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (err) => {
          console.warn('[AdMob Native] Interstitial failed to show:', err);
          this.interstitialActive = false;
          this.notify();
          if (this.pendingInterstitialCallback) {
            const cb = this.pendingInterstitialCallback;
            this.pendingInterstitialCallback = null;
            cb();
          }
        });

        this.isInitialized = true;
        this.notify();

        // Automatically show native bottom banner
        await this.showBanner();
      } catch (e) {
        console.warn('[AdMob] Native initialization failed, falling back to simulated mode:', e);
        this.isNative = false;
        this.isInitialized = true;
        this.bannerVisible = true;
        this.notify();
      }
    } else {
      this.isInitialized = true;
      this.bannerVisible = true;
      this.notify();
    }
  }

  // Display AdMob Demo Banner at bottom (strictly adheres to AdMob position rules)
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
          isTesting: true
        });
        return true;
      } catch (err) {
        console.warn('[AdMob Native] Failed to show banner:', err);
        return false;
      }
    }
    return true;
  }

  // Hide AdMob Banner if screen requires full view
  public async hideBanner(): Promise<boolean> {
    this.bannerVisible = false;
    this.notify();

    if (this.isNative) {
      try {
        await AdMob.hideBanner();
        return true;
      } catch (err) {
        console.warn('[AdMob Native] Failed to hide banner:', err);
        return false;
      }
    }
    return true;
  }

  // Show AdMob Interstitial Ad with frequency cap and natural transition check
  public async showInterstitial(
    options?: { force?: boolean; onClose?: () => void }
  ): Promise<boolean> {
    if (this.adsDisabled) {
      if (options?.onClose) options.onClose();
      return false;
    }

    const now = Date.now();
    const timeSinceLast = now - this.lastInterstitialTime;

    // AdMob Policy: Do not spam interstitials. Respect cooldown unless forced
    if (!options?.force && this.lastInterstitialTime > 0 && timeSinceLast < this.INTERSTITIAL_COOLDOWN_MS) {
      console.log(`[AdMob] Interstitial skipped due to frequency cap (${Math.round((this.INTERSTITIAL_COOLDOWN_MS - timeSinceLast) / 1000)}s cooldown remaining).`);
      if (options?.onClose) options.onClose();
      return false;
    }

    if (this.isNative) {
      try {
        this.pendingInterstitialCallback = options?.onClose || null;
        await AdMob.prepareInterstitial({
          adId: ADMOB_DEMO_IDS.interstitial,
          isTesting: true
        });
        this.interstitialActive = true;
        this.notify();
        await AdMob.showInterstitial();
        return true;
      } catch (err) {
        console.warn('[AdMob Native] Interstitial display error:', err);
        this.interstitialActive = false;
        this.notify();
        if (options?.onClose) options.onClose();
        return false;
      }
    } else {
      // Web / Demo Preview Mode
      this.pendingInterstitialCallback = options?.onClose || null;
      this.interstitialActive = true;
      this.notify();
      return true;
    }
  }

  // Show rewarded video ad for revive or bonus rewards
  public async showRewarded(onReward?: () => void): Promise<boolean> {
    if (this.isNative) {
      try {
        await AdMob.prepareRewardVideoAd({
          adId: ADMOB_DEMO_IDS.rewarded,
          isTesting: true
        });
        const rewardItem = await AdMob.showRewardVideoAd();
        if (rewardItem && onReward) {
          onReward();
        }
        return true;
      } catch (err) {
        console.warn('[AdMob Native] Rewarded ad failed, executing fallback grant:', err);
        if (onReward) onReward();
        return false;
      }
    } else {
      // Web fallback: grant after short delay
      setTimeout(() => {
        if (onReward) onReward();
      }, 1500);
      return true;
    }
  }

  // Dismiss Web Interstitial Ad modal and invoke completion callback
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

  // Preload native interstitial in background memory
  public async preloadInterstitial(): Promise<void> {
    if (this.isNative) {
      try {
        await AdMob.prepareInterstitial({
          adId: ADMOB_DEMO_IDS.interstitial,
          isTesting: true
        });
      } catch (e) {
        console.warn('[AdMob Native] Preload interstitial failed:', e);
      }
    }
  }
}

export const adMobService = new AdMobService();


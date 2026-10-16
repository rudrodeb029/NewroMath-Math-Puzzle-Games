// Google AdMob Service — Rewarded-Only Mode (Earn Gold/Diamonds & Hints Only)
// All automatic Banner Ads and Interstitial Ads are disabled across the entire app.
import { Capacitor } from '@capacitor/core';
import { AdMob } from '@capacitor-community/admob';

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
}

type StateListener = (state: AdMobState) => void;

class AdMobService {
  private isNative: boolean = false;
  private isInitialized: boolean = false;
  private bannerVisible: boolean = false;
  private interstitialActive: boolean = false;
  private lastInterstitialTime: number = 0;
  private adsDisabled: boolean = false;
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
    // Banners and interstitials are permanently disabled; only user-initiated Rewarded Ads are used
    this.bannerVisible = false;
    this.interstitialActive = false;
    this.isInitialized = !this.isNative;
  }

  public setAdsDisabled(disabled: boolean) {
    this.adsDisabled = disabled;
    this.bannerVisible = false;
    this.interstitialActive = false;
    if (this.isNative) {
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
      bannerVisible: false,
      interstitialActive: false,
      lastInterstitialTime: this.lastInterstitialTime,
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

  // Initialize AdMob for Rewarded Video Ads only (no banner or interstitial auto-display)
  public async initialize(): Promise<void> {
    if (this.isInitialized && this.isNative) return;

    if (this.isNative) {
      try {
        await AdMob.initialize({
          initializeForTesting: true,
        });
        await AdMob.hideBanner().catch(() => {});
        this.isInitialized = true;
        this.bannerVisible = false;
        this.notify();
      } catch (e) {
        console.warn('[AdMob] Native initialization fallback:', e);
        this.isNative = false;
        this.isInitialized = true;
        this.bannerVisible = false;
        this.notify();
      }
    } else {
      this.isInitialized = true;
      this.bannerVisible = false;
      this.notify();
    }
  }

  // Banner ads are disabled everywhere
  public async showBanner(): Promise<boolean> {
    this.bannerVisible = false;
    this.notify();
    return false;
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

  // Interstitial ads are disabled everywhere; immediately invoke onClose callback
  public async showInterstitial(options?: { force?: boolean; onClose?: () => void }): Promise<boolean> {
    this.interstitialActive = false;
    if (options?.onClose) {
      options.onClose();
    }
    return false;
  }

  // Show rewarded video ad ONLY when player clicks to earn Gold/Diamonds or unlock Hints
  public async showRewarded(onReward?: () => void): Promise<boolean> {
    if (this.isNative) {
      try {
        await AdMob.prepareRewardVideoAd({
          adId: ADMOB_DEMO_IDS.rewarded,
          isTesting: true,
        });
        const rewardItem = await AdMob.showRewardVideoAd();
        if (rewardItem && onReward) {
          onReward();
        }
        return true;
      } catch (err) {
        console.warn('[AdMob Native] Rewarded ad fallback grant:', err);
        if (onReward) onReward();
        return false;
      }
    } else {
      setTimeout(() => {
        if (onReward) onReward();
      }, 1500);
      return true;
    }
  }

  public dismissWebInterstitial() {
    this.interstitialActive = false;
    this.notify();
  }

  public async preloadInterstitial(): Promise<void> {
    // No-op: interstitials disabled
  }
}

export const adMobService = new AdMobService();

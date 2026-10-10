// AdMob Service with background preloading and graceful Web & Native fallback

type AdEventListener = (event: 'interstitial_showing' | 'rewarded_showing' | 'ad_closed') => void;

class AdMobService {
  private isInterstitialReady: boolean = false;
  private isRewardedReady: boolean = false;
  private listeners: AdEventListener[] = [];

  constructor() {
    this.preloadInterstitial();
    this.preloadRewarded();
  }

  public addListener(listener: AdEventListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(event: 'interstitial_showing' | 'rewarded_showing' | 'ad_closed') {
    this.listeners.forEach(l => l(event));
  }

  // Preload full-screen interstitial ad in background native memory
  public async preloadInterstitial() {
    // In native mode: AdMob.prepareInterstitial(...)
    this.isInterstitialReady = true;
  }

  // Preload rewarded video ad for revive mechanism
  public async preloadRewarded() {
    // In native mode: AdMob.prepareRewardVideoAd(...)
    this.isRewardedReady = true;
  }

  // Display interstitial instantly upon puzzle completion
  public async showInterstitial(): Promise<boolean> {
    if (!this.isInterstitialReady) {
      await this.preloadInterstitial();
    }
    this.notify('interstitial_showing');
    this.isInterstitialReady = false;
    // Preload next interstitial in background
    setTimeout(() => this.preloadInterstitial(), 3000);
    return true;
  }

  // Show rewarded ad when player hits 3 strikes
  public async showRewarded(onReward: () => void): Promise<boolean> {
    this.notify('rewarded_showing');
    this.isRewardedReady = false;
    // On reward granted
    setTimeout(() => {
      onReward();
      this.notify('ad_closed');
      this.preloadRewarded();
    }, 1500);
    return true;
  }

  public closeAd() {
    this.notify('ad_closed');
  }
}

export const adMobService = new AdMobService();


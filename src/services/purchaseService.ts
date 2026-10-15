// Google Play Store In-App Purchases (IAP) Service
// Powered by @capgo/native-purchases with Google Play Billing Library & StoreKit 2
import { Capacitor } from '@capacitor/core';
import { NativePurchases, PURCHASE_TYPE, Product } from '@capgo/native-purchases';
import { adMobService } from './adMobService';

export interface IAPProductConfig {
  id: string; // SKU used in Google Play Console
  type: 'coins' | 'gems' | 'pro';
  amount: number;
  name: string;
  defaultPrice: string; // Fallback price string if offline
  badge?: string | null;
  icon?: string;
  isCustomImg?: boolean;
  customIcon?: string;
  isConsumable: boolean;
  gemsCost?: number; // Optional gems cost for exchange
  description: string;
}

// Official Catalog of Products for NewroMath
export const IAP_CATALOG: IAPProductConfig[] = [
  // --- PRO VIP PASS (NON-CONSUMABLE) ---
  {
    id: 'newromath_pro_noads',
    type: 'pro',
    amount: 1,
    name: 'PRO VIP Lifetime Pass',
    defaultPrice: '$2.99',
    badge: 'POPULAR VIP',
    icon: '👑',
    isConsumable: false,
    description: 'Permanent Ad-Free Experience + 2,000 Gold Coins + 50 Gems + VIP Crown Status'
  },

  // --- GOLD COIN PACKAGES (CONSUMABLE) ---
  {
    id: 'coins_1500',
    type: 'coins',
    amount: 1500,
    name: 'Handful of Gold',
    defaultPrice: '$0.99',
    badge: null,
    isCustomImg: true,
    customIcon: '/assets/icon_gold_coin_3d_clean.webp',
    isConsumable: true,
    gemsCost: 10,
    description: '1,500 Gold Coins for solving hints and entering missions'
  },
  {
    id: 'coins_5000',
    type: 'coins',
    amount: 5000,
    name: 'Pouch of Gold',
    defaultPrice: '$1.99',
    badge: 'POPULAR',
    icon: '💰',
    isConsumable: true,
    gemsCost: 25,
    description: '5,000 Gold Coins with bonus value'
  },
  {
    id: 'coins_15000',
    type: 'coins',
    amount: 15000,
    name: 'Chest of Gold',
    defaultPrice: '$4.99',
    badge: 'BEST VALUE',
    icon: '📦',
    isConsumable: true,
    gemsCost: 65,
    description: '15,000 Gold Coins for serious math masters'
  },
  {
    id: 'coins_45000',
    type: 'coins',
    amount: 45000,
    name: 'Vault of Gold',
    defaultPrice: '$9.99',
    badge: 'MEGA PACK',
    icon: '🏦',
    isConsumable: true,
    gemsCost: 160,
    description: '45,000 Gold Coins - unlimited puzzle unlocking'
  },

  // --- GEM PACKAGES (CONSUMABLE) ---
  {
    id: 'gems_50',
    type: 'gems',
    amount: 50,
    name: 'Pile of Gems',
    defaultPrice: '$0.99',
    badge: null,
    isCustomImg: true,
    customIcon: '/assets/icon_gem_3d_clean.webp',
    isConsumable: true,
    description: '50 Premium Diamonds for streak recovery and power-ups'
  },
  {
    id: 'gems_200',
    type: 'gems',
    amount: 200,
    name: 'Crystal Casket',
    defaultPrice: '$2.99',
    badge: 'HOT',
    icon: '✨',
    isConsumable: true,
    description: '200 Premium Diamonds with extra bonus gems'
  },
  {
    id: 'gems_600',
    type: 'gems',
    amount: 600,
    name: 'Crown of Gems',
    defaultPrice: '$6.99',
    badge: 'POPULAR',
    icon: '👑',
    isConsumable: true,
    description: '600 Premium Diamonds for elite puzzle solvers'
  },
  {
    id: 'gems_2000',
    type: 'gems',
    amount: 2000,
    name: 'Diamond Mountain',
    defaultPrice: '$19.99',
    badge: 'BEST DEAL',
    icon: '🏔️',
    isConsumable: true,
    description: '2,000 Premium Diamonds - the ultimate master treasury'
  }
];

export interface PurchaseState {
  isSupported: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  isProUser: boolean;
  prices: Record<string, string>; // Maps SKU -> Localized price string (e.g. '$0.99', '€0.99', etc.)
  activePurchaseSku: string | null;
  errorMessage: string | null;
}

type PurchaseListener = (state: PurchaseState) => void;

class PurchaseService {
  private isNative: boolean = false;
  private isSupported: boolean = false;
  private isInitialized: boolean = false;
  private isLoading: boolean = false;
  private isProUser: boolean = false;
  private prices: Record<string, string> = {};
  private activePurchaseSku: string | null = null;
  private errorMessage: string | null = null;
  private listeners: PurchaseListener[] = [];

  constructor() {
    this.isNative = typeof window !== 'undefined' && Capacitor.isNativePlatform();
    // Initialize default prices from catalog
    IAP_CATALOG.forEach(p => {
      this.prices[p.id] = p.defaultPrice;
    });

    // Check saved Pro status from local storage
    if (typeof window !== 'undefined') {
      try {
        const savedPro = localStorage.getItem('newromath_is_pro_user');
        if (savedPro === 'true') {
          this.isProUser = true;
          adMobService.setAdsDisabled(true);
        }
      } catch (e) {
        console.warn('[IAP] Failed to read local Pro status:', e);
      }
    }
  }

  public subscribe(listener: PurchaseListener): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getState(): PurchaseState {
    return {
      isSupported: this.isSupported,
      isInitialized: this.isInitialized,
      isLoading: this.isLoading,
      isProUser: this.isProUser,
      prices: { ...this.prices },
      activePurchaseSku: this.activePurchaseSku,
      errorMessage: this.errorMessage
    };
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach(l => {
      try {
        l(s);
      } catch (err) {
        console.warn('[IAP] Listener error:', err);
      }
    });
  }

  // Initialize Billing Client & Fetch Real Local Prices from Google Play Store
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.isLoading = true;
    this.notify();

    if (this.isNative) {
      try {
        const supportRes = await NativePurchases.isBillingSupported();
        this.isSupported = !!supportRes.isBillingSupported;

        if (this.isSupported) {
          const productIdentifiers = IAP_CATALOG.map(p => p.id);
          const productsRes = await NativePurchases.getProducts({
            productIdentifiers,
            productType: PURCHASE_TYPE.INAPP
          });

          if (productsRes && productsRes.products && productsRes.products.length > 0) {
            productsRes.products.forEach((prod: Product) => {
              if (prod.identifier && prod.priceString) {
                this.prices[prod.identifier] = prod.priceString;
              }
            });
            console.log('[IAP] Real prices loaded from Google Play Store:', this.prices);
          }

          // Check if previously bought items exist
          await this.checkPreviousPurchases();
        }
      } catch (err) {
        console.warn('[IAP] Native billing initialization error (fallback to defaults):', err);
        this.isSupported = false;
      }
    } else {
      // In web/desktop preview mode, simulated billing is available
      this.isSupported = true;
    }

    this.isInitialized = true;
    this.isLoading = false;
    this.notify();
  }

  // Check previous purchases to restore Pro VIP pass if already owned
  private async checkPreviousPurchases(): Promise<void> {
    try {
      const res = await NativePurchases.restorePurchases();
      if (res && res.customerInfo) {
        const allPurchased = res.customerInfo.allPurchasedProductIdentifiers || [];
        if (allPurchased.includes('newromath_pro_noads')) {
          this.setProUser(true);
        }
      }
    } catch (e) {
      console.log('[IAP] No previous purchases detected or restore skipped.');
    }
  }

  // Set and persist Pro user VIP status
  public setProUser(isPro: boolean) {
    this.isProUser = isPro;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('newromath_is_pro_user', isPro ? 'true' : 'false');
      } catch (e) {
        console.warn('[IAP] Failed to write Pro status:', e);
      }
    }
    adMobService.setAdsDisabled(isPro);
    this.notify();
  }

  // Buy a product SKU via Google Play Billing
  public async purchaseProduct(
    sku: string
  ): Promise<{ success: boolean; sku: string; transactionId?: string; error?: string }> {
    const product = IAP_CATALOG.find(p => p.id === sku);
    if (!product) {
      return { success: false, sku, error: 'Product not found in catalog' };
    }

    this.isLoading = true;
    this.activePurchaseSku = sku;
    this.errorMessage = null;
    this.notify();

    if (this.isNative && this.isSupported) {
      try {
        const transaction = await NativePurchases.purchaseProduct({
          productIdentifier: sku,
          productType: PURCHASE_TYPE.INAPP
        });

        console.log('[IAP] Google Play Purchase Success:', transaction);

        // If user purchased PRO VIP Pass, activate lifetime Pro status
        if (sku === 'newromath_pro_noads') {
          this.setProUser(true);
        }

        this.isLoading = false;
        this.activePurchaseSku = null;
        this.notify();

        return {
          success: true,
          sku,
          transactionId: transaction?.transactionId || 'gp_' + Date.now()
        };
      } catch (err: any) {
        console.warn('[IAP] Google Play Purchase Error:', err);
        const errMsg = err?.message || err?.errorMessage || 'Purchase was cancelled or interrupted.';

        this.isLoading = false;
        this.activePurchaseSku = null;
        this.errorMessage = errMsg;
        this.notify();

        return {
          success: false,
          sku,
          error: errMsg
        };
      }
    } else {
      // Development / Web Preview Fallback Simulation
      return new Promise(resolve => {
        setTimeout(() => {
          if (sku === 'newromath_pro_noads') {
            this.setProUser(true);
          }
          this.isLoading = false;
          this.activePurchaseSku = null;
          this.notify();
          resolve({
            success: true,
            sku,
            transactionId: 'simulated_tx_' + Date.now()
          });
        }, 1200);
      });
    }
  }

  // Restore Purchases (Required by Google Play and App Store policies)
  public async restorePurchases(): Promise<{
    success: boolean;
    restoredCount: number;
    message: string;
  }> {
    this.isLoading = true;
    this.errorMessage = null;
    this.notify();

    if (this.isNative) {
      try {
        const res = await NativePurchases.restorePurchases();
        const allPurchased = res?.customerInfo?.allPurchasedProductIdentifiers || [];
        let count = 0;

        if (allPurchased.includes('newromath_pro_noads')) {
          this.setProUser(true);
          count++;
        }

        this.isLoading = false;
        this.notify();

        if (count > 0) {
          return {
            success: true,
            restoredCount: count,
            message: '🎉 PRO VIP Lifetime Pass restored successfully!'
          };
        } else {
          return {
            success: true,
            restoredCount: 0,
            message: 'No previous permanent purchases found for this Google account.'
          };
        }
      } catch (err: any) {
        const errMsg = err?.message || 'Failed to connect to Google Play store.';
        this.isLoading = false;
        this.errorMessage = errMsg;
        this.notify();
        return {
          success: false,
          restoredCount: 0,
          message: `Restore failed: ${errMsg}`
        };
      }
    } else {
      // Web preview simulation
      this.isLoading = false;
      this.notify();
      return {
        success: true,
        restoredCount: 1,
        message: '🎉 (Preview Mode) Restored purchases simulated successfully.'
      };
    }
  }

  // Get current localized price or fallback
  public getPrice(sku: string): string {
    return this.prices[sku] || IAP_CATALOG.find(p => p.id === sku)?.defaultPrice || '$0.99';
  }

  public isPro(): boolean {
    return this.isProUser;
  }
}

export const purchaseService = new PurchaseService();


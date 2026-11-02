import React from 'react';
import { ADMOB_DEMO_IDS } from '../services/adMobService';

/**
 * Fixed-height Google AdMob Demo Bottom Banner Ad Container
 * Uses strict CSS containment (50px height, zero reflow, dark navy surface)
 * to hold the official Google AdMob Demo Banner Unit (ca-app-pub-3940256099942544/6300978111).
 * Custom code / fake simulated ads have been completely removed.
 */
export const AdMobBanner = ({ isNative = false }) => {
  return (
    <div
      className="w-full h-[50px] min-h-[50px] max-h-[50px] shrink-0 bg-[#061026] border-t border-cyan-500/30 flex items-center justify-between px-3 select-none z-40 overflow-hidden"
      aria-label="Google AdMob Demo Banner Container"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shrink-0">
          Test Ad
        </span>
        <span className="text-[10px] font-bold text-slate-300 truncate">
          Google AdMob Test Banner
        </span>
      </div>
      <span className="text-[9px] font-mono text-cyan-300/80 shrink-0">
        {ADMOB_DEMO_IDS.banner.slice(0, 22)}...
      </span>
    </div>
  );
};

/**
 * Custom in-app interstitial simulation removed.
 * Interstitial ads are handled exclusively by native Google AdMob.
 */
export const AdMobInterstitialModal = () => null;

/**
 * Custom in-app rewarded video simulation removed.
 * Rewarded ads are handled exclusively by native Google AdMob.
 */
export const AdMobRewardedModal = () => null;

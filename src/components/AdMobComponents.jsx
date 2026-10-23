import React, { useEffect, useState } from 'react';
import { ADMOB_DEMO_IDS } from '../services/adMobService';

/**
 * Fixed-height Google AdMob Bottom Banner Ad
 * Uses strict CSS containment (50px height, zero reflow, dark navy surface)
 * so it never causes screen dancing or white flashes on Android devices.
 */
export const AdMobBanner = ({ isNative }) => {
  return (
    <div
      className="w-full h-[50px] min-h-[50px] max-h-[50px] shrink-0 bg-[#061026] border-t border-cyan-500/30 flex items-center justify-between px-3 select-none z-40 overflow-hidden"
      style={{
        contain: 'layout paint size',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shrink-0 shadow-sm">
          Ad
        </span>
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/25 to-blue-600/25 border border-cyan-400/40 flex items-center justify-center text-sm shrink-0">
          🧮
        </div>
        <div className="flex flex-col min-w-0 leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-extrabold text-white truncate">
              NewroMath Brain Boost • Official AdMob Banner
            </span>
          </div>
          <span className="text-[9px] font-mono text-cyan-300/80 truncate">
            {isNative ? `AdMob Unit: ${ADMOB_DEMO_IDS.banner}` : `Google AdMob Smart Banner (${ADMOB_DEMO_IDS.banner})`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm">
          Active
        </span>
      </div>
    </div>
  );
};

/**
 * Unsolicited popup Interstitial Ads remain disabled.
 */
export const AdMobInterstitialModal = () => null;

/**
 * Google AdMob Rewarded Video Ad Modal
 * Solid dark (#07112b) surface with zero translucent white flash and zero layout bounce.
 * Supports Coins, Diamonds, Daily 2X Supply ('both'), and Solve Hints ('hint').
 */
const REWARD_AD_DURATION_SEC = 3;

export const AdMobRewardedModal = ({ isOpen, onClose, onReward, rewardInfo }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(REWARD_AD_DURATION_SEC);
  const [rewardGranted, setRewardGranted] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(REWARD_AD_DURATION_SEC);
      setRewardGranted(false);
      setShowExitWarning(false);

      const timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setRewardGranted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAttemptClose = () => {
    if (rewardGranted) {
      if (onReward) onReward();
      onClose();
    } else {
      setShowExitWarning(true);
    }
  };

  const handleConfirmExit = () => {
    setShowExitWarning(false);
    onClose();
  };

  const handleClaim = () => {
    if (onReward) onReward();
    onClose();
  };

  const progressPercent = Math.min(
    100,
    Math.round(((REWARD_AD_DURATION_SEC - secondsRemaining) / REWARD_AD_DURATION_SEC) * 100)
  );

  const rewardBadgeText =
    rewardInfo?.type === 'both'
      ? `+${rewardInfo.coinAmount || 350} Coins & +${rewardInfo.gemAmount || 15} Gems`
      : rewardInfo?.type === 'gems'
      ? `+${rewardInfo.amount || 10} Diamonds`
      : rewardInfo?.type === 'hint'
      ? 'Reveal 1 Full Target Solution Free'
      : `+${rewardInfo?.amount || 250} Gold Coins`;

  const rewardIcon =
    rewardInfo?.type === 'gems'
      ? '💎'
      : rewardInfo?.type === 'both'
      ? '🎁'
      : rewardInfo?.type === 'hint'
      ? '💡'
      : '🪙';

  return (
    <div
      className="fixed inset-0 z-[110] bg-[#07112b] flex flex-col justify-between p-4 sm:p-6 select-none text-white"
      style={{
        contain: 'layout paint size',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      <div className="flex items-center justify-between pt-[max(8px,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black text-xs uppercase tracking-wider shadow">
            AdMob Reward
          </span>
          <span className="text-xs font-mono font-bold text-slate-300">
            Instant Video Sponsor
          </span>
        </div>

        <button
          onClick={handleAttemptClose}
          aria-label="Close Ad"
          className="w-8 h-8 rounded-full bg-[#132757] hover:bg-[#1c3778] text-white flex items-center justify-center font-bold text-sm border border-cyan-400/40 active:scale-95 transition-colors cursor-pointer shadow-md"
        >
          ✕
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto mt-2 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-cyan-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Sponsor Stream Active
          </span>
          <span className={`font-black ${rewardGranted ? 'text-emerald-400' : 'text-amber-300'}`}>
            {rewardGranted ? 'Reward Unlocked! ✓' : `Reward in ${secondsRemaining}s`}
          </span>
        </div>
        <div className="h-2 w-full bg-[#102048] rounded-full overflow-hidden border border-cyan-500/20">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="my-auto max-w-sm mx-auto w-full flex flex-col items-center text-center space-y-4">
        <div className="relative w-full aspect-video rounded-3xl bg-gradient-to-br from-[#102353] via-[#0b1736] to-[#050c21] border-2 border-cyan-400/50 p-4 flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.65)] overflow-hidden">
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl shadow-lg mb-2 border-2 border-white/50">
            {rewardIcon}
          </div>

          <h4 className="text-base font-black font-display text-white relative z-10">
            {rewardInfo?.title || 'Quantum Supply Partner'}
          </h4>

          <div className="mt-1.5 px-3.5 py-1 rounded-full bg-[#060d24] border border-amber-400/50 text-amber-300 font-mono font-black text-xs relative z-10">
            {rewardBadgeText}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-cyan-200/90 bg-[#081538] px-3 py-0.5 rounded-full border border-cyan-400/30 relative z-10">
            <span>🛡️ Zero-Flicker AdMob Rewarded Stream</span>
          </div>
        </div>

        <div className="w-full space-y-2">
          <button
            disabled={!rewardGranted}
            onClick={handleClaim}
            className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-colors shadow-md ${
              rewardGranted
                ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 text-emerald-950 border border-emerald-300 active:scale-[0.99] cursor-pointer'
                : 'bg-[#112046] text-slate-400 border border-slate-700/70 cursor-not-allowed'
            }`}
          >
            {rewardGranted
              ? '🎉 Collect Your Reward Now!'
              : `Unlocking Reward (${secondsRemaining}s)...`}
          </button>
        </div>
      </div>

      {showExitWarning && (
        <div className="fixed inset-0 z-[120] bg-[#050c20]/95 flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-3xl bg-gradient-to-b from-[#152a5c] to-[#0c1836] border border-cyan-400/60 p-5 text-center shadow-2xl space-y-3">
            <span className="text-3xl">⚠️</span>
            <h5 className="text-base font-black text-white font-display">
              Leave Video Early?
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you close now, you will lose your reward. Only {secondsRemaining} seconds remaining!
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowExitWarning(false)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-emerald-950 font-black text-xs uppercase tracking-wider shadow-md active:scale-95"
              >
                Resume Video
              </button>
              <button
                onClick={handleConfirmExit}
                className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs uppercase"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center pb-[max(8px,env(safe-area-inset-bottom))] text-[10px] text-slate-400 font-mono">
        Official Rewarded Unit: {ADMOB_DEMO_IDS.rewarded}
      </div>
    </div>
  );
};

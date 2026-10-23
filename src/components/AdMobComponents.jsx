import React, { useEffect, useState } from 'react';
import { ADMOB_DEMO_IDS } from '../services/adMobService';

/**
 * All Banner Ads and Interstitial Ads are permanently removed.
 * Only user-initiated Rewarded Video Ads in the Get Coins sections are active.
 */
export const AdMobBanner = () => null;
export const AdMobInterstitialModal = () => null;

/**
 * Google AdMob Rewarded Video Ad Modal (Strictly for Get Coins / Free Rewards sections)
 */
export const AdMobRewardedModal = ({ isOpen, onClose, onReward, rewardInfo }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [rewardGranted, setRewardGranted] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(5);
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

  const progressPercent = Math.min(100, Math.round(((5 - secondsRemaining) / 5) * 100));

  return (
    <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none text-white">
      <div className="flex items-center justify-between pt-[max(8px,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black text-xs uppercase tracking-wider shadow">
            Test Ad
          </span>
          <span className="text-xs font-mono font-bold text-slate-300">
            Google AdMob Rewarded Video
          </span>
        </div>

        <button
          onClick={handleAttemptClose}
          aria-label="Close Ad"
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm border border-white/40 active:scale-90 transition-all cursor-pointer shadow-md"
        >
          ✕
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto mt-2 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-cyan-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Playing Sponsor Video
          </span>
          <span className={`font-black ${rewardGranted ? 'text-emerald-400' : 'text-amber-300'}`}>
            {rewardGranted ? 'Reward Ready! ✓' : `Reward in ${secondsRemaining}s`}
          </span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="my-auto max-w-sm mx-auto w-full flex flex-col items-center text-center space-y-4">
        <div className="relative w-full aspect-video rounded-3xl bg-gradient-to-br from-[#102353] via-[#0b1736] to-[#040817] border-2 border-cyan-400/50 p-4 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(0,229,255,0.35)] overflow-hidden">
          <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(245,158,11,0.6)] mb-2 animate-bounce border-2 border-white/50">
            {rewardInfo?.type === 'gems' ? '💎' : rewardInfo?.type === 'both' ? '🎁' : '🪙'}
          </div>

          <h4 className="text-base font-black font-display text-white relative z-10">
            {rewardInfo?.title || 'Quantum Supply Partner'}
          </h4>

          <div className="mt-1 px-3 py-1 rounded-full bg-black/60 border border-amber-400/50 text-amber-300 font-mono font-black text-xs relative z-10 shadow-inner">
            {rewardInfo?.type === 'both'
              ? `+${rewardInfo.coinAmount || 350} Coins & +${rewardInfo.gemAmount || 15} Gems`
              : rewardInfo?.type === 'gems'
              ? `+${rewardInfo.amount || 10} Diamonds`
              : `+${rewardInfo?.amount || 250} Gold Coins`}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[9px] text-cyan-200/80 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-400/30 relative z-10">
            <span>🛡️ Verified AdMob Video Sponsor</span>
          </div>
        </div>

        <div className="w-full space-y-2">
          <button
            disabled={!rewardGranted}
            onClick={handleClaim}
            className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md ${
              rewardGranted
                ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 hover:brightness-110 text-emerald-950 border border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.6)] active:scale-95 cursor-pointer animate-pulse'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            {rewardGranted ? '🎉 Collect Your Reward!' : `Please Watch Full Ad (${secondsRemaining}s)...`}
          </button>
        </div>
      </div>

      {showExitWarning && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-150">
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

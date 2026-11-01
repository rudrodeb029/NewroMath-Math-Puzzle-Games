import React, { useEffect, useRef, useState } from 'react';
import { adMobService, ADMOB_DEMO_IDS } from '../services/adMobService';

/**
 * Fixed-height Google AdMob Demo Bottom Banner Ad
 * Uses strict CSS containment (50px height, zero reflow, dark navy surface)
 * and official Google AdMob Demo Banner Unit ID (ca-app-pub-3940256099942544/6300978111).
 */
export const AdMobBanner = ({ isNative = false }) => {
  const [adIndex, setAdIndex] = useState(0);

  const demoAds = [
    {
      title: 'Brain Training 3D • Test Ad',
      subtitle: `Google AdMob Demo (${ADMOB_DEMO_IDS.banner})`,
      action: 'INSTALL',
      color: 'from-blue-600 to-indigo-700',
      icon: '🧠',
    },
    {
      title: 'Quantum Math Blitz • Test Ad',
      subtitle: `Google AdMob Demo (${ADMOB_DEMO_IDS.banner})`,
      action: 'PLAY NOW',
      color: 'from-emerald-600 to-teal-700',
      icon: '⚡',
    },
    {
      title: 'Neon Puzzle Rush • Test Ad',
      subtitle: `Google AdMob Demo (${ADMOB_DEMO_IDS.banner})`,
      action: 'GET',
      color: 'from-purple-600 to-pink-700',
      icon: '🎯',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % demoAds.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [demoAds.length]);

  const currentAd = demoAds[adIndex];

  // On Native Android, the native AdMob banner overlays the bottom 50px slot.
  // We keep this 50px container so the layout never shifts and shows fallback attribution while loading.
  if (isNative) {
    return (
      <div
        className="w-full h-[50px] min-h-[50px] max-h-[50px] shrink-0 bg-[#061026] border-t border-cyan-500/30 flex items-center justify-between px-3 select-none z-40 overflow-hidden"
        aria-label="Google AdMob Native Demo Banner Container"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shrink-0">
            Test Ad
          </span>
          <span className="text-[10px] font-bold text-slate-300 truncate">
            Google AdMob Demo Banner
          </span>
        </div>
        <span className="text-[9px] font-mono text-cyan-300/80 shrink-0">
          {ADMOB_DEMO_IDS.banner.slice(0, 22)}...
        </span>
      </div>
    );
  }

  return (
    <div
      className="w-full h-[50px] min-h-[50px] max-h-[50px] shrink-0 bg-[#061026] border-t border-cyan-500/30 flex items-center justify-between px-2.5 sm:px-3 select-none z-40 overflow-hidden"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="flex flex-col items-center justify-center shrink-0">
          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[8px] uppercase tracking-wider leading-tight shadow-sm">
            Test Ad
          </span>
          <span className="text-[7px] text-slate-400 font-mono leading-none mt-0.5">
            AdMob
          </span>
        </div>

        <div
          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentAd.color} border border-white/20 flex items-center justify-center text-sm shrink-0 shadow-sm`}
        >
          {currentAd.icon}
        </div>

        <div className="flex flex-col min-w-0 leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-extrabold text-white truncate">
              {currentAd.title}
            </span>
            <span className="text-[8px] text-emerald-400 font-bold shrink-0">
              ★★★★★
            </span>
          </div>
          <span className="text-[9px] font-mono text-cyan-300/80 truncate">
            {currentAd.subtitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              const toast = document.createElement('div');
              toast.innerText = '✓ Google AdMob Demo Banner Clicked (Test Mode)';
              toast.className =
                'fixed bottom-16 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full z-50 shadow-lg pointer-events-none';
              document.body.appendChild(toast);
              setTimeout(() => toast.remove(), 2200);
            }
          }}
          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm active:scale-95 transition-transform cursor-pointer"
        >
          {currentAd.action}
        </button>
        <div
          className="w-3.5 h-3.5 rounded-sm bg-white/10 flex items-center justify-center text-[8px] text-slate-400"
          title="Google AdChoices"
        >
          ⓘ
        </div>
      </div>
    </div>
  );
};

/**
 * Google AdMob Demo Interstitial Ad Overlay
 * Uses official Google AdMob Demo Interstitial Unit ID (ca-app-pub-3940256099942544/1033173712)
 * and solid dark surface (#07112b) for zero flicker.
 */
const INTERSTITIAL_SKIP_SEC = 3;

export const AdMobInterstitialModal = ({ isOpen, onClose }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(INTERSTITIAL_SKIP_SEC);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(INTERSTITIAL_SKIP_SEC);
      setCanSkip(false);
      const timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanSkip(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    adMobService.dismissWebInterstitial();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-[105] bg-[#07112b] flex flex-col justify-between p-4 sm:p-6 select-none text-white">
      {/* Top Bar: Official AdMob Test Ad Header + Skip/Close Button */}
      <div className="flex items-center justify-between pt-[max(8px,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black text-xs uppercase tracking-wider shadow">
            Test Ad
          </span>
          <span className="text-xs font-mono font-bold text-slate-300">
            Google AdMob Demo Interstitial
          </span>
        </div>

        {canSkip ? (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close Interstitial Ad"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#152c62] hover:bg-[#1e3d85] text-white font-black text-xs uppercase tracking-wide border border-cyan-400/50 active:scale-95 transition-all cursor-pointer shadow-lg"
          >
            <span>Skip Ad</span>
            <span className="text-sm leading-none">✕</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d1c42] border border-cyan-400/30 text-xs font-mono text-amber-300">
            <span>Skip in</span>
            <span className="font-black text-sm text-white">{secondsRemaining}s</span>
          </div>
        )}
      </div>

      {/* Center: Demo AdMob Interstitial Creative Card */}
      <div className="my-auto max-w-sm mx-auto w-full flex flex-col items-center text-center space-y-4">
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#1e40af] via-[#3b82f6] to-[#60a5fa] p-1 shadow-[0_8px_25px_rgba(59,130,246,0.45)] border-2 border-white/40">
          <div className="w-full h-full rounded-[20px] bg-[#0c1a3a] flex flex-col items-center justify-center p-3 relative overflow-hidden">
            <span className="text-4xl">🚀</span>
          </div>
          <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md uppercase">
            Demo
          </span>
        </div>

        <div>
          <h3 className="text-xl font-black font-display tracking-tight text-white">
            Google AdMob Test Interstitial
          </h3>
          <p className="text-xs text-cyan-200 mt-1 max-w-xs mx-auto">
            Nice job! You are viewing an official Google AdMob Demo Interstitial Ad unit.
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-amber-300 font-bold">
            <span>★★★★★</span>
            <span className="text-slate-300 font-normal">Official Demo Creative</span>
          </div>
        </div>

        <div className="w-full rounded-2xl bg-gradient-to-b from-[#142654] to-[#0d1a38] border border-cyan-400/40 p-4 shadow-xl">
          <div className="text-[10px] font-mono text-cyan-300/80 mb-2 uppercase tracking-wider">
            ⚡ AdMob Demo Interstitial Unit
          </div>
          <div className="text-sm font-mono font-black text-amber-300 bg-[#060d24] py-2 px-3 rounded-xl border border-amber-400/30 break-all">
            {ADMOB_DEMO_IDS.interstitial}
          </div>
          <p className="text-[10px] text-slate-300 mt-2">
            Safe Google Test Mode • Enabled for Development & Verification
          </p>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 hover:brightness-110 text-emerald-950 font-black text-xs uppercase tracking-wider shadow-lg border border-emerald-300 active:scale-95 transition-all cursor-pointer"
        >
          Continue to Game →
        </button>
      </div>

      {/* Bottom Ad Attribution Footer */}
      <div className="text-center pb-[max(8px,env(safe-area-inset-bottom))] text-[10px] text-slate-400 font-mono">
        Official Demo Interstitial Unit: {ADMOB_DEMO_IDS.interstitial}
      </div>
    </div>
  );
};

/**
 * Google AdMob Rewarded Video Ad Modal
 * Solid dark (#07112b) surface with zero translucent white flash and zero layout bounce.
 * Supports Coins, Diamonds, Jackpot ('jackpot'), Supply ('both'), and Hints ('hint').
 */
const REWARD_AD_DURATION_SEC = 3;

export const AdMobRewardedModal = ({ isOpen, onClose, onReward, rewardInfo }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(REWARD_AD_DURATION_SEC);
  const [rewardGranted, setRewardGranted] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const claimedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      claimedRef.current = false;
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

  const grantAndCloseOnce = () => {
    if (claimedRef.current) return;
    claimedRef.current = true;
    if (onReward) {
      onReward(rewardInfo);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleAttemptClose = () => {
    if (rewardGranted) {
      grantAndCloseOnce();
    } else {
      setShowExitWarning(true);
    }
  };

  const handleConfirmExit = () => {
    setShowExitWarning(false);
    if (onClose) onClose();
  };

  const handleClaim = () => {
    if (!rewardGranted) return;
    grantAndCloseOnce();
  };

  const progressPercent = Math.min(
    100,
    Math.round(((REWARD_AD_DURATION_SEC - secondsRemaining) / REWARD_AD_DURATION_SEC) * 100)
  );

  const isDualReward = rewardInfo?.type === 'both' || rewardInfo?.type === 'jackpot';

  const rewardBadgeText = isDualReward
    ? `+${rewardInfo?.coinAmount || (rewardInfo?.type === 'jackpot' ? 600 : 350)} Coins & +${rewardInfo?.gemAmount || 15} Diamonds`
    : rewardInfo?.type === 'gems'
    ? `+${rewardInfo?.gemAmount || rewardInfo?.amount || 10} Diamonds`
    : rewardInfo?.type === 'hint'
    ? 'Reveal 1 Full Target Solution Free'
    : `+${rewardInfo?.coinAmount || rewardInfo?.amount || 250} Gold Coins`;

  const rewardIcon =
    rewardInfo?.type === 'gems'
      ? '💎'
      : isDualReward
      ? '🎁'
      : rewardInfo?.type === 'hint'
      ? '💡'
      : '🪙';

  return (
    <div
      className="fixed inset-0 z-[110] bg-[#07112b] flex flex-col justify-between p-4 sm:p-6 select-none text-white"
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

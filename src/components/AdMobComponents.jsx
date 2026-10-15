import React, { useEffect, useState } from 'react';
import { adMobService, ADMOB_DEMO_IDS } from '../services/adMobService';

/**
 * Google AdMob Demo Banner Component
 * Adheres strictly to Google AdMob Banner Ad Policies:
 * - Clear "Ad" / "Test Ad" attribution badge
 * - Dedicated 50px height space (never obscures interactive puzzle trays or buttons)
 * - Safe area inset bottom support
 * - AdChoices icon and official demo ad creative
 */
export const AdMobBanner = ({ isNative = false }) => {
  const [adIndex, setAdIndex] = useState(0);

  const demoAds = [
    {
      title: 'Brain Training 3D',
      subtitle: 'Boost memory & logic skills daily',
      action: 'INSTALL',
      badge: 'Test Ad',
      color: 'from-blue-600 to-indigo-700',
      icon: '🧠'
    },
    {
      title: 'Quantum Math Blitz',
      subtitle: 'Join 5M+ speed math champions',
      action: 'PLAY NOW',
      badge: 'Test Ad',
      color: 'from-emerald-600 to-teal-700',
      icon: '⚡'
    },
    {
      title: 'Neon Puzzle Rush',
      subtitle: 'Official Google AdMob Demo Unit',
      action: 'GET',
      badge: 'Test Ad',
      color: 'from-purple-600 to-pink-700',
      icon: '🎯'
    }
  ];

  // Rotate demo ad creative smoothly every 20 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAdIndex(prev => (prev + 1) % demoAds.length);
    }, 20000);
    return () => clearInterval(timer);
  }, [demoAds.length]);

  const currentAd = demoAds[adIndex];

  // If running in Native Capacitor, native banner is rendered on top of the webview by AdMob plugin.
  // We still reserve the 50px bottom spacer with native attribution indicator.
  if (isNative) {
    return (
      <div 
        className="w-full h-[50px] shrink-0 bg-[#07132e] border-t border-cyan-500/20 flex items-center justify-between px-3 text-[10px] text-cyan-300/70 select-none z-30"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Google AdMob Native Banner Container"
      >
        <div className="flex items-center gap-1.5 font-mono">
          <span className="bg-amber-400 text-slate-950 px-1 py-0.5 rounded font-black text-[9px] uppercase">
            Ad
          </span>
          <span className="font-semibold text-slate-300">Google AdMob Test Unit</span>
        </div>
        <span className="text-[9px] text-slate-400 font-mono">
          {ADMOB_DEMO_IDS.banner.slice(0, 20)}...
        </span>
      </div>
    );
  }

  // Web / Browser Demo Banner
  return (
    <div 
      className="w-full shrink-0 bg-[#061026] border-t border-cyan-500/30 shadow-[0_-4px_16px_rgba(0,0,0,0.5)] relative z-30 select-none overflow-hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="h-[50px] max-w-[430px] mx-auto flex items-center justify-between px-2.5 sm:px-3 gap-2">
        {/* Left: Ad Attribution Badge & Demo Icon */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Ad Label Pill */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black text-[8px] uppercase tracking-wider leading-tight shadow-xs">
              Ad
            </span>
            <span className="text-[7px] text-slate-400 font-mono leading-none mt-0.5">
              AdMob
            </span>
          </div>

          {/* Ad Creative Icon */}
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentAd.color} flex items-center justify-center text-base shadow-sm shrink-0 border border-white/20`}>
            {currentAd.icon}
          </div>

          {/* Ad Text Headline & Subtitle */}
          <div className="flex flex-col min-w-0 justify-center leading-tight">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-black text-white truncate font-display">
                {currentAd.title}
              </span>
              <span className="text-[8px] text-emerald-400 font-bold shrink-0">
                ★★★★★
              </span>
            </div>
            <span className="text-[9.5px] text-slate-300 truncate">
              {currentAd.subtitle}
            </span>
          </div>
        </div>

        {/* Right: Ad Action Call-to-Action & AdChoices Icon */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                const toast = document.createElement('div');
                toast.innerText = '✓ Google AdMob Test Banner Clicked (Demo Mode)';
                toast.className = 'fixed bottom-16 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full z-50 shadow-lg';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2500);
              }
            }}
            className="px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-[10px] tracking-wide uppercase shadow-[0_2px_8px_rgba(0,229,255,0.4)] active:scale-95 transition-all cursor-pointer border border-cyan-300/40"
            title="AdMob Demo Action"
          >
            {currentAd.action}
          </button>

          {/* Google AdChoices Minimal Indicator */}
          <div className="w-3.5 h-3.5 rounded-sm bg-white/10 flex items-center justify-center text-[8px] text-slate-400" title="Google AdChoices">
            ⓘ
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Google AdMob Demo Interstitial Ad Overlay
 * Adheres strictly to Google AdMob Interstitial Policies:
 * - Only triggered at natural break points (e.g. Level cleared, retry, stage continue)
 * - Minimum 5-second countdown timer before player can dismiss
 * - Clear Skip/Close button
 * - Clear Google AdMob Test Ad designation
 */
export const AdMobInterstitialModal = ({ isOpen, onClose }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(5);
      setCanSkip(false);
      const timer = setInterval(() => {
        setSecondsRemaining(prev => {
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
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none text-white">
      {/* Top Bar: Official AdMob Test Ad Header + Skip/Close Button */}
      <div className="flex items-center justify-between pt-[max(8px,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black text-xs uppercase tracking-wider shadow">
            Test Ad
          </span>
          <span className="text-xs font-mono font-bold text-slate-300">
            Google AdMob Interstitial
          </span>
        </div>

        {/* Skip / Close Button */}
        {canSkip ? (
          <button
            onClick={handleClose}
            aria-label="Close Interstitial Ad"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-black text-xs uppercase tracking-wide border border-white/40 active:scale-95 transition-all cursor-pointer shadow-lg"
          >
            <span>Skip Ad</span>
            <span className="text-base leading-none">✕</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 border border-white/20 text-xs font-mono text-amber-300">
            <span>Skip in</span>
            <span className="font-black text-sm text-white">{secondsRemaining}s</span>
          </div>
        )}
      </div>

      {/* Center: High-Fidelity AdMob Creative Simulation */}
      <div className="my-auto max-w-sm mx-auto w-full flex flex-col items-center text-center space-y-4">
        {/* Animated App Icon Pod */}
        <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#1e40af] via-[#3b82f6] to-[#60a5fa] p-1 shadow-[0_0_35px_rgba(59,130,246,0.6)] border-2 border-white/40">
          <div className="w-full h-full rounded-[20px] bg-[#0c1a3a] flex flex-col items-center justify-center p-3 relative overflow-hidden">
            <span className="text-5xl animate-bounce">🚀</span>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent pointer-events-none" />
          </div>
          <span className="absolute -top-2 -right-2 bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-md">
            NEW
          </span>
        </div>

        {/* Title & Rating */}
        <div>
          <h3 className="text-2xl font-black font-display tracking-tight text-white">
            NeuroMath Master Pro
          </h3>
          <p className="text-xs text-cyan-200 mt-1 max-w-xs mx-auto">
            Train cognitive speed, unlock daily IQ puzzles & master mental calculation.
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-amber-300 font-bold">
            <span>★★★★★</span>
            <span className="text-slate-300 font-normal">4.9 (120K Reviews)</span>
          </div>
        </div>

        {/* Interactive Playable Sample Preview Card */}
        <div className="w-full rounded-2xl bg-gradient-to-b from-[#142654] to-[#0d1a38] border border-cyan-400/40 p-4 shadow-xl">
          <div className="text-[10px] font-mono text-cyan-300/80 mb-2 uppercase tracking-wider">
            ⚡ Quick Brain Challenge
          </div>
          <div className="text-xl font-mono font-black text-amber-300 bg-black/40 py-2 rounded-xl border border-amber-400/30">
            7 × 8 + 4 = 60 ✓
          </div>
          <p className="text-[10px] text-slate-300 mt-2">
            Google AdMob Interstitial Demo • Safe Testing Unit
          </p>
        </div>

        {/* Install CTA Button */}
        <button
          onClick={handleClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 hover:brightness-110 text-emerald-950 font-black text-sm uppercase tracking-wider shadow-[0_6px_25px_rgba(16,185,129,0.5)] border border-emerald-300 active:scale-95 transition-all cursor-pointer"
        >
          Install Now (Free)
        </button>
      </div>

      {/* Bottom Ad Attribution Footer */}
      <div className="text-center pb-[max(8px,env(safe-area-inset-bottom))] text-[10px] text-slate-400 font-mono">
        Official Ad Unit: {ADMOB_DEMO_IDS.interstitial}
      </div>
    </div>
  );
};

/**
 * Google AdMob Demo Rewarded Video Ad Modal
 * Adheres strictly to Google AdMob Rewarded Ad Policies:
 * - Clear "Test Ad • Google AdMob Rewarded Video" attribution
 * - Countdown timer before reward is granted (5 seconds)
 * - Confirmation alert if user attempts to leave before reward is earned
 * - Clear reward grant upon full video watch
 * - Official Google Test Unit ID: ADMOB_DEMO_IDS.rewarded
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
        setSecondsRemaining(prev => {
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
      {/* Top Bar: Official AdMob Test Ad Header + Reward Progress & Close Button */}
      <div className="flex items-center justify-between pt-[max(8px,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black text-xs uppercase tracking-wider shadow">
            Test Ad
          </span>
          <span className="text-xs font-mono font-bold text-slate-300">
            Google AdMob Rewarded Video
          </span>
        </div>

        {/* Close Button / Warning Trigger */}
        <button
          onClick={handleAttemptClose}
          aria-label="Close Ad"
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm border border-white/40 active:scale-90 transition-all cursor-pointer shadow-md"
        >
          ✕
        </button>
      </div>

      {/* Progress Bar Header */}
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

      {/* Center: Video Simulation Creative Card */}
      <div className="my-auto max-w-sm mx-auto w-full flex flex-col items-center text-center space-y-4">
        {/* Animated Video Canvas Pod */}
        <div className="relative w-full aspect-video rounded-3xl bg-gradient-to-br from-[#102353] via-[#0b1736] to-[#040817] border-2 border-cyan-400/50 p-4 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(0,229,255,0.35)] overflow-hidden">
          {/* Pulsing Audio/Video Waves in Background */}
          <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

          {/* Reward Icon & Spotlight */}
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(245,158,11,0.6)] mb-2 animate-bounce border-2 border-white/50">
            {rewardInfo?.type === 'gems' ? '💎' : rewardInfo?.type === 'time' ? '⏱️' : rewardInfo?.type === 'both' ? '🎁' : '🪙'}
          </div>

          <h4 className="text-base font-black font-display text-white relative z-10">
            {rewardInfo?.title || 'Quantum Supply Partner'}
          </h4>

          {/* Reward Value Badge */}
          <div className="mt-1 px-3 py-1 rounded-full bg-black/60 border border-amber-400/50 text-amber-300 font-mono font-black text-xs relative z-10 shadow-inner">
            {rewardInfo?.type === 'both'
              ? `+${rewardInfo.coinAmount || 350} Coins & +${rewardInfo.gemAmount || 15} Gems`
              : rewardInfo?.type === 'time'
              ? `+${rewardInfo.amount || 30}s Extra Time`
              : rewardInfo?.type === 'gems'
              ? `+${rewardInfo.amount || 10} Diamonds`
              : `+${rewardInfo?.amount || 250} Gold Coins`}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[9px] text-cyan-200/80 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-400/30 relative z-10">
            <span>🛡️ Verified AdMob Video Sponsor</span>
          </div>
        </div>

        {/* Reward Grant Action Button */}
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

      {/* Exit Warning Dialog (AdMob standard: prevents accidental reward loss) */}
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

      {/* Bottom Ad Attribution Footer */}
      <div className="text-center pb-[max(8px,env(safe-area-inset-bottom))] text-[10px] text-slate-400 font-mono">
        Official Rewarded Unit: {ADMOB_DEMO_IDS.rewarded}
      </div>
    </div>
  );
};



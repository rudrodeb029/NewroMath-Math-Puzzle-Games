import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Sparkles, X, CheckCircle2 } from 'lucide-react';

export const AdModal: React.FC = () => {
  const activeModal = useGameStore(s => s.activeModal);
  const adInfo = useGameStore(s => s.adInfo);
  const setActiveModal = useGameStore(s => s.setActiveModal);
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (activeModal === 'ad') {
      setSecondsLeft(3);
      setCanClose(false);
      const interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeModal]);

  if (activeModal !== 'ad' || !adInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn text-white">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center space-y-6 relative overflow-hidden shadow-2xl">
        {/* Close Button once timer reaches 0 */}
        {canClose && (
          <button
            onClick={() => setActiveModal('none')}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Ad Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{adInfo.type === 'rewarded' ? 'AdMob Rewarded Video' : 'AdMob Interstitial Ad'}</span>
        </div>

        {/* Ad Preview Content */}
        <div className="h-44 rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4 border border-indigo-700/50 shadow-inner">
          <div className="text-4xl mb-2">🎮</div>
          <h3 className="font-extrabold text-lg text-white font-game">NewroMath Brain Booster</h3>
          <p className="text-xs text-indigo-200 mt-1">Unlock peak math performance</p>
        </div>

        {/* Status / Countdown */}
        <div className="text-sm font-semibold text-slate-300">
          {!canClose ? (
            <span>Reward will be granted in <span className="text-amber-400 font-bold font-mono text-base">{secondsLeft}s</span>...</span>
          ) : (
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Reward Granted! +1 Extra Life</span>
            </div>
          )}
        </div>

        {canClose && (
          <button
            onClick={() => setActiveModal('none')}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all active:scale-95 shadow-lg"
          >
            Continue Playing
          </button>
        )}
      </div>
    </div>
  );
};


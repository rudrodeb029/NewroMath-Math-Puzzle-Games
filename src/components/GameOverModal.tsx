import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { HeartCrack, Video, RotateCcw, PlusCircle } from 'lucide-react';

export const GameOverModal: React.FC = () => {
  const activeModal = useGameStore(s => s.activeModal);
  const revive = useGameStore(s => s.reviveWithReward);
  const restart = useGameStore(s => s.restartCurrentGame);
  const nextGame = useGameStore(s => s.nextGame);
  const setActiveModal = useGameStore(s => s.setActiveModal);

  if (activeModal !== 'gameover') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-game-darkCard rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-5">
        {/* Icon & Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-3.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-500">
            <HeartCrack className="w-10 h-10 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-game">
            Out of Lives!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You made 3 mistakes in this puzzle. Don't worry, you can revive and keep your progress!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Rewarded Ad Revive */}
          <button
            onClick={revive}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
          >
            <Video className="w-5 h-5" />
            <span>Watch Video to Revive (+1 Life)</span>
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              restart();
              setActiveModal('none');
            }}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart This Level</span>
          </button>

          {/* New Game */}
          <button
            onClick={() => {
              nextGame();
              setActiveModal('none');
            }}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium transition-colors"
          >
            Start a Different Level
          </button>
        </div>
      </div>
    </div>
  );
};


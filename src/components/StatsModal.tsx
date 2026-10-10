import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Crown, Star, Flag, Clock, ArrowRight, X } from 'lucide-react';

export const StatsModal: React.FC = () => {
  const activeModal = useGameStore(s => s.activeModal);
  const stats = useGameStore(s => s.stats);
  const setActiveModal = useGameStore(s => s.setActiveModal);

  if (activeModal !== 'stats') return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const avgTimeSecs = stats.gamesWon > 0 ? Math.floor(stats.totalTime / stats.gamesWon) : 165;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-game-darkCard rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        {/* Title */}
        <div className="flex items-center justify-between pb-1">
          <div>
            <h2 className="text-2xl font-extrabold text-[#2c3e50] dark:text-slate-100 font-game tracking-tight">
              Grow with Statistics
            </h2>
            <p className="text-xs text-slate-400 font-medium">Your Math Puzzle Mastery</p>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats List (Matching images 4.PNG & 4545.PNG) */}
        <div className="space-y-3">
          {/* Games Won */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-sky-950 text-blue-600 dark:text-sky-400">
                <Crown className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Games Won
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                ▲25
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {stats.gamesWon}
              </span>
            </div>
          </div>

          {/* Best Score */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Best Score
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                ▲2
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {stats.bestScore}
              </span>
            </div>
          </div>

          {/* Wins with No Mistakes */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500">
                <Flag className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Wins with No Mistakes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                ▲17
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {stats.winsWithNoMistakes}
              </span>
            </div>
          </div>

          {/* Best Time */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-500">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Best Time
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                ▲00:07
              </span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {formatTime(stats.bestTime || 165)}
              </span>
            </div>
          </div>

          {/* Win Streak */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-500">
                <ArrowRight className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Win Streak
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                ▲2
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {stats.winStreak}
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setActiveModal('none')}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-center active:scale-95 transition-all shadow-md"
        >
          Got It
        </button>
      </div>
    </div>
  );
};


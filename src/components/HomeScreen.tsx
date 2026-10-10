import React from 'react';
import { ArrowRight, Flame, Gamepad2, Trophy } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { GameMode } from '../types/game';
import { Header } from './Header';

interface HomeScreenProps {
  onContinue: () => void;
  onStartMode: (mode: GameMode) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onContinue, onStartMode }) => {
  const mode = useGameStore(s => s.mode);
  const difficulty = useGameStore(s => s.difficulty);
  const stage = useGameStore(s => s.stage);
  const stats = useGameStore(s => s.stats);
  const winRate = stats.totalGames > 0 ? Math.round((stats.gamesWon / stats.totalGames) * 100) : 0;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-2 pb-6">
      <Header onSelectMode={onStartMode} />
      <main className="flex-1 px-2 pt-5">
        <section className="mb-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-game-darkCard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Your progress</p>
              <p className="mt-1 text-sm font-bold capitalize">{difficulty} player</p>
            </div>
            <span className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-extrabold text-blue-600 dark:bg-slate-800">
              {stats.gamesWon} wins
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Win rate"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={winRate}
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
          >
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${winRate}%` }} />
          </div>
          <p className="mt-1 text-right text-[10px] text-slate-400">{winRate}% win rate · Best score: {stats.bestScore}</p>
        </section>

        <section aria-label="Player statistics" className="mb-3 grid grid-cols-3 gap-2">
          <StatCard icon={<Flame className="h-4 w-4 text-orange-500" />} label="Win streak" value={`${stats.winStreak} days`} />
          <StatCard icon={<Trophy className="h-4 w-4 text-amber-500" />} label="Games won" value={`${stats.gamesWon}`} />
          <StatCard icon={<Gamepad2 className="h-4 w-4 text-blue-500" />} label="Played" value={`${stats.totalGames}`} />
        </section>

        <button
          onClick={onContinue}
          className="mb-3 flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 dark:border-slate-800 dark:bg-game-darkCard"
        >
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Continue puzzle</span>
            <span className="mt-1 block text-sm font-bold">
              {mode === 'sudoku' ? 'Classic Sudoku' : `Crossmath · Stage ${stage}`}
            </span>
            <span className="text-xs capitalize text-slate-400">{difficulty} difficulty</span>
          </span>
          <span className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white">
            Continue <ArrowRight className="h-4 w-4" />
          </span>
        </button>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Choose a puzzle</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ModeCard title="Sudoku" description="Classic number puzzle" onClick={() => onStartMode('sudoku')} />
            <ModeCard title="Crossmath" description="Solve with equations" onClick={() => onStartMode('crossmath')} />
          </div>
        </section>
      </main>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white px-2 py-3 text-center shadow-sm dark:border-slate-800 dark:bg-game-darkCard">
    {icon}
    <span className="mt-1 text-[10px] text-slate-400">{label}</span>
    <span className="text-xs font-bold">{value}</span>
  </div>
);

const ModeCard: React.FC<{ title: string; description: string; onClick: () => void }> = ({ title, description, onClick }) => (
  <button
    onClick={onClick}
    className="rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm transition hover:border-blue-200 dark:border-slate-800 dark:bg-game-darkCard"
  >
    <span className="block text-sm font-bold">{title}</span>
    <span className="mt-1 block text-[10px] text-slate-400">{description}</span>
  </button>
);

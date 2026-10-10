import React from 'react';
import { BarChart2, Calculator, Grid2X2, Home, UserRound } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { GameMode } from '../types/game';

interface HeaderProps {
  onSelectMode: (mode: GameMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSelectMode }) => {
  const setActiveModal = useGameStore(s => s.setActiveModal);

  return (
    <header className="w-full max-w-md mx-auto px-4 pt-4">
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-xl font-extrabold tracking-tight text-blue-600">Math Puzzle</h1>
        <button
          onClick={() => setActiveModal('settings')}
          aria-label="Open settings"
          className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <UserRound className="h-5 w-5" />
        </button>
      </div>
      <nav aria-label="Main navigation" className="grid grid-cols-4 border-y border-slate-200 dark:border-slate-800">
        <button
          aria-current="page"
          className="flex flex-col items-center gap-1 border-b-2 border-blue-600 py-2 text-blue-600"
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button
          onClick={() => onSelectMode('sudoku')}
          className="flex flex-col items-center gap-1 border-b-2 border-transparent py-2 text-slate-400 hover:text-blue-600"
        >
          <Grid2X2 className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Sudoku</span>
        </button>
        <button
          onClick={() => onSelectMode('crossmath')}
          className="flex flex-col items-center gap-1 border-b-2 border-transparent py-2 text-slate-400 hover:text-blue-600"
        >
          <Calculator className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Crossmath</span>
        </button>
        <button
          onClick={() => setActiveModal('stats')}
          className="flex flex-col items-center gap-1 border-b-2 border-transparent py-2 text-slate-400 hover:text-blue-600"
        >
          <BarChart2 className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Stats</span>
        </button>
      </nav>
    </header>
  );
};

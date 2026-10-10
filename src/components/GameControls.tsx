import React from 'react';
import { ArrowLeft, Pause, Play, RotateCcw, Settings } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

interface GameControlsProps {
  onHome: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ onHome }) => {
  const mode = useGameStore(s => s.mode);
  const difficulty = useGameStore(s => s.difficulty);
  const stage = useGameStore(s => s.stage);
  const elapsedTime = useGameStore(s => s.elapsedTime);
  const isPaused = useGameStore(s => s.isPaused);
  const togglePause = useGameStore(s => s.togglePause);
  const restart = useGameStore(s => s.restartCurrentGame);
  const setActiveModal = useGameStore(s => s.setActiveModal);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return (
    <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-game-darkCard">
      <div className="flex items-center justify-between">
        <button onClick={onHome} aria-label="Return to home" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h1 className="text-base font-extrabold">{mode === 'sudoku' ? 'Classic Sudoku' : 'Crossmath'}</h1>
          <p className="text-[10px] capitalize text-slate-400">
            {mode === 'sudoku' ? difficulty : `Stage ${stage} · ${difficulty}`} · {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
        </div>
        <div className="flex">
          <button onClick={restart} aria-label="Restart puzzle" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <RotateCcw className="h-5 w-5" />
          </button>
          <button onClick={togglePause} aria-label={isPaused ? 'Resume puzzle' : 'Pause puzzle'} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </button>
          <button onClick={() => setActiveModal('settings')} aria-label="Open settings" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

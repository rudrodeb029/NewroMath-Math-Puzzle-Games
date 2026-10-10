import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { CrossmathCell } from './CrossmathCell';

export const CrossmathGrid: React.FC = () => {
  const puzzle = useGameStore(s => s.currentCrossmath);

  return (
    <div className="w-full max-w-[420px] mx-auto px-2">
      <div
        className="grid gap-1 sm:gap-1.5 p-2 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${puzzle.gridCols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${puzzle.gridRows}, minmax(0, 1fr))`,
        }}
      >
        {puzzle.cells.map(cell => (
          <CrossmathCell key={cell.id} cell={cell} />
        ))}
      </div>
    </div>
  );
};


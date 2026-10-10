import React from 'react';
import { SudokuCell } from './SudokuCell';

export const SudokuGrid: React.FC = () => {
  return (
    <div className="w-full max-w-[420px] mx-auto px-2">
      <div className="grid grid-cols-9 grid-rows-9 border-2 border-slate-900 dark:border-slate-300 rounded-lg overflow-hidden shadow-md bg-white dark:bg-game-darkCard">
        {Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 9 }).map((_, c) => (
            <SudokuCell key={`${r}-${c}`} row={r} col={c} />
          ))
        )}
      </div>
    </div>
  );
};


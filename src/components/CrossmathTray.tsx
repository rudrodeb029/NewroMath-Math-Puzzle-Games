import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { ArrowUpDown, RotateCcw, Lightbulb } from 'lucide-react';

export const CrossmathTray: React.FC = () => {
  const pool = useGameStore(s => s.crossmathPool);
  const hintsRemaining = useGameStore(s => s.crossmathHintsRemaining);
  const selectedCellId = useGameStore(s => s.selectedCrossmathCellId);
  const placeNumber = useGameStore(s => s.placeCrossmathNumber);
  const sortPool = useGameStore(s => s.sortCrossmathPool);
  const undo = useGameStore(s => s.undo);
  const useHint = useGameStore(s => s.useCrossmathHint);

  return (
    <div className="w-full max-w-[420px] mx-auto px-2 mt-4 space-y-4">
      {/* Number Tile Pool Cards */}
      <div className="p-3 bg-white dark:bg-game-darkCard rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-7 sm:grid-cols-8 gap-1.5 sm:gap-2 max-h-36 overflow-y-auto p-1">
          {pool.map(item => (
            <button
              key={item.id}
              disabled={item.isUsed}
              draggable={!item.isUsed}
              onDragStart={(e) => {
                if (!item.isUsed) {
                  e.dataTransfer.setData('text/plain', JSON.stringify({ poolItemId: item.id, value: item.value }));
                }
              }}
              onClick={() => {
                if (selectedCellId) {
                  placeNumber(item.id);
                }
              }}
              className={`flex items-center justify-center py-2 sm:py-2.5 rounded-lg font-bold text-base sm:text-lg border transition-all active:scale-95 select-none cursor-grab active:cursor-grabbing ${
                item.isUsed
                  ? 'opacity-25 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed'
                  : selectedCellId
                  ? 'bg-[#e8f5e9] dark:bg-[#1b3323] border-[#a5d6a7] dark:border-[#2e7d32] text-emerald-700 dark:text-emerald-300 hover:bg-[#c8e6c9] shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {item.value}
            </button>
          ))}
        </div>
      </div>

      {/* Control Actions Row (Sort, Undo, Hint x3) */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          {/* Sort Button */}
          <button
            onClick={sortPool}
            title="Sort Numbers"
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>

          {/* Undo Button */}
          <button
            onClick={undo}
            title="Undo"
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Hint Button with x3 badge */}
        <button
          onClick={useHint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm active:scale-95 transition-all shadow-md"
        >
          <Lightbulb className="w-4 h-4" />
          <span>Hint</span>
          <span className="text-xs bg-blue-800 px-1.5 py-0.5 rounded-full">
            ×{hintsRemaining}
          </span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { RotateCcw, Eraser, Pencil, Lightbulb } from 'lucide-react';

export const Keypad: React.FC = () => {
  const isNotesMode = useGameStore(s => s.isNotesMode);
  const hintsRemaining = useGameStore(s => s.sudokuHintsRemaining);
  const inputNumber = useGameStore(s => s.inputSudokuNumber);
  const toggleNotesMode = useGameStore(s => s.toggleNotesMode);
  const eraseCell = useGameStore(s => s.eraseSudokuCell);
  const useHint = useGameStore(s => s.useSudokuHint);
  const undo = useGameStore(s => s.undo);

  return (
    <div className="w-full max-w-[420px] mx-auto px-2 mt-4 space-y-4">
      {/* Action Toolbar */}
      <div className="flex items-center justify-around py-1">
        {/* Undo */}
        <button
          onClick={undo}
          className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 active:scale-95 transition-transform"
        >
          <div className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <RotateCcw className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="text-xs font-medium">Undo</span>
        </button>

        {/* Erase */}
        <button
          onClick={eraseCell}
          className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 active:scale-95 transition-transform"
        >
          <div className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <Eraser className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="text-xs font-medium">Erase</span>
        </button>

        {/* Notes Toggle with ON/OFF badge */}
        <button
          onClick={toggleNotesMode}
          className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 active:scale-95 transition-transform relative"
        >
          <div className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <Pencil className="w-6 h-6 stroke-[2]" />
            <span
              className={`absolute -top-1 -right-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full transition-colors ${
                isNotesMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-400 text-white dark:bg-slate-600'
              }`}
            >
              {isNotesMode ? 'ON' : 'OFF'}
            </span>
          </div>
          <span className="text-xs font-medium">Notes</span>
        </button>

        {/* Hint with badge */}
        <button
          onClick={useHint}
          className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 active:scale-95 transition-transform relative"
        >
          <div className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <Lightbulb className="w-6 h-6 stroke-[2]" />
            <span className="absolute -top-1 -right-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
              {hintsRemaining}
            </span>
          </div>
          <span className="text-xs font-medium">Hint</span>
        </button>
      </div>

      {/* Numeric Keypad Row (1 to 9) - Draggable and Clickable */}
      <div className="grid grid-cols-9 gap-1 sm:gap-2 pt-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', String(num));
            }}
            onClick={() => inputNumber(num)}
            className="flex items-center justify-center py-2 sm:py-3 rounded-lg text-2xl sm:text-3xl font-semibold text-[#1976d2] dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-slate-800 active:bg-blue-100 dark:active:bg-slate-700 active:scale-90 transition-all select-none shadow-sm bg-white dark:bg-game-darkCard border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

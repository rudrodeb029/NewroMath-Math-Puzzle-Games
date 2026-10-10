import React from 'react';
import { useGameStore } from '../store/useGameStore';

interface SudokuCellProps {
  row: number;
  col: number;
}

export const SudokuCell: React.FC<SudokuCellProps> = React.memo(({ row, col }) => {
  const value = useGameStore(s => s.sudokuPlayerBoard[row][col]);
  const isGiven = useGameStore(s => s.currentSudoku.cluesGrid[row][col] !== null);
  const notes = useGameStore(s => s.sudokuNotesBoard[row][col]);
  const isSelected = useGameStore(s => s.selectedCell?.row === row && s.selectedCell?.col === col);
  
  // Highlight states
  const selectedCell = useGameStore(s => s.selectedCell);
  const isRowSelected = selectedCell?.row === row;
  const isColSelected = selectedCell?.col === col;
  const isBoxSelected = selectedCell !== null &&
    Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
    Math.floor(selectedCell.col / 3) === Math.floor(col / 3);

  // Same-number highlight
  const selectedNumber = useGameStore(s => {
    if (!s.selectedCell) return null;
    return s.sudokuPlayerBoard[s.selectedCell.row][s.selectedCell.col];
  });
  const isSameNumber = selectedNumber !== null && value === selectedNumber;

  const selectCell = useGameStore(s => s.selectSudokuCell);
  const inputNumber = useGameStore(s => s.inputSudokuNumber);
  const largeFont = useGameStore(s => s.settings.largeFont);

  // Border calculations for 3x3 blocks
  const borderRight = (col === 2 || col === 5) ? 'border-r-2 border-r-slate-800 dark:border-r-slate-300' : 'border-r border-r-slate-200 dark:border-r-slate-700';
  const borderBottom = (row === 2 || row === 5) ? 'border-b-2 border-b-slate-800 dark:border-b-slate-300' : 'border-b border-b-slate-200 dark:border-b-slate-700';

  // Background styling
  let bgClass = 'bg-white dark:bg-game-darkCard';
  if (isSelected) {
    bgClass = 'bg-[#b3e5fc] dark:bg-sky-900 ring-2 ring-blue-500 z-10';
  } else if (isSameNumber) {
    bgClass = 'bg-[#c8e6c9] dark:bg-emerald-950';
  } else if (isRowSelected || isColSelected || isBoxSelected) {
    bgClass = 'bg-[#e1f5fe] dark:bg-slate-800/80';
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (!isGiven) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isGiven) {
      e.preventDefault();
      const numStr = e.dataTransfer.getData('text/plain');
      const num = parseInt(numStr, 10);
      if (num && num >= 1 && num <= 9) {
        selectCell(row, col);
        inputNumber(num);
      }
    }
  };

  return (
    <div
      data-drop-cell={`sudoku-${row}-${col}`}
      onClick={() => selectCell(row, col)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex items-center justify-center cursor-pointer transition-colors duration-75 select-none ${bgClass} ${borderRight} ${borderBottom}`}
      style={{ aspectRatio: '1 / 1' }}
    >
      {value !== null ? (
        <span
          className={`font-semibold ${
            isGiven ? 'text-slate-900 dark:text-slate-100' : 'text-[#1976d2] dark:text-sky-400 font-bold'
          } ${largeFont ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}
        >
          {value}
        </span>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 pointer-events-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <div key={n} className="flex items-center justify-center text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none">
              {notes.includes(n) ? n : ''}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}, (prev, next) => prev.row === next.row && prev.col === next.col);

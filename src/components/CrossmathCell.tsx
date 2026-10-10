import React from 'react';
import { CrossmathCell as ICrossmathCell } from '../types/game';
import { useGameStore } from '../store/useGameStore';
import { Star } from 'lucide-react';

interface Props {
  cell: ICrossmathCell;
}

export const CrossmathCell: React.FC<Props> = React.memo(({ cell }) => {
  const selectedCellId = useGameStore(s => s.selectedCrossmathCellId);
  const playerValue = useGameStore(s => s.crossmathPlayerBoard[cell.id]);
  const divisionSign = useGameStore(s => s.settings.divisionSign);
  const selectCell = useGameStore(s => s.selectCrossmathCell);
  const placeNumber = useGameStore(s => s.placeCrossmathNumber);
  const removeNumber = useGameStore(s => s.removeCrossmathNumber);
  const isSelected = selectedCellId === cell.id;

  if (cell.type === 'blank') {
    return <div className="w-full h-full" />;
  }

  // Operator formatting
  let displayValue: string | number = cell.value ?? '';
  if (cell.type === 'operator') {
    if (cell.value === '÷' || cell.value === '/') {
      displayValue = divisionSign;
    }
  }

  const isFillable = cell.type === 'empty';
  const hasValue = playerValue !== null && playerValue !== undefined;

  const handleClick = () => {
    if (isFillable) {
      if (hasValue && isSelected) {
        removeNumber(cell.id);
      } else {
        selectCell(cell.id);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isFillable) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isFillable) {
      e.preventDefault();
      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (data && data.poolItemId) {
          selectCell(cell.id);
          placeNumber(data.poolItemId);
        }
      } catch (err) {
        console.error('Drop error:', err);
      }
    }
  };

  let cellStyle = 'bg-[#fff9db] dark:bg-[#342e20] text-slate-800 dark:text-amber-100 border border-[#e9d89a] dark:border-[#5a4f32]';

  if (isFillable) {
    if (isSelected) {
      cellStyle = 'bg-[#c5e1a5] dark:bg-emerald-900 border-2 border-emerald-500 shadow-md scale-105 z-10';
    } else if (hasValue) {
      cellStyle = 'bg-[#e8f5e9] dark:bg-[#1e3a2b] text-emerald-800 dark:text-emerald-300 font-bold border-2 border-emerald-400';
    } else {
      cellStyle = 'bg-[#fffde7] dark:bg-[#2a2720] border-2 border-dashed border-[#e6d087] dark:border-[#605537] cursor-pointer hover:bg-amber-50';
    }
  }

  return (
    <div
      data-drop-cell={cell.id}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex items-center justify-center rounded-md font-bold text-sm sm:text-base select-none transition-all aspect-square ${cellStyle}`}
    >
      {/* Star Goal Badge */}
      {cell.hasStar && !hasValue && (
        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-400 absolute" />
      )}

      {/* Value */}
      {isFillable ? (
        hasValue ? (
          <span className="text-base sm:text-lg text-emerald-700 dark:text-emerald-300 font-extrabold">
            {playerValue}
          </span>
        ) : null
      ) : (
        <span className="text-slate-800 dark:text-slate-200">
          {displayValue}
        </span>
      )}
    </div>
  );
});

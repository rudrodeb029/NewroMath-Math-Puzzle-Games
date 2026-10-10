import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { PuzzleDifficulty } from '../types/game';
import { X, Sparkles } from 'lucide-react';

const DIFFICULTIES: Array<{ id: PuzzleDifficulty; label: string; desc: string; badgeColor: string }> = [
  { id: 'easy', label: 'Easy', desc: 'Relaxing casual puzzle', badgeColor: 'bg-emerald-500' },
  { id: 'medium', label: 'Medium', desc: 'Solid brain exercise', badgeColor: 'bg-blue-500' },
  { id: 'hard', label: 'Hard', desc: 'Challenging deductions', badgeColor: 'bg-amber-500' },
  { id: 'expert', label: 'Expert', desc: 'Complex reasoning', badgeColor: 'bg-orange-500' },
  { id: 'master', label: 'Master', desc: 'Advanced techniques', badgeColor: 'bg-rose-500' },
  { id: 'extreme', label: 'Extreme', desc: 'Ultimate math test', badgeColor: 'bg-purple-600' },
];

export const DifficultyModal: React.FC = () => {
  const activeModal = useGameStore(s => s.activeModal);
  const currentDiff = useGameStore(s => s.difficulty);
  const startNewSudoku = useGameStore(s => s.startNewSudoku);
  const setActiveModal = useGameStore(s => s.setActiveModal);

  if (activeModal !== 'difficulty') return null;

  const handleSelect = (diff: PuzzleDifficulty) => {
    startNewSudoku(diff);
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-game-darkCard rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-1">
          <div>
            <h2 className="text-2xl font-extrabold text-[#2c3e50] dark:text-slate-100 font-game tracking-tight">
              Level Up at Your Pace
            </h2>
            <p className="text-xs text-slate-400 font-medium">Select your Sudoku difficulty tier</p>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Difficulty Grid Cards (Matching image 3.PNG & 2222.PNG) */}
        <div className="grid grid-cols-2 gap-3">
          {DIFFICULTIES.map(item => {
            const isSelected = currentDiff === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all active:scale-95 text-center ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-sky-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-blue-300'
                }`}
              >
                {/* Visual Mini Grid Thumbnail */}
                <div className="w-12 h-12 mb-2 grid grid-cols-3 grid-rows-3 border border-slate-400 dark:border-slate-500 rounded bg-slate-50 dark:bg-slate-700/60 p-0.5 gap-0.5">
                  <div className="bg-slate-300 dark:bg-slate-500 rounded-[1px]" />
                  <div />
                  <div className="bg-blue-400 rounded-[1px]" />
                  <div />
                  <div className="bg-slate-300 dark:bg-slate-500 rounded-[1px]" />
                  <div />
                  <div className="bg-slate-300 dark:bg-slate-500 rounded-[1px]" />
                  <div className="bg-blue-400 rounded-[1px]" />
                  <div />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 font-game">
                    {item.label}
                  </span>
                  {isSelected && <Sparkles className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-400 mt-0.5">
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};


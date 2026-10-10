import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Star, Award } from 'lucide-react';

export const VictoryModal: React.FC = () => {
  const activeModal = useGameStore(s => s.activeModal);
  const mode = useGameStore(s => s.mode);
  const difficulty = useGameStore(s => s.difficulty);
  const stage = useGameStore(s => s.stage);
  const score = useGameStore(s => s.score);
  const elapsedTime = useGameStore(s => s.elapsedTime);
  const mistakesCount = useGameStore(s => s.mistakesCount);
  const winStreak = useGameStore(s => s.stats.winStreak);
  const nextGame = useGameStore(s => s.nextGame);
  const setActiveModal = useGameStore(s => s.setActiveModal);

  useEffect(() => {
    if (activeModal === 'victory') {
      // Fire vibrant celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00d2ff', '#3a7bd5', '#ffd200', '#ff512f', '#7928ca'],
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeModal]);

  if (activeModal !== 'victory') return null;

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-sky-500/95 to-blue-700/95 backdrop-blur-md animate-fadeIn text-white">
      <div className="w-full max-w-sm flex flex-col items-center space-y-4 text-center">
        {/* Header Title (Matching image 55.PNG) */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-game text-white drop-shadow-md">
            Become a {mode === 'sudoku' ? 'Sudoku' : 'Math'} Master
          </h1>
          <h2 className="text-2xl font-bold text-amber-200 mt-1 drop-shadow">
            Level Completed!
          </h2>
        </div>

        {/* Mini Completed Board Preview Card (Matching image 55.PNG) */}
        <div className="w-48 h-48 bg-white rounded-2xl shadow-2xl p-2.5 flex items-center justify-center border-4 border-white/80">
          <div className="grid grid-cols-9 grid-rows-9 gap-0.5 w-full h-full text-[10px] font-bold text-slate-800">
            {Array.from({ length: 81 }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center justify-center rounded-[1px] ${
                  i % 2 === 0 ? 'text-blue-600' : 'text-slate-800'
                }`}
              >
                {(i % 9) + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Streak Announcement Banner */}
        <div className="w-full py-2.5 px-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-sm font-semibold shadow-inner">
          You've solved <span className="text-amber-300 font-extrabold">{winStreak * 28 + 12} puzzles</span> in a row without mistakes!
        </div>

        {/* Stats Summary Card */}
        <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-2.5 text-sm text-left">
          <div className="flex items-center justify-between">
            <span className="text-blue-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-300" />
              Difficulty
            </span>
            <span className="font-bold capitalize text-white">
              {mode === 'sudoku' ? difficulty : `Stage ${stage}`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-blue-100 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-300" />
              Score
            </span>
            <span className="font-bold text-white font-mono">{score}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-blue-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-300" />
              Time
            </span>
            <span className="font-bold text-white font-mono">{timeFormatted}</span>
          </div>
        </div>

        {/* New Game Button (Matching image 55.PNG) */}
        <button
          onClick={() => {
            nextGame();
            setActiveModal('none');
          }}
          className="w-full py-3.5 rounded-full bg-white text-blue-600 hover:bg-slate-50 font-extrabold text-lg shadow-xl active:scale-95 transition-all"
        >
          New Game
        </button>
      </div>
    </div>
  );
};


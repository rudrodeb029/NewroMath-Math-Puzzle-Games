import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { Header } from './components/Header';
import { GameControls } from './components/GameControls';
import { HomeScreen } from './components/HomeScreen';
import { SudokuGrid } from './components/SudokuGrid';
import { Keypad } from './components/Keypad';
import { CrossmathGrid } from './components/CrossmathGrid';
import { CrossmathTray } from './components/CrossmathTray';
import { SettingsModal } from './components/SettingsModal';
import { StatsModal } from './components/StatsModal';
import { DifficultyModal } from './components/DifficultyModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { AdModal } from './components/AdModal';

export const App: React.FC = () => {
  const [isHome, setIsHome] = useState(true);
  const mode = useGameStore(s => s.mode);
  const isPaused = useGameStore(s => s.isPaused);
  const isCompleted = useGameStore(s => s.isCompleted);
  const isGameOver = useGameStore(s => s.isGameOver);
  const init = useGameStore(s => s.init);
  const tickTimer = useGameStore(s => s.tickTimer);
  const inputSudokuNumber = useGameStore(s => s.inputSudokuNumber);
  const eraseCell = useGameStore(s => s.eraseSudokuCell);
  const toggleNotes = useGameStore(s => s.toggleNotesMode);
  const undo = useGameStore(s => s.undo);
  const togglePause = useGameStore(s => s.togglePause);

  // Initialize on mount
  useEffect(() => {
    init();
  }, [init]);

  // Game timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHome) tickTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [isHome, tickTimer]);

  // Keyboard navigation & input shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isHome || isPaused || isCompleted || isGameOver) return;

      if (mode === 'sudoku') {
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= 9) {
          inputSudokuNumber(num);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          eraseCell();
        } else if (e.key.toLowerCase() === 'n') {
          toggleNotes();
        } else if (e.key.toLowerCase() === 'z' && (e.ctrlKey || e.metaKey)) {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, isHome, isPaused, isCompleted, isGameOver, inputSudokuNumber, eraseCell, toggleNotes, undo]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-game-darkBg text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-200">
      {isHome ? (
        <HomeScreen
          onContinue={() => setIsHome(false)}
          onStartMode={nextMode => {
            useGameStore.getState().setMode(nextMode);
            setIsHome(false);
          }}
        />
      ) : (
        <div className="w-full max-w-md mx-auto flex flex-col flex-1 pb-6 pt-1 px-2">
          <GameControls onHome={() => setIsHome(true)} />
          <main className="flex-1 flex flex-col justify-center my-auto relative">
            {isPaused && (
              <div className="absolute inset-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl gap-3">
                <span className="text-3xl font-extrabold font-game text-slate-800 dark:text-slate-100">
                  Game Paused
                </span>
                <button
                  onClick={togglePause}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md active:scale-95 transition-all"
                >
                  Tap to Resume
                </button>
              </div>
            )}

            {mode === 'sudoku' ? (
              <>
                <SudokuGrid />
                <Keypad />
              </>
            ) : (
              <>
                <CrossmathGrid />
                <CrossmathTray />
              </>
            )}
          </main>
        </div>
      )}

      {/* Modals & Overlays */}
      <SettingsModal />
      <StatsModal />
      <DifficultyModal />
      <VictoryModal />
      <GameOverModal />
      <AdModal />
    </div>
  );
};

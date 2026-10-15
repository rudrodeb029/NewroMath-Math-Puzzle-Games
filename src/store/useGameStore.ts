import { create } from 'zustand';
import {
  GameMode,
  PuzzleDifficulty,
  SudokuPuzzle,
  CrossmathPuzzle,
  CrossmathPoolItem,
  MoveRecord,
  AppSettings,
  PlayerStats
} from '../types/game';
import { SUDOKU_PUZZLES, getSudokuPuzzle } from '../data/sudokuLevels';
import { CROSSMATH_LEVELS, getCrossmathLevel } from '../data/crossmathLevels';
import { soundService } from '../services/soundService';
import { adMobService } from '../services/adMobService';
import { StorageService } from '../services/storageService';

interface GameStoreState {
  mode: GameMode;
  difficulty: PuzzleDifficulty;
  stage: number;

  // Sudoku state
  currentSudoku: SudokuPuzzle;
  sudokuPlayerBoard: (number | null)[][];
  sudokuNotesBoard: number[][][]; // 9x9 -> number[]
  selectedCell: { row: number; col: number } | null;
  isNotesMode: boolean;
  sudokuHintsRemaining: number;

  // Crossmath state
  currentCrossmath: CrossmathPuzzle;
  crossmathPlayerBoard: Record<string, number | null>;
  crossmathPool: CrossmathPoolItem[];
  selectedCrossmathCellId: string | null;
  collectedStars: number;
  crossmathHintsRemaining: number;

  // Global game state
  mistakesCount: number;
  maxMistakes: number;
  score: number;
  elapsedTime: number;
  isPaused: boolean;
  isCompleted: boolean;
  isGameOver: boolean;
  history: MoveRecord[];

  // Modals & Ads
  activeModal: 'none' | 'settings' | 'stats' | 'difficulty' | 'victory' | 'gameover' | 'ad';
  adInfo: { type: 'interstitial' | 'rewarded'; timer: number } | null;

  // User Preferences & Stats
  settings: AppSettings;
  stats: PlayerStats;

  // Actions
  init: () => Promise<void>;
  setMode: (mode: GameMode) => void;
  startNewSudoku: (diff?: PuzzleDifficulty) => void;
  startNewCrossmath: (stage?: number) => void;
  selectSudokuCell: (row: number, col: number) => void;
  inputSudokuNumber: (num: number) => void;
  toggleNotesMode: () => void;
  eraseSudokuCell: () => void;
  useSudokuHint: () => void;
  undo: () => void;

  selectCrossmathCell: (cellId: string) => void;
  placeCrossmathNumber: (poolItemId: string) => void;
  removeCrossmathNumber: (cellId: string) => void;
  sortCrossmathPool: () => void;
  useCrossmathHint: () => void;

  reviveWithReward: () => void;
  restartCurrentGame: () => void;
  nextGame: () => void;
  tickTimer: () => void;
  togglePause: () => void;
  setActiveModal: (modal: 'none' | 'settings' | 'stats' | 'difficulty' | 'victory' | 'gameover' | 'ad') => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  triggerAd: (type: 'interstitial' | 'rewarded', onDone?: () => void) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  largeFont: false,
  divisionSign: '÷',
  soundEnabled: true,
  hapticsEnabled: true,
  highlightDuplicates: true,
  autoRemoveNotes: true,
};

const DEFAULT_STATS: PlayerStats = {
  gamesWon: 142,
  bestScore: 1700,
  winsWithNoMistakes: 98,
  bestTime: 165,
  totalTime: 42000,
  totalGames: 160,
  winStreak: 6,
};

function createEmptyNotes(): number[][][] {
  return Array(9).fill(null).map(() => Array(9).fill(null).map(() => []));
}

function cloneBoard<T>(board: T[][]): T[][] {
  return board.map(row => [...row]);
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  mode: 'sudoku',
  difficulty: 'medium',
  stage: 1,

  currentSudoku: SUDOKU_PUZZLES.medium[0],
  sudokuPlayerBoard: cloneBoard(SUDOKU_PUZZLES.medium[0].cluesGrid),
  sudokuNotesBoard: createEmptyNotes(),
  selectedCell: { row: 4, col: 4 },
  isNotesMode: false,
  sudokuHintsRemaining: 2,

  currentCrossmath: CROSSMATH_LEVELS[0],
  crossmathPlayerBoard: {},
  crossmathPool: [],
  selectedCrossmathCellId: null,
  collectedStars: 0,
  crossmathHintsRemaining: 3,

  mistakesCount: 0,
  maxMistakes: 3,
  score: 350,
  elapsedTime: 119, // 01:59
  isPaused: false,
  isCompleted: false,
  isGameOver: false,
  history: [],

  activeModal: 'none',
  adInfo: null,

  settings: DEFAULT_SETTINGS,
  stats: DEFAULT_STATS,

  init: async () => {
    // Asynchronously load settings & stats from local storage/Capacitor
    const savedSettings = await StorageService.get('app_settings', DEFAULT_SETTINGS);
    const savedStats = await StorageService.get('app_stats', DEFAULT_STATS);
    
    soundService.setMuted(!savedSettings.soundEnabled);
    if (savedSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    set({ settings: savedSettings, stats: savedStats });

    // Load active puzzle
    get().startNewSudoku(savedSettings ? 'medium' : 'easy');
  },

  setMode: (mode: GameMode) => {
    soundService.playClick();
    set({ mode });
    if (mode === 'crossmath') {
      get().startNewCrossmath(get().stage);
    } else {
      get().startNewSudoku(get().difficulty);
    }
  },

  startNewSudoku: (diff?: PuzzleDifficulty) => {
    const targetDiff = diff || get().difficulty;
    const puzzle = getSudokuPuzzle(targetDiff, Math.floor(Math.random() * 5));
    const newBoard = cloneBoard(puzzle.cluesGrid);

    set({
      mode: 'sudoku',
      difficulty: targetDiff,
      currentSudoku: puzzle,
      sudokuPlayerBoard: newBoard,
      sudokuNotesBoard: createEmptyNotes(),
      selectedCell: { row: 0, col: 0 },
      isNotesMode: false,
      mistakesCount: 0,
      score: 100,
      elapsedTime: 0,
      isPaused: false,
      isCompleted: false,
      isGameOver: false,
      sudokuHintsRemaining: 2,
      history: [],
      activeModal: 'none'
    });
  },

  startNewCrossmath: (stageNum = 1) => {
    const puzzle = getCrossmathLevel(stageNum);
    const initialBoard: Record<string, number | null> = {};
    puzzle.cells.forEach(c => {
      if (c.type === 'empty') {
        initialBoard[c.id] = null;
      }
    });

    const pool: CrossmathPoolItem[] = puzzle.poolNumbers.map((val, idx) => ({
      id: `p-${idx}-${val}`,
      value: val,
      isUsed: false,
    }));

    set({
      mode: 'crossmath',
      stage: stageNum,
      difficulty: puzzle.difficulty,
      currentCrossmath: puzzle,
      crossmathPlayerBoard: initialBoard,
      crossmathPool: pool,
      selectedCrossmathCellId: null,
      collectedStars: 0,
      mistakesCount: 0,
      score: 500 * stageNum,
      elapsedTime: 0,
      isPaused: false,
      isCompleted: false,
      isGameOver: false,
      crossmathHintsRemaining: 3,
      history: [],
      activeModal: 'none'
    });
  },

  selectSudokuCell: (row: number, col: number) => {
    const { isPaused, isGameOver, isCompleted } = get();
    if (isPaused || isGameOver || isCompleted) return;

    soundService.playClick();
    set({ selectedCell: { row, col } });
  },

  inputSudokuNumber: (num: number) => {
    const state = get();
    const { selectedCell, currentSudoku, sudokuPlayerBoard, sudokuNotesBoard, isNotesMode, mistakesCount, maxMistakes, score } = state;
    if (!selectedCell || state.isPaused || state.isGameOver || state.isCompleted) return;

    const { row, col } = selectedCell;

    // Check if cell is fixed clue
    if (currentSudoku.cluesGrid[row][col] !== null) {
      return;
    }

    if (isNotesMode) {
      // Toggle note
      soundService.playNote();
      const currentCellNotes = sudokuNotesBoard[row][col];
      const newNotes = currentCellNotes.includes(num)
        ? currentCellNotes.filter(n => n !== num)
        : [...currentCellNotes, num].sort((a, b) => a - b);

      const newNotesBoard = cloneBoard(sudokuNotesBoard);
      newNotesBoard[row][col] = newNotes;

      const record: MoveRecord = {
        type: 'sudoku_note',
        row,
        col,
        prevNotes: currentCellNotes,
        newNotes: newNotes,
      };

      set({
        sudokuNotesBoard: newNotesBoard,
        history: [...state.history, record],
      });
      return;
    }

    // Direct numerical input
    const correctVal = currentSudoku.solutionGrid[row][col];
    const prevVal = sudokuPlayerBoard[row][col];

    if (num === correctVal) {
      soundService.playPlace();
      const newBoard = cloneBoard(sudokuPlayerBoard);
      newBoard[row][col] = num;

      // Auto clear notes in current row, col, and 3x3 box if setting is on
      const newNotesBoard = cloneBoard(sudokuNotesBoard);
      if (state.settings.autoRemoveNotes) {
        newNotesBoard[row][col] = [];
        const boxR = Math.floor(row / 3) * 3;
        const boxC = Math.floor(col / 3) * 3;
        for (let r = 0; r < 9; r++) {
          newNotesBoard[r][col] = newNotesBoard[r][col].filter(n => n !== num);
        }
        for (let c = 0; c < 9; c++) {
          newNotesBoard[row][c] = newNotesBoard[row][c].filter(n => n !== num);
        }
        for (let r = boxR; r < boxR + 3; r++) {
          for (let c = boxC; c < boxC + 3; c++) {
            newNotesBoard[r][c] = newNotesBoard[r][c].filter(n => n !== num);
          }
        }
      }

      const record: MoveRecord = {
        type: 'sudoku_number',
        row,
        col,
        prevValue: prevVal,
        newValue: num,
      };

      // Check win condition
      let isSolved = true;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (newBoard[r][c] !== currentSudoku.solutionGrid[r][c]) {
            isSolved = false;
            break;
          }
        }
        if (!isSolved) break;
      }

      if (isSolved) {
        soundService.playVictory();
        const newStats = {
          ...state.stats,
          gamesWon: state.stats.gamesWon + 1,
          winStreak: state.stats.winStreak + 1,
          bestScore: Math.max(state.stats.bestScore, score + 200),
          winsWithNoMistakes: mistakesCount === 0 ? state.stats.winsWithNoMistakes + 1 : state.stats.winsWithNoMistakes,
          bestTime: state.stats.bestTime === 0 ? state.elapsedTime : Math.min(state.stats.bestTime, state.elapsedTime),
        };
        StorageService.set('app_stats', newStats);

        set({
          sudokuPlayerBoard: newBoard,
          sudokuNotesBoard: newNotesBoard,
          score: score + 100,
          isCompleted: true,
          activeModal: 'victory',
          stats: newStats,
        });
      } else {
        set({
          sudokuPlayerBoard: newBoard,
          sudokuNotesBoard: newNotesBoard,
          score: score + 20,
          history: [...state.history, record],
        });
      }
    } else {
      // Mistake!
      soundService.playMistake();
      const newMistakes = mistakesCount + 1;
      if (newMistakes >= maxMistakes) {
        set({
          mistakesCount: newMistakes,
          isGameOver: true,
          activeModal: 'gameover',
        });
      } else {
        set({
          mistakesCount: newMistakes,
        });
      }
    }
  },

  toggleNotesMode: () => {
    soundService.playClick();
    set(state => ({ isNotesMode: !state.isNotesMode }));
  },

  eraseSudokuCell: () => {
    const { selectedCell, currentSudoku, sudokuPlayerBoard, sudokuNotesBoard, history, isPaused, isGameOver, isCompleted } = get();
    if (!selectedCell || isPaused || isGameOver || isCompleted) return;
    const { row, col } = selectedCell;

    if (currentSudoku.cluesGrid[row][col] !== null) return;

    soundService.playErase();
    const prevVal = sudokuPlayerBoard[row][col];
    const prevNotes = sudokuNotesBoard[row][col];

    if (prevVal === null && prevNotes.length === 0) return;

    const newBoard = cloneBoard(sudokuPlayerBoard);
    newBoard[row][col] = null;

    const newNotesBoard = cloneBoard(sudokuNotesBoard);
    newNotesBoard[row][col] = [];

    set({
      sudokuPlayerBoard: newBoard,
      sudokuNotesBoard: newNotesBoard,
      history: [
        ...history,
        {
          type: 'sudoku_erase',
          row,
          col,
          prevValue: prevVal,
          prevNotes,
        }
      ]
    });
  },

  useSudokuHint: () => {
    const state = get();
    const { selectedCell, currentSudoku, sudokuPlayerBoard, sudokuHintsRemaining, isPaused, isGameOver, isCompleted } = state;
    if (isPaused || isGameOver || isCompleted || sudokuHintsRemaining <= 0) return;

    let targetRow = -1;
    let targetCol = -1;

    // Use current selected cell if empty
    if (selectedCell && sudokuPlayerBoard[selectedCell.row][selectedCell.col] === null) {
      targetRow = selectedCell.row;
      targetCol = selectedCell.col;
    } else {
      // Find first empty cell
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (sudokuPlayerBoard[r][c] === null) {
            targetRow = r;
            targetCol = c;
            break;
          }
        }
        if (targetRow !== -1) break;
      }
    }

    if (targetRow === -1) return;

    soundService.playPlace();
    const correctVal = currentSudoku.solutionGrid[targetRow][targetCol];
    const newBoard = cloneBoard(sudokuPlayerBoard);
    newBoard[targetRow][targetCol] = correctVal;

    set({
      selectedCell: { row: targetRow, col: targetCol },
      sudokuPlayerBoard: newBoard,
      sudokuHintsRemaining: sudokuHintsRemaining - 1,
    });
  },

  undo: () => {
    const state = get();
    const { history } = state;
    if (history.length === 0 || state.isPaused || state.isGameOver || state.isCompleted) return;

    soundService.playClick();
    const last = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    if (last.type === 'sudoku_number' || last.type === 'sudoku_erase') {
      const newBoard = cloneBoard(state.sudokuPlayerBoard);
      newBoard[last.row!][last.col!] = last.prevValue ?? null;
      set({
        sudokuPlayerBoard: newBoard,
        history: newHistory,
        selectedCell: { row: last.row!, col: last.col! },
      });
    } else if (last.type === 'sudoku_note') {
      const newNotes = cloneBoard(state.sudokuNotesBoard);
      newNotes[last.row!][last.col!] = last.prevNotes ?? [];
      set({
        sudokuNotesBoard: newNotes,
        history: newHistory,
        selectedCell: { row: last.row!, col: last.col! },
      });
    } else if (last.type === 'crossmath_place') {
      const newPlayerBoard = { ...state.crossmathPlayerBoard };
      newPlayerBoard[last.cellId!] = null;
      const newPool = state.crossmathPool.map(p =>
        p.id === last.poolItemId ? { ...p, isUsed: false, placedInCellId: null } : p
      );
      set({
        crossmathPlayerBoard: newPlayerBoard,
        crossmathPool: newPool,
        history: newHistory,
      });
    }
  },

  // Crossmath actions
  selectCrossmathCell: (cellId: string) => {
    soundService.playClick();
    set({ selectedCrossmathCellId: cellId });
  },

  placeCrossmathNumber: (poolItemId: string) => {
    const state = get();
    const { selectedCrossmathCellId, crossmathPool, crossmathPlayerBoard, currentCrossmath, mistakesCount, maxMistakes, score } = state;
    if (!selectedCrossmathCellId || state.isPaused || state.isGameOver || state.isCompleted) return;

    const poolItem = crossmathPool.find(p => p.id === poolItemId);
    if (!poolItem || poolItem.isUsed) return;

    const targetCell = currentCrossmath.cells.find(c => c.id === selectedCrossmathCellId);
    if (!targetCell || targetCell.type !== 'empty') return;

    // Check correctness
    if (targetCell.solution === poolItem.value) {
      soundService.playPlace();
      const updatedPlayerBoard = {
        ...crossmathPlayerBoard,
        [selectedCrossmathCellId]: poolItem.value,
      };

      const updatedPool = crossmathPool.map(p =>
        p.id === poolItemId ? { ...p, isUsed: true, placedInCellId: selectedCrossmathCellId } : p
      );

      const starAdded = targetCell.hasStar ? 1 : 0;

      // Check if all empty cells are filled correctly
      const emptyCells = currentCrossmath.cells.filter(c => c.type === 'empty');
      const allFilled = emptyCells.every(c => updatedPlayerBoard[c.id] === c.solution);

      if (allFilled) {
        soundService.playVictory();
        const newStats = {
          ...state.stats,
          gamesWon: state.stats.gamesWon + 1,
          winStreak: state.stats.winStreak + 1,
          bestScore: Math.max(state.stats.bestScore, score + 300),
        };
        StorageService.set('app_stats', newStats);

        set({
          crossmathPlayerBoard: updatedPlayerBoard,
          crossmathPool: updatedPool,
          collectedStars: state.collectedStars + starAdded,
          isCompleted: true,
          activeModal: 'victory',
          stats: newStats,
        });
      } else {
        set({
          crossmathPlayerBoard: updatedPlayerBoard,
          crossmathPool: updatedPool,
          collectedStars: state.collectedStars + starAdded,
          score: score + 50,
          history: [
            ...state.history,
            {
              type: 'crossmath_place',
              cellId: selectedCrossmathCellId,
              poolItemId: poolItemId,
            }
          ]
        });
      }
    } else {
      soundService.playMistake();
      const newMistakes = mistakesCount + 1;
      if (newMistakes >= maxMistakes) {
        set({
          mistakesCount: newMistakes,
          isGameOver: true,
          activeModal: 'gameover',
        });
      } else {
        set({ mistakesCount: newMistakes });
      }
    }
  },

  removeCrossmathNumber: (cellId: string) => {
    const state = get();
    const currentVal = state.crossmathPlayerBoard[cellId];
    if (currentVal === null || currentVal === undefined) return;

    soundService.playErase();
    const updatedBoard = { ...state.crossmathPlayerBoard, [cellId]: null };
    const updatedPool = state.crossmathPool.map(p =>
      p.placedInCellId === cellId ? { ...p, isUsed: false, placedInCellId: null } : p
    );

    set({
      crossmathPlayerBoard: updatedBoard,
      crossmathPool: updatedPool,
      selectedCrossmathCellId: cellId,
    });
  },

  sortCrossmathPool: () => {
    soundService.playClick();
    const sorted = [...get().crossmathPool].sort((a, b) => a.value - b.value);
    set({ crossmathPool: sorted });
  },

  useCrossmathHint: () => {
    const state = get();
    const { crossmathHintsRemaining, currentCrossmath, crossmathPlayerBoard, crossmathPool, isPaused, isGameOver, isCompleted } = state;
    if (isPaused || isGameOver || isCompleted || crossmathHintsRemaining <= 0) return;

    // Find first empty unsolved cell
    const emptyCells = currentCrossmath.cells.filter(c => c.type === 'empty' && crossmathPlayerBoard[c.id] !== c.solution);
    if (emptyCells.length === 0) return;

    const cell = emptyCells[0];
    const matchPoolItem = crossmathPool.find(p => !p.isUsed && p.value === cell.solution);
    if (!matchPoolItem) return;

    soundService.playPlace();
    const newBoard = { ...crossmathPlayerBoard, [cell.id]: cell.solution! };
    const newPool = crossmathPool.map(p =>
      p.id === matchPoolItem.id ? { ...p, isUsed: true, placedInCellId: cell.id } : p
    );

    set({
      crossmathPlayerBoard: newBoard,
      crossmathPool: newPool,
      crossmathHintsRemaining: crossmathHintsRemaining - 1,
      selectedCrossmathCellId: cell.id,
    });
  },

  reviveWithReward: () => {
    // Show rewarded video ad, then reset mistakes to 2/3 (giving 1 extra life)
    get().triggerAd('rewarded', () => {
      set({
        mistakesCount: 2,
        isGameOver: false,
        activeModal: 'none',
      });
    });
  },

  restartCurrentGame: () => {
    soundService.playClick();
    if (get().mode === 'sudoku') {
      get().startNewSudoku(get().difficulty);
    } else {
      get().startNewCrossmath(get().stage);
    }
  },

  nextGame: () => {
    soundService.playClick();
    if (get().mode === 'sudoku') {
      get().startNewSudoku(get().difficulty);
    } else {
      get().startNewCrossmath(get().stage + 1);
    }
  },

  tickTimer: () => {
    const { isPaused, isGameOver, isCompleted } = get();
    if (!isPaused && !isGameOver && !isCompleted) {
      set(state => ({ elapsedTime: state.elapsedTime + 1 }));
    }
  },

  togglePause: () => {
    soundService.playClick();
    set(state => ({ isPaused: !state.isPaused }));
  },

  setActiveModal: modal => {
    soundService.playClick();
    set({ activeModal: modal });
  },

  updateSettings: newSettings => {
    const merged = { ...get().settings, ...newSettings };
    soundService.setMuted(!merged.soundEnabled);
    if (merged.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    StorageService.set('app_settings', merged);
    set({ settings: merged });
  },

  triggerAd: (type, onDone) => {
    set({ activeModal: 'ad', adInfo: { type, timer: 3 } });
    if (type === 'rewarded') {
      adMobService.showRewarded(() => {
        if (onDone) onDone();
      });
    } else {
      adMobService.showInterstitial();
      setTimeout(() => {
        set({ activeModal: 'none', adInfo: null });
        if (onDone) onDone();
      }, 2500);
    }
  }
}));


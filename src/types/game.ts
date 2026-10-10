export type GameMode = 'sudoku' | 'crossmath';

export type PuzzleDifficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'master' | 'extreme';

export interface SudokuPuzzle {
  id: string;
  difficulty: PuzzleDifficulty;
  cluesGrid: (number | null)[][]; // 9x9
  solutionGrid: number[][];        // 9x9
}

export type CrossmathCellType = 'empty' | 'number' | 'operator' | 'equals' | 'result' | 'blank';

export interface CrossmathCell {
  id: string;
  row: number;
  col: number;
  type: CrossmathCellType;
  value?: string | number;
  solution?: number;
  isGiven?: boolean;
  hasStar?: boolean;
}

export interface CrossmathPuzzle {
  id: string;
  stage: number;
  difficulty: PuzzleDifficulty;
  gridRows: number;
  gridCols: number;
  cells: CrossmathCell[];
  poolNumbers: number[];
  totalStars: number;
}

export interface CrossmathPoolItem {
  id: string;
  value: number;
  isUsed: boolean;
  placedInCellId?: string | null;
}

export interface MoveRecord {
  type: 'sudoku_number' | 'sudoku_note' | 'sudoku_erase' | 'crossmath_place' | 'crossmath_remove';
  row?: number;
  col?: number;
  prevValue?: number | null;
  newValue?: number | null;
  prevNotes?: number[];
  newNotes?: number[];
  cellId?: string;
  poolItemId?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  largeFont: boolean;
  divisionSign: '÷' | '/' | ':';
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  highlightDuplicates: boolean;
  autoRemoveNotes: boolean;
}

export interface PlayerStats {
  gamesWon: number;
  bestScore: number;
  winsWithNoMistakes: number;
  bestTime: number; // in seconds
  totalTime: number;
  totalGames: number;
  winStreak: number;
}


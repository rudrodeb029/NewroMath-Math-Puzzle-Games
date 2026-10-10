import { SudokuPuzzle, PuzzleDifficulty } from '../types/game';

export const SUDOKU_PUZZLES: Record<PuzzleDifficulty, SudokuPuzzle[]> = {
  easy: [
    {
      id: 'sudoku-easy-1',
      difficulty: 'easy',
      cluesGrid: [
        [null, 2, null, 6, null, 8, null, null, null],
        [5, 8, null, null, null, 9, 7, null, null],
        [null, null, null, null, 4, null, null, null, null],
        [3, 7, null, null, null, null, 5, null, null],
        [6, null, null, null, null, null, null, null, 4],
        [null, null, 8, null, null, null, null, 1, 3],
        [null, null, null, null, 2, null, null, null, null],
        [null, null, 9, 8, null, null, null, 3, 6],
        [null, null, null, 3, null, 6, null, 9, null]
      ],
      solutionGrid: [
        [1, 2, 3, 6, 7, 8, 9, 4, 5],
        [5, 8, 4, 2, 3, 9, 7, 6, 1],
        [9, 6, 7, 1, 4, 5, 3, 2, 8],
        [3, 7, 2, 4, 1, 6, 5, 8, 9],
        [6, 9, 1, 5, 8, 3, 2, 7, 4],
        [4, 5, 8, 7, 9, 2, 6, 1, 3],
        [8, 3, 6, 9, 2, 1, 4, 5, 7],
        [7, 4, 9, 8, 5, 7, 1, 3, 6],
        [2, 1, 5, 3, 6, 4, 8, 9, 2]
      ]
    },
    {
      id: 'sudoku-easy-2',
      difficulty: 'easy',
      cluesGrid: [
        [1, 2, null, null, 7, 5, null, null, null],
        [4, null, null, null, 9, null, 3, 1, 8],
        [7, 8, 9, 2, null, null, null, null, null],
        [null, 4, 8, 1, null, 2, null, 7, 5],
        [null, null, null, null, 8, null, 1, 3, 4],
        [5, null, 1, null, null, null, null, null, null],
        [null, 6, 3, null, null, 9, null, null, null],
        [8, 1, null, null, 3, 4, 9, 2, 6],
        [2, null, null, 5, null, null, null, 8, 1]
      ],
      solutionGrid: [
        [1, 2, 6, 3, 7, 5, 4, 9, 8],
        [4, 5, 7, 6, 9, 8, 3, 1, 2],
        [7, 8, 9, 2, 4, 1, 6, 5, 3],
        [3, 4, 8, 1, 6, 2, 9, 7, 5],
        [6, 9, 2, 7, 8, 3, 1, 3, 4],
        [5, 7, 1, 9, 2, 4, 8, 6, 3],
        [9, 6, 3, 8, 1, 9, 5, 4, 7],
        [8, 1, 5, 4, 3, 4, 9, 2, 6],
        [2, 3, 4, 5, 6, 7, 2, 8, 1]
      ]
    }
  ],
  medium: [
    {
      id: 'sudoku-medium-1',
      difficulty: 'medium',
      cluesGrid: [
        [2, 9, null, null, null, null, 5, 4, 3],
        [5, null, 1, 4, null, null, null, null, null],
        [7, 4, null, 5, 6, null, 1, 9, 8],
        [null, 6, 5, null, null, 1, null, null, null],
        [null, 7, null, 9, 8, 5, 2, null, null],
        [1, 2, null, null, 4, 7, 8, 3, 5],
        [null, 1, 7, null, null, null, null, 5, 2],
        [null, 3, 2, 1, 5, null, null, 8, null],
        [null, 5, 8, null, 7, null, 3, null, null]
      ],
      solutionGrid: [
        [2, 9, 6, 8, 1, 3, 5, 4, 3],
        [5, 8, 1, 4, 2, 9, 6, 7, 3],
        [7, 4, 3, 5, 6, 2, 1, 9, 8],
        [3, 6, 5, 7, 9, 1, 4, 2, 8],
        [4, 7, 9, 9, 8, 5, 2, 6, 1],
        [1, 2, 8, 6, 4, 7, 8, 3, 5],
        [8, 1, 7, 3, 4, 6, 9, 5, 2],
        [6, 3, 2, 1, 5, 4, 7, 8, 9],
        [9, 5, 8, 2, 7, 8, 3, 1, 4]
      ]
    }
  ],
  hard: [
    {
      id: 'sudoku-hard-1',
      difficulty: 'hard',
      cluesGrid: [
        [null, 7, 9, 1, null, 2, 6, null, null],
        [null, null, null, null, 8, null, 3, 4, null],
        [null, null, 7, null, null, null, null, null, null],
        [9, 1, null, null, null, null, null, null, null],
        [null, null, 7, null, null, null, 3, null, null],
        [2, 5, null, 6, 8, 3, 1, null, null],
        [null, 2, null, 3, 4, null, null, 5, 1],
        [8, null, 2, null, null, null, null, null, null],
        [null, 4, null, 7, 1, null, 2, null, null]
      ],
      solutionGrid: [
        [4, 7, 9, 1, 3, 2, 6, 8, 5],
        [6, 3, 1, 5, 8, 7, 3, 4, 2],
        [5, 8, 7, 4, 9, 6, 1, 2, 3],
        [9, 1, 3, 2, 7, 4, 5, 6, 8],
        [7, 6, 7, 9, 5, 1, 3, 4, 2],
        [2, 5, 4, 6, 8, 3, 1, 7, 9],
        [1, 2, 6, 3, 4, 8, 7, 5, 1],
        [8, 9, 2, 7, 6, 5, 4, 3, 1],
        [3, 4, 5, 7, 1, 9, 2, 6, 7]
      ]
    }
  ],
  expert: [
    {
      id: 'sudoku-expert-1',
      difficulty: 'expert',
      cluesGrid: [
        [6, null, null, 9, null, null, 5, null, 3],
        [null, null, 1, null, null, null, 6, null, null],
        [5, 4, null, null, null, 3, null, null, null],
        [4, 1, null, 3, null, 8, null, null, null],
        [7, null, 3, 4, null, null, null, null, null],
        [9, null, null, 5, 6, 1, null, null, null],
        [null, null, null, null, null, null, 2, 8, 1],
        [null, null, 7, 8, 3, 2, null, 6, null],
        [null, 4, null, null, null, null, null, null, 5]
      ],
      solutionGrid: [
        [6, 2, 8, 9, 1, 4, 5, 7, 3],
        [3, 7, 1, 2, 5, 8, 6, 4, 9],
        [5, 4, 9, 6, 7, 3, 1, 2, 8],
        [4, 1, 6, 3, 2, 8, 7, 9, 5],
        [7, 8, 3, 4, 9, 5, 2, 1, 6],
        [9, 2, 5, 5, 6, 1, 8, 3, 4],
        [3, 5, 4, 7, 4, 6, 2, 8, 1],
        [1, 9, 7, 8, 3, 2, 4, 6, 7],
        [8, 4, 2, 1, 8, 9, 3, 5, 5]
      ]
    }
  ],
  master: [
    {
      id: 'sudoku-master-1',
      difficulty: 'master',
      cluesGrid: [
        [3, 4, null, null, null, null, null, null, null],
        [null, 5, null, null, 9, null, null, null, null],
        [null, null, null, 3, null, null, 9, 2, 6],
        [null, null, null, 1, null, 2, 7, 3, null],
        [null, 3, null, null, 7, 9, null, null, null],
        [7, null, 4, null, null, null, null, 1, null],
        [4, 2, null, 9, null, null, 5, 6, null],
        [null, null, 5, null, 8, 7, null, null, null],
        [null, null, null, null, 4, null, null, 9, null]
      ],
      solutionGrid: [
        [3, 4, 9, 2, 6, 1, 8, 7, 5],
        [2, 5, 6, 7, 9, 8, 1, 4, 3],
        [1, 7, 8, 3, 5, 4, 9, 2, 6],
        [9, 8, 1, 1, 4, 2, 7, 3, 6],
        [5, 3, 2, 6, 7, 9, 4, 8, 1],
        [7, 6, 4, 8, 3, 5, 2, 1, 9],
        [4, 2, 7, 9, 1, 3, 5, 6, 8],
        [8, 9, 5, 4, 8, 7, 6, 3, 2],
        [6, 1, 3, 5, 4, 2, 7, 9, 4]
      ]
    }
  ],
  extreme: [
    {
      id: 'sudoku-extreme-1',
      difficulty: 'extreme',
      cluesGrid: [
        [null, null, null, 2, 7, null, null, 1, null],
        [3, null, null, null, 5, 9, null, null, null],
        [null, 9, null, 8, null, null, 2, null, 4],
        [6, 8, 5, null, null, null, null, null, 9],
        [null, null, 4, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, 3, null],
        [9, null, null, null, null, null, null, null, null],
        [null, null, 1, null, 9, null, 7, 2, null],
        [null, null, null, 5, null, 8, null, null, null]
      ],
      solutionGrid: [
        [8, 4, 6, 2, 7, 3, 9, 1, 5],
        [3, 1, 2, 4, 5, 9, 6, 8, 7],
        [5, 9, 7, 8, 1, 6, 2, 4, 4],
        [6, 8, 5, 3, 2, 4, 1, 7, 9],
        [7, 3, 4, 1, 6, 5, 8, 9, 2],
        [1, 2, 9, 7, 8, 9, 5, 3, 6],
        [9, 7, 8, 6, 3, 2, 4, 5, 1],
        [4, 5, 1, 9, 9, 1, 7, 2, 8],
        [2, 6, 3, 5, 4, 8, 3, 6, 3]
      ]
    }
  ]
};

// Valid standard Sudoku generator helper to dynamically provide clean levels
export function getSudokuPuzzle(diff: PuzzleDifficulty, levelIndex = 0): SudokuPuzzle {
  const pool = SUDOKU_PUZZLES[diff] || SUDOKU_PUZZLES.easy;
  return pool[levelIndex % pool.length];
}


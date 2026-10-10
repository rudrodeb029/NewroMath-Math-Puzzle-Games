import { CrossmathPuzzle } from '../types/game';

export const CROSSMATH_LEVELS: CrossmathPuzzle[] = [
  {
    id: 'crossmath-stage-1',
    stage: 1,
    difficulty: 'easy',
    gridRows: 5,
    gridCols: 5,
    totalStars: 2,
    poolNumbers: [4, 7, 2, 5, 3, 9],
    cells: [
      // Row 0: [ ] + [ ] = 9
      { id: 'c-0-0', row: 0, col: 0, type: 'empty', solution: 4 },
      { id: 'c-0-1', row: 0, col: 1, type: 'operator', value: '+' },
      { id: 'c-0-2', row: 0, col: 2, type: 'empty', solution: 5 },
      { id: 'c-0-3', row: 0, col: 3, type: 'equals', value: '=' },
      { id: 'c-0-4', row: 0, col: 4, type: 'result', value: 9 },

      // Row 1: +    +
      { id: 'c-1-0', row: 1, col: 0, type: 'operator', value: '+' },
      { id: 'c-1-1', row: 1, col: 1, type: 'blank' },
      { id: 'c-1-2', row: 1, col: 2, type: 'operator', value: '+' },
      { id: 'c-1-3', row: 1, col: 3, type: 'blank' },
      { id: 'c-1-4', row: 1, col: 4, type: 'blank' },

      // Row 2: [ ] - [ ] = 5
      { id: 'c-2-0', row: 2, col: 0, type: 'empty', solution: 7, hasStar: true },
      { id: 'c-2-1', row: 2, col: 1, type: 'operator', value: '-' },
      { id: 'c-2-2', row: 2, col: 2, type: 'empty', solution: 2 },
      { id: 'c-2-3', row: 2, col: 3, type: 'equals', value: '=' },
      { id: 'c-2-4', row: 2, col: 4, type: 'result', value: 5 },

      // Row 3: =    =
      { id: 'c-3-0', row: 3, col: 0, type: 'equals', value: '=' },
      { id: 'c-3-1', row: 3, col: 1, type: 'blank' },
      { id: 'c-3-2', row: 3, col: 2, type: 'equals', value: '=' },
      { id: 'c-3-3', row: 3, col: 3, type: 'blank' },
      { id: 'c-3-4', row: 3, col: 4, type: 'blank' },

      // Row 4: 11   7
      { id: 'c-4-0', row: 4, col: 0, type: 'result', value: 11 },
      { id: 'c-4-1', row: 4, col: 1, type: 'blank' },
      { id: 'c-4-2', row: 4, col: 2, type: 'result', value: 7, hasStar: true },
      { id: 'c-4-3', row: 4, col: 3, type: 'blank' },
      { id: 'c-4-4', row: 4, col: 4, type: 'blank' },
    ]
  },
  {
    id: 'crossmath-stage-2',
    stage: 2,
    difficulty: 'medium',
    gridRows: 7,
    gridCols: 7,
    totalStars: 4,
    poolNumbers: [3, 8, 4, 12, 6, 2, 14, 5, 1],
    cells: [
      // Row 0: 3 + [ ] = 15
      { id: 'c-0-0', row: 0, col: 0, type: 'number', value: 3, isGiven: true },
      { id: 'c-0-1', row: 0, col: 1, type: 'operator', value: '+' },
      { id: 'c-0-2', row: 0, col: 2, type: 'empty', solution: 12, hasStar: true },
      { id: 'c-0-3', row: 0, col: 3, type: 'equals', value: '=' },
      { id: 'c-0-4', row: 0, col: 4, type: 'result', value: 15 },
      { id: 'c-0-5', row: 0, col: 5, type: 'blank' },
      { id: 'c-0-6', row: 0, col: 6, type: 'blank' },

      // Row 1: x   -
      { id: 'c-1-0', row: 1, col: 0, type: 'operator', value: 'x' },
      { id: 'c-1-1', row: 1, col: 1, type: 'blank' },
      { id: 'c-1-2', row: 1, col: 2, type: 'operator', value: '-' },
      { id: 'c-1-3', row: 1, col: 3, type: 'blank' },
      { id: 'c-1-4', row: 1, col: 4, type: 'blank' },
      { id: 'c-1-5', row: 1, col: 5, type: 'blank' },
      { id: 'c-1-6', row: 1, col: 6, type: 'blank' },

      // Row 2: [ ] + 4 = 8
      { id: 'c-2-0', row: 2, col: 0, type: 'empty', solution: 4 },
      { id: 'c-2-1', row: 2, col: 1, type: 'operator', value: '+' },
      { id: 'c-2-2', row: 2, col: 2, type: 'number', value: 4, isGiven: true },
      { id: 'c-2-3', row: 2, col: 3, type: 'equals', value: '=' },
      { id: 'c-2-4', row: 2, col: 4, type: 'result', value: 8 },
      { id: 'c-2-5', row: 2, col: 5, type: 'blank' },
      { id: 'c-2-6', row: 2, col: 6, type: 'blank' },

      // Row 3: =   =
      { id: 'c-3-0', row: 3, col: 0, type: 'equals', value: '=' },
      { id: 'c-3-1', row: 3, col: 1, type: 'blank' },
      { id: 'c-3-2', row: 3, col: 2, type: 'equals', value: '=' },
      { id: 'c-3-3', row: 3, col: 3, type: 'blank' },
      { id: 'c-3-4', row: 3, col: 4, type: 'blank' },
      { id: 'c-3-5', row: 3, col: 5, type: 'blank' },
      { id: 'c-3-6', row: 3, col: 6, type: 'blank' },

      // Row 4: 12  8
      { id: 'c-4-0', row: 4, col: 0, type: 'result', value: 12, hasStar: true },
      { id: 'c-4-1', row: 4, col: 1, type: 'blank' },
      { id: 'c-4-2', row: 4, col: 2, type: 'result', value: 8 },
      { id: 'c-4-3', row: 4, col: 3, type: 'blank' },
      { id: 'c-4-4', row: 4, col: 4, type: 'blank' },
      { id: 'c-4-5', row: 4, col: 5, type: 'blank' },
      { id: 'c-4-6', row: 4, col: 6, type: 'blank' },
    ]
  },
  {
    id: 'crossmath-stage-9',
    stage: 9,
    difficulty: 'hard',
    gridRows: 9,
    gridCols: 7,
    totalStars: 6,
    poolNumbers: [1, 5, 11, 7, 2, 7, 1, 10, 1, 5, 4, 10, 1, 7, 3, 1, 1, 9, 4, 2, 7, 3],
    cells: [
      // Top row left: [ ] - 3 = [ ]
      { id: 'c-0-0', row: 0, col: 0, type: 'empty', solution: 7 },
      { id: 'c-0-1', row: 0, col: 1, type: 'operator', value: '-' },
      { id: 'c-0-2', row: 0, col: 2, type: 'number', value: 3, isGiven: true },
      { id: 'c-0-3', row: 0, col: 3, type: 'equals', value: '=' },
      { id: 'c-0-4', row: 0, col: 4, type: 'empty', solution: 4 },
      { id: 'c-0-5', row: 0, col: 5, type: 'blank' },
      { id: 'c-0-6', row: 0, col: 6, type: 'blank' },

      // Row 1: -    -
      { id: 'c-1-0', row: 1, col: 0, type: 'operator', value: '-' },
      { id: 'c-1-1', row: 1, col: 1, type: 'blank' },
      { id: 'c-1-2', row: 1, col: 2, type: 'blank' },
      { id: 'c-1-3', row: 1, col: 3, type: 'blank' },
      { id: 'c-1-4', row: 1, col: 4, type: 'operator', value: '-' },
      { id: 'c-1-5', row: 1, col: 5, type: 'blank' },
      { id: 'c-1-6', row: 1, col: 6, type: 'blank' },

      // Row 2: 9  2 - [ ] = [ ]
      { id: 'c-2-0', row: 2, col: 0, type: 'number', value: 9, isGiven: true },
      { id: 'c-2-1', row: 2, col: 1, type: 'blank' },
      { id: 'c-2-2', row: 2, col: 2, type: 'number', value: 2, isGiven: true },
      { id: 'c-2-3', row: 2, col: 3, type: 'operator', value: '-' },
      { id: 'c-2-4', row: 2, col: 4, type: 'empty', solution: 1, hasStar: true },
      { id: 'c-2-5', row: 2, col: 5, type: 'equals', value: '=' },
      { id: 'c-2-6', row: 2, col: 6, type: 'empty', solution: 1 },

      // Row 3: =    +
      { id: 'c-3-0', row: 3, col: 0, type: 'equals', value: '=' },
      { id: 'c-3-1', row: 3, col: 1, type: 'blank' },
      { id: 'c-3-2', row: 3, col: 2, type: 'operator', value: '+' },
      { id: 'c-3-3', row: 3, col: 3, type: 'blank' },
      { id: 'c-3-4', row: 3, col: 4, type: 'equals', value: '=' },
      { id: 'c-3-5', row: 3, col: 5, type: 'blank' },
      { id: 'c-3-6', row: 3, col: 6, type: 'blank' },

      // Row 4: [ ] + [ ] = 6
      { id: 'c-4-0', row: 4, col: 0, type: 'empty', solution: 2 },
      { id: 'c-4-1', row: 4, col: 1, type: 'operator', value: '+' },
      { id: 'c-4-2', row: 4, col: 2, type: 'empty', solution: 4 },
      { id: 'c-4-3', row: 4, col: 3, type: 'equals', value: '=' },
      { id: 'c-4-4', row: 4, col: 4, type: 'result', value: 6, hasStar: true },
      { id: 'c-4-5', row: 4, col: 5, type: 'blank' },
      { id: 'c-4-6', row: 4, col: 6, type: 'blank' },

      // Row 5: [ ] + [ ] = 16
      { id: 'c-5-0', row: 5, col: 0, type: 'empty', solution: 5 },
      { id: 'c-5-1', row: 5, col: 1, type: 'operator', value: '+' },
      { id: 'c-5-2', row: 5, col: 2, type: 'empty', solution: 11 },
      { id: 'c-5-3', row: 5, col: 3, type: 'equals', value: '=' },
      { id: 'c-5-4', row: 5, col: 4, type: 'result', value: 16 },
      { id: 'c-5-5', row: 5, col: 5, type: 'blank' },
      { id: 'c-5-6', row: 5, col: 6, type: 'blank' },

      // Row 6: +
      { id: 'c-6-0', row: 6, col: 0, type: 'operator', value: '+' },
      { id: 'c-6-1', row: 6, col: 1, type: 'blank' },
      { id: 'c-6-2', row: 6, col: 2, type: 'blank' },
      { id: 'c-6-3', row: 6, col: 3, type: 'blank' },
      { id: 'c-6-4', row: 6, col: 4, type: 'blank' },
      { id: 'c-6-5', row: 6, col: 5, type: 'blank' },
      { id: 'c-6-6', row: 6, col: 6, type: 'blank' },

      // Row 7: [ ] + [ ] = 3
      { id: 'c-7-0', row: 7, col: 0, type: 'empty', solution: 1 },
      { id: 'c-7-1', row: 7, col: 1, type: 'operator', value: '+' },
      { id: 'c-7-2', row: 7, col: 2, type: 'empty', solution: 2 },
      { id: 'c-7-3', row: 7, col: 3, type: 'equals', value: '=' },
      { id: 'c-7-4', row: 7, col: 4, type: 'result', value: 3 },
      { id: 'c-7-5', row: 7, col: 5, type: 'blank' },
      { id: 'c-7-6', row: 7, col: 6, type: 'blank' },

      // Row 8: 8 - [ ] = 5
      { id: 'c-8-0', row: 8, col: 0, type: 'number', value: 8, isGiven: true },
      { id: 'c-8-1', row: 8, col: 1, type: 'operator', value: '-' },
      { id: 'c-8-2', row: 8, col: 2, type: 'empty', solution: 3, hasStar: true },
      { id: 'c-8-3', row: 8, col: 3, type: 'equals', value: '=' },
      { id: 'c-8-4', row: 8, col: 4, type: 'result', value: 5 },
      { id: 'c-8-5', row: 8, col: 5, type: 'blank' },
      { id: 'c-8-6', row: 8, col: 6, type: 'blank' },
    ]
  }
];

export function getCrossmathLevel(stageNumber = 1): CrossmathPuzzle {
  const match = CROSSMATH_LEVELS.find(l => l.stage === stageNumber);
  return match || CROSSMATH_LEVELS[0];
}


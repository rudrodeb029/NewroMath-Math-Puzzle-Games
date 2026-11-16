import '../models/game_models.dart';

/// Structured diagnostic step displayed in the Quantum Hint Terminal.
class HintStep {
  const HintStep({
    required this.stepNum,
    required this.title,
    required this.badge,
    required this.equation,
    required this.tip,
  });

  final int stepNum;
  final String title;
  final String badge;
  final String equation;
  final String tip;
}

/// Hint generation & next-slot solver utilities for Campaign and Daily puzzles.
class HintSolver {
  HintSolver._();

  /// Builds the 3 step-by-step diagnostic cards shown in the Hint bottom sheet.
  static List<HintStep> buildHintSteps(CrossmathPuzzle puzzle) {
    final slots = puzzle.slots;
    final rows = puzzle.rows;

    String cellVal(CrossmathCell? cell) {
      if (cell == null) return '';
      if (cell.type == CrossmathCellType.blank && cell.slotIndex != null) {
        final found = slots.where((s) => s.slotIndex == cell.slotIndex).firstOrNull;
        return found != null ? '${found.answer}' : '?';
      }
      return cell.value ?? '';
    }

    String? rowEq(int rowIdx) {
      if (rows.length <= rowIdx || rows[rowIdx].length < 5) return null;
      final row = rows[rowIdx];
      final a = cellVal(row[0]);
      final op = row[1].value ?? '';
      final b = cellVal(row[2]);
      final eq = row[3].value ?? '';
      final c = cellVal(row[4]);
      if (a.isEmpty || op.isEmpty || b.isEmpty || eq != '=' || c.isEmpty) {
        return null;
      }
      return '$a $op $b = $c';
    }

    String? colEq(int colIdx) {
      if (rows.length < 5) return null;
      final a = cellVal(rows[0][colIdx]);
      final op = rows[1][colIdx].value ?? '';
      final b = cellVal(rows[2][colIdx]);
      final eq = rows[3][colIdx].value ?? '';
      final c = cellVal(rows[4][colIdx]);
      if (a.isEmpty || op.isEmpty || b.isEmpty || eq != '=' || c.isEmpty) {
        return null;
      }
      return '$a $op $b = $c';
    }

    final row0Eq = rowEq(0) ??
        (puzzle.solvedText.isNotEmpty ? puzzle.solvedText : 'Top Row Balanced');
    final row2Eq = rowEq(2);
    final row4Eq = rowEq(4);
    final col0Eq = colEq(0);

    return [
      HintStep(
        stepNum: 1,
        title: 'Recommended Move • Step 1',
        badge: 'TOP ROW ANCHOR',
        equation: 'Top row: $row0Eq',
        tip:
            'Solve the top horizontal row first to lock in the opening anchor tile.',
      ),
      HintStep(
        stepNum: 2,
        title: 'Recommended Move • Step 2',
        badge: row2Eq != null ? 'CENTER JUNCTION' : 'LEFT COLUMN',
        equation: row2Eq != null
            ? 'Middle row: $row2Eq'
            : (col0Eq != null
                ? 'Left col: $col0Eq'
                : 'Junction intersection balanced'),
        tip:
            'Shared junction tiles must satisfy both horizontal and vertical operations.',
      ),
      HintStep(
        stepNum: 3,
        title: 'Recommended Move • Step 3',
        badge: 'BOTTOM BALANCE',
        equation:
            row4Eq != null ? 'Bottom row: $row4Eq' : 'Final row balanced',
        tip:
            'Place the remaining numbers from your tray to balance the final equation and complete the matrix.',
      ),
    ];
  }

  /// Finds the next unfilled (or incorrect) slot in a Campaign Cross-Math puzzle.
  static CrossmathSlot? findNextUnsolvedSlot(
    CrossmathPuzzle puzzle,
    Map<int, int> currentAnswers,
  ) {
    for (final slot in puzzle.slots) {
      if (!currentAnswers.containsKey(slot.slotIndex)) {
        return slot;
      }
    }
    for (final slot in puzzle.slots) {
      if (currentAnswers[slot.slotIndex] != slot.answer) {
        return slot;
      }
    }
    return null;
  }

  /// Finds the next slot (0..8) in a Daily Challenge puzzle whose placed value
  /// does not yet match [puzzle.answers].
  static int? findNextDailyHintSlot(
    DailyChallengePuzzle puzzle,
    Map<int, int> currentAnswers,
  ) {
    for (var s = 0; s < 9; s++) {
      if (currentAnswers[s] != puzzle.answers[s]) {
        return s;
      }
    }
    return null;
  }
}

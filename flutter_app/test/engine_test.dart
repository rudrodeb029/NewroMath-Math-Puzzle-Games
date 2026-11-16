import 'package:flutter_test/flutter_test.dart';
import 'package:newromath/data/levels_catalog.dart';
import 'package:newromath/engine/crossmath_generator.dart';
import 'package:newromath/engine/daily_generator.dart';
import 'package:newromath/engine/hint_solver.dart';

void main() {
  group('CrossmathGenerator', () {
    test('generates solvable 5x5 puzzles across all 25 levels', () {
      for (var level = 1; level <= 25; level++) {
        final totalStages = getStageCount(level);
        final stageIndices = <int>{0, totalStages ~/ 2, totalStages - 1};
        for (final st in stageIndices) {
          final puzzle = CrossmathGenerator.generateCrossMathPuzzle(
            level,
            seed: st * 1000 + 101,
            stageIndex: st,
          );

          expect(puzzle.rows.length, 5);
          for (final row in puzzle.rows) {
            expect(row.length, 5);
          }
          expect(puzzle.slots, isNotEmpty);

          final solution = <int, int>{
            for (final slot in puzzle.slots) slot.slotIndex: slot.answer,
          };

          // Every slot answer must be present in the tray numbers.
          for (final ans in solution.values) {
            expect(
              puzzle.numbers,
              contains(ans),
              reason: 'Level $level stage $st tray missing answer $ans',
            );
          }

          expect(
            CrossmathGenerator.isPuzzleSolved(puzzle, solution),
            isTrue,
            reason: 'Level $level stage $st failed exact solution check',
          );

          // Partial answers must not solve.
          final partial = Map<int, int>.from(solution)..remove(0);
          expect(CrossmathGenerator.isPuzzleSolved(puzzle, partial), isFalse);

          // Wrong answer must not solve.
          final wrong = Map<int, int>.from(solution);
          wrong[0] = (wrong[0] ?? 0) + 9999;
          expect(CrossmathGenerator.isPuzzleSolved(puzzle, wrong), isFalse);
        }
      }
    });

    test('is deterministic for identical level, seed, and stageIndex', () {
      final a = CrossmathGenerator.generateCrossMathPuzzle(
        12,
        seed: 3101,
        stageIndex: 3,
      );
      final b = CrossmathGenerator.generateCrossMathPuzzle(
        12,
        seed: 3101,
        stageIndex: 3,
      );

      expect(a.id, b.id);
      expect(a.solvedText, b.solvedText);
      expect(a.numbers, b.numbers);
      expect(
        a.slots.map((s) => '${s.row},${s.column}=${s.answer}').toList(),
        b.slots.map((s) => '${s.row},${s.column}=${s.answer}').toList(),
      );
    });

    test('getStageSeedsForLevel avoids duplicate top-row equations', () {
      final seeds = CrossmathGenerator.getStageSeedsForLevel(5);
      expect(seeds.length, getStageCount(5));
      final texts = <String>{};
      for (var st = 0; st < seeds.length; st++) {
        final p = CrossmathGenerator.getMemoizedPuzzle(
          5,
          seed: seeds[st],
          stageIndex: st,
        );
        texts.add(p.solvedText);
      }
      expect(texts.length, seeds.length);
    });
  });

  group('DailyGenerator', () {
    test('is deterministic per calendar date and scales tray length by day', () {
      final p1 = DailyGenerator.generateDailyChallengePuzzle(2026, 11, 16);
      final p2 = DailyGenerator.generateDailyChallengePuzzle(2026, 11, 16);
      final otherDay =
          DailyGenerator.generateDailyChallengePuzzle(2026, 11, 17);

      expect(p1.protocolId, 274 + 16);
      expect(p1.protocolId, p2.protocolId);
      expect(p1.answers, p2.answers);
      expect(p1.trayNumbers, p2.trayNumbers);
      expect(p1.targetAlpha, p2.targetAlpha);
      expect(p1.targetBeta, p2.targetBeta);
      expect(p1.targetGamma, p2.targetGamma);
      expect(p1.targetLink, p2.targetLink);

      expect(otherDay.answers, isNot(equals(p1.answers)));

      // Tray scaling checks across day thresholds
      expect(
        DailyGenerator.generateDailyChallengePuzzle(2026, 11, 3)
            .trayNumbers
            .length,
        10,
      );
      expect(
        DailyGenerator.generateDailyChallengePuzzle(2026, 11, 10)
            .trayNumbers
            .length,
        11,
      );
      expect(
        DailyGenerator.generateDailyChallengePuzzle(2026, 11, 16)
            .trayNumbers
            .length,
        12,
      );
      expect(
        DailyGenerator.generateDailyChallengePuzzle(2026, 11, 22)
            .trayNumbers
            .length,
        13,
      );
      expect(
        DailyGenerator.generateDailyChallengePuzzle(2026, 11, 29)
            .trayNumbers
            .length,
        14,
      );
    });

    test('validates daily puzzle solution accurately', () {
      final puzzle = DailyGenerator.generateDailyChallengePuzzle(2026, 11, 16);
      expect(puzzle.answers.length, 9);
      for (final val in puzzle.answers.values) {
        expect(puzzle.trayNumbers, contains(val));
      }

      expect(
        DailyGenerator.isDailyPuzzleSolved(puzzle, puzzle.answers),
        isTrue,
      );

      final incomplete = Map<int, int>.from(puzzle.answers)..remove(4);
      expect(DailyGenerator.isDailyPuzzleSolved(puzzle, incomplete), isFalse);

      final wrong = Map<int, int>.from(puzzle.answers);
      wrong[4] = (wrong[4] ?? 0) + 100;
      expect(DailyGenerator.isDailyPuzzleSolved(puzzle, wrong), isFalse);
    });
  });

  group('HintSolver', () {
    test('builds 3 steps and finds next unsolved slot for campaign & daily', () {
      final puzzle = CrossmathGenerator.generateCrossMathPuzzle(
        3,
        seed: 101,
        stageIndex: 0,
      );
      final steps = HintSolver.buildHintSteps(puzzle);
      expect(steps.length, 3);
      expect(steps[0].stepNum, 1);

      final answers = <int, int>{};
      final firstHint = HintSolver.findNextUnsolvedSlot(puzzle, answers);
      expect(firstHint, isNotNull);
      expect(firstHint!.slotIndex, 0);

      for (final slot in puzzle.slots) {
        answers[slot.slotIndex] = slot.answer;
      }
      expect(HintSolver.findNextUnsolvedSlot(puzzle, answers), isNull);

      final daily = DailyGenerator.generateDailyChallengePuzzle(2026, 11, 16);
      final dailyAnswers = <int, int>{0: daily.answers[0]!};
      expect(HintSolver.findNextDailyHintSlot(daily, dailyAnswers), 1);
      expect(HintSolver.findNextDailyHintSlot(daily, daily.answers), isNull);
    });
  });
}

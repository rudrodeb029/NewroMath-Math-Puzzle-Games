import 'dart:collection';

import '../data/levels_catalog.dart';
import '../models/game_models.dart';

/// Procedural 5x5 Cross-Math puzzle generator (+, −, ×, ÷) with progressive
/// difficulty scaling across levels (1-25) and stages within each level.
class CrossmathGenerator {
  CrossmathGenerator._();

  static final LinkedHashMap<String, CrossmathPuzzle> _puzzleCache =
      LinkedHashMap<String, CrossmathPuzzle>();
  static final Map<int, List<int>> _levelStageSeedsCache = {};

  /// Computes the dynamic difficulty profile for [levelNum] at [stageIndex].
  static StageDifficultyProfile getStageDifficultyProfile(
    int levelNum, {
    int stageIndex = 0,
    int? totalStages,
  }) {
    final lvl = levelNum.clamp(1, 25);
    final total = totalStages ?? getStageCount(lvl);
    final st = stageIndex.clamp(0, total > 0 ? total - 1 : 0);
    final progress = total > 1 ? st / (total - 1) : 0.0;

    final String tierName;
    final String mode;
    final int blankCount;
    final int trayCount;
    final int minVal;
    final int maxVal;
    var minM = 2;
    var maxM = 5;
    var minD = 2;
    var maxD = 3;

    if (lvl == 1) {
      if (progress < 0.35) {
        tierName = 'INTRO ✦';
        mode = 'add';
        blankCount = 3;
        trayCount = 5;
        minVal = 1;
        maxVal = 6;
      } else if (progress < 0.70) {
        tierName = 'WARM-UP ⚡';
        mode = (st % 2 == 0) ? 'add' : 'sub';
        blankCount = (st <= 5) ? 3 : 4;
        trayCount = 6;
        minVal = 2;
        maxVal = 9;
      } else {
        tierName = 'LEVEL FINALE 🔥';
        mode = (st % 2 == 0) ? 'sub' : 'add';
        blankCount = 4;
        trayCount = 7;
        minVal = 3;
        maxVal = 14;
      }
    } else if (lvl <= 5) {
      if (progress < 0.35) {
        tierName = 'NOVICE ✦';
        mode = (st % 2 == 0) ? 'add' : 'sub';
        blankCount = 4;
        trayCount = 6;
        minVal = 2;
        maxVal = 10;
      } else if (progress < 0.75) {
        tierName = 'TACTICAL ⚡';
        mode = (st % 3 == 0)
            ? 'mul'
            : (st % 3 == 1)
                ? 'sub'
                : 'add';
        blankCount = (st % 2 == 0) ? 4 : 5;
        trayCount = 7;
        minVal = 3;
        maxVal = 16;
        minM = 2;
        maxM = 4;
      } else {
        tierName = 'SECTOR BOSS 🔥';
        mode = (st % 2 == 0) ? 'mul' : 'sub_both';
        blankCount = 5;
        trayCount = 8;
        minVal = 4;
        maxVal = 20;
        minM = 2;
        maxM = 5;
      }
    } else if (lvl <= 10) {
      if (progress < 0.30) {
        tierName = 'ADEPT ✦';
        mode = (st % 3 == 0)
            ? 'add'
            : (st % 3 == 1)
                ? 'sub'
                : 'mul';
        blankCount = (st % 2 == 0) ? 4 : 5;
        trayCount = 7;
        minVal = 4;
        maxVal = 18;
        minM = 2;
        maxM = 5;
      } else if (progress < 0.70) {
        tierName = 'OPERATOR ⚡';
        mode = (st % 4 == 0)
            ? 'div'
            : (st % 4 == 1)
                ? 'mul'
                : (st % 4 == 2)
                    ? 'sub_both'
                    : 'add';
        blankCount = 5;
        trayCount = 8;
        minVal = 5;
        maxVal = 24;
        minM = 2;
        maxM = 6;
        minD = 2;
        maxD = 3;
      } else {
        tierName = 'MATRIX BOSS 🔥';
        mode = (st % 3 == 0)
            ? 'div'
            : (st % 3 == 1)
                ? 'mul_div'
                : 'mul';
        blankCount = 5;
        trayCount = 9;
        minVal = 6;
        maxVal = 30;
        minM = 3;
        maxM = 6;
        minD = 2;
        maxD = 4;
      }
    } else if (lvl <= 17) {
      if (progress < 0.30) {
        tierName = 'SPECIALIST ⚡';
        mode = (st % 4 == 0)
            ? 'mul'
            : (st % 4 == 1)
                ? 'div'
                : (st % 4 == 2)
                    ? 'sub'
                    : 'add';
        blankCount = 5;
        trayCount = 8;
        minVal = 6;
        maxVal = 28;
        minM = 3;
        maxM = 6;
        minD = 2;
        maxD = 3;
      } else if (progress < 0.75) {
        tierName = 'VANGUARD 🔥';
        mode = (st % 4 == 0)
            ? 'mul_div'
            : (st % 4 == 1)
                ? 'div_mul'
                : (st % 4 == 2)
                    ? 'div'
                    : 'mul';
        blankCount = (st % 2 == 0) ? 5 : 6;
        trayCount = 9;
        minVal = 8;
        maxVal = 35;
        minM = 3;
        maxM = 7;
        minD = 2;
        maxD = 4;
      } else {
        tierName = 'TRIAL OVERLORD 💀';
        mode = (st % 3 == 0)
            ? 'mul_div'
            : (st % 3 == 1)
                ? 'div_mul'
                : 'div';
        blankCount = 6;
        trayCount = 10;
        minVal = 10;
        maxVal = 45;
        minM = 3;
        maxM = 8;
        minD = 2;
        maxD = 4;
      }
    } else {
      if (progress < 0.30) {
        tierName = 'MASTER ⚡';
        mode = (st % 4 == 0)
            ? 'mul'
            : (st % 4 == 1)
                ? 'div'
                : (st % 4 == 2)
                    ? 'mul_div'
                    : 'sub_both';
        blankCount = 5;
        trayCount = 9;
        minVal = 10;
        maxVal = 40;
        minM = 3;
        maxM = 7;
        minD = 2;
        maxD = 4;
      } else if (progress < 0.80) {
        tierName = 'GRANDMASTER 🔥';
        mode = (st % 4 == 0)
            ? 'mul_div'
            : (st % 4 == 1)
                ? 'div_mul'
                : (st % 4 == 2)
                    ? 'div'
                    : 'mul';
        blankCount = 6;
        trayCount = 10;
        minVal = 12;
        maxVal = 55;
        minM = 3;
        maxM = 8;
        minD = 2;
        maxD = 5;
      } else {
        tierName = 'APEX BOSS 👑';
        mode = (st % 3 == 0)
            ? 'mul_div'
            : (st % 3 == 1)
                ? 'div_mul'
                : 'div';
        blankCount = 6;
        trayCount = (lvl == 25 && progress >= 0.90) ? 12 : 11;
        minVal = 15;
        maxVal = 70;
        minM = 4;
        maxM = 9;
        minD = 3;
        maxD = 5;
      }
    }

    return StageDifficultyProfile(
      tierName: tierName,
      mode: mode,
      blankCount: blankCount,
      trayCount: trayCount,
      minVal: minVal,
      maxVal: maxVal,
      minM: minM,
      maxM: maxM,
      minD: minD,
      maxD: maxD,
      progress: progress,
    );
  }

  /// Deterministically generates a 5x5 Cross-Math puzzle for [levelNum],
  /// [seed], and [stageIndex].
  static CrossmathPuzzle generateCrossMathPuzzle(
    int levelNum, {
    int seed = 0,
    int stageIndex = -1,
  }) {
    final lvl = levelNum.clamp(1, 25);
    final totalStages = getStageCount(lvl);
    final derivedStage =
        stageIndex >= 0 ? stageIndex : (seed >= 1000 ? seed ~/ 1000 : 0);
    final st = derivedStage.clamp(0, totalStages - 1);
    final profile = getStageDifficultyProfile(
      lvl,
      stageIndex: st,
      totalStages: totalStages,
    );

    var s = (lvl * 7919 + seed * 9973 + (st + 1) * 31337 + 12345).abs() % 233280;
    int rnd(int min, int max) {
      s = (s * 9301 + 49297) % 233280;
      final r = s / 233280.0;
      return (min + r * (max - min + 1)).floor().clamp(min, max);
    }

    final mode = profile.mode;
    var x = 0, y = 0, z = 0, a = 0, b = 0, c = 0, d = 0, e = 0, f = 0;
    var opH = '+';
    var opV = '+';
    var valMap = <String, int>{};

    var attempts = 0;
    while (attempts < 60) {
      attempts++;
      if (mode == 'mul') {
        opH = '×';
        opV = '×';
        x = rnd(profile.minM, profile.maxM);
        y = rnd(profile.minM, profile.maxM);
        a = rnd(profile.minM, profile.maxM);
        b = rnd(profile.minM, profile.maxM);
        z = x * y;
        c = a * b;
        d = x * a;
        e = y * b;
        f = z * c;
      } else if (mode == 'div') {
        opH = '÷';
        opV = '÷';
        b = rnd(profile.minD, profile.maxD);
        c = rnd(profile.minD, profile.maxD);
        a = b * c;

        e = rnd(profile.minD, profile.maxD);
        f = rnd(profile.minD, profile.maxD);
        d = e * f;

        z = c * f;
        y = b * e;
        x = a * d;
      } else if (mode == 'mul_div') {
        opH = '×';
        opV = '÷';
        a = rnd(profile.minD, profile.maxD);
        d = rnd(profile.minD, profile.maxD);
        x = a * d;

        b = rnd(profile.minD, profile.maxD);
        e = rnd(profile.minD, profile.maxD);
        y = b * e;

        z = x * y;
        c = a * b;
        f = d * e;
      } else if (mode == 'div_mul') {
        opH = '÷';
        opV = '×';
        y = rnd(profile.minD, profile.maxD);
        z = rnd(profile.minD, profile.maxD);
        x = y * z;

        b = rnd(profile.minD, profile.maxD);
        c = rnd(profile.minD, profile.maxD);
        a = b * c;

        d = x * a;
        e = y * b;
        f = z * c;
      } else if (mode == 'sub') {
        opH = '−';
        opV = '+';
        y = rnd(profile.minVal, profile.maxVal);
        z = rnd(profile.minVal, profile.maxVal);
        x = y + z;

        b = rnd(profile.minVal, profile.maxVal);
        c = rnd(profile.minVal, profile.maxVal);
        a = b + c;

        d = x + a;
        e = y + b;
        f = z + c;
      } else if (mode == 'sub_both') {
        opH = '+';
        opV = '−';
        a = rnd(profile.minVal, profile.maxVal);
        d = rnd(profile.minVal, profile.maxVal);
        x = a + d;

        b = rnd(profile.minVal, profile.maxVal);
        e = rnd(profile.minVal, profile.maxVal);
        y = b + e;

        z = x + y;
        c = a + b;
        f = d + e;
      } else {
        opH = '+';
        opV = '+';
        x = rnd(profile.minVal, profile.maxVal);
        y = rnd(profile.minVal, profile.maxVal);
        a = rnd(profile.minVal, profile.maxVal);
        b = rnd(profile.minVal, profile.maxVal);
        z = x + y;
        c = a + b;
        d = x + a;
        e = y + b;
        f = z + c;
      }

      valMap = {
        '0,0': x,
        '0,2': y,
        '0,4': z,
        '2,0': a,
        '2,2': b,
        '2,4': c,
        '4,0': d,
        '4,2': e,
        '4,4': f,
      };

      if (valMap.values.toSet().length >= profile.blankCount) {
        break;
      }
    }

    final allPos = [
      '0,0',
      '0,2',
      '0,4',
      '2,0',
      '2,2',
      '2,4',
      '4,0',
      '4,2',
      '4,4',
    ];
    for (var i = allPos.length - 1; i > 0; i--) {
      final j = rnd(0, i);
      final temp = allPos[i];
      allPos[i] = allPos[j];
      allPos[j] = temp;
    }

    var blankKeys = <String>[];
    final chosenValues = <int>{};

    var preferredSets = <List<String>>[];
    if (profile.blankCount == 3) {
      preferredSets = [
        ['0,0', '2,2', '4,2'],
        ['0,2', '2,0', '4,0'],
        ['0,0', '2,4', '4,2'],
        ['0,2', '2,2', '4,4'],
        ['2,0', '2,2', '2,4'],
      ];
    } else if (profile.blankCount == 4) {
      preferredSets = [
        ['0,0', '0,2', '2,2', '4,2'],
        ['0,2', '2,0', '2,4', '4,0'],
        ['0,0', '2,0', '2,2', '4,4'],
      ];
    }

    for (final set in preferredSets) {
      final vals = set.map((k) => valMap[k]!).toList();
      if (vals.toSet().length == set.length) {
        blankKeys = List<String>.from(set);
        chosenValues.addAll(vals);
        break;
      }
    }

    if (blankKeys.length < profile.blankCount) {
      blankKeys = [];
      chosenValues.clear();
      for (final pos in allPos) {
        final v = valMap[pos]!;
        if (chosenValues.add(v)) {
          blankKeys.add(pos);
          if (blankKeys.length == profile.blankCount) break;
        }
      }
    }

    if (blankKeys.length < profile.blankCount) {
      for (final pos in allPos) {
        if (!blankKeys.contains(pos)) {
          blankKeys.add(pos);
          if (blankKeys.length == profile.blankCount) break;
        }
      }
    }

    final slots = <CrossmathSlot>[];
    final slotIndices = <String, int>{};
    for (var idx = 0; idx < blankKeys.length; idx++) {
      final key = blankKeys[idx];
      final parts = key.split(',');
      final r = int.parse(parts[0]);
      final cCol = int.parse(parts[1]);
      slots.add(CrossmathSlot(
        slotIndex: idx,
        row: r,
        column: cCol,
        answer: valMap[key]!,
      ));
      slotIndices[key] = idx;
    }

    CrossmathCell buildNumberOrBlankCell(int r, int cCol) {
      final key = '$r,$cCol';
      final slotIdx = slotIndices[key];
      final val = valMap[key]!;
      if (slotIdx != null) {
        return CrossmathCell(
          id: '$r-$cCol',
          row: r,
          col: cCol,
          type: CrossmathCellType.blank,
          solution: val,
          isGiven: false,
          slotIndex: slotIdx,
        );
      }
      final isResult = (r == 4 || cCol == 4);
      return CrossmathCell(
        id: '$r-$cCol',
        row: r,
        col: cCol,
        type: isResult ? CrossmathCellType.result : CrossmathCellType.number,
        value: '$val',
        solution: val,
        isGiven: true,
      );
    }

    CrossmathCell opCell(int r, int cCol, String symbol) => CrossmathCell(
          id: '$r-$cCol',
          row: r,
          col: cCol,
          type: symbol == '='
              ? CrossmathCellType.equals
              : CrossmathCellType.operatorSymbol,
          value: symbol,
          isGiven: true,
        );

    CrossmathCell emptyCell(int r, int cCol) => CrossmathCell(
          id: '$r-$cCol',
          row: r,
          col: cCol,
          type: CrossmathCellType.empty,
          isGiven: true,
        );

    final rows = <List<CrossmathCell>>[
      [
        buildNumberOrBlankCell(0, 0),
        opCell(0, 1, opH),
        buildNumberOrBlankCell(0, 2),
        opCell(0, 3, '='),
        buildNumberOrBlankCell(0, 4),
      ],
      [
        opCell(1, 0, opV),
        emptyCell(1, 1),
        opCell(1, 2, opV),
        emptyCell(1, 3),
        opCell(1, 4, opV),
      ],
      [
        buildNumberOrBlankCell(2, 0),
        opCell(2, 1, opH),
        buildNumberOrBlankCell(2, 2),
        opCell(2, 3, '='),
        buildNumberOrBlankCell(2, 4),
      ],
      [
        opCell(3, 0, '='),
        emptyCell(3, 1),
        opCell(3, 2, '='),
        emptyCell(3, 3),
        opCell(3, 4, '='),
      ],
      [
        buildNumberOrBlankCell(4, 0),
        opCell(4, 1, opH),
        buildNumberOrBlankCell(4, 2),
        opCell(4, 3, '='),
        buildNumberOrBlankCell(4, 4),
      ],
    ];

    final answers = slots.map((slot) => slot.answer).toList();
    final targetNumbersCount = profile.trayCount;
    final numbersSet = <int>{...answers};

    final secondAns = answers.length > 1 ? answers[1] : answers[0];
    final thirdAns = answers.length > 2 ? answers[2] : answers[0];
    final lastAns = answers.last;

    int clampPos(int value) => value < 1 ? 1 : value;

    final distractorCandidates = <int>[
      clampPos(answers[0] + (rnd(0, 1) == 0 ? 1 : -1)),
      clampPos(secondAns + (rnd(0, 1) == 0 ? 2 : -2)),
      clampPos(thirdAns + rnd(1, 4)),
      clampPos(answers[0] + rnd(3, 7)),
      clampPos(lastAns + (rnd(0, 1) == 0 ? 3 : -3)),
      clampPos(secondAns + (rnd(0, 1) == 0 ? 4 : -4)),
      clampPos(thirdAns + (rnd(0, 1) == 0 ? 5 : -5)),
      clampPos(answers[0] + rnd(4, 9)),
      clampPos(lastAns + rnd(2, 6)),
      clampPos(((answers[0] + secondAns) / 2).round()),
      clampPos(answers[0] + 10),
      clampPos(lastAns + 10),
    ];

    for (final distractor in distractorCandidates) {
      if (numbersSet.length < targetNumbersCount) {
        numbersSet.add(distractor);
      }
    }

    var padAttempt = 0;
    var padCandidate = 1;
    final padMax = profile.maxVal * 2 < 30 ? 30 : profile.maxVal * 2;
    while (numbersSet.length < targetNumbersCount && padAttempt < 150) {
      padAttempt++;
      final fallbackNum = rnd(1, padMax);
      if (!numbersSet.contains(fallbackNum)) {
        numbersSet.add(fallbackNum);
      } else {
        while (numbersSet.contains(padCandidate)) {
          padCandidate++;
        }
        numbersSet.add(padCandidate);
      }
    }

    final numbers = numbersSet.toList();
    for (var i = numbers.length - 1; i > 0; i--) {
      final j = rnd(0, i);
      final temp = numbers[i];
      numbers[i] = numbers[j];
      numbers[j] = temp;
    }

    return CrossmathPuzzle(
      id: 'puzzle_${lvl}_${st}_$seed',
      seed: seed,
      cols: 5,
      rowsCount: 5,
      level: lvl,
      stage: st + 1,
      totalStages: totalStages,
      stageDifficulty: profile.tierName,
      solvedText: '$x $opH $y = $z',
      hintStep: 'Top row: $x $opH $y = $z',
      slots: List<CrossmathSlot>.unmodifiable(slots),
      rows: List<List<CrossmathCell>>.unmodifiable(
        rows.map((r) => List<CrossmathCell>.unmodifiable(r)),
      ),
      numbers: List<int>.unmodifiable(numbers),
    );
  }

  /// Returns a memoized puzzle from an LRU cache of up to 300 entries.
  static CrossmathPuzzle getMemoizedPuzzle(
    int levelNum, {
    int seed = 0,
    int stageIndex = -1,
  }) {
    final sIdx =
        stageIndex >= 0 ? stageIndex : (seed >= 1000 ? seed ~/ 1000 : 0);
    final key = '${levelNum}_${seed}_$sIdx';
    final existing = _puzzleCache[key];
    if (existing != null) return existing;

    final result = generateCrossMathPuzzle(
      levelNum,
      seed: seed,
      stageIndex: sIdx,
    );
    if (_puzzleCache.length >= 300) {
      _puzzleCache.remove(_puzzleCache.keys.first);
    }
    _puzzleCache[key] = result;
    return result;
  }

  /// Generates unique per-stage seeds for [levelNum] so no stage repeats the
  /// same top-row equation.
  static List<int> getStageSeedsForLevel(int levelNum) {
    final cached = _levelStageSeedsCache[levelNum];
    if (cached != null) return cached;

    final total = getStageCount(levelNum);
    final seen = <String>{};
    final seeds = <int>[];
    for (var st = 0; st < total; st++) {
      var seed = st * 1000 + 101;
      var guard = 0;
      while (guard < 40) {
        final text = getMemoizedPuzzle(
          levelNum,
          seed: seed,
          stageIndex: st,
        ).solvedText;
        if (seen.add(text)) break;
        seed += 1;
        guard += 1;
      }
      seeds.add(seed);
    }
    final result = List<int>.unmodifiable(seeds);
    _levelStageSeedsCache[levelNum] = result;
    return result;
  }

  /// Checks whether every slot in [puzzle] has its exact expected answer, or
  /// evaluates all 6 intersecting equations (rows 0/2/4, cols 0/2/4) so any
  /// mathematically valid solution is accepted.
  static bool isPuzzleSolved(CrossmathPuzzle puzzle, Map<int, int> answers) {
    if (puzzle.slots.isEmpty) return false;
    for (final slot in puzzle.slots) {
      if (!answers.containsKey(slot.slotIndex)) return false;
    }

    // Fast exact match check first.
    var exact = true;
    for (final slot in puzzle.slots) {
      if (answers[slot.slotIndex] != slot.answer) {
        exact = false;
        break;
      }
    }
    if (exact) return true;

    // Fallback: evaluate all 3 horizontal & 3 vertical equations so alternative
    // valid placements (if commutative) are also recognized accurately.
    if (puzzle.rows.length < 5) return false;
    int? cellVal(int r, int c) {
      final cell = puzzle.rows[r][c];
      if (cell.type == CrossmathCellType.blank && cell.slotIndex != null) {
        return answers[cell.slotIndex!];
      }
      return int.tryParse(cell.value ?? '');
    }

    bool evalTriplet(int a, String op, int b, int target) {
      switch (op) {
        case '+':
          return a + b == target;
        case '−':
        case '-':
          return a - b == target;
        case '×':
        case '*':
          return a * b == target;
        case '÷':
        case '/':
          return b != 0 && a % b == 0 && a ~/ b == target;
        default:
          return false;
      }
    }

    for (final r in const [0, 2, 4]) {
      final a = cellVal(r, 0);
      final b = cellVal(r, 2);
      final res = cellVal(r, 4);
      final op = puzzle.rows[r][1].value ?? '';
      if (a == null || b == null || res == null || !evalTriplet(a, op, b, res)) {
        return false;
      }
    }

    for (final c in const [0, 2, 4]) {
      final a = cellVal(0, c);
      final b = cellVal(2, c);
      final res = cellVal(4, c);
      final op = puzzle.rows[1][c].value ?? '';
      if (a == null || b == null || res == null || !evalTriplet(a, op, b, res)) {
        return false;
      }
    }

    return true;
  }
}

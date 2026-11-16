import '../models/game_models.dart';

/// Deterministic Daily Challenge 3x3 interconnected matrix puzzle generator.
///
/// Matches the exact calendar-seeded algorithm in `src/legacyApp.jsx`
/// (`generateDailyChallengePuzzle`).
class DailyGenerator {
  DailyGenerator._();

  static const List<DailyEquationTemplate> _rowTemplates = [
    DailyEquationTemplate(id: 'mul_add', op1: '×', op2: '+'),
    DailyEquationTemplate(id: 'add_mul', op1: '+', op2: '×'),
    DailyEquationTemplate(id: 'mul_sub', op1: '×', op2: '−'),
    DailyEquationTemplate(id: 'sub_mul', op1: '−', op2: '×'),
    DailyEquationTemplate(id: 'add_add', op1: '+', op2: '+'),
    DailyEquationTemplate(id: 'add_sub', op1: '+', op2: '−'),
  ];

  /// Deterministically generates the Daily Challenge puzzle for [year], [month]
  /// (1..12), and [day] (1..31).
  static DailyChallengePuzzle generateDailyChallengePuzzle(
    int year,
    int month,
    int day,
  ) {
    var seed = ((year * 10000 + month * 100 + day) * 2654435761) & 0xFFFFFFFF;
    int rnd(int min, int max) {
      seed = (seed * 1664525 + 1013904223) & 0xFFFFFFFF;
      final span = max - min + 1;
      if (span <= 0) return min;
      return min + (seed % span);
    }

    final idx1 = (day * 2 + month) % _rowTemplates.length;
    final idx2 = (idx1 + 2) % _rowTemplates.length;
    final idx3 = (idx1 + 4) % _rowTemplates.length;

    final rowAlpha = _rowTemplates[idx1];
    final rowBeta = _rowTemplates[idx2];
    final rowGamma = _rowTemplates[idx3];

    final used = <int>{};
    int pickUnique(int min, int max) {
      final safeMax = max < min ? min : max;
      for (var attempt = 0; attempt < 80; attempt++) {
        final val = rnd(min, safeMax);
        if (used.add(val)) return val;
      }
      for (var v = min; v <= 40; v++) {
        if (used.add(v)) return v;
      }
      var fallback = 1;
      while (!used.add(fallback)) {
        fallback++;
      }
      return fallback;
    }

    List<int> genTriplet(DailyEquationTemplate tmpl) {
      int x, y, z;
      if (tmpl.id == 'mul_add') {
        x = pickUnique(2, 9);
        y = pickUnique(2, 8);
        z = pickUnique(1, 14);
      } else if (tmpl.id == 'add_mul') {
        x = pickUnique(2, 8);
        y = pickUnique(2, 7);
        z = pickUnique(2, 6);
      } else if (tmpl.id == 'mul_sub') {
        x = pickUnique(3, 9);
        y = pickUnique(3, 8);
        final upper = ((x * y) - 3).clamp(2, 12);
        z = pickUnique(1, upper);
      } else if (tmpl.id == 'sub_mul') {
        x = pickUnique(5, 14);
        final yMax = (x - 2) < 2 ? 2 : (x - 2);
        y = pickUnique(1, yMax);
        if (x < y) {
          final tmp = x;
          x = y;
          y = tmp;
        }
        z = pickUnique(2, 6);
      } else if (tmpl.id == 'add_add') {
        x = pickUnique(3, 14);
        y = pickUnique(2, 12);
        z = pickUnique(2, 11);
      } else {
        x = pickUnique(4, 14);
        y = pickUnique(3, 12);
        final upper = ((x + y) - 3).clamp(2, 10);
        z = pickUnique(1, upper);
      }
      return [x, y, z];
    }

    final alpha = genTriplet(rowAlpha);
    final beta = genTriplet(rowBeta);
    final gamma = genTriplet(rowGamma);

    final a = alpha[0], b = alpha[1], c = alpha[2];
    final d = beta[0], e = beta[1], f = beta[2];
    final g = gamma[0], h = gamma[1], i = gamma[2];

    final targetAlpha = rowAlpha.evaluate(a, b, c);
    final targetBeta = rowBeta.evaluate(d, e, f);
    final targetGamma = rowGamma.evaluate(g, h, i);

    final linkTemplates = <DailyEquationTemplate>[];
    if (b + e > h) {
      linkTemplates.add(const DailyEquationTemplate(id: 'add_sub', op1: '+', op2: '−'));
    }
    if (b > e) {
      linkTemplates.add(const DailyEquationTemplate(id: 'sub_add', op1: '−', op2: '+'));
    }
    linkTemplates.add(const DailyEquationTemplate(id: 'add_add', op1: '+', op2: '+'));
    if (b * e > h && b * e <= 35) {
      linkTemplates.add(const DailyEquationTemplate(id: 'mul_sub', op1: '×', op2: '−'));
    }
    if (b * e + h <= 45) {
      linkTemplates.add(const DailyEquationTemplate(id: 'mul_add', op1: '×', op2: '+'));
    }

    final colLink = linkTemplates[(day * 3 + month) % linkTemplates.length];
    final targetLink = colLink.evaluate(b, e, h);

    final answers = <int, int>{
      0: a,
      1: b,
      2: c,
      3: d,
      4: e,
      5: f,
      6: g,
      7: h,
      8: i,
    };

    int clampPos(int value) => value < 1 ? 1 : value;

    final distractors = <int>[
      a + rnd(1, 3),
      clampPos(d + (rnd(0, 1) == 1 ? 2 : -2)),
      clampPos(g + (rnd(0, 1) == 1 ? 1 : -1)),
      clampPos(b + (rnd(0, 1) == 1 ? 3 : -3)),
      clampPos(e + rnd(2, 5)),
      clampPos(h + (rnd(0, 1) == 1 ? 2 : -2)),
    ];

    int targetDailyTrayCount = 10;
    if (day >= 28) {
      targetDailyTrayCount = 14;
    } else if (day >= 21) {
      targetDailyTrayCount = 13;
    } else if (day >= 14) {
      targetDailyTrayCount = 12;
    } else if (day >= 7) {
      targetDailyTrayCount = 11;
    }

    final traySet = <int>{a, b, c, d, e, f, g, h, i};
    for (final dist in distractors) {
      if (traySet.length < targetDailyTrayCount) {
        traySet.add(dist);
      }
    }

    var fallbackSeed = 1;
    var padGuard = 0;
    while (traySet.length < targetDailyTrayCount && padGuard < 150) {
      padGuard++;
      final candidate = rnd(1, 45);
      if (!traySet.contains(candidate)) {
        traySet.add(candidate);
      } else {
        while (traySet.contains(fallbackSeed)) {
          fallbackSeed++;
        }
        traySet.add(fallbackSeed);
      }
    }

    final trayNumbers = traySet.toList()..sort();

    return DailyChallengePuzzle(
      year: year,
      month: month,
      day: day,
      protocolId: 274 + day,
      difficulty: 'TACTICAL ⚡',
      rowAlpha: rowAlpha,
      rowBeta: rowBeta,
      rowGamma: rowGamma,
      colLink: colLink,
      targetAlpha: targetAlpha,
      targetBeta: targetBeta,
      targetGamma: targetGamma,
      targetLink: targetLink,
      answers: Map<int, int>.unmodifiable(answers),
      trayNumbers: List<int>.unmodifiable(trayNumbers),
    );
  }

  /// Evaluates whether all 3 rows and the middle resonance column satisfy their
  /// target values in [puzzle] for the user's [answers].
  static bool isDailyPuzzleSolved(
    DailyChallengePuzzle puzzle,
    Map<int, int> answers,
  ) {
    for (var idx = 0; idx < 9; idx++) {
      if (!answers.containsKey(idx)) return false;
    }
    final n0 = answers[0]!, n1 = answers[1]!, n2 = answers[2]!;
    final n3 = answers[3]!, n4 = answers[4]!, n5 = answers[5]!;
    final n6 = answers[6]!, n7 = answers[7]!, n8 = answers[8]!;

    return puzzle.rowAlpha.evaluate(n0, n1, n2) == puzzle.targetAlpha &&
        puzzle.rowBeta.evaluate(n3, n4, n5) == puzzle.targetBeta &&
        puzzle.rowGamma.evaluate(n6, n7, n8) == puzzle.targetGamma &&
        puzzle.colLink.evaluate(n1, n4, n7) == puzzle.targetLink;
  }
}

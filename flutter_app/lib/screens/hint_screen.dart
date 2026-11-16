import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';

/// Quantum Hint Terminal Bottom-Sheet Screen (3 Interactive Steps).
///
/// Mirrors `renderHintScreen` in `src/legacyApp.jsx` with dynamic row/column
/// equation extraction from `activePuzzle`, interactive 3-dot pagination, and
/// optional one-slot reveal via `GameController.useHint()`.
class HintScreen extends StatefulWidget {
  const HintScreen({super.key});

  @override
  State<HintScreen> createState() => _HintScreenState();
}

class _HintScreenState extends State<HintScreen> {
  int _activeStep = 0;

  String _cellValue(CrossmathCell cell, List<CrossmathSlot> slots) {
    if (cell.type == CrossmathCellType.empty) return '';
    if (cell.type == CrossmathCellType.blank) {
      final slotIdx = cell.slotIndex;
      if (slotIdx == null) return '?';
      final match = slots.where((s) => s.slotIndex == slotIdx).firstOrNull;
      return match != null ? '${match.answer}' : '?';
    }
    return cell.value ?? '';
  }

  String? _rowEquation(
    List<List<CrossmathCell>> rows,
    int rowIdx,
    List<CrossmathSlot> slots,
    String divSym,
  ) {
    if (rowIdx >= rows.length) return null;
    final row = rows[rowIdx];
    if (row.length < 5) return null;
    final a = _cellValue(row[0], slots);
    final rawOp = row[1].value ?? '';
    final op = rawOp == '÷' ? divSym : rawOp;
    final b = _cellValue(row[2], slots);
    final eq = row[3].value ?? '';
    final c = _cellValue(row[4], slots);
    if (a.isEmpty || op.isEmpty || b.isEmpty || eq != '=' || c.isEmpty) {
      return null;
    }
    return '$a $op $b = $c';
  }

  String? _colEquation(
    List<List<CrossmathCell>> rows,
    int colIdx,
    List<CrossmathSlot> slots,
    String divSym,
  ) {
    if (rows.length < 5) return null;
    if (rows.any((r) => colIdx >= r.length)) return null;
    final a = _cellValue(rows[0][colIdx], slots);
    final rawOp = rows[1][colIdx].value ?? '';
    final op = rawOp == '÷' ? divSym : rawOp;
    final b = _cellValue(rows[2][colIdx], slots);
    final eq = rows[3][colIdx].value ?? '';
    final c = _cellValue(rows[4][colIdx], slots);
    if (a.isEmpty || op.isEmpty || b.isEmpty || eq != '=' || c.isEmpty) {
      return null;
    }
    return '$a $op $b = $c';
  }

  @override
  Widget build(BuildContext context) {
    final game = context.watch<GameController>();
    final puzzle = game.activePuzzle;
    final divSym = game.settings.divisionSymbol;

    final row0Eq =
        _rowEquation(puzzle.rows, 0, puzzle.slots, divSym) ??
        (puzzle.solvedText.isNotEmpty ? puzzle.solvedText : 'Top Row Balanced');
    final row2Eq = _rowEquation(puzzle.rows, 2, puzzle.slots, divSym);
    final row4Eq = _rowEquation(puzzle.rows, 4, puzzle.slots, divSym);
    final col0Eq = _colEquation(puzzle.rows, 0, puzzle.slots, divSym);

    final hintSteps = [
      _HintStepData(
        title: 'Recommended Move • Step 1',
        badge: 'TOP ROW ANCHOR',
        equation: 'Top row: $row0Eq',
        tip:
            'Solve the top horizontal row first to lock in the opening anchor tile.',
      ),
      _HintStepData(
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
      _HintStepData(
        title: 'Recommended Move • Step 3',
        badge: 'BOTTOM BALANCE',
        equation: row4Eq != null
            ? 'Bottom row: $row4Eq'
            : 'Final row balanced',
        tip:
            'Place the remaining numbers from your tray to balance the final equation and complete the matrix.',
      ),
    ];

    final current = hintSteps[_activeStep.clamp(0, hintSteps.length - 1)];

    return Container(
      color: const Color(0xC7030816),
      child: Align(
        alignment: Alignment.bottomCenter,
        child: SafeArea(
          top: false,
          child: SingleChildScrollView(
            child: Container(
              width: double.infinity,
              constraints: const BoxConstraints(maxWidth: 460),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Color(0xFF132A63), Color(0xFF0B183B)],
                ),
                borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
                border: Border(
                  top: BorderSide(color: Color(0xB322D3EE), width: 2),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Color(0xCC000000),
                    blurRadius: 32,
                    offset: Offset(0, -10),
                  ),
                ],
              ),
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Container(
                    padding: const EdgeInsets.only(bottom: 10),
                    decoration: BoxDecoration(
                      border: Border(
                        bottom: BorderSide(
                          color: AppTheme.cyanSky.withValues(alpha: 0.2),
                        ),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              Container(
                                width: 34,
                                height: 34,
                                decoration: BoxDecoration(
                                  color: AppTheme.gold.withValues(alpha: 0.2),
                                  borderRadius: BorderRadius.circular(11),
                                  border: Border.all(
                                    color: AppTheme.gold.withValues(alpha: 0.5),
                                  ),
                                ),
                                child: const Icon(
                                  Icons.lightbulb_rounded,
                                  size: 20,
                                  color: AppTheme.gold,
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'Quantum Hint Terminal',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: AppTheme.displayStyle(
                                    fontSize: 17,
                                    fontWeight: FontWeight.w900,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Material(
                          color: const Color(0xCC082F49),
                          borderRadius: BorderRadius.circular(9),
                          child: InkWell(
                            onTap: () => game.navigateTo(AppScreen.game),
                            borderRadius: BorderRadius.circular(9),
                            child: Container(
                              width: 30,
                              height: 30,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(9),
                                border: Border.all(
                                  color:
                                      AppTheme.cyanSky.withValues(alpha: 0.4),
                                ),
                              ),
                              child: const Icon(
                                Icons.close_rounded,
                                size: 17,
                                color: Color(0xFF67E8F9),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Fill the empty target slots so all intersecting horizontal and vertical equations resolve correctly:',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.cyanLight,
                    ),
                  ),
                  const SizedBox(height: 6),
                  _RuleLine(
                    numText: '1.',
                    prefix: 'First horizontal row balances: ',
                    highlight: puzzle.solvedText.isNotEmpty
                        ? puzzle.solvedText
                        : row0Eq,
                  ),
                  const _RuleLine(
                    numText: '2.',
                    prefix:
                        'Shared junction tiles must satisfy both intersecting arithmetic operations.',
                  ),
                  const _RuleLine(
                    numText: '3.',
                    prefix:
                        'Tap an empty slot to focus, then press a key in the number tray.',
                  ),
                  const SizedBox(height: 12),
                  // Interactive Step Diagnostic Card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0C1F4C),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: AppTheme.cyanSky.withValues(alpha: 0.5),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                current.title.toUpperCase(),
                                style: AppTheme.hudNumberStyle(
                                  fontSize: 10,
                                  color: const Color(0xFF67E8F9),
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 3,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0xFF082F49),
                                borderRadius: BorderRadius.circular(999),
                                border: Border.all(
                                  color:
                                      AppTheme.cyanSky.withValues(alpha: 0.5),
                                ),
                              ),
                              child: Text(
                                current.badge,
                                style: AppTheme.hudNumberStyle(
                                  fontSize: 9,
                                  color: const Color(0xFF67E8F9),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(
                          current.equation,
                          style: AppTheme.hudNumberStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          current.tip,
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xCCBAE6FD),
                            height: 1.35,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Interactive Pagination Controls & 3 Dots
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _NavChipButton(
                        label: '‹ Prev',
                        enabled: _activeStep > 0,
                        onTap: () => setState(() => _activeStep--),
                      ),
                      Row(
                        children: List.generate(hintSteps.length, (idx) {
                          final active = idx == _activeStep;
                          return GestureDetector(
                            onTap: () => setState(() => _activeStep = idx),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 220),
                              margin: const EdgeInsets.symmetric(horizontal: 4),
                              width: active ? 28 : 10,
                              height: 10,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(999),
                                gradient: active
                                    ? const LinearGradient(
                                        colors: [
                                          Color(0xFF22D3EE),
                                          Color(0xFF7DD3FC),
                                        ],
                                      )
                                    : null,
                                color: active ? null : const Color(0xFF475569),
                                boxShadow: active
                                    ? const [
                                        BoxShadow(
                                          color: Color(0xE600E5FF),
                                          blurRadius: 8,
                                        ),
                                      ]
                                    : null,
                              ),
                            ),
                          );
                        }),
                      ),
                      _NavChipButton(
                        label: 'Next ›',
                        enabled: _activeStep < hintSteps.length - 1,
                        onTap: () => setState(() => _activeStep++),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  // Action Buttons: Reveal 1 Tile + Resume Mission
                  Row(
                    children: [
                      Expanded(
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: () {
                              game.watchRewardedAd(
                                const AdRewardInfo(
                                  type: 'hint',
                                  amount: 1,
                                  title: 'Quantum Hint Unlock',
                                ),
                                onComplete: () async {
                                  await game.useHint();
                                  game.navigateTo(AppScreen.game);
                                },
                              );
                            },
                            borderRadius: BorderRadius.circular(16),
                            child: Ink(
                              padding: const EdgeInsets.symmetric(vertical: 13),
                              decoration: BoxDecoration(
                                gradient: AppTheme.goldActionGradient,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: const Color(0xFFFEF08A),
                                ),
                              ),
                              child: const Text(
                                '💡 Reveal Slot',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w900,
                                  color: AppTheme.amberDeepText,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        flex: 2,
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: () => game.navigateTo(AppScreen.game),
                            borderRadius: BorderRadius.circular(16),
                            child: Ink(
                              padding: const EdgeInsets.symmetric(vertical: 13),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [
                                    Color(0xFF22D3EE),
                                    Color(0xFF3B82F6),
                                    Color(0xFF4F46E5),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: const [
                                  BoxShadow(
                                    color: Color(0x6600E5FF),
                                    blurRadius: 14,
                                  ),
                                ],
                              ),
                              child: const Text(
                                'RESUME MISSION',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                  letterSpacing: 0.8,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _HintStepData {
  const _HintStepData({
    required this.title,
    required this.badge,
    required this.equation,
    required this.tip,
  });

  final String title;
  final String badge;
  final String equation;
  final String tip;
}

class _RuleLine extends StatelessWidget {
  const _RuleLine({
    required this.numText,
    required this.prefix,
    this.highlight,
  });

  final String numText;
  final String prefix;
  final String? highlight;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 3),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            numText,
            style: const TextStyle(
              fontSize: 11.5,
              fontWeight: FontWeight.w800,
              color: Color(0xFFCBD5E1),
            ),
          ),
          const SizedBox(width: 6),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: const TextStyle(
                  fontSize: 11.5,
                  color: Color(0xFFCBD5E1),
                  height: 1.35,
                ),
                children: [
                  TextSpan(text: prefix),
                  if (highlight != null)
                    TextSpan(
                      text: '$highlight.',
                      style: const TextStyle(
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF67E8F9),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _NavChipButton extends StatelessWidget {
  const _NavChipButton({
    required this.label,
    required this.enabled,
    required this.onTap,
  });

  final String label;
  final bool enabled;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: enabled ? 1.0 : 0.3,
      child: Material(
        color: enabled ? const Color(0xCC082F49) : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          onTap: enabled ? onTap : null,
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
            decoration: enabled
                ? BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AppTheme.cyanSky.withValues(alpha: 0.4),
                    ),
                  )
                : null,
            child: Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                color: enabled
                    ? const Color(0xFF67E8F9)
                    : const Color(0xFF64748B),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

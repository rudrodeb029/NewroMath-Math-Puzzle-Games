import 'dart:math' as math;
import 'package:flutter/material.dart';

import '../models/game_models.dart';
import '../theme/app_theme.dart';

/// 3D Peaked Roof / Pediment Game Board Header shared by Campaign and Daily screens.
///
/// Renders:
/// - Upper peak loft with clean timer text (no pill border)
/// - Emerald peaked HUD chamber with gold stroke
/// - Lower HUD deck: Difficulty badge (left), centered GAME/DAY counter, Pause/Resume button (right)
class PeakedBoardHeader extends StatelessWidget {
  const PeakedBoardHeader({
    super.key,
    required this.timerText,
    required this.isWarning,
    required this.difficultyLabel,
    required this.centerBadgeLabel,
    required this.isPaused,
    required this.onTogglePause,
    this.timerEnabled = true,
  });

  final String timerText;
  final bool isWarning;
  final String difficultyLabel;
  final String centerBadgeLabel;
  final bool isPaused;
  final VoidCallback onTogglePause;
  final bool timerEnabled;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 78,
      width: double.infinity,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned.fill(
            child: CustomPaint(
              painter: _PeakedHeaderPainter(),
            ),
          ),
          // Upper Peak Loft: Clean timer text without pill border
          Positioned(
            top: 15,
            left: 0,
            right: 0,
            child: Center(
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.timer_outlined,
                    size: 12,
                    color: isWarning
                        ? const Color(0xFFFCA5A5)
                        : const Color(0xFFFEF9C3),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    timerEnabled ? timerText : '∞',
                    style: AppTheme.hudNumberStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      color: isWarning
                          ? const Color(0xFFFCA5A5)
                          : const Color(0xFFFEF9C3),
                    ).copyWith(
                      letterSpacing: 1.1,
                      shadows: [
                        if (isWarning)
                          const Shadow(
                            color: Color(0xD9EF4444),
                            blurRadius: 8,
                          ),
                        const Shadow(
                          color: Color(0xD9000000),
                          offset: Offset(0, 1.5),
                          blurRadius: 3,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Lower Peaked HUD Deck: Difficulty (Left), GAME X/Y (Center), Pause (Right)
          Positioned(
            left: 14,
            right: 14,
            bottom: 7,
            child: SizedBox(
              height: 28,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Left: 3D Gold Difficulty Badge
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 9,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Color(0xFFFEF08A),
                            Color(0xFFFCD34D),
                            Color(0xFFF59E0B),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(999),
                        border: Border.all(
                          color: const Color(0xFFFEF9C3),
                          width: 1,
                        ),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x66000000),
                            blurRadius: 4,
                            offset: Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Text(
                        difficultyLabel.toUpperCase(),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 9.5,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.amberDeepText,
                          height: 1.0,
                          letterSpacing: 0.4,
                        ),
                      ),
                    ),
                  ),
                  // Center: True Horizontal Center Stage Pill (GAME X/Y)
                  Center(
                    child: IgnorePointer(
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 11,
                          vertical: 4.5,
                        ),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Color(0xFF047857),
                              Color(0xFF065F46),
                              Color(0xFF022C22),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(999),
                          border: Border.all(
                            color: const Color(0xCC6EE7B7),
                            width: 1,
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x40FFFFFF),
                              blurRadius: 2,
                              offset: Offset(0, 1),
                            ),
                          ],
                        ),
                        child: Text(
                          centerBadgeLabel,
                          style: AppTheme.hudNumberStyle(
                            fontSize: 9.5,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ).copyWith(
                            letterSpacing: 0.9,
                            height: 1.0,
                            shadows: const [
                              Shadow(
                                color: Color(0xCC000000),
                                offset: Offset(0, 1),
                                blurRadius: 2,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  // Right: 3D Gold Pause / Resume Button
                  Align(
                    alignment: Alignment.centerRight,
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: onTogglePause,
                        borderRadius: BorderRadius.circular(8),
                        child: Container(
                          width: 26,
                          height: 26,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Color(0xFFFDE047),
                                Color(0xFFFBBF24),
                                Color(0xFFF59E0B),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: const Color(0xFFFEF9C3),
                              width: 1,
                            ),
                            boxShadow: const [
                              BoxShadow(
                                color: Color(0xFFB45309),
                                offset: Offset(0, 2),
                                blurRadius: 0,
                              ),
                              BoxShadow(
                                color: Color(0x66000000),
                                offset: Offset(0, 3),
                                blurRadius: 6,
                              ),
                            ],
                          ),
                          child: Icon(
                            isPaused
                                ? Icons.play_arrow_rounded
                                : Icons.pause_rounded,
                            size: 16,
                            color: AppTheme.amberDeepText,
                          ),
                        ),
                      ),
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

class _PeakedHeaderPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final sx = size.width / 320.0;
    final sy = size.height / 84.0;

    Offset p(double x, double y) => Offset(x * sx, y * sy);

    // 1. Outer Blue Peaked Frame
    final outerPath = Path()
      ..moveTo(0.75 * sx, 84 * sy)
      ..lineTo(0.75 * sx, 44 * sy)
      ..quadraticBezierTo(0.75 * sx, 38 * sy, 7 * sx, 36.2 * sy)
      ..lineTo(152 * sx, 2.2 * sy)
      ..quadraticBezierTo(160 * sx, 0.4 * sy, 168 * sx, 2.2 * sy)
      ..lineTo(313 * sx, 36.2 * sy)
      ..quadraticBezierTo(319.25 * sx, 38 * sy, 319.25 * sx, 44 * sy)
      ..lineTo(319.25 * sx, 84 * sy)
      ..close();

    final outerFill = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Color(0xFF2651B0), Color(0xFF1D3F8F), Color(0xFF1A3882)],
        stops: [0.0, 0.55, 1.0],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawPath(outerPath, outerFill);

    // 2. Double-Rimmed Architectural Roof Moulding Track
    final mouldingPath = Path()
      ..moveTo(4.5 * sx, 82 * sy)
      ..lineTo(4.5 * sx, 45.5 * sy)
      ..quadraticBezierTo(4.5 * sx, 40.8 * sy, 9.5 * sx, 39.2 * sy)
      ..lineTo(153.5 * sx, 5.4 * sy)
      ..quadraticBezierTo(160 * sx, 3.8 * sy, 166.5 * sx, 5.4 * sy)
      ..lineTo(310.5 * sx, 39.2 * sy)
      ..quadraticBezierTo(315.5 * sx, 40.8 * sy, 315.5 * sx, 45.5 * sy)
      ..lineTo(315.5 * sx, 82 * sy);

    final mouldingPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.4
      ..shader = const LinearGradient(
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
        colors: [
          Color(0x7338BDF8),
          Color(0xD9FDE047),
          Color(0x7338BDF8),
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawPath(mouldingPath, mouldingPaint);

    // 3. Outer Cyan-Gold Roof Border (open bottom connects seamlessly to body)
    final outerBorderPath = Path()
      ..moveTo(0.75 * sx, 84 * sy)
      ..lineTo(0.75 * sx, 44 * sy)
      ..quadraticBezierTo(0.75 * sx, 38 * sy, 7 * sx, 36.2 * sy)
      ..lineTo(152 * sx, 2.2 * sy)
      ..quadraticBezierTo(160 * sx, 0.4 * sy, 168 * sx, 2.2 * sy)
      ..lineTo(313 * sx, 36.2 * sy)
      ..quadraticBezierTo(319.25 * sx, 38 * sy, 319.25 * sx, 44 * sy)
      ..lineTo(319.25 * sx, 84 * sy);

    final outerStrokePaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          Color(0xF27DD3FC),
          Color(0xA638BDF8),
          Color(0x5967E8F9),
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawPath(outerBorderPath, outerStrokePaint);

    // 4. Inner Peaked Emerald HUD Chamber with Gold Stroke
    final chamberPath = Path()
      ..moveTo(8.5 * sx, 78.5 * sy)
      ..quadraticBezierTo(8.5 * sx, 81.5 * sy, 12.5 * sx, 81.5 * sy)
      ..lineTo(307.5 * sx, 81.5 * sy)
      ..quadraticBezierTo(311.5 * sx, 81.5 * sy, 311.5 * sx, 78.5 * sy)
      ..lineTo(311.5 * sx, 47 * sy)
      ..quadraticBezierTo(311.5 * sx, 42.5 * sy, 306.5 * sx, 41 * sy)
      ..lineTo(165.5 * sx, 8.2 * sy)
      ..quadraticBezierTo(160 * sx, 6.8 * sy, 154.5 * sx, 8.2 * sy)
      ..lineTo(13.5 * sx, 41 * sy)
      ..quadraticBezierTo(8.5 * sx, 42.5 * sy, 8.5 * sx, 47 * sy)
      ..close();

    final chamberFill = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Color(0xFF10B981), Color(0xFF059669), Color(0xFF064E3B)],
        stops: [0.0, 0.48, 1.0],
      ).createShader(Rect.fromLTWH(0, 6 * sy, size.width, 76 * sy));
    canvas.drawPath(chamberPath, chamberFill);

    final chamberStroke = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.8
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Color(0xFFFEF08A), Color(0xFFFACC15), Color(0xFFD97706)],
      ).createShader(Rect.fromLTWH(0, 6 * sy, size.width, 76 * sy));
    canvas.drawPath(chamberPath, chamberStroke);

    // 5. Inner Emerald Bevel Highlight & Tier Divider Line
    final innerBevel = Path()
      ..moveTo(11 * sx, 77.5 * sy)
      ..lineTo(11 * sx, 47.5 * sy)
      ..quadraticBezierTo(11 * sx, 44 * sy, 15 * sx, 42.8 * sy)
      ..lineTo(155.5 * sx, 10.2 * sy)
      ..quadraticBezierTo(160 * sx, 9 * sy, 164.5 * sx, 10.2 * sy)
      ..lineTo(305 * sx, 42.8 * sy)
      ..quadraticBezierTo(309 * sx, 44 * sy, 309 * sx, 47.5 * sy)
      ..lineTo(309 * sx, 77.5 * sy);

    canvas.drawPath(
      innerBevel,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.0
        ..color = const Color(0x73A7F3D0),
    );

    canvas.drawLine(
      p(18, 46.5),
      p(302, 46.5),
      Paint()
        ..strokeWidth = 1.0
        ..color = const Color(0x596EE7B7),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Subtle blueprint coordinate grid painter for the board interior.
class BlueprintGridPainter extends CustomPainter {
  const BlueprintGridPainter({this.opacity = 0.14});

  final double opacity;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppTheme.cyanSky.withValues(alpha: opacity)
      ..strokeWidth = 0.6;
    const step = 20.0;
    for (double x = step; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = step; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant BlueprintGridPainter oldDelegate) =>
      oldDelegate.opacity != opacity;
}

/// Unified 3D Sci-Fi Game Board container (Peaked Header + Blueprint Body).
class PeakedBoardContainer extends StatelessWidget {
  const PeakedBoardContainer({
    super.key,
    required this.header,
    required this.child,
    this.maxWidth = 340,
    this.padding = const EdgeInsets.fromLTRB(10, 4, 10, 10),
  });

  final Widget header;
  final Widget child;
  final double maxWidth;
  final EdgeInsets padding;

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: BoxConstraints(maxWidth: maxWidth),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          header,
          Transform.translate(
            offset: const Offset(0, -1),
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xFF1A3882),
                    Color(0xFF102761),
                    Color(0xFF0B1C45),
                  ],
                ),
                borderRadius: const BorderRadius.vertical(
                  bottom: Radius.circular(22),
                ),
                border: const Border(
                  left: BorderSide(color: Color(0x5967E8F9), width: 1.2),
                  right: BorderSide(color: Color(0x5967E8F9), width: 1.2),
                  bottom: BorderSide(color: Color(0x5967E8F9), width: 1.2),
                ),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0xA6020A20),
                    blurRadius: 28,
                    offset: Offset(0, 14),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  bottom: Radius.circular(21),
                ),
                child: Stack(
                  children: [
                    const Positioned.fill(
                      child: IgnorePointer(
                        child: CustomPaint(
                          painter: BlueprintGridPainter(opacity: 0.12),
                        ),
                      ),
                    ),
                    // Drafting corner '+' markers
                    const Positioned(
                      top: 3,
                      left: 6,
                      child: _CornerCross(),
                    ),
                    const Positioned(
                      top: 3,
                      right: 6,
                      child: _CornerCross(),
                    ),
                    const Positioned(
                      bottom: 3,
                      left: 6,
                      child: _CornerCross(),
                    ),
                    const Positioned(
                      bottom: 3,
                      right: 6,
                      child: _CornerCross(),
                    ),
                    Padding(
                      padding: padding,
                      child: child,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CornerCross extends StatelessWidget {
  const _CornerCross();

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Text(
        '+',
        style: TextStyle(
          fontFamily: 'monospace',
          fontSize: 9,
          color: AppTheme.cyanSky.withValues(alpha: 0.4),
          height: 1.0,
        ),
      ),
    );
  }
}

/// Interactive 5x5 Cross-Math puzzle board supporting tap-to-select,
/// tap-to-remove, and drag-to-place/swap interactions.
class CrossmathBoard extends StatelessWidget {
  const CrossmathBoard({
    super.key,
    required this.puzzle,
    required this.answers,
    required this.selectedSlot,
    required this.divisionSymbol,
    required this.largeFontEnabled,
    required this.onSlotTap,
    this.onDropNumberOnSlot,
    this.isInteractive = true,
    this.maxBoardWidth = 264,
  });

  final CrossmathPuzzle puzzle;
  final Map<int, int> answers;
  final int? selectedSlot;
  final String divisionSymbol;
  final bool largeFontEnabled;
  final ValueChanged<int> onSlotTap;
  final void Function(int slotIndex, int number)? onDropNumberOnSlot;
  final bool isInteractive;
  final double maxBoardWidth;

  @override
  Widget build(BuildContext context) {
    final cols = puzzle.cols > 0 ? puzzle.cols : 5;
    final rows = puzzle.rows;
    final blankCount = puzzle.slots.length;
    final trayCount = puzzle.numbers.length;
    final isCompact = blankCount >= 5 || trayCount >= 6;
    final isVeryCompact = blankCount >= 6 || trayCount >= 9;
    final gap = isVeryCompact ? 3.5 : 5.0;

    if (rows.isEmpty) {
      return SizedBox(
        height: 180,
        child: Center(
          child: Text(
            'Generating Matrix...',
            style: AppTheme.hudNumberStyle(
              fontSize: 12,
              color: AppTheme.cyanLight,
            ),
          ),
        ),
      );
    }

    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxBoardWidth),
        child: AspectRatio(
          aspectRatio: cols / math.max(1, rows.length),
          child: Column(
            mainAxisSize: MainAxisSize.max,
            children: [
              for (var r = 0; r < rows.length; r++) ...[
                if (r > 0) SizedBox(height: gap),
                Expanded(
                  child: Row(
                    children: [
                      for (var c = 0; c < rows[r].length; c++) ...[
                        if (c > 0) SizedBox(width: gap),
                        Expanded(
                          child: _buildCell(
                            rows[r][c],
                            isCompact: isCompact,
                            isVeryCompact: isVeryCompact,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCell(
    CrossmathCell cell, {
    required bool isCompact,
    required bool isVeryCompact,
  }) {
    if (cell.type == CrossmathCellType.empty) {
      return const SizedBox.shrink();
    }

    if (cell.type == CrossmathCellType.blank) {
      final slotIdx = cell.slotIndex ?? 0;
      final placedVal = answers[slotIdx];
      final isFilled = placedVal != null;
      final isSelected = selectedSlot == slotIdx;

      final tile = GestureDetector(
        onTap: isInteractive ? () => onSlotTap(slotIdx) : null,
        child: AnimatedScale(
          scale: isSelected ? 1.05 : 1.0,
          duration: const Duration(milliseconds: 140),
          curve: Curves.easeOutBack,
          child: _SlotTile(
            value: placedVal,
            isFilled: isFilled,
            isSelected: isSelected,
            isCompact: isCompact,
            isVeryCompact: isVeryCompact,
            largeFontEnabled: largeFontEnabled,
          ),
        ),
      );

      if (!isInteractive || onDropNumberOnSlot == null) {
        return tile;
      }

      return DragTarget<int>(
        onWillAcceptWithDetails: (_) => isInteractive,
        onAcceptWithDetails: (details) =>
            onDropNumberOnSlot!(slotIdx, details.data),
        builder: (context, candidateData, _) {
          final isHovered = candidateData.isNotEmpty;
          return AnimatedScale(
            scale: isHovered ? 1.08 : 1.0,
            duration: const Duration(milliseconds: 110),
            child: tile,
          );
        },
      );
    }

    final isOperator = cell.type == CrossmathCellType.operatorSymbol ||
        cell.type == CrossmathCellType.equals;

    final rawText = cell.value ?? '';
    final displayText = rawText == '÷' ? divisionSymbol : rawText;

    if (isOperator) {
      return _OperatorTile(
        symbol: displayText,
        isCompact: isCompact,
        isVeryCompact: isVeryCompact,
        largeFontEnabled: largeFontEnabled,
      );
    }

    return _FixedNumberTile(
      text: displayText,
      isCompact: isCompact,
      isVeryCompact: isVeryCompact,
      largeFontEnabled: largeFontEnabled,
    );
  }
}

class _SlotTile extends StatelessWidget {
  const _SlotTile({
    required this.value,
    required this.isFilled,
    required this.isSelected,
    required this.isCompact,
    required this.isVeryCompact,
    required this.largeFontEnabled,
  });

  final int? value;
  final bool isFilled;
  final bool isSelected;
  final bool isCompact;
  final bool isVeryCompact;
  final bool largeFontEnabled;

  @override
  Widget build(BuildContext context) {
    if (isFilled && value != null) {
      final text = value.toString();
      return TweenAnimationBuilder<double>(
        key: ValueKey('filled_$value'),
        tween: Tween(begin: 0.72, end: 1.0),
        duration: const Duration(milliseconds: 210),
        curve: Curves.elasticOut,
        builder: (context, scale, child) =>
            Transform.scale(scale: scale, child: child),
        child: Container(
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFF34D399),
                Color(0xFF10B981),
                Color(0xFF059669),
              ],
            ),
            borderRadius: BorderRadius.circular(9),
            border: Border.all(color: const Color(0xFFA7F3D0), width: 1.5),
            boxShadow: const [
              BoxShadow(
                color: Color(0xFF064E3B),
                offset: Offset(0, 3),
                blurRadius: 0,
              ),
              BoxShadow(
                color: Color(0x8010B981),
                offset: Offset(0, 5),
                blurRadius: 10,
              ),
            ],
          ),
          alignment: Alignment.center,
          padding: const EdgeInsets.all(2),
          child: FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              text,
              style: _tileNumberStyle(
                text.length,
                isCompact: isCompact,
                isVeryCompact: isVeryCompact,
                largeFontEnabled: largeFontEnabled,
              ),
            ),
          ),
        ),
      );
    }

    if (isSelected) {
      return Container(
        decoration: BoxDecoration(
          gradient: const RadialGradient(
            colors: [
              Color(0x6BFBBF24),
              Color(0xD178350F),
            ],
          ),
          borderRadius: BorderRadius.circular(9),
          border: Border.all(color: const Color(0xFFFDE047), width: 2),
          boxShadow: const [
            BoxShadow(
              color: Color(0xD9F59E0B),
              blurRadius: 12,
              spreadRadius: 0,
            ),
          ],
        ),
        alignment: Alignment.center,
        child: Container(
          width: 8,
          height: 8,
          decoration: const BoxDecoration(
            color: Color(0xFFFCD34D),
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: Color(0xE6FCD34D),
                blurRadius: 6,
              ),
            ],
          ),
        ),
      );
    }

    // Empty slot with dashed cyan border
    return CustomPaint(
      painter: _DashedBorderPainter(
        color: const Color(0xBF38BDF8),
        radius: 9,
      ),
      child: Container(
        decoration: BoxDecoration(
          gradient: const RadialGradient(
            colors: [
              Color(0x2E38BDF8),
              Color(0xBF122D69),
            ],
          ),
          borderRadius: BorderRadius.circular(9),
          boxShadow: const [
            BoxShadow(
              color: Color(0x4D00E5FF),
              blurRadius: 10,
            ),
          ],
        ),
        alignment: Alignment.center,
        child: Text(
          '◇',
          style: TextStyle(
            fontSize: isVeryCompact ? 8 : (isCompact ? 9 : 10),
            fontWeight: FontWeight.w700,
            color: const Color(0x8038BDF8),
            height: 1.0,
          ),
        ),
      ),
    );
  }
}

class _FixedNumberTile extends StatelessWidget {
  const _FixedNumberTile({
    required this.text,
    required this.isCompact,
    required this.isVeryCompact,
    required this.largeFontEnabled,
  });

  final String text;
  final bool isCompact;
  final bool isVeryCompact;
  final bool largeFontEnabled;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFF2563EB),
            Color(0xFF1D4ED8),
            Color(0xFF173887),
          ],
          stops: [0.0, 0.55, 1.0],
        ),
        borderRadius: BorderRadius.circular(9),
        border: Border.all(color: const Color(0xFF60A5FA), width: 1.5),
        boxShadow: const [
          BoxShadow(
            color: Color(0xFF0B1D4D),
            offset: Offset(0, 3),
            blurRadius: 0,
          ),
          BoxShadow(
            color: Color(0x73000000),
            offset: Offset(0, 5),
            blurRadius: 10,
          ),
        ],
      ),
      alignment: Alignment.center,
      padding: const EdgeInsets.all(2),
      child: FittedBox(
        fit: BoxFit.scaleDown,
        child: Text(
          text,
          style: _tileNumberStyle(
            text.length,
            isCompact: isCompact,
            isVeryCompact: isVeryCompact,
            largeFontEnabled: largeFontEnabled,
          ),
        ),
      ),
    );
  }
}

class _OperatorTile extends StatelessWidget {
  const _OperatorTile({
    required this.symbol,
    required this.isCompact,
    required this.isVeryCompact,
    required this.largeFontEnabled,
  });

  final String symbol;
  final bool isCompact;
  final bool isVeryCompact;
  final bool largeFontEnabled;

  @override
  Widget build(BuildContext context) {
    final fontSize = isVeryCompact
        ? 12.0
        : isCompact
            ? 13.5
            : (largeFontEnabled ? 17.5 : 15.0);

    return Container(
      decoration: BoxDecoration(
        gradient: const RadialGradient(
          center: Alignment(0, -0.4),
          radius: 0.9,
          colors: [
            Color(0xFF173D82),
            Color(0xFF112D66),
            Color(0xFF0D2252),
          ],
        ),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: const Color(0x9938BDF8),
          width: 1.4,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x59041234),
            offset: Offset(0, 3),
            blurRadius: 6,
          ),
        ],
      ),
      alignment: Alignment.center,
      child: Text(
        symbol,
        style: TextStyle(
          fontSize: fontSize,
          fontWeight: FontWeight.w900,
          color: AppTheme.cyanSky,
          height: 1.0,
          shadows: const [
            Shadow(color: Color(0xCC38BDF8), blurRadius: 8),
            Shadow(color: Color(0x7300E5FF), blurRadius: 14),
          ],
        ),
      ),
    );
  }
}

class _DashedBorderPainter extends CustomPainter {
  _DashedBorderPainter({required this.color, required this.radius});

  final Color color;
  final double radius;

  @override
  void paint(Canvas canvas, Size size) {
    final rrect = RRect.fromRectAndRadius(
      Offset.zero & size,
      Radius.circular(radius),
    );
    final path = Path()..addRRect(rrect);
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1.8
      ..style = PaintingStyle.stroke;

    const dashWidth = 4.5;
    const dashSpace = 3.5;
    for (final metric in path.computeMetrics()) {
      var distance = 0.0;
      while (distance < metric.length) {
        final next = math.min(distance + dashWidth, metric.length);
        canvas.drawPath(metric.extractPath(distance, next), paint);
        distance += dashWidth + dashSpace;
      }
    }
  }

  @override
  bool shouldRepaint(covariant _DashedBorderPainter oldDelegate) =>
      oldDelegate.color != color || oldDelegate.radius != radius;
}

TextStyle _tileNumberStyle(
  int charLength, {
  required bool isCompact,
  required bool isVeryCompact,
  required bool largeFontEnabled,
}) {
  double size;
  if (charLength >= 3) {
    size = isVeryCompact
        ? 10.5
        : isCompact
            ? 11.5
            : (largeFontEnabled ? 13.5 : 12.0);
  } else if (charLength == 2) {
    size = isVeryCompact
        ? 12.0
        : isCompact
            ? 13.5
            : (largeFontEnabled ? 16.5 : 14.5);
  } else {
    size = isVeryCompact
        ? 14.0
        : isCompact
            ? 16.0
            : (largeFontEnabled ? 19.5 : 17.0);
  }

  return TextStyle(
    fontSize: size,
    fontWeight: FontWeight.w900,
    color: Colors.white,
    height: 1.0,
    fontFeatures: AppTheme.tabularLiningFeatures,
    shadows: const [
      Shadow(
        color: Color(0xCC000000),
        offset: Offset(0, 1),
        blurRadius: 2,
      ),
    ],
  );
}

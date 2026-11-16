import 'dart:async';
import 'package:confetti/confetti.dart';
import 'package:flutter/material.dart';

import '../data/levels_catalog.dart';
import '../models/game_models.dart';
import '../theme/app_theme.dart';

/// Shared dark scrim overlay without BackdropFilter to ensure zero GPU flicker on Android.
class _ModalBackdrop extends StatelessWidget {
  const _ModalBackdrop({required this.child, this.onTapOutside});

  final Widget child;
  final VoidCallback? onTapOutside;

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: GestureDetector(
        onTap: onTapOutside,
        child: Container(
          color: const Color(0xCC06122C),
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 20),
          child: GestureDetector(
            onTap: () {},
            child: child,
          ),
        ),
      ),
    );
  }
}

/// 3D Arched Ribbon Banner painted with folded side tails.
class _ArchedRibbonBanner extends StatelessWidget {
  const _ArchedRibbonBanner({
    required this.leadingText,
    required this.accentText,
    required this.topColor,
    required this.midColor,
    required this.bottomColor,
    required this.strokeColor,
    required this.tailColor,
    required this.darkTailColor,
  });

  final String leadingText;
  final String accentText;
  final Color topColor;
  final Color midColor;
  final Color bottomColor;
  final Color strokeColor;
  final Color tailColor;
  final Color darkTailColor;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 196,
      height: 44,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Positioned.fill(
            child: CustomPaint(
              painter: _RibbonPainter(
                topColor: topColor,
                midColor: midColor,
                bottomColor: bottomColor,
                strokeColor: strokeColor,
                tailColor: tailColor,
                darkTailColor: darkTailColor,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: 3),
            child: RichText(
              text: TextSpan(
                style: AppTheme.displayStyle(
                  fontSize: 16.5,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                ).copyWith(
                  shadows: const [
                    Shadow(
                      color: Color(0x99000000),
                      offset: Offset(0, 1.5),
                      blurRadius: 3,
                    ),
                  ],
                ),
                children: [
                  TextSpan(text: leadingText),
                  if (accentText.isNotEmpty)
                    TextSpan(
                      text: accentText,
                      style: const TextStyle(
                        color: AppTheme.goldBright,
                        shadows: [
                          Shadow(
                            color: Color(0xCCB45309),
                            offset: Offset(0, 2),
                            blurRadius: 4,
                          ),
                        ],
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

class _RibbonPainter extends CustomPainter {
  _RibbonPainter({
    required this.topColor,
    required this.midColor,
    required this.bottomColor,
    required this.strokeColor,
    required this.tailColor,
    required this.darkTailColor,
  });

  final Color topColor;
  final Color midColor;
  final Color bottomColor;
  final Color strokeColor;
  final Color tailColor;
  final Color darkTailColor;

  @override
  void paint(Canvas canvas, Size size) {
    final sx = size.width / 220.0;
    final sy = size.height / 52.0;

    final leftTail = Path()
      ..moveTo(12 * sx, 36 * sy)
      ..lineTo(0, 26 * sy)
      ..lineTo(12 * sx, 16 * sy)
      ..lineTo(22 * sx, 22 * sy)
      ..lineTo(22 * sx, 34 * sy)
      ..close();
    canvas.drawPath(leftTail, Paint()..color = tailColor);

    final leftFold = Path()
      ..moveTo(22 * sx, 22 * sy)
      ..lineTo(35 * sx, 14 * sy)
      ..lineTo(35 * sx, 34 * sy)
      ..lineTo(22 * sx, 34 * sy)
      ..close();
    canvas.drawPath(leftFold, Paint()..color = darkTailColor);

    final rightTail = Path()
      ..moveTo(208 * sx, 36 * sy)
      ..lineTo(220 * sx, 26 * sy)
      ..lineTo(208 * sx, 16 * sy)
      ..lineTo(198 * sx, 22 * sy)
      ..lineTo(198 * sx, 34 * sy)
      ..close();
    canvas.drawPath(rightTail, Paint()..color = tailColor);

    final rightFold = Path()
      ..moveTo(198 * sx, 22 * sy)
      ..lineTo(185 * sx, 14 * sy)
      ..lineTo(185 * sx, 34 * sy)
      ..lineTo(198 * sx, 34 * sy)
      ..close();
    canvas.drawPath(rightFold, Paint()..color = darkTailColor);

    final banner = Path()
      ..moveTo(18 * sx, 20 * sy)
      ..cubicTo(60 * sx, 6 * sy, 160 * sx, 6 * sy, 202 * sx, 20 * sy)
      ..cubicTo(206 * sx, 36 * sy, 196 * sx, 46 * sy, 185 * sx, 45 * sy)
      ..cubicTo(150 * sx, 38 * sy, 70 * sx, 38 * sy, 35 * sx, 45 * sy)
      ..cubicTo(24 * sx, 46 * sy, 14 * sx, 36 * sy, 18 * sx, 20 * sy)
      ..close();

    canvas.drawPath(
      banner,
      Paint()
        ..shader = LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [topColor, midColor, bottomColor],
        ).createShader(Rect.fromLTWH(0, 0, size.width, size.height)),
    );
    canvas.drawPath(
      banner,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.8
        ..color = strokeColor,
    );
  }

  @override
  bool shouldRepaint(covariant _RibbonPainter oldDelegate) => false;
}

class _FloatingHeroHeader extends StatelessWidget {
  const _FloatingHeroHeader({
    required this.haloColor,
    required this.heroWidget,
    required this.ribbon,
  });

  final Color haloColor;
  final Widget heroWidget;
  final Widget ribbon;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 204,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            alignment: Alignment.bottomCenter,
            children: [
              Container(
                width: 108,
                height: 36,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [haloColor, Colors.white],
                  ),
                  borderRadius: BorderRadius.circular(999),
                ),
              ),
              heroWidget,
            ],
          ),
          Transform.translate(
            offset: const Offset(0, -10),
            child: ribbon,
          ),
        ],
      ),
    );
  }
}

class _ModalDivider extends StatelessWidget {
  const _ModalDivider({
    required this.lineColor,
    required this.circleBg,
    required this.circleBorder,
    required this.icon,
    required this.iconColor,
  });

  final Color lineColor;
  final Color circleBg;
  final Color circleBorder;
  final IconData icon;
  final Color iconColor;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 40,
          height: 1.5,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.transparent, lineColor],
            ),
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 10),
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: circleBg,
            shape: BoxShape.circle,
            border: Border.all(color: circleBorder),
          ),
          child: Icon(icon, size: 14, color: iconColor),
        ),
        const SizedBox(width: 10),
        Container(
          width: 40,
          height: 1.5,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [lineColor, Colors.transparent],
            ),
            borderRadius: BorderRadius.circular(2),
          ),
        ),
      ],
    );
  }
}

class _Primary3DButton extends StatelessWidget {
  const _Primary3DButton({
    required this.label,
    required this.gradientColors,
    required this.borderColor,
    required this.shadowColor,
    required this.onTap,
    this.icon,
  });

  final String label;
  final List<Color> gradientColors;
  final Color borderColor;
  final Color shadowColor;
  final VoidCallback onTap;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(999),
        child: Ink(
          height: 46,
          width: double.infinity,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: gradientColors,
            ),
            borderRadius: BorderRadius.circular(999),
            border: Border.all(color: borderColor, width: 2),
            boxShadow: [
              BoxShadow(
                color: shadowColor,
                offset: const Offset(0, 4),
                blurRadius: 0,
              ),
              BoxShadow(
                color: shadowColor.withValues(alpha: 0.35),
                offset: const Offset(0, 8),
                blurRadius: 18,
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                Icon(icon, color: Colors.white, size: 19),
                const SizedBox(width: 8),
              ],
              Flexible(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 14.5,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SecondaryChipButton extends StatelessWidget {
  const _SecondaryChipButton({
    required this.label,
    required this.gradientColors,
    required this.borderColor,
    required this.shadowColor,
    required this.textColor,
    required this.onTap,
    this.leadingEmoji,
  });

  final String label;
  final List<Color> gradientColors;
  final Color borderColor;
  final Color shadowColor;
  final Color textColor;
  final VoidCallback onTap;
  final String? leadingEmoji;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Ink(
          height: 40,
          decoration: BoxDecoration(
            gradient: LinearGradient(colors: gradientColors),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: borderColor),
            boxShadow: [
              BoxShadow(
                color: shadowColor,
                offset: const Offset(0, 2.5),
                blurRadius: 0,
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (leadingEmoji != null) ...[
                Text(leadingEmoji!, style: const TextStyle(fontSize: 13)),
                const SizedBox(width: 5),
              ],
              Flexible(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                    color: textColor,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// =============================================================================
// 1. VICTORY / CORRECT RESULT MODAL
// =============================================================================

class CorrectResultModal extends StatefulWidget {
  const CorrectResultModal({
    super.key,
    required this.result,
    required this.nextLevelNum,
    required this.nextStageNum,
    required this.stageTotal,
    required this.onPrimaryAction,
    required this.onLevels,
    required this.onHome,
    required this.onClose,
  });

  final GameResultSummary result;
  final int nextLevelNum;
  final int nextStageNum;
  final int stageTotal;
  final VoidCallback onPrimaryAction;
  final VoidCallback onLevels;
  final VoidCallback onHome;
  final VoidCallback onClose;

  @override
  State<CorrectResultModal> createState() => _CorrectResultModalState();
}

class _CorrectResultModalState extends State<CorrectResultModal> {
  late final ConfettiController _confetti;

  @override
  void initState() {
    super.initState();
    _confetti = ConfettiController(duration: const Duration(seconds: 2))
      ..play();
  }

  @override
  void dispose() {
    _confetti.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final r = widget.result;
    return _ModalBackdrop(
      child: Stack(
        alignment: Alignment.topCenter,
        clipBehavior: Clip.none,
        children: [
          Positioned(
            top: 0,
            child: ConfettiWidget(
              confettiController: _confetti,
              blastDirectionality: BlastDirectionality.explosive,
              emissionFrequency: 0.08,
              numberOfParticles: 24,
              gravity: 0.25,
              shouldLoop: false,
            ),
          ),
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 330),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(top: 46),
                  padding: const EdgeInsets.fromLTRB(20, 62, 20, 20),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Color(0xF5FFFFFF),
                        Color(0xF5F0FDF4),
                        Color(0xF5DCFCE7),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(34),
                    border: Border.all(color: Colors.white, width: 2),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x99081844),
                        blurRadius: 48,
                        offset: Offset(0, 20),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const _ModalDivider(
                        lineColor: Color(0xFF4ADE80),
                        circleBg: Color(0xFFD1FAE5),
                        circleBorder: Color(0xFF86EFAC),
                        icon: Icons.check_rounded,
                        iconColor: Color(0xFF059669),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        r.levelCleared
                            ? 'Mission Accomplished!'
                            : 'Puzzle Solved!',
                        textAlign: TextAlign.center,
                        style: AppTheme.displayStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: const Color(0xFF052E16),
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        r.levelCleared
                            ? 'Level ${r.level} Cleared • All ${r.totalStages} Puzzles Done!'
                            : 'Level ${r.level} • Puzzle ${r.stage} of ${r.totalStages} Complete',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF334155),
                        ),
                      ),
                      if (r.solvedText.isNotEmpty) ...[
                        const SizedBox(height: 10),
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xE6ECFDF5),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: const Color(0xFFA7F3D0)),
                          ),
                          child: Column(
                            children: [
                              const Text(
                                'SOLVED EQUATION',
                                style: TextStyle(
                                  fontFamily: 'monospace',
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xCC047857),
                                  letterSpacing: 0.8,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                r.solvedText,
                                textAlign: TextAlign.center,
                                style: AppTheme.hudNumberStyle(
                                  fontSize: 16.5,
                                  fontWeight: FontWeight.w900,
                                  color: const Color(0xFF064E3B),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        runSpacing: 6,
                        alignment: WrapAlignment.center,
                        children: [
                          _RewardPill(
                            borderColor: const Color(0xFF6EE7B7),
                            leading: const Text('⭐', style: TextStyle(fontSize: 13)),
                            label: '+${r.xpEarned} XP',
                            textColor: const Color(0xFF052E16),
                          ),
                          _RewardPill(
                            borderColor: const Color(0xFFFCD34D),
                            leading: Image.asset(
                              AppAssets.goldCoin,
                              width: 16,
                              height: 16,
                            ),
                            label: '+${r.coinsEarned} Coins',
                            textColor: AppTheme.amberDeepText,
                          ),
                          if (r.gemsEarned > 0)
                            _RewardPill(
                              borderColor: const Color(0xFF7DD3FC),
                              leading: Image.asset(
                                AppAssets.gem,
                                width: 16,
                                height: 16,
                              ),
                              label: '+${r.gemsEarned} Gems',
                              textColor: const Color(0xFF0C4A6E),
                            ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      _Primary3DButton(
                        label: r.levelCleared
                            ? 'Next Mission (Level ${widget.nextLevelNum}) →'
                            : 'Next Game (${widget.nextStageNum}/${widget.stageTotal}) →',
                        gradientColors: const [
                          Color(0xFF4ADE80),
                          Color(0xFF22C55E),
                          Color(0xFF15803D),
                        ],
                        borderColor: const Color(0xFFE2FBE8),
                        shadowColor: const Color(0xFF14532D),
                        onTap: widget.onPrimaryAction,
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: _SecondaryChipButton(
                              label: 'Missions',
                              leadingEmoji: '⊞',
                              gradientColors: const [
                                Color(0xFFE0F2FE),
                                Color(0xFFDBEAFE),
                              ],
                              borderColor: const Color(0xFF93C5FD),
                              shadowColor: const Color(0xFF93C5FD),
                              textColor: const Color(0xFF1E3A8A),
                              onTap: widget.onLevels,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _SecondaryChipButton(
                              label: 'Home',
                              leadingEmoji: '🏠',
                              gradientColors: const [
                                Color(0xFFF1F5F9),
                                Color(0xFFE2E8F0),
                              ],
                              borderColor: const Color(0xFFCBD5E1),
                              shadowColor: const Color(0xFFCBD5E1),
                              textColor: const Color(0xFF1E293B),
                              onTap: widget.onHome,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                // Top-Right Close Button
                Positioned(
                  top: 58,
                  right: 14,
                  child: _ModalCloseButton(
                    bgColor: const Color(0xFFD1FAE5),
                    iconColor: const Color(0xFF065F46),
                    onTap: widget.onClose,
                  ),
                ),
                // Floating 3D Emerald Checkmark Hero + Ribbon
                Positioned(
                  top: -6,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: _FloatingHeroHeader(
                      haloColor: const Color(0xFFBBF7D0),
                      heroWidget: Container(
                        width: 74,
                        height: 74,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              Color(0xFF4ADE80),
                              Color(0xFF22C55E),
                              Color(0xFF15803D),
                            ],
                          ),
                          border: Border.all(color: Colors.white, width: 3),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x8022C55E),
                              blurRadius: 18,
                              offset: Offset(0, 6),
                            ),
                          ],
                        ),
                        alignment: Alignment.center,
                        child: const Icon(
                          Icons.check_rounded,
                          size: 40,
                          color: Colors.white,
                        ),
                      ),
                      ribbon: _ArchedRibbonBanner(
                        leadingText: r.levelCleared ? 'Level ' : 'Puzzle ',
                        accentText: r.levelCleared ? 'Cleared' : 'Solved',
                        topColor: const Color(0xFF22C55E),
                        midColor: const Color(0xFF16A34A),
                        bottomColor: const Color(0xFF15803D),
                        strokeColor: const Color(0xFF86EFAC),
                        tailColor: const Color(0xFF14532D),
                        darkTailColor: const Color(0xFF052E16),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _RewardPill extends StatelessWidget {
  const _RewardPill({
    required this.borderColor,
    required this.leading,
    required this.label,
    required this.textColor,
  });

  final Color borderColor;
  final Widget leading;
  final String label;
  final Color textColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: borderColor),
        boxShadow: const [
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          leading,
          const SizedBox(width: 5),
          Text(
            label,
            style: TextStyle(
              fontSize: 11.5,
              fontWeight: FontWeight.w900,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// 2. DAILY VICTORY MODAL
// =============================================================================

class DailyVictoryModal extends StatefulWidget {
  const DailyVictoryModal({
    super.key,
    required this.dayNum,
    required this.streakDays,
    required this.onCollectAndReturn,
  });

  final int dayNum;
  final int streakDays;
  final VoidCallback onCollectAndReturn;

  @override
  State<DailyVictoryModal> createState() => _DailyVictoryModalState();
}

class _DailyVictoryModalState extends State<DailyVictoryModal> {
  late final ConfettiController _confetti;

  @override
  void initState() {
    super.initState();
    _confetti = ConfettiController(duration: const Duration(seconds: 2))
      ..play();
  }

  @override
  void dispose() {
    _confetti.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _ModalBackdrop(
      child: Stack(
        alignment: Alignment.topCenter,
        clipBehavior: Clip.none,
        children: [
          Positioned(
            top: 0,
            child: ConfettiWidget(
              confettiController: _confetti,
              blastDirectionality: BlastDirectionality.explosive,
              emissionFrequency: 0.08,
              numberOfParticles: 28,
              gravity: 0.25,
              shouldLoop: false,
            ),
          ),
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 330),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(top: 46),
                  padding: const EdgeInsets.fromLTRB(20, 62, 20, 20),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Color(0xF5FFFFFF),
                        Color(0xF5F0FDF4),
                        Color(0xF5DCFCE7),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(34),
                    border: Border.all(color: Colors.white, width: 2),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x80064E3B),
                        blurRadius: 48,
                        offset: Offset(0, 20),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Protocol Synchronized!',
                        textAlign: TextAlign.center,
                        style: AppTheme.displayStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: const Color(0xFF064E3B),
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        'Day ${widget.dayNum} Quantum Matrix Cleared (3★)',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF047857),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFFFBEB),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: const Color(0xFFFCD34D),
                                ),
                              ),
                              child: Column(
                                children: [
                                  const Text(
                                    'REWARD',
                                    style: TextStyle(
                                      fontSize: 9.5,
                                      fontWeight: FontWeight.w800,
                                      color: Color(0xFF92400E),
                                    ),
                                  ),
                                  const SizedBox(height: 3),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Image.asset(
                                        AppAssets.goldCoin,
                                        width: 15,
                                        height: 15,
                                      ),
                                      const SizedBox(width: 4),
                                      const Text(
                                        '+150 Coins',
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w900,
                                          color: Color(0xFFD97706),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: const Color(0xFFECFEFF),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: const Color(0xFF67E8F9),
                                ),
                              ),
                              child: Column(
                                children: [
                                  const Text(
                                    'BONUS',
                                    style: TextStyle(
                                      fontSize: 9.5,
                                      fontWeight: FontWeight.w800,
                                      color: Color(0xFF155E75),
                                    ),
                                  ),
                                  const SizedBox(height: 3),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Image.asset(
                                        AppAssets.gem,
                                        width: 15,
                                        height: 15,
                                      ),
                                      const SizedBox(width: 4),
                                      const Text(
                                        '+20 Gems',
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w900,
                                          color: Color(0xFF0891B2),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xCCFFEDD5),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFFDBA74)),
                        ),
                        child: Text(
                          '🔥 Streak Extended: ${widget.streakDays} Consecutive Days!',
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF7C2D12),
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),
                      _Primary3DButton(
                        label: 'Collect Rewards & Return to Hub',
                        gradientColors: const [
                          Color(0xFF10B981),
                          Color(0xFF059669),
                          Color(0xFF047857),
                        ],
                        borderColor: const Color(0xFFA7F3D0),
                        shadowColor: const Color(0xFF064E3B),
                        onTap: widget.onCollectAndReturn,
                      ),
                    ],
                  ),
                ),
                Positioned(
                  top: -4,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: _FloatingHeroHeader(
                      haloColor: const Color(0xFFBBF7D0),
                      heroWidget: Container(
                        width: 66,
                        height: 66,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Color(0xFFFCD34D),
                              Color(0xFFFACC15),
                              Color(0xFFF59E0B),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(
                            color: const Color(0xFFFEF08A),
                            width: 2,
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x73F59E0B),
                              blurRadius: 16,
                              offset: Offset(0, 6),
                            ),
                          ],
                        ),
                        alignment: Alignment.center,
                        child: Image.asset(
                          AppAssets.trophy3d,
                          width: 44,
                          height: 44,
                        ),
                      ),
                      ribbon: const _ArchedRibbonBanner(
                        leadingText: 'Daily ',
                        accentText: 'Cleared',
                        topColor: Color(0xFF10B981),
                        midColor: Color(0xFF059669),
                        bottomColor: Color(0xFF047857),
                        strokeColor: Color(0xFF34D399),
                        tailColor: Color(0xFF047857),
                        darkTailColor: Color(0xFF064E3B),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// 3. WRONG RESULT MODAL
// =============================================================================

class WrongResultModal extends StatelessWidget {
  const WrongResultModal({
    super.key,
    required this.stageNum,
    required this.stageTotal,
    required this.onRetry,
    required this.onHint,
    required this.onLevels,
    required this.onClose,
  });

  final int stageNum;
  final int stageTotal;
  final VoidCallback onRetry;
  final VoidCallback onHint;
  final VoidCallback onLevels;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    return _ModalBackdrop(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 330),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Container(
              width: double.infinity,
              margin: const EdgeInsets.only(top: 46),
              padding: const EdgeInsets.fromLTRB(20, 62, 20, 20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xF5FFFFFF),
                    Color(0xF5F0F7FF),
                    Color(0xF5E0EFFF),
                  ],
                ),
                borderRadius: BorderRadius.circular(34),
                border: Border.all(color: Colors.white, width: 2),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x99081844),
                    blurRadius: 48,
                    offset: Offset(0, 20),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const _ModalDivider(
                    lineColor: Color(0xFFFB7185),
                    circleBg: Color(0xFFFFE4E6),
                    circleBorder: Color(0xFFFDA4AF),
                    icon: Icons.error_outline_rounded,
                    iconColor: Color(0xFFE11D48),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Calculation Error!',
                    textAlign: TextAlign.center,
                    style: AppTheme.displayStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: const Color(0xFF4C0519),
                    ),
                  ),
                  const SizedBox(height: 3),
                  const Text(
                    "One or more equations don't balance.",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF64748B),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 10,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xE6FFF1F2),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFFECDD3)),
                    ),
                    child: const Column(
                      children: [
                        Text(
                          'DIAGNOSTIC ANALYSIS',
                          style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 9.5,
                            fontWeight: FontWeight.w800,
                            color: Color(0xCCBE123C),
                            letterSpacing: 0.7,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Check number placements & signs',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF9F1239),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),
                  _Primary3DButton(
                    label: 'Retry Game ($stageNum/$stageTotal)',
                    icon: Icons.refresh_rounded,
                    gradientColors: const [
                      Color(0xFFF43F5E),
                      Color(0xFFE11D48),
                      Color(0xFFBE123C),
                    ],
                    borderColor: const Color(0xFFFECDD3),
                    shadowColor: const Color(0xFF9F1239),
                    onTap: onRetry,
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: _SecondaryChipButton(
                          label: 'View Hint',
                          leadingEmoji: '💡',
                          gradientColors: const [
                            Color(0xFFFBBF24),
                            Color(0xFFEAB308),
                          ],
                          borderColor: const Color(0xFFFDE68A),
                          shadowColor: const Color(0xFFB45309),
                          textColor: AppTheme.amberDeepText,
                          onTap: onHint,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _SecondaryChipButton(
                          label: 'Missions',
                          leadingEmoji: '⊞',
                          gradientColors: const [
                            Color(0xFFE0F2FE),
                            Color(0xFFDBEAFE),
                          ],
                          borderColor: const Color(0xFF93C5FD),
                          shadowColor: const Color(0xFF93C5FD),
                          textColor: const Color(0xFF1E3A8A),
                          onTap: onLevels,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Positioned(
              top: 58,
              right: 14,
              child: _ModalCloseButton(
                bgColor: const Color(0xFFFFE4E6),
                iconColor: const Color(0xFF9F1239),
                onTap: onClose,
              ),
            ),
            Positioned(
              top: -6,
              left: 0,
              right: 0,
              child: Center(
                child: _FloatingHeroHeader(
                  haloColor: const Color(0xFFFECDD3),
                  heroWidget: Container(
                    width: 74,
                    height: 74,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Color(0xFFFB7185),
                          Color(0xFFF43F5E),
                          Color(0xFFBE123C),
                        ],
                      ),
                      border: Border.all(color: Colors.white, width: 3),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x80E11D48),
                          blurRadius: 18,
                          offset: Offset(0, 6),
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: const Icon(
                      Icons.close_rounded,
                      size: 40,
                      color: Colors.white,
                    ),
                  ),
                  ribbon: const _ArchedRibbonBanner(
                    leadingText: 'Try ',
                    accentText: 'Again',
                    topColor: Color(0xFFF43F5E),
                    midColor: Color(0xFFE11D48),
                    bottomColor: Color(0xFFBE123C),
                    strokeColor: Color(0xFFFDA4AF),
                    tailColor: Color(0xFF9F1239),
                    darkTailColor: Color(0xFF4C0519),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// =============================================================================
// 4. TIMEOUT MODAL (Shared by Campaign & Daily Challenge)
// =============================================================================

class TimeoutModal extends StatelessWidget {
  const TimeoutModal({
    super.key,
    required this.onRestart,
    required this.onExtraTime,
    required this.onExitHub,
    required this.exitLabel,
    required this.exitEmoji,
    required this.onClose,
  });

  final VoidCallback onRestart;
  final VoidCallback onExtraTime;
  final VoidCallback onExitHub;
  final String exitLabel;
  final String exitEmoji;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    return _ModalBackdrop(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 330),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Container(
              width: double.infinity,
              margin: const EdgeInsets.only(top: 46),
              padding: const EdgeInsets.fromLTRB(20, 62, 20, 20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xF5FFFFFF),
                    Color(0xF5F0F7FF),
                    Color(0xF5E0EFFF),
                  ],
                ),
                borderRadius: BorderRadius.circular(34),
                border: Border.all(color: Colors.white, width: 2),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x99081844),
                    blurRadius: 48,
                    offset: Offset(0, 20),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const _ModalDivider(
                    lineColor: Color(0xFF60A5FA),
                    circleBg: Color(0xFFDBEAFE),
                    circleBorder: Color(0xFF93C5FD),
                    icon: Icons.access_time_rounded,
                    iconColor: Color(0xFF2563EB),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Take a short break!',
                    textAlign: TextAlign.center,
                    style: AppTheme.displayStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: const Color(0xFF152A55),
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    "You can continue the game anytime you're ready.",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF4B618A),
                    ),
                  ),
                  const SizedBox(height: 18),
                  _Primary3DButton(
                    label: 'Restart',
                    icon: Icons.refresh_rounded,
                    gradientColors: const [
                      Color(0xFF3B82F6),
                      Color(0xFF2563EB),
                      Color(0xFF1D4ED8),
                    ],
                    borderColor: const Color(0xFFBFDBFE),
                    shadowColor: const Color(0xFF1E40AF),
                    onTap: onRestart,
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: _SecondaryChipButton(
                          label: '+30s Time',
                          leadingEmoji: '⚡',
                          gradientColors: const [
                            Color(0xFFFBBF24),
                            Color(0xFFEAB308),
                          ],
                          borderColor: const Color(0xFFFDE68A),
                          shadowColor: const Color(0xFFB45309),
                          textColor: AppTheme.amberDeepText,
                          onTap: onExtraTime,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _SecondaryChipButton(
                          label: exitLabel,
                          leadingEmoji: exitEmoji,
                          gradientColors: const [
                            Color(0xFFE0F2FE),
                            Color(0xFFDBEAFE),
                          ],
                          borderColor: const Color(0xFF93C5FD),
                          shadowColor: const Color(0xFF93C5FD),
                          textColor: const Color(0xFF1E3A8A),
                          onTap: onExitHub,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Positioned(
              top: 58,
              right: 14,
              child: _ModalCloseButton(
                bgColor: const Color(0xFFDBEAFE),
                iconColor: const Color(0xFF1E3A8A),
                onTap: onClose,
              ),
            ),
            Positioned(
              top: -8,
              left: 0,
              right: 0,
              child: Center(
                child: _FloatingHeroHeader(
                  haloColor: const Color(0xFFBAE6FD),
                  heroWidget: const SizedBox(
                    width: 78,
                    height: 78,
                    child: CustomPaint(painter: _HourglassPainter()),
                  ),
                  ribbon: const _ArchedRibbonBanner(
                    leadingText: 'Time ',
                    accentText: 'Out',
                    topColor: Color(0xFF3B82F6),
                    midColor: Color(0xFF2563EB),
                    bottomColor: Color(0xFF1D4ED8),
                    strokeColor: Color(0xFF60A5FA),
                    tailColor: Color(0xFF1E40AF),
                    darkTailColor: Color(0xFF172554),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HourglassPainter extends CustomPainter {
  const _HourglassPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final s = size.width / 100.0;
    final blueGrad = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Color(0xFF38BDF8), Color(0xFF0284C7), Color(0xFF0369A1)],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    final goldGrad = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Color(0xFFFEF08A), Color(0xFFF59E0B), Color(0xFFD97706)],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    // Glass body
    final glassPath = Path()
      ..moveTo(33 * s, 20 * s)
      ..cubicTo(33 * s, 42 * s, 46 * s, 48 * s, 46 * s, 50 * s)
      ..cubicTo(46 * s, 52 * s, 33 * s, 58 * s, 33 * s, 80 * s)
      ..lineTo(67 * s, 80 * s)
      ..cubicTo(67 * s, 58 * s, 54 * s, 52 * s, 54 * s, 50 * s)
      ..cubicTo(54 * s, 48 * s, 67 * s, 42 * s, 67 * s, 20 * s)
      ..close();
    canvas.drawPath(
      glassPath,
      Paint()..color = const Color(0x73E0F2FE),
    );
    canvas.drawPath(
      glassPath,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.4 * s
        ..color = const Color(0xFF38BDF8),
    );

    // Top sand
    final topSand = Path()
      ..moveTo(38 * s, 32 * s)
      ..cubicTo(38 * s, 43 * s, 47 * s, 47 * s, 50 * s, 49 * s)
      ..cubicTo(53 * s, 47 * s, 62 * s, 43 * s, 62 * s, 32 * s)
      ..close();
    canvas.drawPath(topSand, goldGrad);

    // Falling stream
    canvas.drawLine(
      Offset(50 * s, 49 * s),
      Offset(50 * s, 68 * s),
      Paint()
        ..color = const Color(0xFFFBBF24)
        ..strokeWidth = 2.0 * s,
    );

    // Bottom sand
    final bottomSand = Path()
      ..moveTo(36 * s, 78 * s)
      ..cubicTo(38 * s, 68 * s, 46 * s, 64 * s, 50 * s, 64 * s)
      ..cubicTo(54 * s, 64 * s, 62 * s, 68 * s, 64 * s, 78 * s)
      ..close();
    canvas.drawPath(bottomSand, goldGrad);

    // Top & bottom caps
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(50 * s, 18 * s),
        width: 44 * s,
        height: 14 * s,
      ),
      blueGrad,
    );
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(50 * s, 16 * s),
        width: 38 * s,
        height: 10 * s,
      ),
      Paint()..color = const Color(0xFF7DD3FC),
    );

    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(50 * s, 82 * s),
        width: 44 * s,
        height: 14 * s,
      ),
      blueGrad,
    );
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(50 * s, 80 * s),
        width: 38 * s,
        height: 10 * s,
      ),
      Paint()..color = const Color(0xFF0284C7),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// =============================================================================
// 5. PAUSE MODAL
// =============================================================================

class PauseModal extends StatelessWidget {
  const PauseModal({
    super.key,
    required this.title,
    required this.subtitle,
    required this.onResume,
    required this.onRestart,
    required this.onExit,
    required this.exitLabel,
  });

  final String title;
  final String subtitle;
  final VoidCallback onResume;
  final VoidCallback onRestart;
  final VoidCallback onExit;
  final String exitLabel;

  @override
  Widget build(BuildContext context) {
    return _ModalBackdrop(
      onTapOutside: onResume,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 316),
        child: Container(
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Color(0xFF142B66), Color(0xFF0A1638)],
            ),
            borderRadius: BorderRadius.circular(28),
            border: Border.all(
              color: AppTheme.cyanNeon.withValues(alpha: 0.65),
              width: 1.8,
            ),
            boxShadow: const [
              BoxShadow(
                color: Color(0x6600E5FF),
                blurRadius: 28,
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    colors: [Color(0xFFFDE047), Color(0xFFF59E0B)],
                  ),
                  border: Border.all(color: Colors.white, width: 2),
                ),
                child: const Icon(
                  Icons.pause_rounded,
                  size: 34,
                  color: AppTheme.amberDeepText,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: AppTheme.displayStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.cyanLight,
                ),
              ),
              const SizedBox(height: 18),
              _Primary3DButton(
                label: 'Resume Mission',
                icon: Icons.play_arrow_rounded,
                gradientColors: const [
                  Color(0xFF34D399),
                  Color(0xFF10B981),
                  Color(0xFF059669),
                ],
                borderColor: const Color(0xFFA7F3D0),
                shadowColor: const Color(0xFF064E3B),
                onTap: onResume,
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: _SecondaryChipButton(
                      label: 'Restart',
                      leadingEmoji: '↻',
                      gradientColors: const [
                        Color(0xFF1E40AF),
                        Color(0xFF1D4ED8),
                      ],
                      borderColor: AppTheme.cyanSky,
                      shadowColor: const Color(0xFF0C235C),
                      textColor: Colors.white,
                      onTap: onRestart,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _SecondaryChipButton(
                      label: exitLabel,
                      leadingEmoji: '⊞',
                      gradientColors: const [
                        Color(0xFF1E293B),
                        Color(0xFF0F172A),
                      ],
                      borderColor: const Color(0xFF64748B),
                      shadowColor: const Color(0xFF020617),
                      textColor: const Color(0xFFE2E8F0),
                      onTap: onExit,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// =============================================================================
// 6. INSTRUCTIONS MODAL (Campaign & Daily Challenge)
// =============================================================================

class InstructionsModal extends StatelessWidget {
  const InstructionsModal({
    super.key,
    required this.headline,
    required this.subtitle,
    required this.heroEmoji,
    required this.sections,
    required this.onClose,
  });

  factory InstructionsModal.campaign({
    required int levelNum,
    required VoidCallback onClose,
  }) {
    return InstructionsModal(
      headline: 'Mission L$levelNum // How to Play',
      subtitle: 'Follow these mission rules to solve the math puzzle grid:',
      heroEmoji: '📐',
      onClose: onClose,
      sections: const [
        InstructionCardData(
          emoji: '🔢',
          title: '1. Equation Balance',
          body:
              'Fill all blank target slots on the grid. Every equation evaluates sequentially from left-to-right and top-to-bottom to equal the target result.',
          bgColor: Color(0xE6FFFFFF),
          borderColor: Color(0xFFBFDBFE),
          titleColor: Color(0xFF172554),
        ),
        InstructionCardData(
          emoji: '🔗',
          title: '2. Intersecting Tiles',
          body:
              'Number tiles placed at intersection points must satisfy both the horizontal row and vertical column equations simultaneously.',
          bgColor: Color(0xFFEFF6FF),
          borderColor: Color(0xFF67E8F9),
          titleColor: Color(0xFF1E3A8A),
        ),
        InstructionCardData(
          emoji: '👆',
          title: '3. Number Placement',
          body:
              'Tap any empty slot on the grid, then tap a number from the green tray below (or drag & drop). Use Undo or Reroll ↻ anytime!',
          bgColor: Color(0xFFFAF5FF),
          borderColor: Color(0xFFD8B4FE),
          titleColor: Color(0xFF581C87),
        ),
        InstructionCardData(
          emoji: '💡',
          title: '4. Tactical Math Tip',
          body:
              'Remember: Even + Odd = Odd and Even + Even = Even. Check the target numbers to quickly eliminate impossible tiles!',
          bgColor: Color(0xFFFFFBEB),
          borderColor: Color(0xFFFCD34D),
          titleColor: Color(0xFF451A03),
        ),
      ],
    );
  }

  factory InstructionsModal.daily({
    required int dayNum,
    required DailyChallengePuzzle puzzle,
    required VoidCallback onClose,
  }) {
    return InstructionsModal(
      headline: 'Quantum Reactor Calibration',
      subtitle: 'Follow these mission parameters to balance all cores:',
      heroEmoji: '📘',
      onClose: onClose,
      sections: [
        InstructionCardData(
          emoji: '🧬',
          title: 'Mission Objective',
          body:
              'Balance all 3 Reactor Cores simultaneously and lock the central Connected Resonance Link to clear Day $dayNum.',
          bgColor: const Color(0xE6FFFFFF),
          borderColor: const Color(0xFFBFDBFE),
          titleColor: const Color(0xFF172554),
        ),
        InstructionCardData(
          emoji: '🔵',
          title: 'Core Alpha // Row 1 (Target = ${puzzle.targetAlpha})',
          formula:
              '(α-1 ${puzzle.rowAlpha.op1} α-2) ${puzzle.rowAlpha.op2} α-3 = ${puzzle.targetAlpha}',
          body:
              'Place data chips in Core Alpha to balance equation 1 to target ${puzzle.targetAlpha}.',
          bgColor: const Color(0xFFEFF6FF),
          borderColor: const Color(0xFF67E8F9),
          titleColor: const Color(0xFF1E3A8A),
        ),
        InstructionCardData(
          emoji: '🟣',
          title: 'Core Beta // Row 2 (Target = ${puzzle.targetBeta})',
          formula:
              '(β-1 ${puzzle.rowBeta.op1} β-2) ${puzzle.rowBeta.op2} β-3 = ${puzzle.targetBeta}',
          body:
              'Place data chips in Core Beta to balance equation 2 to target ${puzzle.targetBeta}.',
          bgColor: const Color(0xFFFAF5FF),
          borderColor: const Color(0xFFD8B4FE),
          titleColor: const Color(0xFF581C87),
        ),
        InstructionCardData(
          emoji: '🟢',
          title: 'Core Gamma // Row 3 (Target = ${puzzle.targetGamma})',
          formula:
              '(γ-1 ${puzzle.rowGamma.op1} γ-2) ${puzzle.rowGamma.op2} γ-3 = ${puzzle.targetGamma}',
          body:
              'Place data chips in Core Gamma to balance equation 3 to target ${puzzle.targetGamma}.',
          bgColor: const Color(0xFFECFDF5),
          borderColor: const Color(0xFF6EE7B7),
          titleColor: const Color(0xFF064E3B),
        ),
        InstructionCardData(
          emoji: '🔗',
          title: 'Connected Resonance Link (Target = ${puzzle.targetLink})',
          formula:
              'α-2 ${puzzle.colLink.op1} β-2 ${puzzle.colLink.op2} γ-2 = ${puzzle.targetLink}',
          body:
              'The central column connects all 3 cores vertically! Both rows and the column must balance!',
          bgColor: const Color(0xFFFFFBEB),
          borderColor: const Color(0xFFFCD34D),
          titleColor: const Color(0xFF451A03),
        ),
      ],
    );
  }

  final String headline;
  final String subtitle;
  final String heroEmoji;
  final List<InstructionCardData> sections;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    final maxH = MediaQuery.of(context).size.height * 0.72;
    return _ModalBackdrop(
      onTapOutside: onClose,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: 335, maxHeight: maxH),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Container(
              width: double.infinity,
              margin: const EdgeInsets.only(top: 40),
              padding: const EdgeInsets.fromLTRB(16, 48, 16, 16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xF5FFFFFF),
                    Color(0xF5F0F7FF),
                    Color(0xF5E0EFFF),
                  ],
                ),
                borderRadius: BorderRadius.circular(30),
                border: Border.all(color: Colors.white, width: 2),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x99081844),
                    blurRadius: 48,
                    offset: Offset(0, 20),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const _ModalDivider(
                    lineColor: Color(0xFF60A5FA),
                    circleBg: Color(0xFFDBEAFE),
                    circleBorder: Color(0xFF93C5FD),
                    icon: Icons.menu_book_rounded,
                    iconColor: Color(0xFF2563EB),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    headline,
                    textAlign: TextAlign.center,
                    style: AppTheme.displayStyle(
                      fontSize: 15.5,
                      fontWeight: FontWeight.w900,
                      color: const Color(0xFF152A55),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 10.5,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF4B618A),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Flexible(
                    child: SingleChildScrollView(
                      child: Column(
                        children: [
                          for (final sec in sections) ...[
                            Container(
                              width: double.infinity,
                              margin: const EdgeInsets.only(bottom: 7),
                              padding: const EdgeInsets.all(9),
                              decoration: BoxDecoration(
                                color: sec.bgColor,
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: sec.borderColor),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        sec.emoji,
                                        style: const TextStyle(fontSize: 12),
                                      ),
                                      const SizedBox(width: 5),
                                      Expanded(
                                        child: Text(
                                          sec.title,
                                          style: TextStyle(
                                            fontSize: 10.5,
                                            fontWeight: FontWeight.w900,
                                            color: sec.titleColor,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  if (sec.formula != null) ...[
                                    const SizedBox(height: 4),
                                    Container(
                                      width: double.infinity,
                                      padding: const EdgeInsets.symmetric(
                                        vertical: 4,
                                        horizontal: 8,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(8),
                                        border:
                                            Border.all(color: sec.borderColor),
                                      ),
                                      child: Text(
                                        sec.formula!,
                                        textAlign: TextAlign.center,
                                        style: AppTheme.hudNumberStyle(
                                          fontSize: 11,
                                          color: sec.titleColor,
                                        ),
                                      ),
                                    ),
                                  ],
                                  const SizedBox(height: 3),
                                  Text(
                                    sec.body,
                                    style: const TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF334155),
                                      height: 1.3,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  _Primary3DButton(
                    label: '✓ Got It! Resume Mission',
                    gradientColors: const [
                      Color(0xFF3B82F6),
                      Color(0xFF2563EB),
                      Color(0xFF1D4ED8),
                    ],
                    borderColor: const Color(0xFFBFDBFE),
                    shadowColor: const Color(0xFF1E40AF),
                    onTap: onClose,
                  ),
                ],
              ),
            ),
            Positioned(
              top: 52,
              right: 12,
              child: _ModalCloseButton(
                bgColor: const Color(0xFFDBEAFE),
                iconColor: const Color(0xFF1E3A8A),
                onTap: onClose,
              ),
            ),
            Positioned(
              top: -8,
              left: 0,
              right: 0,
              child: Center(
                child: _FloatingHeroHeader(
                  haloColor: const Color(0xFFBAE6FD),
                  heroWidget: Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Color(0xFF38BDF8),
                          Color(0xFF0284C7),
                          Color(0xFF0369A1),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: const Color(0xFFA5F3FC),
                        width: 2,
                      ),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x800EA5E9),
                          blurRadius: 14,
                          offset: Offset(0, 5),
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      heroEmoji,
                      style: const TextStyle(fontSize: 26),
                    ),
                  ),
                  ribbon: const _ArchedRibbonBanner(
                    leadingText: '',
                    accentText: 'Instructions',
                    topColor: Color(0xFF3B82F6),
                    midColor: Color(0xFF2563EB),
                    bottomColor: Color(0xFF1D4ED8),
                    strokeColor: Color(0xFF60A5FA),
                    tailColor: Color(0xFF1E40AF),
                    darkTailColor: Color(0xFF172554),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class InstructionCardData {
  const InstructionCardData({
    required this.emoji,
    required this.title,
    required this.body,
    required this.bgColor,
    required this.borderColor,
    required this.titleColor,
    this.formula,
  });

  final String emoji;
  final String title;
  final String body;
  final String? formula;
  final Color bgColor;
  final Color borderColor;
  final Color titleColor;
}

class _ModalCloseButton extends StatelessWidget {
  const _ModalCloseButton({
    required this.bgColor,
    required this.iconColor,
    required this.onTap,
  });

  final Color bgColor;
  final Color iconColor;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: bgColor,
      shape: const CircleBorder(),
      child: InkWell(
        onTap: onTap,
        customBorder: const CircleBorder(),
        child: Container(
          width: 30,
          height: 30,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 1.5),
          ),
          child: Icon(Icons.close_rounded, size: 16, color: iconColor),
        ),
      ),
    );
  }
}

// =============================================================================
// 7. ADMOB DEMO INTERSTITIAL & REWARDED OVERLAY MODALS (#07112B Zero-Flicker)
// =============================================================================

/// Dark zero-flicker AdMob Demo Interstitial overlay modal (`#07112B`).
/// Used as a safe fallback overlay when native InterstitialAd isn't loaded yet.
class AdMobInterstitialModal extends StatefulWidget {
  const AdMobInterstitialModal({
    super.key,
    required this.isVisible,
    required this.onClose,
  });

  final bool isVisible;
  final VoidCallback onClose;

  @override
  State<AdMobInterstitialModal> createState() => _AdMobInterstitialModalState();
}

class _AdMobInterstitialModalState extends State<AdMobInterstitialModal> {
  int _countdown = 3;
  Timer? _timer;

  @override
  void didUpdateWidget(covariant AdMobInterstitialModal oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isVisible && !oldWidget.isVisible) {
      _startCountdown();
    } else if (!widget.isVisible && oldWidget.isVisible) {
      _timer?.cancel();
    }
  }

  @override
  void initState() {
    super.initState();
    if (widget.isVisible) {
      _startCountdown();
    }
  }

  void _startCountdown() {
    _timer?.cancel();
    _countdown = 3;
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) return;
      setState(() {
        if (_countdown > 0) {
          _countdown--;
        } else {
          t.cancel();
        }
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.isVisible) return const SizedBox.shrink();

    return Positioned.fill(
      child: Material(
        color: const Color(0xFF07112B),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.gold,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        'TEST AD',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF020617),
                          letterSpacing: 0.8,
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: _countdown == 0 ? widget.onClose : null,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: _countdown == 0
                              ? AppTheme.cyanNeon.withValues(alpha: 0.2)
                              : const Color(0xFF0E1D47),
                          borderRadius: BorderRadius.circular(999),
                          border: Border.all(
                            color: _countdown == 0
                                ? AppTheme.cyanNeon
                                : const Color(0xFF334155),
                          ),
                        ),
                        child: Text(
                          _countdown == 0 ? 'Close ✕' : 'Wait ${_countdown}s',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0C1B44),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: AppTheme.cyanNeon.withValues(alpha: 0.35),
                    ),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Image.asset(
                        AppAssets.heroScifi,
                        width: 96,
                        height: 96,
                        fit: BoxFit.contain,
                      ),
                      const SizedBox(height: 14),
                      Text(
                        'Google AdMob Demo Interstitial',
                        textAlign: TextAlign.center,
                        style: AppTheme.displayStyle(
                          fontSize: 19,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        AdMobConfig.interstitialAdUnitId,
                        textAlign: TextAlign.center,
                        style: AppTheme.hudNumberStyle(
                          fontSize: 11,
                          color: AppTheme.cyanSky,
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        'Upgrade to PRO VIP in Rewards Shop to disable all Banner & Interstitial ads permanently.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF94A3B8),
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Dark zero-flicker AdMob Demo Rewarded Video overlay modal (`#07112B`).
class AdMobRewardedModal extends StatefulWidget {
  const AdMobRewardedModal({
    super.key,
    required this.reward,
    required this.onClaim,
    required this.onCancel,
  });

  final AdRewardInfo? reward;
  final VoidCallback onClaim;
  final VoidCallback onCancel;

  @override
  State<AdMobRewardedModal> createState() => _AdMobRewardedModalState();
}

class _AdMobRewardedModalState extends State<AdMobRewardedModal> {
  int _secondsRemaining = 4;
  Timer? _timer;

  @override
  void didUpdateWidget(covariant AdMobRewardedModal oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.reward != null && oldWidget.reward == null) {
      _startTimer();
    } else if (widget.reward == null && oldWidget.reward != null) {
      _timer?.cancel();
    }
  }

  @override
  void initState() {
    super.initState();
    if (widget.reward != null) {
      _startTimer();
    }
  }

  void _startTimer() {
    _timer?.cancel();
    _secondsRemaining = 4;
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) return;
      setState(() {
        if (_secondsRemaining > 0) {
          _secondsRemaining--;
        } else {
          t.cancel();
        }
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reward = widget.reward;
    if (reward == null) return const SizedBox.shrink();

    final canClaim = _secondsRemaining == 0;

    return Positioned.fill(
      child: Material(
        color: const Color(0xFF07112B),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.gold,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        'REWARDED TEST AD',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF020617),
                          letterSpacing: 0.8,
                        ),
                      ),
                    ),
                    TextButton(
                      onPressed: widget.onCancel,
                      child: const Text(
                        'Cancel',
                        style: TextStyle(
                          color: Color(0xFF94A3B8),
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0C1B44),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: AppTheme.emerald.withValues(alpha: 0.45),
                    ),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.play_circle_fill_rounded,
                        size: 64,
                        color: AppTheme.cyanNeon,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        reward.title,
                        textAlign: TextAlign.center,
                        style: AppTheme.displayStyle(
                          fontSize: 19,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        AdMobConfig.rewardedAdUnitId,
                        textAlign: TextAlign.center,
                        style: AppTheme.hudNumberStyle(
                          fontSize: 11,
                          color: AppTheme.cyanSky,
                        ),
                      ),
                      const SizedBox(height: 16),
                      _Primary3DButton(
                        label: canClaim
                            ? 'Claim Reward Now ✓'
                            : 'Reward unlocks in ${_secondsRemaining}s...',
                        gradientColors: canClaim
                            ? const [
                                Color(0xFF34D399),
                                Color(0xFF10B981),
                                Color(0xFF059669),
                              ]
                            : const [
                                Color(0xFF334155),
                                Color(0xFF1E293B),
                              ],
                        borderColor: canClaim
                            ? const Color(0xFFA7F3D0)
                            : const Color(0xFF475569),
                        shadowColor: canClaim
                            ? const Color(0xFF064E3B)
                            : const Color(0xFF0F172A),
                        onTap: canClaim ? widget.onClaim : () {},
                      ),
                    ],
                  ),
                ),
                const Spacer(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';

/// Arena Battle Mode Screen.
///
/// Mirrors `renderBattleScreen` in `src/legacyApp.jsx` with the seasonal
/// crest, win/loss telemetry, energy progress bar, and Battle launch CTA.
class BattleScreen extends StatelessWidget {
  const BattleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final game = context.watch<GameController>();
    final monthShort = game.currentMonthShort;
    final completed = game.completedLevelsCount;

    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFFFF3DD), Color(0xFFEDF7FF)],
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      _LightCircleBtn(
                        onTap: () => game.navigateTo(AppScreen.home),
                        tooltip: 'Back to Home',
                        child: const Icon(
                          Icons.arrow_back_rounded,
                          color: Color(0xFF1E293B),
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        'Battle',
                        style: AppTheme.displayStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.lightInk,
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      _LightCircleBtn(
                        onTap: () => game.navigateTo(AppScreen.leaderboard),
                        tooltip: 'Trophy leaderboard',
                        child: const Text('🏆', style: TextStyle(fontSize: 20)),
                      ),
                      const SizedBox(width: 8),
                      _LightCircleBtn(
                        onTap: () => game.navigateTo(AppScreen.help),
                        tooltip: 'Battle information',
                        child: const Text(
                          'ⓘ',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF1E3A8A),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 14),
              // Season & Tickets Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Flexible(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 7,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xBF334155),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        '$monthShort  |  ◴ 22d 10h',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Flexible(
                    flex: 0,
                    child: GestureDetector(
                      onTap: () => game.navigateTo(AppScreen.achievements),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xB3334155),
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              '🎟️  13  ',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              '+',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF93C5FD),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const Spacer(),
              // Center Battle Crest
              Stack(
                clipBehavior: Clip.none,
                alignment: Alignment.bottomCenter,
                children: [
                  Container(
                    width: 144,
                    height: 144,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(34),
                      gradient: const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Color(0xFFF2CBC1),
                          Color(0xFFBF7B72),
                          Color(0xFF8F5662),
                        ],
                      ),
                      border: Border.all(
                        color: const Color(0xFFDCA9A2),
                        width: 10,
                      ),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x40704147),
                          blurRadius: 24,
                          offset: Offset(0, 12),
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: const Text(
                      '✦',
                      style: TextStyle(
                        fontSize: 68,
                        color: Colors.white,
                        shadows: [
                          Shadow(
                            color: Color(0x40000000),
                            offset: Offset(0, 3),
                            blurRadius: 6,
                          ),
                        ],
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: -20,
                    child: Container(
                      width: 46,
                      height: 46,
                      decoration: BoxDecoration(
                        color: const Color(0xFFC87875),
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 4),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x33000000),
                            blurRadius: 8,
                            offset: Offset(0, 3),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        '${game.activePlayerLevel}',
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 42),
              // Wins | Losses
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  RichText(
                    text: TextSpan(
                      style: const TextStyle(
                        fontSize: 17,
                        color: AppTheme.lightInk,
                      ),
                      children: [
                        const TextSpan(text: 'Wins '),
                        TextSpan(
                          text: '$completed',
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF059669),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 18),
                    child: Text(
                      '|',
                      style: TextStyle(fontSize: 18, color: Color(0xFF94A3B8)),
                    ),
                  ),
                  RichText(
                    text: const TextSpan(
                      style: TextStyle(
                        fontSize: 17,
                        color: AppTheme.lightInk,
                      ),
                      children: [
                        TextSpan(text: 'Losses '),
                        TextSpan(
                          text: '0',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            color: AppTheme.lightInk,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 28),
              // Energy Progress Bar
              FractionallySizedBox(
                widthFactor: 0.78,
                child: Row(
                  children: [
                    Expanded(
                      child: Container(
                        height: 12,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(999),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x1A000000),
                              blurRadius: 4,
                              offset: Offset(0, 1),
                            ),
                          ],
                        ),
                        alignment: Alignment.centerLeft,
                        child: FractionallySizedBox(
                          widthFactor: (completed / 3).clamp(0.0, 1.0),
                          child: Container(
                            decoration: BoxDecoration(
                              color: const Color(0xFF3B82F6),
                              borderRadius: BorderRadius.circular(999),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Text('⚡', style: TextStyle(fontSize: 36)),
                  ],
                ),
              ),
              const SizedBox(height: 2),
              Text(
                '${completed.clamp(0, 3)} / 3',
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF334155),
                ),
              ),
              const Spacer(),
              // Primary Start CTA
              Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () => game.attemptStartLevel(),
                  borderRadius: BorderRadius.circular(999),
                  child: Ink(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 13),
                    decoration: BoxDecoration(
                      color: AppTheme.bluePrimary,
                      borderRadius: BorderRadius.circular(999),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x332D63D8),
                          blurRadius: 12,
                          offset: Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text(
                          'Start',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '🔒 ($completed/20)   🎟️ ×1',
                          style: const TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            color: Color(0xBFFFFFFF),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }
}

class _LightCircleBtn extends StatelessWidget {
  const _LightCircleBtn({
    required this.onTap,
    required this.child,
    required this.tooltip,
  });

  final VoidCallback onTap;
  final Widget child;
  final String tooltip;

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: tooltip,
      child: Material(
        color: Colors.white,
        shape: const CircleBorder(),
        elevation: 2,
        child: InkWell(
          onTap: onTap,
          customBorder: const CircleBorder(),
          child: SizedBox(
            width: 42,
            height: 42,
            child: Center(child: child),
          ),
        ),
      ),
    );
  }
}

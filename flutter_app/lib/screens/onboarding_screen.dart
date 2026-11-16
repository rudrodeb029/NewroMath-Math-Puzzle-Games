import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';

/// 2. ONBOARDING SCREEN — Floating Math Symbols + Lightbulb Hero.
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _floatController;

  @override
  void initState() {
    super.initState();
    _floatController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2800),
    )..repeat();
  }

  @override
  void dispose() {
    _floatController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.read<GameController>();

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
          child: Column(
            children: [
              // Top-right Skip action
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () => controller.navigateTo(AppScreen.home),
                  child: const Text(
                    'Skip',
                    style: TextStyle(
                      color: Color(0xFF2563EB),
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
              const Spacer(),
              // Center Graphic
              SizedBox(
                width: 224,
                height: 224,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // Soft radial glow
                    Container(
                      width: 200,
                      height: 200,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [
                            Color(0x99DBEAFE),
                            Color(0x00DBEAFE),
                          ],
                        ),
                      ),
                    ),
                    // Floating math symbols
                    _floatingBadge(
                      top: 8,
                      left: 24,
                      phase: 0.0,
                      symbol: '+',
                      color: const Color(0xFF3B82F6),
                    ),
                    _floatingBadge(
                      top: 24,
                      right: 24,
                      phase: 1.5,
                      symbol: '-',
                      color: const Color(0xFF2DD4BF),
                    ),
                    _floatingBadge(
                      bottom: 40,
                      left: 24,
                      phase: 3.1,
                      symbol: '÷',
                      color: const Color(0xFF2563EB),
                    ),
                    _floatingBadge(
                      bottom: 24,
                      right: 32,
                      phase: 4.7,
                      symbol: '=',
                      color: const Color(0xFF2DD4BF),
                    ),
                    // Central Glowing Lightbulb
                    Container(
                      width: 96,
                      height: 96,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: const Color(0xFFFEF3C7),
                        border: Border.all(
                          color: const Color(0xFFFCD34D),
                          width: 4,
                        ),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x26000000),
                            blurRadius: 20,
                            offset: Offset(0, 8),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: const Text('💡', style: TextStyle(fontSize: 44)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),
              Text(
                'Sharpen Your Mind\nwith Math Puzzles',
                textAlign: TextAlign.center,
                style: AppTheme.displayStyle(
                  fontSize: 27,
                  fontWeight: FontWeight.w900,
                  color: const Color(0xFF0F172A),
                  height: 1.15,
                ),
              ),
              const SizedBox(height: 12),
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 300),
                child: const Text(
                  'Fun, challenging and educational puzzles to boost your brain power.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    color: Color(0xFF64748B),
                    height: 1.45,
                  ),
                ),
              ),
              const Spacer(),
              // Pagination dots
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 24,
                    height: 8,
                    decoration: BoxDecoration(
                      color: const Color(0xFF2563EB),
                      borderRadius: BorderRadius.circular(999),
                    ),
                  ),
                  const SizedBox(width: 6),
                  _dot(),
                  const SizedBox(width: 6),
                  _dot(),
                  const SizedBox(width: 6),
                  _dot(),
                ],
              ),
              const SizedBox(height: 24),
              // Next Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => controller.navigateTo(AppScreen.home),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2563EB),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 6,
                    shadowColor: const Color(0x403B82F6),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Next',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(width: 8),
                      Text(
                        '→',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _dot() {
    return Container(
      width: 8,
      height: 8,
      decoration: const BoxDecoration(
        shape: BoxShape.circle,
        color: Color(0xFFCBD5E1),
      ),
    );
  }

  Widget _floatingBadge({
    double? top,
    double? bottom,
    double? left,
    double? right,
    required double phase,
    required String symbol,
    required Color color,
  }) {
    return Positioned(
      top: top,
      bottom: bottom,
      left: left,
      right: right,
      child: AnimatedBuilder(
        animation: _floatController,
        builder: (context, child) {
          final dy = math.sin(_floatController.value * 2 * math.pi + phase) * 5.0;
          return Transform.translate(offset: Offset(0, dy), child: child);
        },
        child: Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(12),
            boxShadow: const [
              BoxShadow(
                color: Color(0x26000000),
                blurRadius: 8,
                offset: Offset(0, 4),
              ),
            ],
          ),
          alignment: Alignment.center,
          child: Text(
            symbol,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w900,
              height: 1.0,
            ),
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/levels_catalog.dart';
import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';

/// 1. SPLASH SCREEN — Clean 2x2 Squaricle Logo + Bottom Wave.
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  bool _precached = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_precached) {
      _precached = true;
      for (final asset in const [
        AppAssets.heroScifi,
        AppAssets.cardDaily,
        AppAssets.cardLevel,
        AppAssets.cardRewards,
        AppAssets.cardContinue,
        'assets/images/card_newgame_clean_bg.webp',
        AppAssets.robotAvatar,
        AppAssets.goldCoin,
        AppAssets.gem,
      ]) {
        precacheImage(AssetImage(asset), context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.read<GameController>();

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () => controller.navigateTo(AppScreen.onboarding),
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SafeArea(
          bottom: false,
          child: Column(
            children: [
              const Spacer(),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // 2x2 Squaricle App Icon
                    Container(
                      width: 96,
                      height: 96,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xB3EFF6FF),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: const Color(0xFFDBEAFE)),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x1A3B82F6),
                            blurRadius: 24,
                            offset: Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Expanded(
                            child: Row(
                              children: [
                                _squaricle(const Color(0xFF2563EB)),
                                const SizedBox(width: 6),
                                _squaricle(const Color(0xFF2DD4BF)),
                              ],
                            ),
                          ),
                          const SizedBox(height: 6),
                          Expanded(
                            child: Row(
                              children: [
                                _squaricle(const Color(0xFF2563EB)),
                                const SizedBox(width: 6),
                                _squaricle(const Color(0xFF2DD4BF)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Math Puzzle',
                      style: AppTheme.displayStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.w900,
                        color: const Color(0xFF0F172A),
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'THINK • SOLVE • GROW',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF94A3B8),
                        letterSpacing: 2.2,
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              // Bottom Layered Wave Aesthetic
              SizedBox(
                width: double.infinity,
                height: 112,
                child: Stack(
                  alignment: Alignment.bottomCenter,
                  children: [
                    Positioned.fill(
                      child: CustomPaint(
                        painter: _SplashWavePainter(),
                      ),
                    ),
                    Positioned(
                      bottom: 12,
                      child: Container(
                        width: 128,
                        height: 4,
                        decoration: BoxDecoration(
                          color: const Color(0xFFCBD5E1),
                          borderRadius: BorderRadius.circular(999),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _squaricle(Color color) {
    return Expanded(
      child: Container(
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(12),
          boxShadow: const [
            BoxShadow(
              color: Color(0x1A000000),
              blurRadius: 3,
              offset: Offset(0, 1),
            ),
          ],
        ),
        alignment: Alignment.center,
        child: const Text(
          '+',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.w800,
            height: 1.0,
          ),
        ),
      ),
    );
  }
}

class _SplashWavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    final path1 = Path()
      ..moveTo(0, h * 0.50)
      ..cubicTo(w * 0.30, h * 0.08, w * 0.60, h * 0.84, w, h * 0.34)
      ..lineTo(w, h)
      ..lineTo(0, h)
      ..close();
    canvas.drawPath(path1, Paint()..color = const Color(0xFFEFF6FF));

    final path2 = Path()
      ..moveTo(0, h * 0.67)
      ..cubicTo(w * 0.35, h * 0.34, w * 0.65, h * 0.92, w, h * 0.54)
      ..lineTo(w, h)
      ..lineTo(0, h)
      ..close();
    canvas.drawPath(
      path2,
      Paint()..color = const Color(0xFFDBEAFE).withValues(alpha: 0.6),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

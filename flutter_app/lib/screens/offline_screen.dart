import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';

/// Offline Mode screen (`renderOfflineScreen` parity).
class OfflineScreen extends StatelessWidget {
  const OfflineScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<GameController>();

    return Container(
      color: Colors.white,
      child: Column(
        children: [
          SizedBox(height: MediaQuery.of(context).padding.top + 16),
          Expanded(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: const Color(0xFFEFF6FF),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: const Color(0xFFDBEAFE)),
                      ),
                      alignment: Alignment.center,
                      child: const Text('📡', style: TextStyle(fontSize: 34)),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Offline Mode',
                      style: AppTheme.displayStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: const Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      "You're offline.\nNo internet connection detected.\nYou can still play saved puzzles and access some features.",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 12.5,
                        color: Color(0xFF64748B),
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2563EB),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 4,
                        ),
                        onPressed: () => controller.navigateTo(AppScreen.home),
                        child: const Text(
                          'Continue Offline',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextButton(
                      onPressed: () => controller.navigateTo(AppScreen.home),
                      child: const Text(
                        'Check Connection',
                        style: TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF2563EB),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SizedBox(
            width: double.infinity,
            height: 80,
            child: CustomPaint(painter: _MountainLandscapePainter()),
          ),
        ],
      ),
    );
  }
}

class _MountainLandscapePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final sx = size.width / 400.0;
    final sy = size.height / 80.0;

    final backPath = Path()
      ..moveTo(0, 50 * sy)
      ..lineTo(60 * sx, 30 * sy)
      ..lineTo(140 * sx, 60 * sy)
      ..lineTo(220 * sx, 20 * sy)
      ..lineTo(310 * sx, 60 * sy)
      ..lineTo(400 * sx, 35 * sy)
      ..lineTo(400 * sx, 80 * sy)
      ..lineTo(0, 80 * sy)
      ..close();
    canvas.drawPath(backPath, Paint()..color = const Color(0xFFF1F5F9));

    final frontPath = Path()
      ..moveTo(0, 65 * sy)
      ..lineTo(80 * sx, 45 * sy)
      ..lineTo(180 * sx, 70 * sy)
      ..lineTo(280 * sx, 40 * sy)
      ..lineTo(400 * sx, 60 * sy)
      ..lineTo(400 * sx, 80 * sy)
      ..lineTo(0, 80 * sy)
      ..close();
    canvas.drawPath(
      frontPath,
      Paint()..color = const Color(0x99E2E8F0),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

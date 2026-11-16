import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/game_models.dart';
import '../state/game_controller.dart';

/// Monthly Trophies / Awards screen (`renderAchievementsScreen` parity).
class AchievementsScreen extends StatelessWidget {
  const AchievementsScreen({super.key});

  static const List<String> _awardTabs = ['▦', '♜', '▤', '⚔'];
  static const List<String> _months = [
    'Oct',
    'Sep',
    'Aug',
    'Jul',
    'Jun',
    'May',
    'Apr',
    'Mar',
    'Feb',
    'Jan',
    'Dec',
    'Nov',
  ];

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<GameController>();

    return Container(
      color: Colors.white,
      child: Column(
        children: [
          Container(
            color: Colors.white,
            padding: EdgeInsets.fromLTRB(
              20,
              MediaQuery.of(context).padding.top + 14,
              20,
              12,
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    GestureDetector(
                      onTap: () => controller.navigateTo(AppScreen.home),
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: Color(0xFFF1F1F2),
                        ),
                        alignment: Alignment.center,
                        child: const Text(
                          '‹',
                          style: TextStyle(
                            fontSize: 30,
                            height: 1.0,
                            color: Color(0xFF31569A),
                          ),
                        ),
                      ),
                    ),
                    const Text(
                      'Awards',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF16171B),
                      ),
                    ),
                    const SizedBox(width: 44, height: 44),
                  ],
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F1F1),
                    borderRadius: BorderRadius.circular(99),
                  ),
                  child: Row(
                    children: List.generate(_awardTabs.length, (i) {
                      final isActive = i == 0;
                      return Expanded(
                        child: GestureDetector(
                          onTap: () {
                            if (i == 1) {
                              controller.navigateTo(AppScreen.leaderboard);
                            } else if (i == 3) {
                              controller.navigateTo(AppScreen.battle);
                            }
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 7),
                            decoration: BoxDecoration(
                              color: isActive
                                  ? const Color(0xFF2E64D6)
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(99),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              _awardTabs[i],
                              style: TextStyle(
                                fontSize: 19,
                                color: isActive
                                    ? Colors.white
                                    : const Color(0xFF8C8C8C),
                              ),
                            ),
                          ),
                        ),
                      );
                    }),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(20, 14, 20, 24),
              child: Column(
                children: [
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _months.length,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      mainAxisSpacing: 14,
                      crossAxisSpacing: 8,
                      childAspectRatio: 0.78,
                    ),
                    itemBuilder: (context, i) {
                      final month = _months[i];
                      return GestureDetector(
                        onTap: () {
                          controller.selectDailyDay(i + 1);
                          controller.navigateTo(AppScreen.daily);
                        },
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Opacity(
                              opacity: 0.4,
                              child: ColorFiltered(
                                colorFilter: const ColorFilter.mode(
                                  Colors.grey,
                                  BlendMode.saturation,
                                ),
                                child: const Text(
                                  '🏆',
                                  style: TextStyle(fontSize: 64),
                                ),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              month,
                              style: const TextStyle(
                                fontSize: 14,
                                color: Color(0xFF16171B),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                  Container(
                    margin: const EdgeInsets.symmetric(vertical: 18),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.white,
                          Color(0xFFEEF3FF),
                          Colors.white,
                        ],
                      ),
                    ),
                    child: const Row(
                      children: [
                        Expanded(
                          child: Divider(
                            color: Color(0xFFCBD5E1),
                            thickness: 1,
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 12),
                          child: Text(
                            '2025',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF16171B),
                            ),
                          ),
                        ),
                        Expanded(
                          child: Divider(
                            color: Color(0xFFCBD5E1),
                            thickness: 1,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Row(
                    children: ['Dec', 'Nov'].map((month) {
                      return Expanded(
                        child: Column(
                          children: [
                            Opacity(
                              opacity: 0.4,
                              child: ColorFiltered(
                                colorFilter: const ColorFilter.mode(
                                  Colors.grey,
                                  BlendMode.saturation,
                                ),
                                child: const Text(
                                  '🏆',
                                  style: TextStyle(fontSize: 64),
                                ),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              month,
                              style: const TextStyle(
                                fontSize: 14,
                                color: Color(0xFF16171B),
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
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

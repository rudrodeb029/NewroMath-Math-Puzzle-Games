import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../data/levels_catalog.dart';
import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';

/// Sci-Fi Arena Leaderboard screen (`renderLeaderboardScreen` parity).
class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen> {
  static final NumberFormat _numFmt = NumberFormat('#,###');

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        context.read<GameController>().refreshLeaderboard();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<GameController>();
    final entries = controller.leaderboardEntries.isNotEmpty
        ? controller.leaderboardEntries
        : fallbackLeaderboard;
    final rank1 = entries.isNotEmpty ? entries[0] : fallbackLeaderboard[0];
    final rank2 = entries.length > 1 ? entries[1] : fallbackLeaderboard[1];
    final rank3 = entries.length > 2 ? entries[2] : fallbackLeaderboard[2];
    final rest = entries.length > 3 ? entries.sublist(3) : <LeaderboardEntry>[];

    return Container(
      decoration: const BoxDecoration(gradient: AppTheme.gameBackgroundGradient),
      child: Column(
        children: [
          _buildHeader(context, controller),
          Expanded(
            child: ListView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(12, 12, 12, 16),
              children: [
                _buildPodiumStage(rank1, rank2, rank3),
                const SizedBox(height: 14),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'RANK & PLAYER',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.0,
                          color: Color(0xB367E8F9),
                        ),
                      ),
                      Text(
                        'TOTAL SCORE',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.0,
                          color: Color(0xB367E8F9),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 4),
                ...rest.map((player) => _buildPlayerRow(player)),
              ],
            ),
          ),
          _buildStickyPlayerDock(controller),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context, GameController controller) {
    return Container(
      decoration: BoxDecoration(
        gradient: AppTheme.headerBackgroundGradient,
        border: Border(
          bottom: BorderSide(color: Colors.white.withValues(alpha: 0.15)),
        ),
      ),
      padding: EdgeInsets.fromLTRB(
        14,
        MediaQuery.of(context).padding.top + 8,
        14,
        12,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _HeaderSquareBtn(
            label: '‹',
            fontSize: 24,
            onTap: () => controller.navigateTo(AppScreen.home),
          ),
          Text(
            'LEADERBOARD',
            style: AppTheme.displayStyle(
              fontSize: 17,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.2,
              color: const Color(0xFFE0F2FE),
            ),
          ),
          _HeaderSquareBtn(
            label: 'ⓘ',
            fontSize: 16,
            onTap: () => controller.navigateTo(AppScreen.help),
          ),
        ],
      ),
    );
  }

  Widget _buildPodiumStage(
    LeaderboardEntry rank1,
    LeaderboardEntry rank2,
    LeaderboardEntry rank3,
  ) {
    return Container(
      padding: const EdgeInsets.fromLTRB(10, 18, 10, 4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0x24FFFFFF),
            Color(0xA60F2766),
            Color(0xCC07163C),
          ],
        ),
        border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF020A20).withValues(alpha: 0.45),
            blurRadius: 24,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Expanded(
            child: _PodiumColumn(
              entry: rank2,
              medal: '🥈',
              pillarHeight: 90,
              tierLabel: 'SILVER',
              rimColors: const [
                Color(0xFFE2E8F0),
                Color(0xFF7DD3FC),
                Color(0xFF94A3B8),
              ],
              pillarBorderColor: const Color(0xB367E8F9),
              pillarGradient: const [
                Color(0x28FFFFFF),
                Color(0x99163674),
                Color(0x66000000),
              ],
              badgeColors: const [Color(0xFFF1F5F9), Color(0xFFCBD5E1)],
              badgeTextColor: const Color(0xFF0F172A),
              nameColor: Colors.white,
              scoreColor: const Color(0xFFA5F3FC),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Transform.translate(
              offset: const Offset(0, -8),
              child: _PodiumColumn(
                entry: rank1,
                medal: '👑',
                pillarHeight: 118,
                tierLabel: 'CHAMPION',
                isChampion: true,
                rimColors: const [
                  Color(0xFFFCD34D),
                  Color(0xFFFACC15),
                  Color(0xFFF59E0B),
                ],
                pillarBorderColor: const Color(0xE6FCD34D),
                pillarGradient: const [
                  Color(0x40FBBF24),
                  Color(0x9935250C),
                  Color(0x80000000),
                ],
                badgeColors: const [
                  Color(0xFFFDE68A),
                  Color(0xFFFACC15),
                  Color(0xFFF59E0B),
                ],
                badgeTextColor: const Color(0xFF451A03),
                nameColor: const Color(0xFFFDE68A),
                scoreColor: const Color(0xFFFDE047),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: _PodiumColumn(
              entry: rank3,
              medal: '🥉',
              pillarHeight: 74,
              tierLabel: '',
              rimColors: const [
                Color(0xFFD97706),
                Color(0xFFF97316),
                Color(0xFFB45309),
              ],
              pillarBorderColor: const Color(0xB3F59E0B),
              pillarGradient: const [
                Color(0x24FFFFFF),
                Color(0x992C180E),
                Color(0x66000000),
              ],
              badgeColors: const [Color(0xFFFDBA74), Color(0xFFD97706)],
              badgeTextColor: const Color(0xFF0F172A),
              nameColor: Colors.white,
              scoreColor: const Color(0xFFFED7AA),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlayerRow(LeaderboardEntry player) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        gradient: const LinearGradient(
          colors: [
            Color(0x1AFFFFFF),
            Color(0x8C0D245C),
            Color(0xB3071536),
          ],
        ),
        border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF020A20).withValues(alpha: 0.35),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withValues(alpha: 0.25)),
            ),
            alignment: Alignment.center,
            child: Text(
              '#${player.rank}',
              style: AppTheme.hudNumberStyle(
                fontSize: 13,
                color: const Color(0xFFA5F3FC),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(player.flag, style: const TextStyle(fontSize: 15)),
                    const SizedBox(width: 6),
                    Flexible(
                      child: Text(
                        player.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 13.5,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  player.title,
                  style: TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF67E8F9).withValues(alpha: 0.8),
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.35),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('⭐', style: TextStyle(fontSize: 12)),
                const SizedBox(width: 5),
                Text(
                  _numFmt.format(player.score),
                  style: AppTheme.hudNumberStyle(
                    fontSize: 11.5,
                    color: const Color(0xFFA5F3FC),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStickyPlayerDock(GameController controller) {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 10, 12, 12),
      decoration: BoxDecoration(
        color: const Color(0xCC051029),
        border: Border(
          top: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
        ),
      ),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          gradient: const LinearGradient(
            colors: [
              Color(0xD906B6D4),
              Color(0xD92563EB),
              Color(0xD94F46E5),
            ],
          ),
          border: Border.all(
            color: Colors.white.withValues(alpha: 0.42),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: AppTheme.cyanNeon.withValues(alpha: 0.4),
              blurRadius: 20,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.95),
                borderRadius: BorderRadius.circular(12),
              ),
              alignment: Alignment.center,
              child: Text(
                '#${controller.playerRank}',
                style: AppTheme.hudNumberStyle(
                  fontSize: 13,
                  color: const Color(0xFF172554),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        controller.profile.countryFlag,
                        style: const TextStyle(fontSize: 15),
                      ),
                      const SizedBox(width: 5),
                      Flexible(
                        child: Text(
                          '${controller.profile.name} (YOU)',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 1.5,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFF34D399),
                          borderRadius: BorderRadius.circular(99),
                        ),
                        child: const Text(
                          'ACTIVE',
                          style: TextStyle(
                            fontSize: 8.5,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF022C22),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Level ${controller.activePlayerLevel} • Tier Master',
                    style: const TextStyle(
                      fontSize: 10.5,
                      color: Color(0xE6CFFAFE),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white.withValues(alpha: 0.3)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('⭐', style: TextStyle(fontSize: 12)),
                  const SizedBox(width: 4),
                  Text(
                    _numFmt.format(controller.playerScore),
                    style: AppTheme.hudNumberStyle(
                      fontSize: 11.5,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PodiumColumn extends StatelessWidget {
  const _PodiumColumn({
    required this.entry,
    required this.medal,
    required this.pillarHeight,
    required this.tierLabel,
    required this.rimColors,
    required this.pillarBorderColor,
    required this.pillarGradient,
    required this.badgeColors,
    required this.badgeTextColor,
    required this.nameColor,
    required this.scoreColor,
    this.isChampion = false,
  });

  final LeaderboardEntry entry;
  final String medal;
  final double pillarHeight;
  final String tierLabel;
  final bool isChampion;
  final List<Color> rimColors;
  final Color pillarBorderColor;
  final List<Color> pillarGradient;
  final List<Color> badgeColors;
  final Color badgeTextColor;
  final Color nameColor;
  final Color scoreColor;

  static final NumberFormat _numFmt = NumberFormat('#,###');

  @override
  Widget build(BuildContext context) {
    final avatarSize = isChampion ? 56.0 : 48.0;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          medal,
          style: TextStyle(fontSize: isChampion ? 22 : 18),
        ),
        Stack(
          clipBehavior: Clip.none,
          children: [
            Container(
              width: avatarSize,
              height: avatarSize,
              padding: const EdgeInsets.all(2.5),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: rimColors,
                ),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.85),
                  width: 1.5,
                ),
              ),
              child: Image.asset(
                entry.avatarAsset.isNotEmpty
                    ? entry.avatarAsset
                    : AppAssets.awardForLevel(entry.level),
                fit: BoxFit.contain,
                errorBuilder: (_, _, _) =>
                    Image.asset(AppAssets.trophy3d, fit: BoxFit.contain),
              ),
            ),
            Positioned(
              right: -2,
              bottom: -2,
              child: Text(entry.flag, style: const TextStyle(fontSize: 13)),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Text(
          entry.name,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontSize: isChampion ? 12 : 11,
            fontWeight: FontWeight.w900,
            color: nameColor,
          ),
        ),
        const SizedBox(height: 2),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
          decoration: BoxDecoration(
            color: isChampion
                ? AppTheme.amber.withValues(alpha: 0.2)
                : Colors.white.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(99),
            border: Border.all(
              color: isChampion
                  ? AppTheme.amber.withValues(alpha: 0.5)
                  : Colors.white.withValues(alpha: 0.12),
            ),
          ),
          child: Text(
            _numFmt.format(entry.score),
            style: TextStyle(
              fontSize: 9.5,
              fontWeight: FontWeight.w900,
              color: scoreColor,
            ),
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: double.infinity,
          height: pillarHeight,
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: pillarGradient,
            ),
            border: Border(
              top: BorderSide(color: pillarBorderColor, width: 2),
              left: BorderSide(color: pillarBorderColor, width: 1.5),
              right: BorderSide(color: pillarBorderColor, width: 1.5),
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: isChampion ? 32 : 28,
                height: isChampion ? 32 : 28,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: badgeColors,
                  ),
                  border: Border.all(color: Colors.white, width: 1.5),
                ),
                alignment: Alignment.center,
                child: Text(
                  '${entry.rank}',
                  style: TextStyle(
                    fontSize: isChampion ? 13 : 11.5,
                    fontWeight: FontWeight.w900,
                    color: badgeTextColor,
                  ),
                ),
              ),
              if (tierLabel.isNotEmpty)
                Text(
                  tierLabel,
                  style: TextStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.0,
                    color: isChampion
                        ? const Color(0xFFFCD34D)
                        : const Color(0xFFA5F3FC),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class _HeaderSquareBtn extends StatelessWidget {
  const _HeaderSquareBtn({
    required this.label,
    required this.fontSize,
    required this.onTap,
  });

  final String label;
  final double fontSize;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          gradient: const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xCC1B4394), Color(0xCC12306D)],
          ),
          border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          style: TextStyle(
            fontSize: fontSize,
            fontWeight: FontWeight.w800,
            color: const Color(0xFFA5F3FC),
          ),
        ),
      ),
    );
  }
}

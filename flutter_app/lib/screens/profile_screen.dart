import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../data/levels_catalog.dart';
import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';

/// Player Profile, Stats & 25-Trophy Avatar Gallery screen (`renderProfileScreen` parity).
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  static final NumberFormat _numFmt = NumberFormat('#,###');

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<GameController>();
    final level = controller.activePlayerLevel;
    final winRate = math.min(98, math.max(65, 70 + (level * 1.8).round()));
    final gamesStarted = math.max(8, level * 4 + 3);
    final gamesWon = (gamesStarted * (winRate / 100.0)).round();
    final totalScore =
        _numFmt.format(controller.coins * 12 + level * 500);

    return Container(
      decoration: const BoxDecoration(gradient: AppTheme.gameBackgroundGradient),
      child: Column(
        children: [
          _buildHeader(context, controller),
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(12, 12, 12, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildIdentityCard(context, controller),
                  const SizedBox(height: 16),
                  _buildStatsCard(
                    gamesWon: gamesWon,
                    gamesStarted: gamesStarted,
                    winRate: winRate,
                    totalScore: totalScore,
                  ),
                  const SizedBox(height: 16),
                  _buildAwardsGalleryCard(context, controller),
                ],
              ),
            ),
          ),
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
          _HeaderIconBtn(
            icon: Icons.chevron_left_rounded,
            onTap: () => controller.navigateTo(AppScreen.home),
          ),
          Text(
            'PLAYER PROFILE',
            style: AppTheme.displayStyle(
              fontSize: 17,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.2,
              color: const Color(0xFFE0F2FE),
            ),
          ),
          _HeaderIconBtn(
            icon: Icons.settings_rounded,
            iconSize: 19,
            onTap: () => controller.navigateTo(AppScreen.settings),
          ),
        ],
      ),
    );
  }

  Widget _buildIdentityCard(BuildContext context, GameController controller) {
    final profile = controller.profile;
    final lvl = controller.activePlayerLevel;
    final rankLabel = lvl >= 25
        ? 'GRANDMASTER'
        : lvl >= 15
            ? 'MASTER CADET'
            : lvl >= 5
                ? 'CHALLENGER'
                : 'ROOKIE CADET';
    final equippedAward = levelAwards
        .where((a) => a.iconAsset == profile.equippedAvatarAsset)
        .firstOrNull;
    final targetXp = math.max(1, controller.activeLevelTargetXp);
    final currentXp = controller.activeLevelCurrentXp;
    final progressPct = ((currentXp / targetXp) * 100).round().clamp(10, 100);

    return Container(
      padding: const EdgeInsets.all(16),
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
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Avatar pedestal + LV badge
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    width: 68,
                    height: 68,
                    padding: const EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Color(0xFFA5F3FC),
                          Color(0xFF38BDF8),
                          Color(0xFF1D4ED8),
                        ],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.6),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                        BoxShadow(
                          color: AppTheme.cyanNeon.withValues(alpha: 0.4),
                          blurRadius: 16,
                        ),
                      ],
                    ),
                    child: Container(
                      padding: const EdgeInsets.all(2),
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(0xFF031533),
                      ),
                      child: Container(
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            center: Alignment(0, -0.4),
                            radius: 0.9,
                            colors: [
                              Color(0xFF18458A),
                              Color(0xFF0D2857),
                              Color(0xFF041029),
                            ],
                          ),
                        ),
                        alignment: Alignment.center,
                        child: Image.asset(
                          profile.equippedAvatarAsset.isNotEmpty
                              ? profile.equippedAvatarAsset
                              : AppAssets.robotAvatar,
                          width: 44,
                          height: 44,
                          fit: BoxFit.contain,
                          errorBuilder: (_, _, _) => Image.asset(
                            AppAssets.robotAvatar,
                            width: 44,
                            height: 44,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    right: -4,
                    bottom: -2,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(99),
                        gradient: const LinearGradient(
                          colors: [
                            Color(0xFFFBBF24),
                            Color(0xFFFDE047),
                            Color(0xFFF59E0B),
                          ],
                        ),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.8),
                        ),
                      ),
                      child: Text(
                        'LV.$lvl',
                        style: const TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF451A03),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            profile.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: AppTheme.displayStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        GestureDetector(
                          onTap: () => _openEditProfileModal(context, controller),
                          child: _CircleBadge(
                            size: 28,
                            rimColors: const [
                              Color(0xFFA5F3FC),
                              Color(0xFF38BDF8),
                              Color(0xFF1D4ED8),
                            ],
                            discColors: const [
                              Color(0xFF18458A),
                              Color(0xFF0D2857),
                              Color(0xFF041029),
                            ],
                            child: const Icon(
                              Icons.edit_rounded,
                              size: 13,
                              color: Color(0xFFA5F3FC),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: [
                        _TagPill(
                          label: rankLabel,
                          bgColor: AppTheme.cyanNeon.withValues(alpha: 0.15),
                          borderColor:
                              AppTheme.cyanSky.withValues(alpha: 0.35),
                          textColor: const Color(0xFFA5F3FC),
                        ),
                        _TagPill(
                          label: '${profile.countryFlag} ${profile.country}',
                          bgColor: Colors.blue.withValues(alpha: 0.2),
                          borderColor:
                              AppTheme.cyanNeon.withValues(alpha: 0.38),
                          textColor: const Color(0xFFA5F3FC),
                        ),
                        if (profile.phone.isNotEmpty)
                          _TagPill(
                            label: '📱 ${profile.phone}',
                            bgColor: const Color(0x80082F49),
                            borderColor:
                                AppTheme.cyanNeon.withValues(alpha: 0.3),
                            textColor: const Color(0xFFA5F3FC),
                          ),
                        if (profile.email.isNotEmpty)
                          _TagPill(
                            label: '✉️ ${profile.email}',
                            bgColor: const Color(0x80082F49),
                            borderColor:
                                AppTheme.cyanNeon.withValues(alpha: 0.3),
                            textColor: const Color(0xFFA5F3FC),
                          ),
                        if (equippedAward != null)
                          _TagPill(
                            label: '✨ ${equippedAward.title}',
                            bgColor: AppTheme.amber.withValues(alpha: 0.2),
                            borderColor:
                                AppTheme.amber.withValues(alpha: 0.45),
                            textColor: const Color(0xFFFDE68A),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          // Level XP Progress
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.auto_awesome_rounded,
                          size: 14,
                          color: Color(0xFF67E8F9),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'Level $lvl Progress',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF67E8F9),
                          ),
                        ),
                      ],
                    ),
                    Text(
                      '$currentXp / $targetXp XP',
                      style: AppTheme.hudNumberStyle(
                        fontSize: 11,
                        color: const Color(0xFFBAE6FD),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Container(
                  height: 10,
                  padding: const EdgeInsets.all(1.5),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.42),
                    borderRadius: BorderRadius.circular(99),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.15),
                    ),
                  ),
                  child: FractionallySizedBox(
                    alignment: Alignment.centerLeft,
                    widthFactor: progressPct / 100.0,
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(99),
                        gradient: const LinearGradient(
                          colors: [
                            Color(0xFF22D3EE),
                            Color(0xFF3B82F6),
                            Color(0xFF6366F1),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Divider(color: Colors.white.withValues(alpha: 0.1), height: 1),
          const SizedBox(height: 12),
          // 4 Treasury & Metric Pillars
          Row(
            children: [
              Expanded(
                child: _MetricPillar(
                  rimColors: const [
                    Color(0xFFFDE68A),
                    Color(0xFFFBBF24),
                    Color(0xFFB45309),
                  ],
                  discColors: const [
                    Color(0xFF244585),
                    Color(0xFF122752),
                    Color(0xFF061129),
                  ],
                  icon: Image.asset(AppAssets.goldCoin, width: 16, height: 16),
                  value: _numFmt.format(controller.coins),
                  valueColor: const Color(0xFFFCD34D),
                  label: 'COINS',
                  labelColor: const Color(0xB3FDE68A),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _MetricPillar(
                  rimColors: const [
                    Color(0xFFA5F3FC),
                    Color(0xFF38BDF8),
                    Color(0xFF1D4ED8),
                  ],
                  discColors: const [
                    Color(0xFF18458A),
                    Color(0xFF0D2857),
                    Color(0xFF041029),
                  ],
                  icon: Image.asset(AppAssets.gem, width: 16, height: 16),
                  value: _numFmt.format(controller.gems),
                  valueColor: const Color(0xFF67E8F9),
                  label: 'DIAMONDS',
                  labelColor: const Color(0xB3A5F3FC),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _MetricPillar(
                  rimColors: const [
                    Color(0xFFFDE68A),
                    Color(0xFFFB923C),
                    Color(0xFFB91C1C),
                  ],
                  discColors: const [
                    Color(0xFFC2410C),
                    Color(0xFF9A3412),
                    Color(0xFF431407),
                  ],
                  icon: const Icon(
                    Icons.local_fire_department_rounded,
                    size: 14,
                    color: Color(0xFFFED7AA),
                  ),
                  value: '${controller.streakDays}d',
                  valueColor: const Color(0xFFFDBA74),
                  label: 'STREAK',
                  labelColor: const Color(0xB3FED7AA),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _MetricPillar(
                  rimColors: const [
                    Color(0xFFE9D5FF),
                    Color(0xFFC084FC),
                    Color(0xFF4338CA),
                  ],
                  discColors: const [
                    Color(0xFF3B186B),
                    Color(0xFF200B3D),
                    Color(0xFF0E041A),
                  ],
                  icon: Image.asset(AppAssets.trophy3d, width: 16, height: 16),
                  value: 'Lv.$lvl',
                  valueColor: const Color(0xFFD8B4FE),
                  label: 'LEVEL',
                  labelColor: const Color(0xB3E9D5FF),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatsCard({
    required int gamesWon,
    required int gamesStarted,
    required int winRate,
    required String totalScore,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
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
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(left: 2, bottom: 12),
            child: Text(
              'GAMEPLAY STATISTICS',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                letterSpacing: 0.9,
                color: Color(0xFFA5F3FC),
              ),
            ),
          ),
          Row(
            children: [
              Expanded(
                child: _StatTile(
                  label: 'PUZZLES SOLVED',
                  value: '$gamesWon',
                  valueColor: const Color(0xFF6EE7B7),
                  rimColors: const [
                    Color(0xFFA7F3D0),
                    Color(0xFF34D399),
                    Color(0xFF0F766E),
                  ],
                  discColors: const [
                    Color(0xFF047857),
                    Color(0xFF065F46),
                    Color(0xFF022C22),
                  ],
                  icon: const Icon(
                    Icons.check_circle_outline_rounded,
                    size: 14,
                    color: Color(0xFFA7F3D0),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _StatTile(
                  label: 'PUZZLES PLAYED',
                  value: '$gamesStarted',
                  valueColor: Colors.white,
                  rimColors: const [
                    Color(0xFFBAE6FD),
                    Color(0xFF38BDF8),
                    Color(0xFF1D4ED8),
                  ],
                  discColors: const [
                    Color(0xFF0369A1),
                    Color(0xFF075985),
                    Color(0xFF082F49),
                  ],
                  icon: const Icon(
                    Icons.sports_esports_rounded,
                    size: 14,
                    color: Color(0xFFBAE6FD),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: _StatTile(
                  label: 'WIN ACCURACY',
                  value: '$winRate%',
                  valueColor: const Color(0xFF67E8F9),
                  rimColors: const [
                    Color(0xFFA5F3FC),
                    Color(0xFF38BDF8),
                    Color(0xFF1D4ED8),
                  ],
                  discColors: const [
                    Color(0xFF18458A),
                    Color(0xFF0D2857),
                    Color(0xFF041029),
                  ],
                  icon: const Icon(
                    Icons.gps_fixed_rounded,
                    size: 14,
                    color: Color(0xFFA5F3FC),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _StatTile(
                  label: 'TOTAL SCORE',
                  value: totalScore,
                  valueColor: const Color(0xFFFCD34D),
                  rimColors: const [
                    Color(0xFFFDE68A),
                    Color(0xFFFBBF24),
                    Color(0xFFB45309),
                  ],
                  discColors: const [
                    Color(0xFF244585),
                    Color(0xFF122752),
                    Color(0xFF061129),
                  ],
                  icon: const Icon(
                    Icons.emoji_events_rounded,
                    size: 14,
                    color: Color(0xFFFDE68A),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAwardsGalleryCard(
    BuildContext context,
    GameController controller,
  ) {
    final unlockedCount = controller.completedLevelsCount;
    final filter = controller.awardFilter;
    final filteredAwards = levelAwards.where((a) {
      final isUnlocked = a.level < controller.unlockedLevelMax;
      if (filter == 'unlocked') return isUnlocked;
      if (filter == 'locked') return !isUnlocked;
      return true;
    }).toList();

    return Container(
      padding: const EdgeInsets.all(16),
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
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(left: 2, bottom: 12),
            child: Text(
              'YOUR LEVEL AWARDS',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                letterSpacing: 0.9,
                color: Color(0xFFA5F3FC),
              ),
            ),
          ),
          // Filter tabs
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.32),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
            ),
            child: Row(
              children: [
                _FilterTab(
                  label: 'All (25)',
                  selected: filter == 'all',
                  gradientColors: const [Color(0xFF22D3EE), Color(0xFF3B82F6)],
                  onTap: () => controller.setAwardFilter('all'),
                ),
                const SizedBox(width: 6),
                _FilterTab(
                  label: 'Unlocked ($unlockedCount)',
                  selected: filter == 'unlocked',
                  gradientColors: const [Color(0xFF34D399), Color(0xFF14B8A6)],
                  onTap: () => controller.setAwardFilter('unlocked'),
                ),
                const SizedBox(width: 6),
                _FilterTab(
                  label: 'Locked (${25 - unlockedCount})',
                  selected: filter == 'locked',
                  gradientColors: const [Color(0xFFFBBF24), Color(0xFFF97316)],
                  onTap: () => controller.setAwardFilter('locked'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: filteredAwards.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              mainAxisSpacing: 9,
              crossAxisSpacing: 9,
              childAspectRatio: 0.78,
            ),
            itemBuilder: (context, idx) {
              final award = filteredAwards[idx];
              final isUnlocked = award.level < controller.unlockedLevelMax;
              final isEquipped =
                  controller.profile.equippedAvatarAsset == award.iconAsset;

              return GestureDetector(
                onTap: () {
                  if (isUnlocked) {
                    controller.equipAvatar(award.iconAsset);
                    ScaffoldMessenger.of(context)
                      ..hideCurrentSnackBar()
                      ..showSnackBar(
                        SnackBar(
                          content: Text(
                            '🎉 Equipped Level ${award.level} "${award.title}" avatar!',
                          ),
                          duration: const Duration(seconds: 2),
                        ),
                      );
                  } else {
                    ScaffoldMessenger.of(context)
                      ..hideCurrentSnackBar()
                      ..showSnackBar(
                        SnackBar(
                          content: Text(
                            '🔒 Locked: Solve Level ${award.level} to unlock "${award.title}"!',
                          ),
                          duration: const Duration(seconds: 2),
                        ),
                      );
                  }
                },
                child: Container(
                  padding: const EdgeInsets.all(7),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    gradient: isEquipped
                        ? const LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Color(0xB3083344),
                              Color(0xB30D2A63),
                              Color(0xCC07163C),
                            ],
                          )
                        : isUnlocked
                            ? const LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [Color(0x1FFFFFFF), Color(0x0AFFFFFF)],
                              )
                            : null,
                    color: (!isEquipped && !isUnlocked)
                        ? Colors.black.withValues(alpha: 0.42)
                        : null,
                    border: Border.all(
                      color: isEquipped
                          ? const Color(0xFF67E8F9)
                          : isUnlocked
                              ? Colors.white.withValues(alpha: 0.22)
                              : Colors.white.withValues(alpha: 0.1),
                      width: isEquipped ? 1.6 : 1,
                    ),
                    boxShadow: isEquipped
                        ? [
                            BoxShadow(
                              color: AppTheme.cyanNeon.withValues(alpha: 0.35),
                              blurRadius: 12,
                            ),
                          ]
                        : null,
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 4,
                              vertical: 1,
                            ),
                            decoration: BoxDecoration(
                              color: isEquipped
                                  ? const Color(0xFF22D3EE)
                                  : isUnlocked
                                      ? Colors.white.withValues(alpha: 0.2)
                                      : const Color(0xFF1E293B),
                              borderRadius: BorderRadius.circular(5),
                            ),
                            child: Text(
                              'LV.${award.level}',
                              style: TextStyle(
                                fontSize: 8,
                                fontWeight: FontWeight.w900,
                                color: isEquipped
                                    ? const Color(0xFF020617)
                                    : isUnlocked
                                        ? Colors.white
                                        : const Color(0xFF94A3B8),
                              ),
                            ),
                          ),
                          if (isEquipped)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 4,
                                vertical: 1,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0xFF22D3EE),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: const Text(
                                'ACTIVE',
                                style: TextStyle(
                                  fontSize: 6.5,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF020617),
                                ),
                              ),
                            )
                          else if (isUnlocked)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 4,
                                vertical: 1,
                              ),
                              decoration: BoxDecoration(
                                color: AppTheme.emerald.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(4),
                                border: Border.all(
                                  color: AppTheme.emerald.withValues(alpha: 0.45),
                                ),
                              ),
                              child: const Text(
                                'EQUIP',
                                style: TextStyle(
                                  fontSize: 7,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF6EE7B7),
                                ),
                              ),
                            )
                          else
                            const Icon(
                              Icons.lock_rounded,
                              size: 11,
                              color: Color(0xFFFCD34D),
                            ),
                        ],
                      ),
                      Container(
                        width: 46,
                        height: 46,
                        padding: const EdgeInsets.all(5),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isUnlocked
                              ? const Color(0xFF0F244D)
                              : Colors.black.withValues(alpha: 0.6),
                          border: Border.all(
                            color: isEquipped
                                ? const Color(0xFF67E8F9)
                                : isUnlocked
                                    ? Colors.white.withValues(alpha: 0.25)
                                    : Colors.white.withValues(alpha: 0.1),
                          ),
                        ),
                        child: isUnlocked
                            ? Image.asset(
                                award.iconAsset,
                                fit: BoxFit.contain,
                              )
                            : Stack(
                                alignment: Alignment.center,
                                children: [
                                  Opacity(
                                    opacity: 0.25,
                                    child: ColorFiltered(
                                      colorFilter: const ColorFilter.mode(
                                        Colors.grey,
                                        BlendMode.saturation,
                                      ),
                                      child: Image.asset(
                                        award.iconAsset,
                                        fit: BoxFit.contain,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    width: 22,
                                    height: 22,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: Colors.black.withValues(alpha: 0.8),
                                      border: Border.all(
                                        color:
                                            Colors.white.withValues(alpha: 0.3),
                                      ),
                                    ),
                                    child: const Icon(
                                      Icons.lock_rounded,
                                      size: 12,
                                      color: Color(0xFFFCD34D),
                                    ),
                                  ),
                                ],
                              ),
                      ),
                      Column(
                        children: [
                          Text(
                            award.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 9.5,
                              fontWeight: FontWeight.w900,
                              color: isEquipped
                                  ? const Color(0xFFA5F3FC)
                                  : isUnlocked
                                      ? Colors.white
                                      : const Color(0xFF94A3B8),
                            ),
                          ),
                          Text(
                            isEquipped
                                ? 'Equipped Avatar'
                                : isUnlocked
                                    ? 'Tap to equip'
                                    : 'Solve Lvl ${award.level}',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 8,
                              color: Color(0xFF94A3B8),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  void _openEditProfileModal(BuildContext context, GameController controller) {
    showDialog<void>(
      context: context,
      barrierColor: Colors.black.withValues(alpha: 0.8),
      builder: (_) => _ProfileEditDialog(controller: controller),
    );
  }
}

class _ProfileEditDialog extends StatefulWidget {
  const _ProfileEditDialog({required this.controller});

  final GameController controller;

  @override
  State<_ProfileEditDialog> createState() => _ProfileEditDialogState();
}

class _ProfileEditDialogState extends State<_ProfileEditDialog> {
  late final TextEditingController _nameCtrl;
  late final TextEditingController _phoneCtrl;
  late final TextEditingController _emailCtrl;
  late String _selectedCountry;

  @override
  void initState() {
    super.initState();
    final p = widget.controller.profile;
    _nameCtrl = TextEditingController(text: p.name);
    _phoneCtrl = TextEditingController(text: p.phone);
    _emailCtrl = TextEditingController(text: p.email);
    _selectedCountry = playerCountries.any((c) => c.name == p.country)
        ? p.country
        : playerCountries.first.name;
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final flag = playerCountries
            .where((c) => c.name == _selectedCountry)
            .map((c) => c.flag)
            .firstOrNull ??
        '🌍';

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 360),
        padding: const EdgeInsets.all(2.5),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(28),
          gradient: const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFA5F3FC),
              Color(0xFF0EA5E9),
              Color(0xFF1E3A8A),
            ],
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.9),
              blurRadius: 36,
            ),
            BoxShadow(
              color: AppTheme.cyanNeon.withValues(alpha: 0.35),
              blurRadius: 24,
            ),
          ],
        ),
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(25),
            gradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFF0B2452),
                Color(0xFF081B3D),
                Color(0xFF040E24),
              ],
            ),
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    const _CircleBadge(
                      size: 36,
                      rimColors: [
                        Color(0xFFA5F3FC),
                        Color(0xFF38BDF8),
                        Color(0xFF1D4ED8),
                      ],
                      discColors: [
                        Color(0xFF18458A),
                        Color(0xFF0D2857),
                        Color(0xFF041029),
                      ],
                      child: Icon(
                        Icons.person_rounded,
                        size: 18,
                        color: Color(0xFFA5F3FC),
                      ),
                    ),
                    const SizedBox(width: 10),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'PLAYER PROFILE',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                            ),
                          ),
                          Text(
                            'Identity & Contact Information',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: Color(0xCC67E8F9),
                            ),
                          ),
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: () => Navigator.of(context).pop(),
                      child: const _CircleBadge(
                        size: 28,
                        rimColors: [
                          Color(0x66FFFFFF),
                          Color(0xFF94A3B8),
                          Color(0xFF334155),
                        ],
                        discColors: [
                          Color(0xFF334155),
                          Color(0xFF1E293B),
                          Color(0xFF0F172A),
                        ],
                        child: Icon(
                          Icons.close_rounded,
                          size: 14,
                          color: Color(0xFFCBD5E1),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Divider(
                  color: AppTheme.cyanNeon.withValues(alpha: 0.25),
                  height: 1,
                ),
                const SizedBox(height: 12),
                _ModalFieldLabel(
                  label: 'Player Name',
                  requiredMark: true,
                  hintRight: 'MAX 20 CHARS',
                ),
                const SizedBox(height: 4),
                _InsetInputBox(
                  leading: const Text('👤', style: TextStyle(fontSize: 14)),
                  child: TextField(
                    controller: _nameCtrl,
                    maxLength: 20,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                    ),
                    decoration: const InputDecoration(
                      counterText: '',
                      isDense: true,
                      border: InputBorder.none,
                      hintText: 'Enter your name',
                      hintStyle: TextStyle(color: Color(0xFF64748B)),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                _ModalFieldLabel(
                  label: 'Country / Region',
                  requiredMark: true,
                  hintRight: 'LEADERBOARD FLAG',
                ),
                const SizedBox(height: 4),
                _InsetInputBox(
                  leading: Text(flag, style: const TextStyle(fontSize: 16)),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedCountry,
                      isExpanded: true,
                      isDense: true,
                      dropdownColor: const Color(0xFF051433),
                      iconEnabledColor: const Color(0xFF67E8F9),
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 13,
                      ),
                      items: playerCountries
                          .map(
                            (c) => DropdownMenuItem<String>(
                              value: c.name,
                              child: Text('${c.flag}  ${c.name}'),
                            ),
                          )
                          .toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setState(() => _selectedCountry = val);
                        }
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                const _ModalFieldLabel(
                  label: 'Phone Number',
                  hintRight: 'Optional',
                ),
                const SizedBox(height: 4),
                _InsetInputBox(
                  leading: const Text('📱', style: TextStyle(fontSize: 14)),
                  child: TextField(
                    controller: _phoneCtrl,
                    keyboardType: TextInputType.phone,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                    ),
                    decoration: const InputDecoration(
                      isDense: true,
                      border: InputBorder.none,
                      hintText: '+1 (555) 000-0000',
                      hintStyle: TextStyle(color: Color(0xFF64748B)),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                const _ModalFieldLabel(
                  label: 'Email Address',
                  hintRight: 'Optional',
                ),
                const SizedBox(height: 4),
                _InsetInputBox(
                  leading: const Text('✉️', style: TextStyle(fontSize: 14)),
                  child: TextField(
                    controller: _emailCtrl,
                    keyboardType: TextInputType.emailAddress,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                    ),
                    decoration: const InputDecoration(
                      isDense: true,
                      border: InputBorder.none,
                      hintText: 'player@example.com',
                      hintStyle: TextStyle(color: Color(0xFF64748B)),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                GestureDetector(
                  onTap: () async {
                    await widget.controller.updateProfile(
                      name: _nameCtrl.text,
                      country: _selectedCountry,
                      phone: _phoneCtrl.text,
                      email: _emailCtrl.text,
                    );
                    if (context.mounted) Navigator.of(context).pop();
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(14),
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFFFBBF24),
                          Color(0xFFFCD34D),
                          Color(0xFFEAB308),
                        ],
                      ),
                      border: Border.all(color: const Color(0xFFFDE68A)),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0xFF92400E),
                          offset: Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('💾', style: TextStyle(fontSize: 13)),
                        SizedBox(width: 8),
                        Text(
                          'SAVE PROFILE',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 0.7,
                            color: Color(0xFF451A03),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text(
                    'Cancel',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF94A3B8),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ModalFieldLabel extends StatelessWidget {
  const _ModalFieldLabel({
    required this.label,
    required this.hintRight,
    this.requiredMark = false,
  });

  final String label;
  final String hintRight;
  final bool requiredMark;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Text(
              label,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: Color(0xFFA5F3FC),
              ),
            ),
            if (requiredMark)
              const Text(
                ' *',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFFFB7185),
                ),
              ),
          ],
        ),
        Text(
          hintRight,
          style: TextStyle(
            fontSize: 9.5,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF67E8F9).withValues(alpha: 0.65),
          ),
        ),
      ],
    );
  }
}

class _InsetInputBox extends StatelessWidget {
  const _InsetInputBox({required this.leading, required this.child});

  final Widget leading;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF030D1E),
        borderRadius: BorderRadius.circular(11),
        border: Border.all(color: const Color(0xFF0C2A57)),
      ),
      child: Row(
        children: [
          leading,
          const SizedBox(width: 8),
          Expanded(child: child),
        ],
      ),
    );
  }
}

class _HeaderIconBtn extends StatelessWidget {
  const _HeaderIconBtn({
    required this.icon,
    required this.onTap,
    this.iconSize = 22,
  });

  final IconData icon;
  final VoidCallback onTap;
  final double iconSize;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
        ),
        child: Icon(icon, size: iconSize, color: const Color(0xFFA5F3FC)),
      ),
    );
  }
}

class _TagPill extends StatelessWidget {
  const _TagPill({
    required this.label,
    required this.bgColor,
    required this.borderColor,
    required this.textColor,
  });

  final String label;
  final Color bgColor;
  final Color borderColor;
  final Color textColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: borderColor),
      ),
      child: Text(
        label,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: TextStyle(
          fontSize: 9.5,
          fontWeight: FontWeight.w800,
          color: textColor,
        ),
      ),
    );
  }
}

class _MetricPillar extends StatelessWidget {
  const _MetricPillar({
    required this.rimColors,
    required this.discColors,
    required this.icon,
    required this.value,
    required this.valueColor,
    required this.label,
    required this.labelColor,
  });

  final List<Color> rimColors;
  final List<Color> discColors;
  final Widget icon;
  final String value;
  final Color valueColor;
  final String label;
  final Color labelColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 9),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.07),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
      ),
      child: Column(
        children: [
          _CircleBadge(
            size: 28,
            rimColors: rimColors,
            discColors: discColors,
            child: icon,
          ),
          const SizedBox(height: 5),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w900,
              color: valueColor,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 8,
              fontWeight: FontWeight.w700,
              color: labelColor,
            ),
          ),
        ],
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  const _StatTile({
    required this.label,
    required this.value,
    required this.valueColor,
    required this.rimColors,
    required this.discColors,
    required this.icon,
  });

  final String label;
  final String value;
  final Color valueColor;
  final List<Color> rimColors;
  final List<Color> discColors;
  final Widget icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(11),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.07),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 8.5,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFFCBD5E1),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w900,
                    color: valueColor,
                  ),
                ),
              ],
            ),
          ),
          _CircleBadge(
            size: 28,
            rimColors: rimColors,
            discColors: discColors,
            child: icon,
          ),
        ],
      ),
    );
  }
}

class _FilterTab extends StatelessWidget {
  const _FilterTab({
    required this.label,
    required this.selected,
    required this.gradientColors,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final List<Color> gradientColors;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 7),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            gradient: selected ? LinearGradient(colors: gradientColors) : null,
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 10.5,
              fontWeight: selected ? FontWeight.w900 : FontWeight.w700,
              color: selected
                  ? const Color(0xFF020617)
                  : const Color(0xFFCBD5E1),
            ),
          ),
        ),
      ),
    );
  }
}

class _CircleBadge extends StatelessWidget {
  const _CircleBadge({
    required this.size,
    required this.rimColors,
    required this.discColors,
    required this.child,
  });

  final double size;
  final List<Color> rimColors;
  final List<Color> discColors;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      padding: const EdgeInsets.all(1.5),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: rimColors,
        ),
      ),
      child: Container(
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            center: const Alignment(0, -0.3),
            radius: 0.9,
            colors: discColors,
          ),
        ),
        alignment: Alignment.center,
        child: child,
      ),
    );
  }
}

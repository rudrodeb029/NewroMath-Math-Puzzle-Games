import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/levels_catalog.dart';
import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';
import '../widgets/hud_header.dart';

/// 5. LEVEL SELECTION SCREEN — 25 Mission Levels, World Tabs, Quick Jump Ribbon.
class LevelSelectScreen extends StatefulWidget {
  const LevelSelectScreen({super.key});

  @override
  State<LevelSelectScreen> createState() => _LevelSelectScreenState();
}

class _LevelSelectScreenState extends State<LevelSelectScreen> {
  bool _precached = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_precached) {
      _precached = true;
      for (var i = 1; i <= 6; i++) {
        precacheImage(AssetImage(AppAssets.levelArtForLevel(i)), context);
      }
      precacheImage(const AssetImage(AppAssets.goldCoin), context);
      precacheImage(const AssetImage(AppAssets.gem), context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<GameController>();
    final unlockedMax = controller.unlockedLevelMax;
    final selectedNum = controller.selectedLevelNum;
    final progressPct = controller.campaignProgressPct;
    final filterTab = controller.levelFilterTab;

    final filteredLevels = levelsCatalog.where((lvl) {
      switch (filterTab) {
        case 'easy':
          return lvl.tier == PuzzleDifficulty.easy;
        case 'medium':
          return lvl.tier == PuzzleDifficulty.medium;
        case 'hard':
          return lvl.tier == PuzzleDifficulty.hard;
        default:
          return true;
      }
    }).toList(growable: false);

    final selectedCost = getLevelEntryCost(selectedNum);

    return Container(
      decoration: const BoxDecoration(
        gradient: AppTheme.gameBackgroundGradient,
      ),
      child: Column(
        children: [
          SubScreenHudHeader(controller: controller),
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(12, 10, 12, 36),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 448),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Campaign Progress Card
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          gradient: const LinearGradient(
                            colors: [
                              Color(0xFF0D2254),
                              Color(0xFF153473),
                              Color(0xFF0C1F4A),
                            ],
                          ),
                          border: Border.all(
                            color: AppTheme.cyanNeon.withValues(alpha: 0.4),
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x66000000),
                              blurRadius: 12,
                              offset: Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    const Text(
                                      '🏆',
                                      style: TextStyle(fontSize: 16),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Campaign Progress',
                                      style: AppTheme.displayStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w900,
                                      ),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 3,
                                  ),
                                  decoration: BoxDecoration(
                                    color: const Color(0xCC083344),
                                    borderRadius: BorderRadius.circular(999),
                                    border: Border.all(
                                      color: AppTheme.cyanNeon
                                          .withValues(alpha: 0.5),
                                    ),
                                  ),
                                  child: Text(
                                    '$progressPct%',
                                    style: AppTheme.hudNumberStyle(
                                      fontSize: 11.5,
                                      color: AppTheme.cyanLight,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Container(
                              height: 9,
                              padding: const EdgeInsets.all(1.5),
                              decoration: BoxDecoration(
                                color: const Color(0xFF081533),
                                borderRadius: BorderRadius.circular(999),
                                border: Border.all(
                                  color:
                                      AppTheme.cyanNeon.withValues(alpha: 0.4),
                                ),
                              ),
                              child: FractionallySizedBox(
                                alignment: Alignment.centerLeft,
                                widthFactor: (progressPct / 100).clamp(0.04, 1.0),
                                child: Container(
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(999),
                                    gradient: AppTheme.progressGradient,
                                    boxShadow: AppTheme.cyanGlowShadow(0.55),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Difficulty World Filter Tabs
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: const Color(0x66000000),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: AppTheme.cyanNeon.withValues(alpha: 0.3),
                          ),
                        ),
                        child: Row(
                          children: [
                            _filterTab(
                              controller,
                              id: 'all',
                              label: 'All',
                              count: 25,
                              active: filterTab == 'all',
                            ),
                            const SizedBox(width: 4),
                            _filterTab(
                              controller,
                              id: 'easy',
                              label: 'Easy',
                              count: 8,
                              active: filterTab == 'easy',
                            ),
                            const SizedBox(width: 4),
                            _filterTab(
                              controller,
                              id: 'medium',
                              label: 'Medium',
                              count: 9,
                              active: filterTab == 'medium',
                            ),
                            const SizedBox(width: 4),
                            _filterTab(
                              controller,
                              id: 'hard',
                              label: 'Hard',
                              count: 8,
                              active: filterTab == 'hard',
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Quick Jump Ribbon (1..25)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'QUICK JUMP RIBBON',
                              style: AppTheme.hudNumberStyle(
                                fontSize: 10,
                                color:
                                    AppTheme.cyanLight.withValues(alpha: 0.8),
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            Text(
                              'Scroll ➔',
                              style: AppTheme.hudNumberStyle(
                                fontSize: 9,
                                color: const Color(0xFF94A3B8),
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 4),
                      SizedBox(
                        height: 42,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          physics: const BouncingScrollPhysics(),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 2,
                            vertical: 2,
                          ),
                          itemCount: levelsCatalog.length,
                          separatorBuilder: (_, _) =>
                              const SizedBox(width: 6),
                          itemBuilder: (context, index) {
                            final lvl = levelsCatalog[index];
                            final isSelected = selectedNum == lvl.num;
                            final isCompleted = lvl.num < unlockedMax;
                            final isUnlocked = lvl.num <= unlockedMax;

                            return GestureDetector(
                              onTap: () {
                                if (!isUnlocked) return;
                                controller.selectLevel(lvl.num);
                              },
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 160),
                                width: 36,
                                height: 36,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(11),
                                  gradient: isSelected
                                      ? const LinearGradient(
                                          begin: Alignment.topCenter,
                                          end: Alignment.bottomCenter,
                                          colors: [
                                            AppTheme.gold,
                                            AppTheme.amber,
                                          ],
                                        )
                                      : isCompleted
                                          ? const LinearGradient(
                                              begin: Alignment.topCenter,
                                              end: Alignment.bottomCenter,
                                              colors: [
                                                AppTheme.emerald,
                                                Color(0xFF115E59),
                                              ],
                                            )
                                          : isUnlocked
                                              ? const LinearGradient(
                                                  begin: Alignment.topCenter,
                                                  end: Alignment.bottomCenter,
                                                  colors: [
                                                    AppTheme.blueRoyal,
                                                    AppTheme.blueDeep,
                                                  ],
                                                )
                                              : null,
                                  color: !isUnlocked
                                      ? const Color(0x990F172A)
                                      : null,
                                  border: Border.all(
                                    color: isSelected
                                        ? const Color(0xFFFDE68A)
                                        : isCompleted
                                            ? const Color(0x9934D399)
                                            : isUnlocked
                                                ? AppTheme.cyanNeon
                                                    .withValues(alpha: 0.5)
                                                : const Color(0x66334155),
                                    width: isSelected ? 2 : 1,
                                  ),
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  isCompleted
                                      ? '✓'
                                      : !isUnlocked
                                          ? '🔒'
                                          : '${lvl.num}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w900,
                                    color: isSelected
                                        ? AppTheme.amberDeepText
                                        : isCompleted
                                            ? Colors.white
                                            : isUnlocked
                                                ? AppTheme.cyanLight
                                                : const Color(0xFF64748B),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Mission Levels 2-Column Grid
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: filteredLevels.length,
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 10,
                          mainAxisSpacing: 10,
                          childAspectRatio: 0.74,
                        ),
                        itemBuilder: (context, index) {
                          final lvl = filteredLevels[index];
                          final isSelected = selectedNum == lvl.num;
                          final isCompleted = lvl.num < unlockedMax;
                          final isLocked = lvl.num > unlockedMax;
                          final theme = AppTheme.levelCardTheme(
                            lvl.num,
                            isLocked: isLocked,
                          );

                          return _MissionLevelCard(
                            level: lvl,
                            theme: theme,
                            isSelected: isSelected,
                            isCompleted: isCompleted,
                            isLocked: isLocked,
                            onTap: () {
                              if (isLocked) return;
                              controller.selectLevel(lvl.num);
                              controller.attemptStartLevel(
                                targetLevel: lvl.num,
                              );
                            },
                          );
                        },
                      ),
                      const SizedBox(height: 16),

                      // Hero Action Launch Mission Button
                      Center(
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 270),
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              onTap: () => controller.attemptStartLevel(
                                targetLevel: selectedNum,
                              ),
                              borderRadius: BorderRadius.circular(14),
                              child: Container(
                                width: double.infinity,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 10,
                                  horizontal: 14,
                                ),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(14),
                                  gradient: const LinearGradient(
                                    colors: [
                                      AppTheme.gold,
                                      Color(0xFFFCD34D),
                                      Color(0xFFEAB308),
                                    ],
                                  ),
                                  border: Border.all(
                                    color: const Color(0xFFFDE68A),
                                  ),
                                  boxShadow: const [
                                    BoxShadow(
                                      color: Color(0x73F59E0B),
                                      blurRadius: 16,
                                      offset: Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Column(
                                  children: [
                                    Text(
                                      '🚀 Launch Mission (Level $selectedNum)',
                                      style: const TextStyle(
                                        color: AppTheme.amberDeepText,
                                        fontSize: 12.5,
                                        fontWeight: FontWeight.w900,
                                      ),
                                    ),
                                    const SizedBox(height: 3),
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        const Text(
                                          'Fee:',
                                          style: TextStyle(
                                            color: Color(0xD9451A03),
                                            fontSize: 10,
                                            fontWeight: FontWeight.w800,
                                          ),
                                        ),
                                        const SizedBox(width: 4),
                                        SizedBox(
                                          width: 12,
                                          height: 12,
                                          child: Image.asset(
                                            AppAssets.goldCoin,
                                            fit: BoxFit.contain,
                                            gaplessPlayback: true,
                                          ),
                                        ),
                                        const SizedBox(width: 2),
                                        Text(
                                          '${selectedCost.coins}',
                                          style: const TextStyle(
                                            fontFamily: 'monospace',
                                            color: AppTheme.amberDeepText,
                                            fontSize: 10,
                                            fontWeight: FontWeight.w900,
                                          ),
                                        ),
                                        const Text(
                                          ' • ',
                                          style: TextStyle(
                                            color: AppTheme.amberDeepText,
                                            fontSize: 10,
                                          ),
                                        ),
                                        SizedBox(
                                          width: 12,
                                          height: 12,
                                          child: Image.asset(
                                            AppAssets.gem,
                                            fit: BoxFit.contain,
                                            gaplessPlayback: true,
                                          ),
                                        ),
                                        const SizedBox(width: 2),
                                        Text(
                                          '${selectedCost.gems}',
                                          style: const TextStyle(
                                            fontFamily: 'monospace',
                                            color: AppTheme.amberDeepText,
                                            fontSize: 10,
                                            fontWeight: FontWeight.w900,
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 5,
                                            vertical: 1.5,
                                          ),
                                          decoration: BoxDecoration(
                                            color: const Color(0x33451A03),
                                            borderRadius:
                                                BorderRadius.circular(4),
                                          ),
                                          child: const Text(
                                            'PLAY',
                                            style: TextStyle(
                                              color: AppTheme.amberDeepText,
                                              fontSize: 8.5,
                                              fontWeight: FontWeight.w900,
                                              letterSpacing: 0.6,
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
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _filterTab(
    GameController controller, {
    required String id,
    required String label,
    required int count,
    required bool active,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: () => controller.setLevelFilterTab(id),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 160),
          padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(9),
            gradient: active
                ? const LinearGradient(
                    colors: [Color(0xFF06B6D4), Color(0xFF2563EB)],
                  )
                : null,
            border: Border.all(
              color: active ? const Color(0xFF67E8F9) : Colors.transparent,
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Flexible(
                child: Text(
                  label,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w900,
                    color: active ? Colors.white : const Color(0xB3BAE6FD),
                  ),
                ),
              ),
              const SizedBox(width: 3),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                decoration: BoxDecoration(
                  color: active
                      ? const Color(0xCC083344)
                      : const Color(0xCC1E293B),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  '$count',
                  style: TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                    color:
                        active ? AppTheme.cyanLight : const Color(0xFF94A3B8),
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

class _MissionLevelCard extends StatelessWidget {
  const _MissionLevelCard({
    required this.level,
    required this.theme,
    required this.isSelected,
    required this.isCompleted,
    required this.isLocked,
    required this.onTap,
  });

  final LevelConfig level;
  final LevelCardTheme theme;
  final bool isSelected;
  final bool isCompleted;
  final bool isLocked;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Opacity(
        opacity: isLocked ? 0.65 : 1.0,
        child: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: theme.cardGradientColors,
            ),
            border: Border.all(
              color: isSelected
                  ? Colors.white.withValues(alpha: 0.85)
                  : theme.borderColor,
              width: 2,
            ),
            boxShadow: [
              BoxShadow(
                color: isSelected
                    ? AppTheme.cyanNeon.withValues(alpha: 0.55)
                    : theme.glowColor,
                blurRadius: isSelected ? 18 : 14,
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top 3D Artwork Banner (16:10)
              AspectRatio(
                aspectRatio: 16 / 10,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      ColorFiltered(
                        colorFilter: isLocked
                            ? const ColorFilter.mode(
                                Color(0xAA0F172A),
                                BlendMode.saturation,
                              )
                            : const ColorFilter.mode(
                                Colors.transparent,
                                BlendMode.multiply,
                              ),
                        child: Image.asset(
                          level.artAsset,
                          fit: BoxFit.cover,
                          gaplessPlayback: true,
                        ),
                      ),
                      const DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Color(0x1AFFFFFF),
                              Colors.transparent,
                              Color(0x80000000),
                            ],
                          ),
                        ),
                      ),
                      if (isLocked)
                        Container(
                          color: const Color(0x99000000),
                          alignment: Alignment.center,
                          child: Container(
                            width: 30,
                            height: 30,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: const Color(0xE60F172A),
                              border: Border.all(
                                color: const Color(0xCC475569),
                              ),
                            ),
                            alignment: Alignment.center,
                            child: const Text(
                              '🔒',
                              style: TextStyle(fontSize: 12),
                            ),
                          ),
                        ),
                      if (isCompleted)
                        Positioned(
                          top: 6,
                          right: 6,
                          child: Container(
                            width: 20,
                            height: 20,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: AppTheme.emerald,
                              border: Border.all(
                                color: const Color(0xFF6EE7B7),
                              ),
                              boxShadow: const [
                                BoxShadow(
                                  color: Color(0xCC10B981),
                                  blurRadius: 8,
                                ),
                              ],
                            ),
                            alignment: Alignment.center,
                            child: const Text(
                              '✓',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 6),

              // Title & Level Badge
              Row(
                children: [
                  Expanded(
                    child: Text(
                      level.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTheme.displayStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                  const SizedBox(width: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: theme.badgeBgColor,
                      borderRadius: BorderRadius.circular(999),
                      border: Border.all(color: theme.badgeBorderColor),
                    ),
                    child: Text(
                      '${isLocked ? '🔒' : '★'} Lvl ${level.num}',
                      style: TextStyle(
                        fontSize: 8.5,
                        fontWeight: FontWeight.w900,
                        color: theme.badgeTextColor,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 3),

              // 3 Stars Rating
              Row(
                children: List.generate(
                  3,
                  (_) => Text(
                    '★',
                    style: TextStyle(
                      fontSize: 12,
                      color: isCompleted
                          ? AppTheme.gold
                          : const Color(0xFF475569),
                    ),
                  ),
                ),
              ),
              const Spacer(),

              // Bottom Row: Specs Pills & Play Capsule
              Container(
                padding: const EdgeInsets.only(top: 6),
                decoration: const BoxDecoration(
                  border: Border(
                    top: BorderSide(color: Color(0x14FFFFFF)),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Flexible(
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        alignment: Alignment.centerLeft,
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            _specPill('🎮', '${level.stageCount}'),
                            const SizedBox(width: 4),
                            _specPill(
                              '⏱️',
                              '${getLevelTimerSeconds(level.num)}s',
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 5,
                      ),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(999),
                        gradient: LinearGradient(
                          colors: theme.buttonGradientColors,
                        ),
                      ),
                      child: Text(
                        '${isLocked ? '🔒' : '▶'} ${isLocked ? 'Lock' : 'Play'}',
                        style: TextStyle(
                          fontSize: 10.5,
                          fontWeight: FontWeight.w900,
                          color: theme.buttonTextColor,
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

  Widget _specPill(String icon, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
      decoration: BoxDecoration(
        color: const Color(0x26FFFFFF),
        borderRadius: BorderRadius.circular(5),
        border: Border.all(color: const Color(0x40FFFFFF)),
      ),
      child: Text(
        '$icon $value',
        style: const TextStyle(
          fontFamily: 'monospace',
          fontSize: 8.5,
          fontWeight: FontWeight.w800,
          color: Colors.white,
        ),
      ),
    );
  }
}

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../data/levels_catalog.dart';
import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';
import '../widgets/hud_header.dart';

/// 3. HOME DASHBOARD — Sci-Fi 3D Arcade Hub with Zero-Pop-In WebP Cards & Top Champions Reel.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Timer _clockTimer;
  String _currentTime = DateFormat('HH:mm:ss').format(DateTime.now());
  bool _precached = false;

  @override
  void initState() {
    super.initState();
    _clockTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      final next = DateFormat('HH:mm:ss').format(DateTime.now());
      if (next != _currentTime) {
        setState(() {
          _currentTime = next;
        });
      }
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_precached) {
      _precached = true;
      final avatar = context.read<GameController>().profile.equippedAvatarAsset;
      final assetsToCache = <String>{
        AppAssets.heroScifi,
        AppAssets.cardDaily,
        AppAssets.cardLevel,
        AppAssets.cardRewards,
        AppAssets.cardContinue,
        'assets/images/card_newgame_clean_bg.webp',
        AppAssets.goldCoin,
        AppAssets.gem,
        AppAssets.robotAvatar,
        avatar,
        for (final champ in topChampions) champ.iconAsset,
      };
      for (final asset in assetsToCache) {
        precacheImage(AssetImage(asset), context);
      }
    }
  }

  @override
  void dispose() {
    _clockTimer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<GameController>();
    final activeLevel = controller.activePlayerLevel;
    final activeLevelConfig = levelsCatalog.firstWhere(
      (l) => l.num == activeLevel,
      orElse: () => levelsCatalog.first,
    );
    final todayDateLabel = DateFormat('MMM d').format(DateTime.now());

    return Container(
      decoration: const BoxDecoration(
        gradient: AppTheme.gameBackgroundGradient,
      ),
      child: Column(
        children: [
          HomeHudHeader(controller: controller),
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(10, 8, 10, 24),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 448),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Hero Banner (576 x 276)
                      Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: AppTheme.cyanNeon.withValues(alpha: 0.22),
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x99000000),
                              blurRadius: 20,
                              offset: Offset(0, 8),
                            ),
                          ],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: AspectRatio(
                            aspectRatio: 576 / 276,
                            child: Image.asset(
                              AppAssets.heroScifi,
                              fit: BoxFit.cover,
                              gaplessPlayback: true,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),

                      // 1. Daily Challenge Card (540 x 167)
                      _TactileCardWrapper(
                        onTap: () => controller.navigateTo(AppScreen.daily),
                        child: AspectRatio(
                          aspectRatio: 540 / 167,
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              Image.asset(
                                AppAssets.cardDaily,
                                fit: BoxFit.fill,
                                gaplessPlayback: true,
                              ),
                              Positioned.fill(
                                child: FractionallySizedBox(
                                  alignment: Alignment.centerRight,
                                  widthFactor: 0.59,
                                  child: Padding(
                                    padding: const EdgeInsets.fromLTRB(
                                        4, 8, 10, 8),
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.stretch,
                                      children: [
                                        Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Row(
                                              children: [
                                                Expanded(
                                                  child: RichText(
                                                    maxLines: 1,
                                                    overflow:
                                                        TextOverflow.ellipsis,
                                                    text: TextSpan(
                                                      style:
                                                          AppTheme.displayStyle(
                                                        fontSize: 15,
                                                        fontWeight:
                                                            FontWeight.w900,
                                                      ),
                                                      children: const [
                                                        TextSpan(
                                                            text: 'Daily '),
                                                        TextSpan(
                                                          text: 'Challenge',
                                                          style: TextStyle(
                                                            color: Color(
                                                                0xFF67E8F9),
                                                          ),
                                                        ),
                                                      ],
                                                    ),
                                                  ),
                                                ),
                                                const SizedBox(width: 4),
                                                Container(
                                                  padding: const EdgeInsets
                                                      .symmetric(
                                                    horizontal: 6,
                                                    vertical: 2,
                                                  ),
                                                  decoration: BoxDecoration(
                                                    color: const Color(
                                                        0xE60A1E4A),
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            6),
                                                    border: Border.all(
                                                      color: AppTheme.cyanNeon
                                                          .withValues(
                                                              alpha: 0.5),
                                                    ),
                                                  ),
                                                  child: Row(
                                                    mainAxisSize:
                                                        MainAxisSize.min,
                                                    children: [
                                                      const Icon(
                                                        Icons
                                                            .calendar_today_rounded,
                                                        size: 9,
                                                        color:
                                                            Color(0xFF67E8F9),
                                                      ),
                                                      const SizedBox(width: 3),
                                                      Text(
                                                        todayDateLabel,
                                                        style: AppTheme
                                                            .hudNumberStyle(
                                                          fontSize: 9,
                                                          color: AppTheme
                                                              .cyanLight,
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 2),
                                            const Text(
                                              "Solve today's puzzle and get amazing rewards!",
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: TextStyle(
                                                fontSize: 9.5,
                                                fontWeight: FontWeight.w600,
                                                color: Color(0xFFCCE9FF),
                                              ),
                                            ),
                                          ],
                                        ),
                                        Align(
                                          alignment: Alignment.centerRight,
                                          child: Container(
                                            width: double.infinity,
                                            padding: const EdgeInsets.symmetric(
                                              vertical: 6,
                                            ),
                                            decoration: BoxDecoration(
                                              borderRadius:
                                                  BorderRadius.circular(999),
                                              gradient: const LinearGradient(
                                                colors: [
                                                  AppTheme.amber,
                                                  Color(0xFFFCD34D),
                                                  Color(0xFFEAB308),
                                                ],
                                              ),
                                              border: Border.all(
                                                color: const Color(0x99FDE68A),
                                              ),
                                              boxShadow: const [
                                                BoxShadow(
                                                  color: Color(0xFF92400E),
                                                  offset: Offset(0, 3),
                                                ),
                                                BoxShadow(
                                                  color: Color(0x73F59E0B),
                                                  blurRadius: 12,
                                                  offset: Offset(0, 4),
                                                ),
                                              ],
                                            ),
                                            child: const Row(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.center,
                                              children: [
                                                Text(
                                                  '▶',
                                                  style: TextStyle(
                                                    color:
                                                        AppTheme.amberDeepText,
                                                    fontSize: 10,
                                                  ),
                                                ),
                                                SizedBox(width: 6),
                                                Text(
                                                  'Play',
                                                  style: TextStyle(
                                                    color:
                                                        AppTheme.amberDeepText,
                                                    fontSize: 12.5,
                                                    fontWeight: FontWeight.w900,
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
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),

                      // 2. Mid Section (Level & Rewards side by side, 258 x 130)
                      Row(
                        children: [
                          Expanded(
                            child: _TactileCardWrapper(
                              onTap: () =>
                                  controller.navigateTo(AppScreen.levels),
                              child: AspectRatio(
                                aspectRatio: 258 / 130,
                                child: LayoutBuilder(
                                  builder: (context, box) {
                                    return Stack(
                                      fit: StackFit.expand,
                                      children: [
                                        Image.asset(
                                          AppAssets.cardLevel,
                                          fit: BoxFit.fill,
                                          gaplessPlayback: true,
                                        ),
                                        Positioned(
                                          left: box.maxWidth * 0.47,
                                          right: box.maxWidth * 0.14,
                                          top: 0,
                                          bottom: 0,
                                          child: Column(
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: [
                                              FittedBox(
                                                fit: BoxFit.scaleDown,
                                                child: Text(
                                                  'Level $activeLevel',
                                                  style: AppTheme.displayStyle(
                                                    fontSize: 15,
                                                    fontWeight: FontWeight.w900,
                                                    height: 1.0,
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(height: 4),
                                              Text(
                                                '${controller.completedLevelsCount}/${controller.dueLevelsCount}',
                                                style: AppTheme.hudNumberStyle(
                                                  fontSize: 10,
                                                  color:
                                                      const Color(0xFFD8F2FF),
                                                  fontWeight: FontWeight.w700,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    );
                                  },
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _TactileCardWrapper(
                              onTap: () =>
                                  controller.navigateTo(AppScreen.rewards),
                              child: AspectRatio(
                                aspectRatio: 258 / 130,
                                child: LayoutBuilder(
                                  builder: (context, box) {
                                    return Stack(
                                      fit: StackFit.expand,
                                      children: [
                                        Image.asset(
                                          AppAssets.cardRewards,
                                          fit: BoxFit.fill,
                                          gaplessPlayback: true,
                                        ),
                                        Positioned(
                                          left: box.maxWidth * 0.41,
                                          right: box.maxWidth * 0.14,
                                          top: 0,
                                          bottom: 0,
                                          child: Column(
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: [
                                              FittedBox(
                                                fit: BoxFit.scaleDown,
                                                child: Text(
                                                  'Rewards',
                                                  style: AppTheme.displayStyle(
                                                    fontSize: 15,
                                                    fontWeight: FontWeight.w900,
                                                    height: 1.0,
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(height: 4),
                                              const FittedBox(
                                                fit: BoxFit.scaleDown,
                                                child: Text(
                                                  'Coins & Gems',
                                                  style: TextStyle(
                                                    fontSize: 9.5,
                                                    fontWeight: FontWeight.w700,
                                                    color: Color(0xFFD8F2FF),
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    );
                                  },
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),

                      // 3. Continue Card (540 x 74)
                      _TactileCardWrapper(
                        onTap: () => controller.attemptStartLevel(
                          targetLevel: activeLevel,
                        ),
                        child: AspectRatio(
                          aspectRatio: 540 / 74,
                          child: LayoutBuilder(
                            builder: (context, box) {
                              return Stack(
                                fit: StackFit.expand,
                                children: [
                                  Image.asset(
                                    AppAssets.cardContinue,
                                    fit: BoxFit.fill,
                                    gaplessPlayback: true,
                                  ),
                                  Positioned(
                                    left: box.maxWidth * 0.38,
                                    right: box.maxWidth * 0.16,
                                    top: 0,
                                    bottom: 0,
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Continue',
                                          style: AppTheme.displayStyle(
                                            fontSize: 17,
                                            fontWeight: FontWeight.w900,
                                            height: 1.05,
                                          ),
                                        ),
                                        const SizedBox(height: 3),
                                        Row(
                                          children: [
                                            const Icon(
                                              Icons.access_time_rounded,
                                              size: 13,
                                              color: AppTheme.cyanSky,
                                            ),
                                            const SizedBox(width: 5),
                                            Text(
                                              _currentTime,
                                              style: AppTheme.hudNumberStyle(
                                                fontSize: 11,
                                                color: AppTheme.cyanSky,
                                                fontWeight: FontWeight.w700,
                                              ),
                                            ),
                                            const SizedBox(width: 6),
                                            Text(
                                              activeLevelConfig.difficulty,
                                              style: const TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.w700,
                                                color: AppTheme.cyanSky,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              );
                            },
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),

                      // 4. New Game Card (540 x 72)
                      _TactileCardWrapper(
                        onTap: () => controller.navigateTo(AppScreen.levels),
                        child: AspectRatio(
                          aspectRatio: 540 / 72,
                          child: LayoutBuilder(
                            builder: (context, box) {
                              return Stack(
                                fit: StackFit.expand,
                                children: [
                                  Image.asset(
                                    'assets/images/card_newgame_clean_bg.webp',
                                    fit: BoxFit.fill,
                                    gaplessPlayback: true,
                                  ),
                                  Positioned(
                                    left: box.maxWidth * 0.28,
                                    right: box.maxWidth * 0.16,
                                    top: 0,
                                    bottom: 0,
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'New Game',
                                          style: AppTheme.displayStyle(
                                            fontSize: 17,
                                            fontWeight: FontWeight.w900,
                                            height: 1.05,
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        const Text(
                                          'Start a fresh challenge',
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: TextStyle(
                                            fontSize: 10.5,
                                            fontWeight: FontWeight.w700,
                                            color: Color(0xFFE2E8F0),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              );
                            },
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // 5. Top Champions Live Reel
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                const Text('📐', style: TextStyle(fontSize: 12)),
                                const SizedBox(width: 6),
                                Text(
                                  'TOP CHAMPIONS',
                                  style: AppTheme.displayStyle(
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w800,
                                    color: const Color(0xFF0F3268),
                                    letterSpacing: 1.0,
                                  ),
                                ),
                              ],
                            ),
                            const Text(
                              'Swipe ➔',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF1E40AF),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 6),
                      SizedBox(
                        height: 182,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          physics: const BouncingScrollPhysics(),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 2,
                            vertical: 4,
                          ),
                          itemCount: topChampions.length,
                          separatorBuilder: (_, _) =>
                              const SizedBox(width: 10),
                          itemBuilder: (context, index) {
                            final champ = topChampions[index];
                            return _ChampionArchitecturalCard(
                              champion: champ,
                              onTap: () => controller.navigateTo(
                                AppScreen.leaderboard,
                              ),
                            );
                          },
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
}

class _TactileCardWrapper extends StatelessWidget {
  const _TactileCardWrapper({
    required this.onTap,
    required this.child,
  });

  final VoidCallback onTap;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(16),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: child,
      ),
    );
  }
}

class _ChampionThemePalette {
  const _ChampionThemePalette({
    required this.cardColors,
    required this.outerRimColors,
    required this.facetColors,
    required this.innerRimColors,
    required this.rankColors,
    required this.rankTextColor,
    required this.domeColors,
    required this.countryBg,
    required this.countryBorder,
    required this.countryText,
    required this.rewardsBg,
    required this.rewardsBorder,
    required this.glowColor,
  });

  final List<Color> cardColors;
  final List<Color> outerRimColors;
  final List<Color> facetColors;
  final List<Color> innerRimColors;
  final List<Color> rankColors;
  final Color rankTextColor;
  final List<Color> domeColors;
  final Color countryBg;
  final Color countryBorder;
  final Color countryText;
  final Color rewardsBg;
  final Color rewardsBorder;
  final Color glowColor;

  static _ChampionThemePalette forRank(int rankNum) {
    switch (rankNum) {
      case 1:
        return const _ChampionThemePalette(
          cardColors: [Color(0xFF13377A), Color(0xFF1D4F9E), Color(0xFF102E66)],
          outerRimColors: [
            Color(0xFFFEF08A),
            Color(0xFFFBBF24),
            Color(0xFFB45309),
          ],
          facetColors: [Color(0xFF2C1C04), Color(0xFF150D02)],
          innerRimColors: [
            Color(0xFFFEF08A),
            Color(0xFFF59E0B),
            Color(0xFF92400E),
          ],
          rankColors: [
            Color(0xFFFCD34D),
            Color(0xFFFBBF24),
            Color(0xFFF59E0B),
          ],
          rankTextColor: Color(0xFF451A03),
          domeColors: [Color(0xFF2558B8), Color(0xFF163B82), Color(0xFF0D2354)],
          countryBg: Color(0xE6133270),
          countryBorder: Color(0x66FBBF24),
          countryText: Color(0xFFFDE68A),
          rewardsBg: Color(0xF20E285A),
          rewardsBorder: Color(0x99FBBF24),
          glowColor: Color(0x73F59E0B),
        );
      case 2:
        return const _ChampionThemePalette(
          cardColors: [Color(0xFF3A1B73), Color(0xFF51239E), Color(0xFF2E155C)],
          outerRimColors: [
            Color(0xFFF3E8FF),
            Color(0xFFC084FC),
            Color(0xFF7E22CE),
          ],
          facetColors: [Color(0xFF240E40), Color(0xFF130624)],
          innerRimColors: [
            Color(0xFFF3E8FF),
            Color(0xFFA855F7),
            Color(0xFF6B21A8),
          ],
          rankColors: [
            Color(0xFFF1F5F9),
            Color(0xFFE2E8F0),
            Color(0xFFCBD5E1),
          ],
          rankTextColor: Color(0xFF0F172A),
          domeColors: [Color(0xFF682BC9), Color(0xFF451A87), Color(0xFF260D4D)],
          countryBg: Color(0xE6371970),
          countryBorder: Color(0x66C084FC),
          countryText: Color(0xFFE9D5FF),
          rewardsBg: Color(0xF2291354),
          rewardsBorder: Color(0x99C084FC),
          glowColor: Color(0x73A855F7),
        );
      case 3:
        return const _ChampionThemePalette(
          cardColors: [Color(0xFF094D3C), Color(0xFF0E6952), Color(0xFF073D30)],
          outerRimColors: [
            Color(0xFFD1FAE5),
            Color(0xFF34D399),
            Color(0xFF047857),
          ],
          facetColors: [Color(0xFF062B20), Color(0xFF031711)],
          innerRimColors: [
            Color(0xFFD1FAE5),
            Color(0xFF10B981),
            Color(0xFF065F46),
          ],
          rankColors: [
            Color(0xFFD97706),
            Color(0xFFF59E0B),
            Color(0xFFEAB308),
          ],
          rankTextColor: Color(0xFF451A03),
          domeColors: [Color(0xFF158066), Color(0xFF0C5745), Color(0xFF06362B)],
          countryBg: Color(0xE60B4739),
          countryBorder: Color(0x6634D399),
          countryText: Color(0xFFA7F3D0),
          rewardsBg: Color(0xF207382D),
          rewardsBorder: Color(0x9934D399),
          glowColor: Color(0x7310B981),
        );
      case 4:
        return const _ChampionThemePalette(
          cardColors: [Color(0xFF692D0E), Color(0xFF8C3D14), Color(0xFF54240A)],
          outerRimColors: [
            Color(0xFFFFEDD5),
            Color(0xFFFB923C),
            Color(0xFFC2410C),
          ],
          facetColors: [Color(0xFF331204), Color(0xFF1C0902)],
          innerRimColors: [
            Color(0xFFFFEDD5),
            Color(0xFFF97316),
            Color(0xFF9A3412),
          ],
          rankColors: [
            Color(0xFF67E8F9),
            Color(0xFF22D3EE),
            Color(0xFF06B6D4),
          ],
          rankTextColor: Color(0xFF083344),
          domeColors: [Color(0xFFAD4B1B), Color(0xFF783210), Color(0xFF471D08)],
          countryBg: Color(0xE65F280E),
          countryBorder: Color(0x66FB923C),
          countryText: Color(0xFFFED7AA),
          rewardsBg: Color(0xF24A1F0A),
          rewardsBorder: Color(0x99FB923C),
          glowColor: Color(0x73F97316),
        );
      default:
        return const _ChampionThemePalette(
          cardColors: [Color(0xFF0B426E), Color(0xFF105A96), Color(0xFF083559)],
          outerRimColors: [
            Color(0xFFCFFAFE),
            Color(0xFF22D3EE),
            Color(0xFF0891B2),
          ],
          facetColors: [Color(0xFF08283A), Color(0xFF04151E)],
          innerRimColors: [
            Color(0xFFCFFAFE),
            Color(0xFF06B6D4),
            Color(0xFF0E7490),
          ],
          rankColors: [
            Color(0xFFF0ABFC),
            Color(0xFFE879F9),
            Color(0xFFEC4899),
          ],
          rankTextColor: Color(0xFF4A044E),
          domeColors: [Color(0xFF1972B5), Color(0xFF0F4C7D), Color(0xFF092F4F)],
          countryBg: Color(0xE60D3F66),
          countryBorder: Color(0x6622D3EE),
          countryText: Color(0xFFA5F3FC),
          rewardsBg: Color(0xF2093252),
          rewardsBorder: Color(0x9922D3EE),
          glowColor: Color(0x7306B6D4),
        );
    }
  }
}

class _ChampionArchitecturalCard extends StatelessWidget {
  const _ChampionArchitecturalCard({
    required this.champion,
    required this.onTap,
  });

  final ChampionEntry champion;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = _ChampionThemePalette.forRank(champion.rankNum);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 114,
        height: 174,
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: p.glowColor,
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
            const BoxShadow(
              color: Color(0x99000000),
              blurRadius: 4,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: ClipPath(
          clipper: const _ChamferedClipper(12),
          child: Container(
            padding: const EdgeInsets.all(1.5),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: p.outerRimColors,
              ),
            ),
            child: ClipPath(
              clipper: const _ChamferedClipper(10.5),
              child: Container(
                padding: const EdgeInsets.all(3),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: p.facetColors,
                  ),
                ),
                child: ClipPath(
                  clipper: const _ChamferedClipper(8.5),
                  child: Container(
                    padding: const EdgeInsets.all(1.5),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: p.innerRimColors,
                      ),
                    ),
                    child: ClipPath(
                      clipper: const _ChamferedClipper(7.5),
                      child: Container(
                        padding: const EdgeInsets.fromLTRB(6, 7, 6, 6),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: p.cardColors,
                          ),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            // Top Blueprint Header
                            Column(
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Flexible(
                                      child: Text(
                                        'COMPLETED',
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: TextStyle(
                                          fontFamily: 'monospace',
                                          fontSize: 6.5,
                                          fontWeight: FontWeight.w800,
                                          color: p.countryText,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 3),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 4,
                                        vertical: 1.5,
                                      ),
                                      decoration: BoxDecoration(
                                        color: const Color(0x66000000),
                                        borderRadius: BorderRadius.circular(4),
                                        border: Border.all(
                                          color: const Color(0x1AFFFFFF),
                                        ),
                                      ),
                                      child: Text(
                                        champion.levelDisplay,
                                        style: TextStyle(
                                          fontFamily: 'monospace',
                                          fontSize: 7.5,
                                          fontWeight: FontWeight.w900,
                                          color: p.countryText,
                                          height: 1.0,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 3),
                                Container(
                                  height: 1,
                                  decoration: const BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        Colors.transparent,
                                        Color(0x33FFFFFF),
                                        Colors.transparent,
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),

                            // Center Pedestal + Name + Country
                            Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 38,
                                  height: 38,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    gradient: RadialGradient(
                                      center: const Alignment(0, -0.5),
                                      colors: p.domeColors,
                                    ),
                                    boxShadow: const [
                                      BoxShadow(
                                        color: Color(0x80000000),
                                        blurRadius: 8,
                                        offset: Offset(0, 4),
                                      ),
                                    ],
                                  ),
                                  padding: const EdgeInsets.all(4),
                                  child: Image.asset(
                                    champion.iconAsset,
                                    fit: BoxFit.contain,
                                    gaplessPlayback: true,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  champion.name,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: AppTheme.displayStyle(
                                    fontSize: 10.5,
                                    fontWeight: FontWeight.w900,
                                  ),
                                ),
                                const SizedBox(height: 3),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 6,
                                    vertical: 2,
                                  ),
                                  decoration: BoxDecoration(
                                    color: p.countryBg,
                                    borderRadius: BorderRadius.circular(999),
                                    border: Border.all(color: p.countryBorder),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        champion.flag,
                                        style: const TextStyle(fontSize: 9),
                                      ),
                                      const SizedBox(width: 3),
                                      Flexible(
                                        child: Text(
                                          champion.country,
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: TextStyle(
                                            fontSize: 7.5,
                                            fontWeight: FontWeight.w700,
                                            color: p.countryText,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),

                            // Bottom Rank & Rewards
                            Column(
                              children: [
                                Container(
                                  width: double.infinity,
                                  padding:
                                      const EdgeInsets.symmetric(vertical: 2.5),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(4),
                                    gradient: LinearGradient(
                                      colors: p.rankColors,
                                    ),
                                    border: Border.all(
                                      color: const Color(0x80FFFFFF),
                                      width: 0.7,
                                    ),
                                  ),
                                  alignment: Alignment.center,
                                  child: Text(
                                    champion.rank.toUpperCase(),
                                    style: TextStyle(
                                      color: p.rankTextColor,
                                      fontSize: 8,
                                      fontWeight: FontWeight.w900,
                                      height: 1.0,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 3),
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 4,
                                    vertical: 2.5,
                                  ),
                                  decoration: BoxDecoration(
                                    color: p.rewardsBg,
                                    borderRadius: BorderRadius.circular(4),
                                    border: Border.all(color: p.rewardsBorder),
                                  ),
                                  child: FittedBox(
                                    fit: BoxFit.scaleDown,
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        SizedBox(
                                          width: 10,
                                          height: 10,
                                          child: Image.asset(
                                            AppAssets.goldCoin,
                                            fit: BoxFit.contain,
                                            gaplessPlayback: true,
                                          ),
                                        ),
                                        const SizedBox(width: 2),
                                        Text(
                                          champion.coins,
                                          style: const TextStyle(
                                            color: Color(0xFFFCD34D),
                                            fontSize: 7.5,
                                            fontWeight: FontWeight.w900,
                                          ),
                                        ),
                                        const Padding(
                                          padding: EdgeInsets.symmetric(
                                              horizontal: 3),
                                          child: Text(
                                            '|',
                                            style: TextStyle(
                                              color: Color(0x4DFFFFFF),
                                              fontSize: 7,
                                            ),
                                          ),
                                        ),
                                        SizedBox(
                                          width: 10,
                                          height: 10,
                                          child: Image.asset(
                                            AppAssets.gem,
                                            fit: BoxFit.contain,
                                            gaplessPlayback: true,
                                          ),
                                        ),
                                        const SizedBox(width: 2),
                                        Text(
                                          champion.gems,
                                          style: const TextStyle(
                                            color: AppTheme.cyanLight,
                                            fontSize: 7.5,
                                            fontWeight: FontWeight.w900,
                                          ),
                                        ),
                                      ],
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
            ),
          ),
        ),
      ),
    );
  }
}

class _ChamferedClipper extends CustomClipper<Path> {
  const _ChamferedClipper(this.cut);

  final double cut;

  @override
  Path getClip(Size size) {
    final c = cut;
    final w = size.width;
    final h = size.height;
    return Path()
      ..moveTo(c, 0)
      ..lineTo(w - c, 0)
      ..lineTo(w, c)
      ..lineTo(w, h - c)
      ..lineTo(w - c, h)
      ..lineTo(c, h)
      ..lineTo(0, h - c)
      ..lineTo(0, c)
      ..close();
  }

  @override
  bool shouldReclip(covariant _ChamferedClipper oldClipper) =>
      oldClipper.cut != cut;
}

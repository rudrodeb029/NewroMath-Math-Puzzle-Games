import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../data/levels_catalog.dart';
import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';

final NumberFormat _hudNumberFormat = NumberFormat.decimalPattern();

/// Tactile square cyber-arcade icon button used in top HUD bars.
class CyberHeaderIconButton extends StatelessWidget {
  const CyberHeaderIconButton({
    super.key,
    required this.icon,
    required this.onTap,
    this.tooltip,
    this.size = 32,
  });

  final Widget icon;
  final VoidCallback onTap;
  final String? tooltip;
  final double size;

  @override
  Widget build(BuildContext context) {
    final button = Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(11),
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(11),
            gradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [AppTheme.blueRoyal, AppTheme.blueDeep],
            ),
            border: Border.all(
              color: AppTheme.cyanNeon.withValues(alpha: 0.7),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: AppTheme.cyanNeon.withValues(alpha: 0.35),
                blurRadius: 10,
              ),
            ],
          ),
          alignment: Alignment.center,
          child: icon,
        ),
      ),
    );

    if (tooltip != null) {
      return Tooltip(message: tooltip!, child: button);
    }
    return button;
  }
}

/// 3D tactile Gold Coin currency capsule for top HUD headers.
class CoinCurrencyCapsule extends StatelessWidget {
  const CoinCurrencyCapsule({
    super.key,
    required this.coins,
    required this.onTap,
    this.showPlus = true,
  });

  final int coins;
  final VoidCallback onTap;
  final bool showPlus;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            gradient: const LinearGradient(
              colors: [
                Color(0xE61B1C08),
                Color(0xE6272106),
                Color(0xE6121102),
              ],
            ),
            border: Border.all(
              color: AppTheme.amber.withValues(alpha: 0.55),
              width: 1,
            ),
            boxShadow: const [
              BoxShadow(
                color: Color(0x80000000),
                blurRadius: 8,
                offset: Offset(0, 3),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                width: 14,
                height: 14,
                child: Image.asset(
                  AppAssets.goldCoin,
                  fit: BoxFit.contain,
                  gaplessPlayback: true,
                  errorBuilder: (_, _, _) => const Icon(
                    Icons.monetization_on_rounded,
                    size: 14,
                    color: AppTheme.goldBright,
                  ),
                ),
              ),
              const SizedBox(width: 4),
              Text(
                _hudNumberFormat.format(coins),
                style: AppTheme.hudNumberStyle(
                  fontSize: 10.5,
                  color: const Color(0xFFFCD34D),
                ),
              ),
              if (showPlus) ...[
                const SizedBox(width: 4),
                Container(
                  width: 13,
                  height: 13,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [AppTheme.gold, AppTheme.amberDark],
                    ),
                  ),
                  alignment: Alignment.center,
                  child: const Text(
                    '+',
                    style: TextStyle(
                      color: AppTheme.amberDeepText,
                      fontSize: 9,
                      fontWeight: FontWeight.w900,
                      height: 1.0,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// 3D tactile Cyan Gem currency capsule for top HUD headers.
class GemCurrencyCapsule extends StatelessWidget {
  const GemCurrencyCapsule({
    super.key,
    required this.gems,
    required this.onTap,
    this.showPlus = true,
  });

  final int gems;
  final VoidCallback onTap;
  final bool showPlus;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            gradient: const LinearGradient(
              colors: [
                Color(0xE6071D38),
                Color(0xE60A2347),
                Color(0xE6051429),
              ],
            ),
            border: Border.all(
              color: AppTheme.cyanBright.withValues(alpha: 0.55),
              width: 1,
            ),
            boxShadow: const [
              BoxShadow(
                color: Color(0x80000000),
                blurRadius: 8,
                offset: Offset(0, 3),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                width: 14,
                height: 14,
                child: Image.asset(
                  AppAssets.gem,
                  fit: BoxFit.contain,
                  gaplessPlayback: true,
                  errorBuilder: (_, _, _) => const Icon(
                    Icons.diamond_rounded,
                    size: 14,
                    color: AppTheme.cyanSky,
                  ),
                ),
              ),
              const SizedBox(width: 4),
              Text(
                _hudNumberFormat.format(gems),
                style: AppTheme.hudNumberStyle(
                  fontSize: 10.5,
                  color: AppTheme.cyanLight,
                ),
              ),
              if (showPlus) ...[
                const SizedBox(width: 4),
                Container(
                  width: 13,
                  height: 13,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [AppTheme.cyanBright, AppTheme.bluePrimary],
                    ),
                  ),
                  alignment: Alignment.center,
                  child: const Text(
                    '+',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 9,
                      fontWeight: FontWeight.w900,
                      height: 1.0,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// Sticky Cyber-Arcade HUD header for the Home Dashboard.
class HomeHudHeader extends StatelessWidget {
  const HomeHudHeader({
    super.key,
    required this.controller,
  });

  final GameController controller;

  @override
  Widget build(BuildContext context) {
    final topInset = MediaQuery.paddingOf(context).top;
    final activeLevel = controller.activePlayerLevel;
    final progressPct = (controller.campaignProgressPct / 100.0).clamp(0.08, 1.0);

    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(10, topInset > 0 ? topInset + 6 : 10, 10, 8),
      decoration: BoxDecoration(
        gradient: AppTheme.headerBackgroundGradient,
        border: Border(
          bottom: BorderSide(
            color: AppTheme.cyanNeon.withValues(alpha: 0.28),
            width: 1,
          ),
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x99000000),
            blurRadius: 16,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 448),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Left: Profile & Campaign Level Capsule
              Flexible(
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () => controller.navigateTo(AppScreen.profile),
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.fromLTRB(4, 4, 9, 4),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        gradient: const LinearGradient(
                          colors: [
                            Color(0xF214397D),
                            Color(0xF2122F6D),
                            Color(0xF20E2456),
                          ],
                        ),
                        border: Border.all(
                          color: AppTheme.cyanNeon.withValues(alpha: 0.6),
                          width: 1,
                        ),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x40008CFF),
                            blurRadius: 12,
                            offset: Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // 3D Avatar Frame + Golden LV badge
                          Stack(
                            clipBehavior: Clip.none,
                            children: [
                              Container(
                                width: 32,
                                height: 32,
                                padding: const EdgeInsets.all(2),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(11),
                                  gradient: const LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      AppTheme.cyanNeon,
                                      AppTheme.bluePrimary,
                                      AppTheme.navyDeep,
                                    ],
                                  ),
                                  boxShadow: AppTheme.cyanGlowShadow(0.45),
                                ),
                                child: Container(
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(9),
                                    gradient: const LinearGradient(
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                      colors: [
                                        Color(0xFF18366D),
                                        Color(0xFF0E2147),
                                      ],
                                    ),
                                  ),
                                  padding: const EdgeInsets.all(2),
                                  child: Image.asset(
                                    controller.profile.equippedAvatarAsset,
                                    fit: BoxFit.contain,
                                    gaplessPlayback: true,
                                    errorBuilder: (_, _, _) => Image.asset(
                                      AppAssets.robotAvatar,
                                      fit: BoxFit.contain,
                                      gaplessPlayback: true,
                                    ),
                                  ),
                                ),
                              ),
                              Positioned(
                                bottom: -3,
                                right: -4,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 4,
                                    vertical: 1,
                                  ),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(5),
                                    gradient: const LinearGradient(
                                      colors: [
                                        AppTheme.gold,
                                        AppTheme.goldBright,
                                        AppTheme.amber,
                                      ],
                                    ),
                                    border: Border.all(
                                      color: const Color(0xFFFDE68A),
                                      width: 0.8,
                                    ),
                                  ),
                                  child: Text(
                                    'LV.$activeLevel',
                                    style: const TextStyle(
                                      color: AppTheme.amberDeepText,
                                      fontSize: 7.5,
                                      fontWeight: FontWeight.w900,
                                      height: 1.0,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(width: 8),
                          // Level Title + VIP/FREE + Progress Bar
                          Flexible(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Flexible(
                                      child: Text(
                                        'LEVEL $activeLevel',
                                        overflow: TextOverflow.ellipsis,
                                        style: AppTheme.displayStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w900,
                                          letterSpacing: 0.4,
                                          height: 1.1,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      controller.isProUser ? 'VIP' : 'FREE',
                                      style: TextStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: 0.6,
                                        color: controller.isProUser
                                            ? const Color(0xFFFCD34D)
                                            : AppTheme.cyanLight,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Container(
                                      width: 50,
                                      height: 6,
                                      padding: const EdgeInsets.all(1),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF0B1C3D),
                                        borderRadius: BorderRadius.circular(999),
                                        border: Border.all(
                                          color:
                                              AppTheme.cyanNeon.withValues(alpha: 0.6),
                                          width: 0.8,
                                        ),
                                      ),
                                      child: FractionallySizedBox(
                                        alignment: Alignment.centerLeft,
                                        widthFactor: progressPct,
                                        child: Container(
                                          decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(999),
                                            gradient: const LinearGradient(
                                              colors: [
                                                AppTheme.cyanNeon,
                                                AppTheme.cyanSky,
                                                Colors.white,
                                              ],
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 5),
                                    Text(
                                      '${controller.completedLevelsCount}/${controller.dueLevelsCount}',
                                      style: AppTheme.hudNumberStyle(
                                        fontSize: 8.5,
                                        color: AppTheme.cyanLight,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 6),
              // Right: Coins + Gems + Settings
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CoinCurrencyCapsule(
                    coins: controller.coins,
                    onTap: () => controller.navigateTo(AppScreen.rewards),
                  ),
                  const SizedBox(width: 5),
                  GemCurrencyCapsule(
                    gems: controller.gems,
                    onTap: () => controller.navigateTo(AppScreen.rewards),
                  ),
                  const SizedBox(width: 5),
                  CyberHeaderIconButton(
                    size: 28,
                    tooltip: 'Settings',
                    onTap: () => controller.navigateTo(AppScreen.settings),
                    icon: const Icon(
                      Icons.settings_outlined,
                      size: 15,
                      color: AppTheme.cyanLight,
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

/// Reusable Sci-Fi sticky HUD header for sub-screens (Level Select, Daily, etc.).
class SubScreenHudHeader extends StatelessWidget {
  const SubScreenHudHeader({
    super.key,
    required this.controller,
    this.title,
    this.onBack,
    this.onCoinsTap,
    this.onGemsTap,
    this.showGemPlus = true,
    this.trailing,
  });

  final GameController controller;
  final String? title;
  final VoidCallback? onBack;
  final VoidCallback? onCoinsTap;
  final VoidCallback? onGemsTap;
  final bool showGemPlus;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    final topInset = MediaQuery.paddingOf(context).top;

    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(12, topInset > 0 ? topInset + 6 : 10, 12, 8),
      decoration: BoxDecoration(
        gradient: AppTheme.headerBackgroundGradient,
        border: Border(
          bottom: BorderSide(
            color: AppTheme.cyanNeon.withValues(alpha: 0.22),
            width: 1,
          ),
        ),
      ),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 448),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CyberHeaderIconButton(
                      size: 32,
                      tooltip: 'Back',
                      onTap: onBack ?? controller.navigateBack,
                      icon: const Icon(
                        Icons.chevron_left_rounded,
                        size: 22,
                        color: AppTheme.cyanLight,
                      ),
                    ),
                    if (title != null) ...[
                      const SizedBox(width: 8),
                      Flexible(
                        child: Text(
                          title!.toUpperCase(),
                          overflow: TextOverflow.ellipsis,
                          style: AppTheme.displayStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.0,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CoinCurrencyCapsule(
                    coins: controller.coins,
                    onTap: onCoinsTap ??
                        () => controller.navigateTo(AppScreen.rewards),
                  ),
                  const SizedBox(width: 6),
                  GemCurrencyCapsule(
                    gems: controller.gems,
                    showPlus: showGemPlus,
                    onTap: onGemsTap ??
                        () => controller.navigateTo(AppScreen.rewards),
                  ),
                  if (trailing != null) ...[
                    const SizedBox(width: 6),
                    trailing!,
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

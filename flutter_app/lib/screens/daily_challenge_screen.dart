import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../data/levels_catalog.dart';
import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';
import '../widgets/hud_header.dart';

/// 10. DAILY CHALLENGE HUB — Monthly Cup, Tactile Cyber Calendar, Supply Crate & Day Mission.
class DailyChallengeScreen extends StatefulWidget {
  const DailyChallengeScreen({super.key});

  @override
  State<DailyChallengeScreen> createState() => _DailyChallengeScreenState();
}

class _DailyChallengeScreenState extends State<DailyChallengeScreen> {
  bool _precached = false;
  bool _localAdPromptOpen = false;
  int _localAdPromptTargetDay = 1;
  String _localAdPromptReason = 'missed_day';

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_precached) {
      _precached = true;
      for (final asset in const [
        AppAssets.trophy3d,
        AppAssets.goldCoin,
        AppAssets.gem,
      ]) {
        precacheImage(AssetImage(asset), context);
      }
    }
  }

  void _openTrophyModal(
    BuildContext context,
    GameController controller,
    int completedCount,
    int daysInMonth,
  ) {
    showDialog<void>(
      context: context,
      barrierColor: const Color(0xBF06122D),
      builder: (ctx) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.symmetric(horizontal: 20),
          child: Container(
            constraints: const BoxConstraints(maxWidth: 360),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(32),
              gradient: const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0x24FFFFFF),
                  Color(0xD90F2868),
                  Color(0xE606122D),
                ],
              ),
              border: Border.all(color: const Color(0x40FFFFFF)),
              boxShadow: const [
                BoxShadow(
                  color: Color(0xB3000000),
                  blurRadius: 40,
                  offset: Offset(0, 16),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(18),
                    color: AppTheme.gold.withValues(alpha: 0.2),
                    border: Border.all(
                      color: const Color(0x80FCD34D),
                    ),
                  ),
                  padding: const EdgeInsets.all(8),
                  child: Image.asset(
                    AppAssets.trophy3d,
                    fit: BoxFit.contain,
                    gaplessPlayback: true,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  '${controller.currentMonthName} Cup'.toUpperCase(),
                  style: AppTheme.displayStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.0,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Season ${controller.currentSeasonNum} Trophies',
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 12,
                    color: Color(0xCCFDE68A),
                  ),
                ),
                const SizedBox(height: 16),
                _trophyTierRow(
                  icon: '🥉',
                  name: 'Bronze Cup',
                  current: completedCount,
                  target: 7,
                ),
                const SizedBox(height: 8),
                _trophyTierRow(
                  icon: '🥈',
                  name: 'Silver Cup',
                  current: completedCount,
                  target: 14,
                ),
                const SizedBox(height: 8),
                _trophyTierRow(
                  icon: '🥇',
                  name: 'Gold Cup',
                  current: completedCount,
                  target: 21,
                ),
                const SizedBox(height: 8),
                _trophyTierRow(
                  icon: '💎',
                  name: 'Grand Trophy',
                  current: completedCount,
                  target: daysInMonth,
                  isGrand: true,
                ),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Navigator.of(ctx).pop(),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      backgroundColor: const Color(0xFF0284C7),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Text(
                      'CLOSE',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.0,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _trophyTierRow({
    required String icon,
    required String name,
    required int current,
    required int target,
    bool isGrand = false,
  }) {
    final unlocked = current >= target;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0x12FFFFFF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isGrand
              ? AppTheme.gold.withValues(alpha: 0.45)
              : const Color(0x26FFFFFF),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Text(icon, style: const TextStyle(fontSize: 15)),
              const SizedBox(width: 8),
              Text(
                name,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: isGrand ? const Color(0xFFFCD34D) : Colors.white,
                ),
              ),
            ],
          ),
          Text(
            unlocked
                ? (isGrand ? 'UNLOCKED 🏆' : 'UNLOCKED ✓')
                : '$current/$target Days',
            style: TextStyle(
              fontFamily: unlocked ? null : 'monospace',
              fontSize: 11.5,
              fontWeight: FontWeight.w900,
              color: unlocked
                  ? (isGrand
                      ? const Color(0xFFFCD34D)
                      : const Color(0xFF6EE7B7))
                  : (isGrand
                      ? const Color(0x99FDE68A)
                      : const Color(0xFF94A3B8)),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<GameController>();
    final daysInMonth = controller.daysInCurrentMonth;
    final completedDays = controller.completedDailyDays;
    final completedCount =
        completedDays.where((d) => d >= 1 && d <= daysInMonth).length;
    final monthlyPct = ((completedCount / daysInMonth) * 100).round().clamp(0, 100);

    final activeDay = controller.activeDailyDay;
    final todayDay = controller.todayCalendarDay;
    final isTodaySelected = activeDay == todayDay;
    final isCompletedDay = completedDays.contains(activeDay);
    final isPastDay = activeDay < todayDay;
    final isMissedDay = isPastDay && !isCompletedDay;
    final isFutureDay = activeDay > todayDay;

    final showAdModal =
        _localAdPromptOpen || controller.dailyAdPromptModal.isOpen;
    final modalTargetDay = controller.dailyAdPromptModal.isOpen
        ? controller.dailyAdPromptModal.targetDay
        : _localAdPromptTargetDay;
    final modalFee = controller.dailyAdPromptModal.isOpen
        ? controller.dailyAdPromptModal.fee
        : 50;
    final modalReason = controller.dailyAdPromptModal.isOpen
        ? controller.dailyAdPromptModal.reason
        : _localAdPromptReason;

    final leadingBlanks = controller.firstDayOfWeek;
    final totalGridCells = leadingBlanks + daysInMonth;

    return Container(
      decoration: const BoxDecoration(
        gradient: AppTheme.gameBackgroundGradient,
      ),
      child: Stack(
        children: [
          Column(
            children: [
              SubScreenHudHeader(
                controller: controller,
                title: 'Daily Challenge',
                showGemPlus: false,
                onCoinsTap: () {
                  if (controller.coins < 50) {
                    setState(() {
                      _localAdPromptOpen = true;
                      _localAdPromptTargetDay = activeDay;
                      _localAdPromptReason = 'low_balance';
                    });
                  } else {
                    controller.navigateTo(AppScreen.rewards);
                  }
                },
                trailing: CyberHeaderIconButton(
                  size: 32,
                  tooltip: 'Awards & Achievements',
                  onTap: () => _openTrophyModal(
                    context,
                    controller,
                    completedCount,
                    daysInMonth,
                  ),
                  icon: const Text('🏆', style: TextStyle(fontSize: 14)),
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(12, 12, 12, 36),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 448),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // 1. Hero Season Cup Banner Card (NO SEASON 11 badge, NO 0 Days Completed / Remaining subtext)
                          _GlassCard(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    Stack(
                                      clipBehavior: Clip.none,
                                      children: [
                                        _SkeuomorphicCircle(
                                          size: 56,
                                          variant: _CircleVariant.amber,
                                          child: Padding(
                                            padding: const EdgeInsets.all(8),
                                            child: Image.asset(
                                              AppAssets.trophy3d,
                                              fit: BoxFit.contain,
                                              gaplessPlayback: true,
                                            ),
                                          ),
                                        ),
                                        Positioned(
                                          bottom: -2,
                                          right: -4,
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 6,
                                              vertical: 2,
                                            ),
                                            decoration: BoxDecoration(
                                              borderRadius:
                                                  BorderRadius.circular(999),
                                              gradient: const LinearGradient(
                                                colors: [
                                                  AppTheme.gold,
                                                  AppTheme.goldBright,
                                                  AppTheme.amber,
                                                ],
                                              ),
                                              border: Border.all(
                                                color: Colors.white
                                                    .withValues(alpha: 0.8),
                                              ),
                                            ),
                                            child: const Text(
                                              'TOP',
                                              style: TextStyle(
                                                color: AppTheme.amberDeepText,
                                                fontSize: 8.5,
                                                fontWeight: FontWeight.w900,
                                                height: 1.0,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Text(
                                        '${controller.currentMonthName} Cup',
                                        style: AppTheme.displayStyle(
                                          fontSize: 17,
                                          fontWeight: FontWeight.w900,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Container(
                                  padding: const EdgeInsets.only(top: 12),
                                  decoration: const BoxDecoration(
                                    border: Border(
                                      top: BorderSide(color: Color(0x1AFFFFFF)),
                                    ),
                                  ),
                                  child: Column(
                                    children: [
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          const Text(
                                            'Monthly Progress',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.w700,
                                              color: AppTheme.cyanLight,
                                            ),
                                          ),
                                          Text(
                                            '$completedCount / $daysInMonth ($monthlyPct%)',
                                            style: AppTheme.hudNumberStyle(
                                              fontSize: 11,
                                              color: const Color(0xFFFCD34D),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Container(
                                        height: 10,
                                        padding: const EdgeInsets.all(2),
                                        decoration: BoxDecoration(
                                          color: const Color(0x66000000),
                                          borderRadius:
                                              BorderRadius.circular(999),
                                          border: Border.all(
                                            color: const Color(0x26FFFFFF),
                                          ),
                                        ),
                                        child: FractionallySizedBox(
                                          alignment: Alignment.centerLeft,
                                          widthFactor:
                                              (monthlyPct / 100).clamp(0.0, 1.0),
                                          child: Container(
                                            decoration: BoxDecoration(
                                              borderRadius:
                                                  BorderRadius.circular(999),
                                              gradient: const LinearGradient(
                                                colors: [
                                                  AppTheme.gold,
                                                  Color(0xFFFB923C),
                                                  AppTheme.goldBright,
                                                ],
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 14),

                          // 2. Tactile Cyber Calendar Matrix (NO status legend row below)
                          _GlassCard(
                            padding: const EdgeInsets.all(14),
                            child: Column(
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(
                                      children: [
                                        const _SkeuomorphicCircle(
                                          size: 30,
                                          variant: _CircleVariant.cyan,
                                          child: Text(
                                            '📆',
                                            style: TextStyle(fontSize: 12),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Text(
                                          '${controller.currentMonthName} ${controller.currentCalendarYear}'
                                              .toUpperCase(),
                                          style: AppTheme.displayStyle(
                                            fontSize: 12.5,
                                            fontWeight: FontWeight.w900,
                                            color: AppTheme.cyanLight,
                                            letterSpacing: 0.8,
                                          ),
                                        ),
                                      ],
                                    ),
                                    RichText(
                                      text: TextSpan(
                                        style: AppTheme.hudNumberStyle(
                                          fontSize: 10,
                                          color: AppTheme.cyanLight
                                              .withValues(alpha: 0.8),
                                          fontWeight: FontWeight.w600,
                                        ),
                                        children: [
                                          const TextSpan(text: 'Today: '),
                                          TextSpan(
                                            text: 'Day $todayDay',
                                            style: const TextStyle(
                                              fontWeight: FontWeight.w900,
                                              color: AppTheme.cyanLight,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                // Days of week header
                                Container(
                                  padding: const EdgeInsets.only(bottom: 8),
                                  decoration: const BoxDecoration(
                                    border: Border(
                                      bottom:
                                          BorderSide(color: Color(0x1AFFFFFF)),
                                    ),
                                  ),
                                  child: Row(
                                    children: const [
                                      'SUN',
                                      'MON',
                                      'TUE',
                                      'WED',
                                      'THU',
                                      'FRI',
                                      'SAT',
                                    ]
                                        .map(
                                          (d) => Expanded(
                                            child: Text(
                                              d,
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.w800,
                                                color: Color(0xCC7DD3FC),
                                              ),
                                            ),
                                          ),
                                        )
                                        .toList(),
                                  ),
                                ),
                                const SizedBox(height: 6),
                                // 7-column calendar grid
                                GridView.builder(
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  itemCount: totalGridCells,
                                  gridDelegate:
                                      const SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: 7,
                                    crossAxisSpacing: 6,
                                    mainAxisSpacing: 6,
                                    mainAxisExtent: 44,
                                  ),
                                  itemBuilder: (context, index) {
                                    if (index < leadingBlanks) {
                                      return const SizedBox.shrink();
                                    }
                                    final day = index - leadingBlanks + 1;
                                    final isPast = day < todayDay;
                                    final isCurrent = day == todayDay;
                                    final isFuture = day > todayDay;
                                    final isDone = completedDays.contains(day);
                                    final isMissed = isPast && !isDone;
                                    final isSelected = activeDay == day;

                                    return _CalendarDayTile(
                                      day: day,
                                      isSelected: isSelected,
                                      isCurrent: isCurrent,
                                      isDone: isDone,
                                      isMissed: isMissed,
                                      isFuture: isFuture,
                                      onTap: () =>
                                          controller.selectDailyDay(day),
                                    );
                                  },
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 14),

                          // 3. Selected Day Mission Card
                          _GlassCard(
                            padding: const EdgeInsets.all(14),
                            child: Column(
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Row(
                                        children: [
                                          _SkeuomorphicCircle(
                                            size: 36,
                                            variant: isCompletedDay
                                                ? _CircleVariant.emerald
                                                : isMissedDay
                                                    ? _CircleVariant.rose
                                                    : isTodaySelected
                                                        ? _CircleVariant.cyan
                                                        : _CircleVariant.slate,
                                            child: Text(
                                              isCompletedDay
                                                  ? '★'
                                                  : isMissedDay
                                                      ? '✕'
                                                      : isTodaySelected
                                                          ? '🎯'
                                                          : '🔒',
                                              style: TextStyle(
                                                fontSize: 13,
                                                fontWeight: FontWeight.w900,
                                                color: isCompletedDay
                                                    ? const Color(0xFFA7F3D0)
                                                    : isMissedDay
                                                        ? const Color(
                                                            0xFFFECDD3)
                                                        : Colors.white,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 10),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  isTodaySelected
                                                      ? "Today's Mission"
                                                      : 'Day $activeDay Mission',
                                                  maxLines: 1,
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                  style: AppTheme.displayStyle(
                                                    fontSize: 14,
                                                    fontWeight: FontWeight.w900,
                                                  ),
                                                ),
                                                Text(
                                                  '${controller.currentMonthShort} $activeDay, ${controller.currentCalendarYear}',
                                                  style: const TextStyle(
                                                    fontFamily: 'monospace',
                                                    fontSize: 9.5,
                                                    color: Color(0xFFCBD5E1),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    _missionStatusBadge(
                                      isTodaySelected: isTodaySelected,
                                      isCompletedDay: isCompletedDay,
                                      isMissedDay: isMissedDay,
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 10),
                                Container(
                                  padding: const EdgeInsets.only(top: 10),
                                  decoration: const BoxDecoration(
                                    border: Border(
                                      top: BorderSide(color: Color(0x1AFFFFFF)),
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      _missionStatBox(
                                        label: 'DIFFICULTY',
                                        value: _difficultyLabel(activeDay),
                                        valueColor: const Color(0xFFFCD34D),
                                      ),
                                      const SizedBox(width: 8),
                                      _missionStatBox(
                                        label: 'REWARD',
                                        value: '+150 Coins',
                                        valueColor: const Color(0xFF6EE7B7),
                                      ),
                                      const SizedBox(width: 8),
                                      _missionStatBox(
                                        label: 'BONUS',
                                        value: '+20 Gems',
                                        valueColor: AppTheme.cyanLight,
                                      ),
                                    ],
                                  ),
                                ),
                                if (isMissedDay) ...[
                                  const SizedBox(height: 10),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 8,
                                    ),
                                    decoration: BoxDecoration(
                                      color:
                                          AppTheme.amber.withValues(alpha: 0.1),
                                      borderRadius: BorderRadius.circular(14),
                                      border: Border.all(
                                        color: AppTheme.amber
                                            .withValues(alpha: 0.35),
                                      ),
                                    ),
                                    child: Row(
                                      children: [
                                        const Text(
                                          '🩹',
                                          style: TextStyle(fontSize: 16),
                                        ),
                                        const SizedBox(width: 8),
                                        const Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                'Streak Repair Available',
                                                style: TextStyle(
                                                  fontSize: 10.5,
                                                  fontWeight: FontWeight.w800,
                                                  color: Color(0xFFFDE68A),
                                                ),
                                              ),
                                              Text(
                                                'Recover this date to restore your streak progress',
                                                style: TextStyle(
                                                  fontSize: 8.5,
                                                  color: Color(0xCCFCD34D),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 3,
                                          ),
                                          decoration: BoxDecoration(
                                            color: AppTheme.gold
                                                .withValues(alpha: 0.2),
                                            borderRadius:
                                                BorderRadius.circular(6),
                                            border: Border.all(
                                              color: AppTheme.gold
                                                  .withValues(alpha: 0.4),
                                            ),
                                          ),
                                          child: const Text(
                                            '50 🪙',
                                            style: TextStyle(
                                              fontFamily: 'monospace',
                                              fontSize: 9.5,
                                              fontWeight: FontWeight.w900,
                                              color: Color(0xFFFCD34D),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                          const SizedBox(height: 14),

                          // 4. Daily Supply Crate Card
                          _GlassCard(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 12,
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    _SkeuomorphicCircle(
                                      size: 42,
                                      variant: controller.dailyGiftClaimed
                                          ? _CircleVariant.purple
                                          : _CircleVariant.amber,
                                      child: const Text(
                                        '🎁',
                                        style: TextStyle(fontSize: 19),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Text(
                                      'Daily Supply',
                                      style: AppTheme.displayStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w900,
                                      ),
                                    ),
                                  ],
                                ),
                                Material(
                                  color: Colors.transparent,
                                  child: InkWell(
                                    onTap: controller.dailyGiftClaimed
                                        ? null
                                        : () => controller.claimDailyGift(),
                                    borderRadius: BorderRadius.circular(12),
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 12,
                                        vertical: 7,
                                      ),
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(12),
                                        gradient: controller.dailyGiftClaimed
                                            ? null
                                            : const LinearGradient(
                                                colors: [
                                                  AppTheme.gold,
                                                  Color(0xFFEAB308),
                                                ],
                                              ),
                                        color: controller.dailyGiftClaimed
                                            ? const Color(0x0DFFFFFF)
                                            : null,
                                        border: controller.dailyGiftClaimed
                                            ? Border.all(
                                                color: const Color(0x1AFFFFFF),
                                              )
                                            : null,
                                        boxShadow: controller.dailyGiftClaimed
                                            ? null
                                            : const [
                                                BoxShadow(
                                                  color: Color(0x99FBBF24),
                                                  blurRadius: 10,
                                                ),
                                              ],
                                      ),
                                      child: Text(
                                        controller.dailyGiftClaimed
                                            ? 'CLAIMED ✓'
                                            : 'CLAIM',
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w900,
                                          color: controller.dailyGiftClaimed
                                              ? const Color(0xFF64748B)
                                              : const Color(0xFF020617),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 14),

                          // 5. Primary Action Launch Button
                          if (isMissedDay)
                            Row(
                              children: [
                                Expanded(
                                  child: _Action3DButton(
                                    onTap: () {
                                      if (controller.coins >= 50) {
                                        controller.startDailyChallenge(
                                          dayNum: activeDay,
                                        );
                                      } else {
                                        setState(() {
                                          _localAdPromptOpen = true;
                                          _localAdPromptTargetDay = activeDay;
                                          _localAdPromptReason = 'missed_day';
                                        });
                                      }
                                    },
                                    colors: const [
                                      AppTheme.gold,
                                      Color(0xFFFACC15),
                                      AppTheme.amber,
                                    ],
                                    borderColor: const Color(0xE6FDE68A),
                                    lipColor: const Color(0xFFB45309),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        SizedBox(
                                          width: 15,
                                          height: 15,
                                          child: Image.asset(
                                            AppAssets.goldCoin,
                                            fit: BoxFit.contain,
                                            gaplessPlayback: true,
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        const Text(
                                          'RECOVER (50 🪙)',
                                          style: TextStyle(
                                            fontSize: 11.5,
                                            fontWeight: FontWeight.w900,
                                            color: AppTheme.amberDeepText,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: _Action3DButton(
                                    onTap: () =>
                                        controller.unlockMissedDailyDayWithAd(
                                      activeDay,
                                    ),
                                    colors: const [
                                      Color(0xFF34D399),
                                      AppTheme.emerald,
                                      Color(0xFF0D9488),
                                    ],
                                    borderColor: const Color(0xE6A7F3D0),
                                    lipColor: AppTheme.emeraldDark,
                                    child: const Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Text(
                                          '▶',
                                          style: TextStyle(
                                            fontSize: 11,
                                            color: Colors.white,
                                          ),
                                        ),
                                        SizedBox(width: 6),
                                        Text(
                                          'WATCH AD (FREE)',
                                          style: TextStyle(
                                            fontSize: 11.5,
                                            fontWeight: FontWeight.w900,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            )
                          else
                            Material(
                              color: Colors.transparent,
                              child: InkWell(
                                onTap: isFutureDay
                                    ? null
                                    : () => controller.startDailyChallenge(
                                          dayNum: activeDay,
                                        ),
                                borderRadius: BorderRadius.circular(16),
                                child: Container(
                                  width: double.infinity,
                                  padding:
                                      const EdgeInsets.symmetric(vertical: 15),
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(16),
                                    gradient: isFutureDay
                                        ? null
                                        : const LinearGradient(
                                            colors: [
                                              Color(0xE606B6D4),
                                              Color(0xF22563EB),
                                              Color(0xE64F46E5),
                                            ],
                                          ),
                                    color: isFutureDay
                                        ? const Color(0x0DFFFFFF)
                                        : null,
                                    border: Border.all(
                                      color: isFutureDay
                                          ? const Color(0x1AFFFFFF)
                                          : const Color(0x4DFFFFFF),
                                    ),
                                    boxShadow: isFutureDay
                                        ? null
                                        : [
                                            BoxShadow(
                                              color: AppTheme.cyanNeon
                                                  .withValues(alpha: 0.45),
                                              blurRadius: 20,
                                              offset: const Offset(0, 8),
                                            ),
                                          ],
                                  ),
                                  alignment: Alignment.center,
                                  child: Text(
                                    isFutureDay
                                        ? 'LOCKED • UNLOCKS ${controller.currentMonthShort.toUpperCase()} $activeDay'
                                        : isCompletedDay
                                            ? 'REPLAY DAY $activeDay ›'
                                            : 'START DAY $activeDay ›',
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: 1.0,
                                      color: isFutureDay
                                          ? const Color(0xFF64748B)
                                          : Colors.white,
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

          // Not Enough Coins / Watch Ad Overlay Modal
          if (showAdModal)
            _DailyNotEnoughCoinsModal(
              coins: controller.coins,
              fee: modalFee,
              targetDay: modalTargetDay,
              reason: modalReason,
              onClose: () {
                setState(() => _localAdPromptOpen = false);
                controller.dismissDailyAdPrompt();
              },
              onWatchAd: () {
                setState(() => _localAdPromptOpen = false);
                controller.unlockMissedDailyDayWithAd(modalTargetDay);
              },
              onOpenStore: () {
                setState(() => _localAdPromptOpen = false);
                controller.dismissDailyAdPrompt();
                controller.navigateTo(AppScreen.rewards);
              },
            ),
        ],
      ),
    );
  }

  String _difficultyLabel(int day) {
    if (day % 4 == 0) return 'EXPERT ⚡';
    if (day % 3 == 0) return 'HARD ⚡';
    if (day % 2 == 0) return 'TACTICAL';
    return 'CADET';
  }

  Widget _missionStatusBadge({
    required bool isTodaySelected,
    required bool isCompletedDay,
    required bool isMissedDay,
  }) {
    final String text;
    final Color bg;
    final Color border;
    final Color fg;

    if (isTodaySelected && !isCompletedDay) {
      text = 'ACTIVE NOW';
      bg = const Color(0x3306B6D4);
      border = const Color(0x8022D3EE);
      fg = const Color(0xFF67E8F9);
    } else if (isCompletedDay) {
      text = 'COMPLETED (3★)';
      bg = const Color(0x3310B981);
      border = const Color(0x8034D399);
      fg = const Color(0xFF6EE7B7);
    } else if (isMissedDay) {
      text = 'INCOMPLETE / MISSED';
      bg = const Color(0x33F43F5E);
      border = const Color(0x80FB7185);
      fg = const Color(0xFFFDA4AF);
    } else {
      text = 'LOCKED';
      bg = const Color(0x0DFFFFFF);
      border = const Color(0x1AFFFFFF);
      fg = const Color(0xFF94A3B8);
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: border),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 9,
          fontWeight: FontWeight.w900,
          color: fg,
        ),
      ),
    );
  }

  Widget _missionStatBox({
    required String label,
    required String value,
    required Color valueColor,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
        decoration: BoxDecoration(
          color: const Color(0x12FFFFFF),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0x26FFFFFF)),
        ),
        child: Column(
          children: [
            Text(
              label,
              style: const TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.w700,
                color: Color(0xFFCBD5E1),
              ),
            ),
            const SizedBox(height: 3),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                value,
                style: AppTheme.displayStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: valueColor,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _GlassCard extends StatelessWidget {
  const _GlassCard({
    required this.padding,
    required this.child,
  });

  final EdgeInsetsGeometry padding;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0x21FFFFFF),
            Color(0xA60F2766),
            Color(0xCC07163C),
          ],
        ),
        border: Border.all(color: const Color(0x33FFFFFF)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x73020A20),
            blurRadius: 24,
            offset: Offset(0, 12),
          ),
        ],
      ),
      child: child,
    );
  }
}

enum _CircleVariant { amber, cyan, emerald, rose, purple, slate }

class _SkeuomorphicCircle extends StatelessWidget {
  const _SkeuomorphicCircle({
    required this.size,
    required this.variant,
    required this.child,
  });

  final double size;
  final _CircleVariant variant;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final List<Color> rim;
    final List<Color> disc;

    switch (variant) {
      case _CircleVariant.amber:
        rim = const [Color(0xFFFDE68A), AppTheme.gold, Color(0xFFB45309)];
        disc = const [Color(0xFF244585), Color(0xFF122752), Color(0xFF061129)];
      case _CircleVariant.cyan:
        rim = const [Color(0xFFA5F3FC), AppTheme.cyanSky, Color(0xFF1D4ED8)];
        disc = const [Color(0xFF18458A), Color(0xFF0D2857), Color(0xFF041029)];
      case _CircleVariant.emerald:
        rim = const [Color(0xFFA7F3D0), Color(0xFF34D399), Color(0xFF0F766E)];
        disc = const [Color(0xFF047857), AppTheme.emeraldDark, Color(0xFF022C22)];
      case _CircleVariant.rose:
        rim = const [Color(0xFFFECDD3), Color(0xFFFB7185), Color(0xFFBE123C)];
        disc = const [Color(0xFF881337), Color(0xFF4C0519), Color(0xFF20030B)];
      case _CircleVariant.purple:
        rim = const [Color(0xFFE9D5FF), Color(0xFFC084FC), Color(0xFF4338CA)];
        disc = const [Color(0xFF3B186B), Color(0xFF200B3D), Color(0xFF0E041A)];
      case _CircleVariant.slate:
        rim = const [Color(0xFFCBD5E1), Color(0xFF94A3B8), Color(0xFF334155)];
        disc = const [Color(0xFF1E293B), Color(0xFF0F172A), Color(0xFF020617)];
    }

    return Container(
      width: size,
      height: size,
      padding: const EdgeInsets.all(1.5),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: rim,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x99000000),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Container(
        padding: const EdgeInsets.all(1.5),
        decoration: const BoxDecoration(
          shape: BoxShape.circle,
          color: Color(0xBF000000),
        ),
        child: Container(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              center: const Alignment(0, -0.35),
              colors: disc,
            ),
          ),
          alignment: Alignment.center,
          child: child,
        ),
      ),
    );
  }
}

class _CalendarDayTile extends StatelessWidget {
  const _CalendarDayTile({
    required this.day,
    required this.isSelected,
    required this.isCurrent,
    required this.isDone,
    required this.isMissed,
    required this.isFuture,
    required this.onTap,
  });

  final int day;
  final bool isSelected;
  final bool isCurrent;
  final bool isDone;
  final bool isMissed;
  final bool isFuture;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    List<Color>? gradientColors;
    Color? solidColor;
    Color borderColor;
    double borderWidth = 1;
    Color textColor;

    if (isSelected) {
      gradientColors = const [
        Color(0x8022D3EE),
        Color(0x992563EB),
        Color(0xB34338CA),
      ];
      borderColor = const Color(0xFFA5F3FC);
      borderWidth = 2;
      textColor = Colors.white;
    } else if (isCurrent) {
      if (isDone) {
        gradientColors = const [Color(0x4D10B981), Color(0x730F766E)];
        borderColor = const Color(0xFF6EE7B7);
        borderWidth = 2;
        textColor = const Color(0xFFD1FAE5);
      } else {
        gradientColors = const [Color(0x4D06B6D4), Color(0x731D4ED8)];
        borderColor = const Color(0xFF22D3EE);
        borderWidth = 2;
        textColor = AppTheme.cyanLight;
      }
    } else if (isDone) {
      gradientColors = const [Color(0x3310B981), Color(0x99072418)];
      borderColor = const Color(0x9934D399);
      textColor = const Color(0xFFA7F3D0);
    } else if (isMissed) {
      gradientColors = const [Color(0x33F43F5E), Color(0xB3180812)];
      borderColor = const Color(0x80F43F5E);
      textColor = const Color(0xFFFECDD3);
    } else {
      solidColor = const Color(0x08FFFFFF);
      borderColor = const Color(0x1AFFFFFF);
      textColor = const Color(0xFF94A3B8);
    }

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 140),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          gradient: gradientColors != null
              ? LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: gradientColors,
                )
              : null,
          color: solidColor,
          border: Border.all(color: borderColor, width: borderWidth),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppTheme.cyanNeon.withValues(alpha: 0.75),
                    blurRadius: 12,
                  ),
                ]
              : null,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '$day',
              style: AppTheme.displayStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.w900,
                color: textColor,
                height: 1.0,
              ),
            ),
            const SizedBox(height: 2),
            if (isDone)
              const Text(
                '★',
                style: TextStyle(
                  fontSize: 8.5,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFFFCD34D),
                  height: 1.0,
                ),
              )
            else if (isMissed)
              const Text(
                '✕',
                style: TextStyle(
                  fontSize: 9,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFFFB7185),
                  height: 1.0,
                ),
              )
            else if (isCurrent)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 3, vertical: 1),
                decoration: BoxDecoration(
                  color: const Color(0x4006B6D4),
                  borderRadius: BorderRadius.circular(3),
                  border: Border.all(color: const Color(0x6622D3EE)),
                ),
                child: const Text(
                  'TODAY',
                  style: TextStyle(
                    fontSize: 6.5,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF67E8F9),
                    height: 1.0,
                  ),
                ),
              )
            else if (isFuture)
              const Text(
                '🔒',
                style: TextStyle(fontSize: 8, height: 1.0),
              ),
          ],
        ),
      ),
    );
  }
}

class _Action3DButton extends StatelessWidget {
  const _Action3DButton({
    required this.onTap,
    required this.colors,
    required this.borderColor,
    required this.lipColor,
    required this.child,
  });

  final VoidCallback onTap;
  final List<Color> colors;
  final Color borderColor;
  final Color lipColor;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 13, horizontal: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(colors: colors),
          border: Border.all(color: borderColor, width: 1.8),
          boxShadow: [
            BoxShadow(
              color: lipColor,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        alignment: Alignment.center,
        child: child,
      ),
    );
  }
}

class _DailyNotEnoughCoinsModal extends StatelessWidget {
  const _DailyNotEnoughCoinsModal({
    required this.coins,
    required this.fee,
    required this.targetDay,
    required this.reason,
    required this.onClose,
    required this.onWatchAd,
    required this.onOpenStore,
  });

  final int coins;
  final int fee;
  final int targetDay;
  final String reason;
  final VoidCallback onClose;
  final VoidCallback onWatchAd;
  final VoidCallback onOpenStore;

  @override
  Widget build(BuildContext context) {
    final pct = (coins / (fee <= 0 ? 1 : fee)).clamp(0.08, 1.0);

    return GestureDetector(
      onTap: onClose,
      child: Container(
        color: const Color(0xCC06122C),
        alignment: Alignment.center,
        padding: const EdgeInsets.all(20),
        child: GestureDetector(
          onTap: () {},
          child: Container(
            constraints: const BoxConstraints(maxWidth: 335),
            padding: const EdgeInsets.fromLTRB(20, 22, 20, 20),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(32),
              gradient: const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xF2FFFFFF),
                  Color(0xF2F0F7FF),
                  Color(0xF2E0EFFF),
                ],
              ),
              border: Border.all(color: Colors.white, width: 2),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x99081844),
                  blurRadius: 40,
                  offset: Offset(0, 20),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Align(
                  alignment: Alignment.topRight,
                  child: GestureDetector(
                    onTap: onClose,
                    child: Container(
                      width: 30,
                      height: 30,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: const Color(0xFFE0F2FE),
                        border: Border.all(color: Colors.white),
                      ),
                      child: const Icon(
                        Icons.close_rounded,
                        size: 16,
                        color: Color(0xFF1E3A8A),
                      ),
                    ),
                  ),
                ),
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Color(0xFF38BDF8),
                        Color(0xFF0284C7),
                        Color(0xFF0369A1),
                      ],
                    ),
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                  padding: const EdgeInsets.all(10),
                  child: Image.asset(
                    AppAssets.goldCoin,
                    fit: BoxFit.contain,
                    gaplessPlayback: true,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Not Enough Coins!',
                  style: AppTheme.displayStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: const Color(0xFF152A55),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  reason == 'missed_day'
                      ? 'Recovering missed Day $targetDay requires $fee Coins. Watch a quick ad to claim +150 Coins and unlock it free!'
                      : 'You need more Coins to unlock Daily Challenge missions. Watch a quick ad to claim free coins!',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF4B618A),
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xE6FFF1F2),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xCCFDA4AF)),
                  ),
                  child: Row(
                    children: [
                      SizedBox(
                        width: 28,
                        height: 28,
                        child: Image.asset(
                          AppAssets.goldCoin,
                          fit: BoxFit.contain,
                          gaplessPlayback: true,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          children: [
                            Container(
                              height: 8,
                              decoration: BoxDecoration(
                                color: const Color(0xFFE2E8F0),
                                borderRadius: BorderRadius.circular(999),
                              ),
                              alignment: Alignment.centerLeft,
                              child: FractionallySizedBox(
                                widthFactor: pct,
                                child: Container(
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(999),
                                    gradient: const LinearGradient(
                                      colors: [AppTheme.rose, AppTheme.amber],
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 5),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  '${NumberFormat.decimalPattern().format(coins)} Coins',
                                  style: const TextStyle(
                                    fontFamily: 'monospace',
                                    fontSize: 11,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFFBE123C),
                                  ),
                                ),
                                Text(
                                  '/ $fee Needed',
                                  style: const TextStyle(
                                    fontFamily: 'monospace',
                                    fontSize: 11,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF64748B),
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
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  child: _Action3DButton(
                    onTap: onWatchAd,
                    colors: const [
                      Color(0xFF34D399),
                      AppTheme.emerald,
                      Color(0xFF0D9488),
                    ],
                    borderColor: const Color(0xE6A7F3D0),
                    lipColor: AppTheme.emeraldDark,
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.play_circle_outline_rounded,
                          color: Colors.white,
                          size: 18,
                        ),
                        SizedBox(width: 8),
                        Text(
                          'WATCH AD TO UNLOCK FREE (+150 🪙)',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11.5,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: onOpenStore,
                    style: OutlinedButton.styleFrom(
                      backgroundColor: Colors.white.withValues(alpha: 0.85),
                      side: const BorderSide(color: Color(0xFFBFDBFE)),
                      padding: const EdgeInsets.symmetric(vertical: 11),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: const Text(
                      'Visit Coin Store & Shop',
                      style: TextStyle(
                        color: Color(0xFF1E3A8A),
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                      ),
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

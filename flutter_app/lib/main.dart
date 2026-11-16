import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import 'data/levels_catalog.dart';
import 'models/game_models.dart';
import 'screens/achievements_screen.dart';
import 'screens/battle_screen.dart';
import 'screens/daily_challenge_screen.dart';
import 'screens/daily_game_screen.dart';
import 'screens/game_screen.dart';
import 'screens/help_screen.dart';
import 'screens/hint_screen.dart';
import 'screens/history_screen.dart';
import 'screens/home_screen.dart';
import 'screens/leaderboard_screen.dart';
import 'screens/level_select_screen.dart';
import 'screens/offline_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/rewards_shop_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/splash_screen.dart';
import 'state/game_controller.dart';
import 'theme/app_theme.dart';
import 'widgets/admob_banner_widget.dart';
import 'widgets/game_modals.dart';
import 'widgets/slide_page_route.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppTheme.navyStage,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const NewroMathApp());
}

/// Root NewroMath Flutter Application.
class NewroMathApp extends StatefulWidget {
  const NewroMathApp({
    super.key,
    this.controller,
    this.initialScreen = AppScreen.home,
  });

  final GameController? controller;
  final AppScreen initialScreen;

  @override
  State<NewroMathApp> createState() => _NewroMathAppState();
}

class _NewroMathAppState extends State<NewroMathApp> {
  GameController? _ownedController;

  GameController get _controller {
    if (widget.controller != null) return widget.controller!;
    return _ownedController ??=
        GameController(initialScreen: widget.initialScreen)..init();
  }

  @override
  void dispose() {
    _ownedController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<GameController>.value(
      value: _controller,
      child: MaterialApp(
        title: 'NewroMath',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          brightness: Brightness.dark,
          scaffoldBackgroundColor: AppTheme.navyStage,
          colorScheme: const ColorScheme.dark(
            primary: AppTheme.cyanNeon,
            secondary: AppTheme.amber,
            surface: AppTheme.navyStage,
          ),
        ),
        home: const _NewroMathShell(),
      ),
    );
  }
}

class _NewroMathShell extends StatefulWidget {
  const _NewroMathShell();

  @override
  State<_NewroMathShell> createState() => _NewroMathShellState();
}

class _NewroMathShellState extends State<_NewroMathShell> {
  double? _edgeDragStartX;
  double _edgeDragAccumulatedDx = 0;

  Widget _buildActiveScreen(AppScreen screen) {
    switch (screen) {
      case AppScreen.splash:
        return const SplashScreen();
      case AppScreen.onboarding:
        return const OnboardingScreen();
      case AppScreen.home:
      case AppScreen.stats:
        return const HomeScreen();
      case AppScreen.categories:
      case AppScreen.levels:
        return const LevelSelectScreen();
      case AppScreen.game:
      case AppScreen.correct:
      case AppScreen.wrong:
        return const GameScreen();
      case AppScreen.hint:
        return const HintScreen();
      case AppScreen.daily:
        return const DailyChallengeScreen();
      case AppScreen.dailyGame:
        return const DailyGameScreen();
      case AppScreen.battle:
        return const BattleScreen();
      case AppScreen.achievements:
        return const AchievementsScreen();
      case AppScreen.leaderboard:
        return const LeaderboardScreen();
      case AppScreen.history:
        return const HistoryScreen();
      case AppScreen.profile:
        return const ProfileScreen();
      case AppScreen.settings:
        return const SettingsScreen();
      case AppScreen.help:
        return const HelpScreen();
      case AppScreen.offline:
        return const OfflineScreen();
      case AppScreen.rewards:
        return const RewardsShopScreen();
    }
  }

  void _handleHardwareBack(GameController controller) {
    if (controller.insufficientFundsModal.isOpen) {
      controller.dismissInsufficientFunds();
      return;
    }
    if (controller.canGoBack) {
      controller.navigateBack();
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<GameController>();
    final shouldInterceptBack =
        controller.canGoBack || controller.insufficientFundsModal.isOpen;

    return PopScope(
      canPop: !shouldInterceptBack,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) {
          _handleHardwareBack(controller);
        }
      },
      child: Scaffold(
        backgroundColor: AppTheme.navyStage,
        body: GestureDetector(
          behavior: HitTestBehavior.translucent,
          onHorizontalDragStart: (details) {
            if (details.globalPosition.dx <= 44.0) {
              _edgeDragStartX = details.globalPosition.dx;
              _edgeDragAccumulatedDx = 0;
            } else {
              _edgeDragStartX = null;
            }
          },
          onHorizontalDragUpdate: (details) {
            if (_edgeDragStartX != null) {
              _edgeDragAccumulatedDx += details.delta.dx;
            }
          },
          onHorizontalDragEnd: (details) {
            if (_edgeDragStartX != null) {
              final velocity = details.primaryVelocity ?? 0;
              if ((_edgeDragAccumulatedDx > 55 || velocity > 320) &&
                  controller.canGoBack) {
                controller.navigateBack();
              }
            }
            _edgeDragStartX = null;
            _edgeDragAccumulatedDx = 0;
          },
          child: Stack(
            children: [
              Column(
                children: [
                  Expanded(
                    child: SlideTransitionStage(
                      screenKey: ValueKey<AppScreen>(controller.currentScreen),
                      direction: controller.transitionDirection,
                      isHintOverlay: controller.currentScreen == AppScreen.hint,
                      child: _buildActiveScreen(controller.currentScreen),
                    ),
                  ),
                  if (controller.isBannerVisible)
                    AdMobBannerWidget(isProUser: controller.isProUser),
                ],
              ),
              if (controller.rewardToastMessage != null)
                _CyberToastBanner(
                  message: controller.rewardToastMessage!,
                  onDismiss: controller.clearRewardToast,
                ),
              if (controller.insufficientFundsModal.isOpen)
                _InsufficientFundsModal(controller: controller),
              AdMobInterstitialModal(
                isVisible: controller.isInterstitialActive,
                onClose: controller.clearRewardToast,
              ),
              AdMobRewardedModal(
                reward: null,
                onClaim: () {},
                onCancel: () {},
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CyberToastBanner extends StatelessWidget {
  const _CyberToastBanner({
    required this.message,
    required this.onDismiss,
  });

  final String message;
  final VoidCallback onDismiss;

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: MediaQuery.of(context).padding.top + 12,
      left: 16,
      right: 16,
      child: IgnorePointer(
        ignoring: false,
        child: Center(
          child: GestureDetector(
            onTap: onDismiss,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                gradient: const LinearGradient(
                  colors: [
                    Color(0xF20D2254),
                    Color(0xF2153473),
                    Color(0xF20C1F4A),
                  ],
                ),
                border: Border.all(
                  color: AppTheme.cyanNeon.withValues(alpha: 0.8),
                  width: 1.5,
                ),
                boxShadow: AppTheme.cyanGlowShadow(0.5),
              ),
              child: Text(
                message,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _InsufficientFundsModal extends StatelessWidget {
  const _InsufficientFundsModal({required this.controller});

  final GameController controller;
  static final NumberFormat _numFmt = NumberFormat('#,###');

  @override
  Widget build(BuildContext context) {
    final info = controller.insufficientFundsModal;
    final need = info.cost;

    return Positioned.fill(
      child: GestureDetector(
        onTap: controller.dismissInsufficientFunds,
        child: Container(
          color: const Color(0xBF06122C),
          alignment: Alignment.center,
          padding: const EdgeInsets.all(20),
          child: GestureDetector(
            onTap: () {},
            child: Container(
              constraints: const BoxConstraints(maxWidth: 335),
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(32),
                gradient: const LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xFFF8FAFC),
                    Color(0xFFF0F7FF),
                    Color(0xFFE0EFFF),
                  ],
                ),
                border: Border.all(color: Colors.white, width: 2),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF081844).withValues(alpha: 0.6),
                    blurRadius: 36,
                    offset: const Offset(0, 14),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Align(
                    alignment: Alignment.centerRight,
                    child: GestureDetector(
                      onTap: controller.dismissInsufficientFunds,
                      child: Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFFDBEAFE),
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
                    width: 64,
                    height: 64,
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
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF0EA5E9).withValues(alpha: 0.45),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Transform.translate(
                          offset: const Offset(-6, 0),
                          child: Image.asset(
                            AppAssets.goldCoin,
                            width: 30,
                            height: 30,
                          ),
                        ),
                        Transform.translate(
                          offset: const Offset(11, 8),
                          child: Image.asset(
                            AppAssets.gem,
                            width: 26,
                            height: 26,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 18,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(99),
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFF3B82F6),
                          Color(0xFF2563EB),
                          Color(0xFF1D4ED8),
                        ],
                      ),
                      border: Border.all(color: const Color(0xFF60A5FA)),
                    ),
                    child: Text(
                      'Need Funds',
                      style: AppTheme.displayStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Get More Resources!',
                    style: AppTheme.displayStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: const Color(0xFF152A55),
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Claim free rewards or visit the shop to unlock this stage.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF4B618A),
                    ),
                  ),
                  const SizedBox(height: 14),
                  _FundMeterRow(
                    iconAsset: AppAssets.goldCoin,
                    have: controller.coins,
                    need: need.coins,
                    formatter: _numFmt,
                  ),
                  const SizedBox(height: 8),
                  _FundMeterRow(
                    iconAsset: AppAssets.gem,
                    have: controller.gems,
                    need: need.gems,
                    formatter: _numFmt,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () {
                            final targetLvl = info.targetLevel;
                            controller.dismissInsufficientFunds();
                            controller.watchRewardedAd(
                              const AdRewardInfo(
                                type: 'both',
                                amount: 0,
                                coinAmount: 350,
                                gemAmount: 15,
                                title: 'Quantum Supply Depot Sponsor',
                              ),
                              onComplete: () {
                                controller.attemptStartLevel(
                                  targetLevel: targetLvl,
                                );
                              },
                            );
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(16),
                              gradient: const LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Color(0xFF34D399),
                                  Color(0xFF10B981),
                                  Color(0xFF0D9488),
                                ],
                              ),
                              border: Border.all(
                                color: const Color(0xFFA7F3D0),
                                width: 1.5,
                              ),
                              boxShadow: const [
                                BoxShadow(
                                  color: Color(0xFF065F46),
                                  offset: Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Column(
                              children: [
                                const Icon(
                                  Icons.smart_display_rounded,
                                  color: Colors.white,
                                  size: 22,
                                ),
                                const SizedBox(height: 3),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Text(
                                      '+350 ',
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w900,
                                        color: Colors.white,
                                      ),
                                    ),
                                    Image.asset(
                                      AppAssets.goldCoin,
                                      width: 13,
                                      height: 13,
                                    ),
                                    const Text(
                                      ' +15 ',
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w900,
                                        color: Colors.white,
                                      ),
                                    ),
                                    Image.asset(
                                      AppAssets.gem,
                                      width: 13,
                                      height: 13,
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      GestureDetector(
                        onTap: () {
                          controller.dismissInsufficientFunds();
                          controller.navigateTo(AppScreen.rewards);
                        },
                        child: Container(
                          width: 72,
                          height: 60,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            gradient: const LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Color(0xFF3B82F6),
                                Color(0xFF2563EB),
                                Color(0xFF1D4ED8),
                              ],
                            ),
                            border: Border.all(
                              color: const Color(0xFFBFDBFE),
                              width: 1.5,
                            ),
                            boxShadow: const [
                              BoxShadow(
                                color: Color(0xFF1E40AF),
                                offset: Offset(0, 4),
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.shopping_cart_rounded,
                            color: Colors.white,
                            size: 26,
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
    );
  }
}

class _FundMeterRow extends StatelessWidget {
  const _FundMeterRow({
    required this.iconAsset,
    required this.have,
    required this.need,
    required this.formatter,
  });

  final String iconAsset;
  final int have;
  final int need;
  final NumberFormat formatter;

  @override
  Widget build(BuildContext context) {
    final ok = have >= need;
    final pct = (have / (need <= 0 ? 1 : need)).clamp(0.06, 1.0);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: ok ? const Color(0xE6ECFDF5) : const Color(0xE6FFF1F2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: ok ? const Color(0xFF6EE7B7) : const Color(0xFFFDA4AF),
        ),
      ),
      child: Row(
        children: [
          Image.asset(iconAsset, width: 28, height: 28),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              children: [
                Container(
                  height: 8,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE2E8F0),
                    borderRadius: BorderRadius.circular(99),
                  ),
                  child: FractionallySizedBox(
                    alignment: Alignment.centerLeft,
                    widthFactor: pct,
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(99),
                        gradient: LinearGradient(
                          colors: ok
                              ? const [Color(0xFF34D399), Color(0xFF14B8A6)]
                              : const [Color(0xFFF43F5E), Color(0xFFF59E0B)],
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      formatter.format(have),
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        color: ok
                            ? const Color(0xFF047857)
                            : const Color(0xFFBE123C),
                      ),
                    ),
                    Text(
                      '/ ${formatter.format(need)}',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF64748B),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: ok ? AppTheme.emerald : AppTheme.rose,
            ),
            child: Icon(
              ok ? Icons.check_rounded : Icons.close_rounded,
              size: 14,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}

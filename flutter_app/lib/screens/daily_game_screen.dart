import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';
import '../widgets/crossmath_board.dart';
import '../widgets/game_modals.dart';
import '../widgets/number_tray.dart';

/// Daily Challenge 3x3 Interconnected Matrix Gameplay Screen.
///
/// Mirrors `renderDailyGameScreen` in `src/legacyApp.jsx` with:
/// - Top HUD (`‹` back to Daily Hub, `DAILY #{protocolId}` pill, `↻` reset)
/// - 3D Peaked Roof Board Header (`DAY X`, difficulty badge, clean apex timer, pause)
/// - 3 Reactor Cores (Alpha, Beta, Gamma) + vertical Resonance Link column
/// - Live `LINK: α-2 op1 β-2 op2 γ-2 = targetLink` status bar
/// - 2-row Emerald Number Tray (tap & drag-swap)
/// - 4 bottom 3D Arcade Action buttons (Daily Hub, Undo, Hint, Info)
class DailyGameScreen extends StatefulWidget {
  const DailyGameScreen({super.key});

  @override
  State<DailyGameScreen> createState() => _DailyGameScreenState();
}

class _DailyGameScreenState extends State<DailyGameScreen>
    with SingleTickerProviderStateMixin {
  bool _showInstructions = false;
  bool _dismissedTimeout = false;
  bool _prevTimeOver = false;

  late final AnimationController _resetSpinController;

  @override
  void initState() {
    super.initState();
    _resetSpinController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 450),
    );
  }

  @override
  void dispose() {
    _resetSpinController.dispose();
    super.dispose();
  }

  String _formatTimer(int sec) {
    final safe = sec < 0 ? 0 : sec;
    final m = (safe ~/ 60).toString().padLeft(2, '0');
    final s = (safe % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    final game = context.watch<GameController>();
    if (game.dailyGameTimeOver && !_prevTimeOver) {
      _dismissedTimeout = false;
    }
    _prevTimeOver = game.dailyGameTimeOver;

    final puzzle = game.dailyGamePuzzle;
    final isDark = game.settings.isDarkMode;

    return Container(
      decoration: BoxDecoration(
        gradient: isDark
            ? const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFF0A1433),
                  Color(0xFF070E24),
                  Color(0xFF040816),
                ],
              )
            : AppTheme.gameBackgroundGradient,
      ),
      child: Stack(
        children: [
          Column(
            children: [
              _buildTopHeader(game, puzzle),
              Expanded(
                child: puzzle == null
                    ? Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const CircularProgressIndicator(
                              color: AppTheme.cyanNeon,
                            ),
                            const SizedBox(height: 12),
                            Text(
                              'Calibrating Day ${game.dailyGameDay} Matrix...',
                              style: AppTheme.hudNumberStyle(
                                color: AppTheme.cyanLight,
                              ),
                            ),
                          ],
                        ),
                      )
                    : LayoutBuilder(
                        builder: (context, constraints) {
                          return SingleChildScrollView(
                            padding: const EdgeInsets.fromLTRB(10, 8, 10, 14),
                            child: ConstrainedBox(
                              constraints: BoxConstraints(
                                minHeight: math.max(
                                  0,
                                  constraints.maxHeight - 22,
                                ),
                              ),
                              child: Column(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  _buildMatrixTerminal(game, puzzle),
                                  const SizedBox(height: 10),
                                  _buildBottomActions(game),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),

          // Pause Overlay
          if (game.isDailyGamePaused &&
              !game.dailyGameTimeOver &&
              !game.dailyGameVictoryModal)
            PauseModal(
              title: 'Matrix Paused',
              subtitle: 'Daily Challenge • Day ${game.dailyGameDay}',
              exitLabel: 'Daily Hub',
              onResume: game.toggleDailyPause,
              onRestart: () {
                game.toggleDailyPause();
                game.retryDailyChallenge();
              },
              onExit: () {
                game.toggleDailyPause();
                game.navigateTo(AppScreen.daily);
              },
            ),

          // Instructions Modal
          if (_showInstructions && puzzle != null)
            InstructionsModal.daily(
              dayNum: game.dailyGameDay,
              puzzle: puzzle,
              onClose: () => setState(() => _showInstructions = false),
            ),

          // Timeout Modal
          if (game.dailyGameTimeOver && !_dismissedTimeout)
            TimeoutModal(
              onRestart: game.retryDailyChallenge,
              onExtraTime: () {
                game.watchRewardedAd(
                  const AdRewardInfo(
                    type: 'daily_time',
                    amount: 30,
                    title: '+30s Extra Time',
                  ),
                );
              },
              exitLabel: 'Daily Hub',
              exitEmoji: '📅',
              onExitHub: () => game.navigateTo(AppScreen.daily),
              onClose: () {
                setState(() => _dismissedTimeout = true);
                game.navigateTo(AppScreen.daily);
              },
            ),

          // Daily Cleared Victory Modal
          if (game.dailyGameVictoryModal)
            DailyVictoryModal(
              dayNum: game.dailyGameDay,
              streakDays: math.max(1, game.streakDays),
              onCollectAndReturn: () {
                game.showInterstitialAd(
                  force: true,
                  onClose: () => game.navigateTo(AppScreen.daily),
                );
              },
            ),
        ],
      ),
    );
  }

  Widget _buildTopHeader(
    GameController game,
    DailyChallengePuzzle? puzzle,
  ) {
    final protocolId = puzzle?.protocolId ?? (274 + game.dailyGameDay);
    return Container(
      decoration: BoxDecoration(
        gradient: AppTheme.headerBackgroundGradient,
        border: Border(
          bottom: BorderSide(
            color: AppTheme.cyanSky.withValues(alpha: 0.22),
          ),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _DailyCircleButton(
                tooltip: 'Back to daily hub',
                onTap: () => game.navigateTo(AppScreen.daily),
                child: const Icon(
                  Icons.chevron_left_rounded,
                  size: 22,
                  color: Color(0xFFA5F3FC),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 13,
                  vertical: 4.5,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xCC0D255A),
                  borderRadius: BorderRadius.circular(999),
                  border: Border.all(
                    color: AppTheme.cyanSky.withValues(alpha: 0.5),
                  ),
                ),
                child: Text(
                  'DAILY #$protocolId',
                  style: AppTheme.displayStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    color: const Color(0xFFA5F3FC),
                    letterSpacing: 1.0,
                  ),
                ),
              ),
              _DailyCircleButton(
                tooltip: 'Reset daily puzzle',
                onTap: () {
                  _resetSpinController.forward(from: 0);
                  game.retryDailyChallenge();
                },
                child: RotationTransition(
                  turns: Tween(begin: 0.0, end: 1.0)
                      .animate(_resetSpinController),
                  child: const Icon(
                    Icons.refresh_rounded,
                    size: 18,
                    color: Color(0xFFA5F3FC),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMatrixTerminal(
    GameController game,
    DailyChallengePuzzle puzzle,
  ) {
    final ans = game.dailyGameAnswers;
    final a0 = ans[0], a1 = ans[1], a2 = ans[2];
    final a3 = ans[3], a4 = ans[4], a5 = ans[5];
    final a6 = ans[6], a7 = ans[7], a8 = ans[8];

    final isAlphaCorrect = a0 != null &&
        a1 != null &&
        a2 != null &&
        puzzle.rowAlpha.evaluate(a0, a1, a2) == puzzle.targetAlpha;
    final isBetaCorrect = a3 != null &&
        a4 != null &&
        a5 != null &&
        puzzle.rowBeta.evaluate(a3, a4, a5) == puzzle.targetBeta;
    final isGammaCorrect = a6 != null &&
        a7 != null &&
        a8 != null &&
        puzzle.rowGamma.evaluate(a6, a7, a8) == puzzle.targetGamma;

    final linkFilled = a1 != null && a4 != null && a7 != null;
    final currentColVal =
        linkFilled ? puzzle.colLink.evaluate(a1, a4, a7) : null;
    final isLinkCorrect = linkFilled && currentColVal == puzzle.targetLink;

    final trayCount = puzzle.trayNumbers.length;
    final slotSize = trayCount >= 13
        ? 30.0
        : trayCount >= 11
            ? 33.0
            : 36.0;
    final opWidth = trayCount >= 13 ? 14.0 : 17.0;
    final parenWidth = trayCount >= 13 ? 8.0 : 10.0;

    return PeakedBoardContainer(
      maxWidth: 356,
      padding: const EdgeInsets.fromLTRB(10, 8, 10, 12),
      header: PeakedBoardHeader(
        timerText: _formatTimer(game.dailyGameTimerSeconds),
        isWarning: game.dailyGameTimerSeconds <= 15,
        difficultyLabel: puzzle.difficulty,
        centerBadgeLabel: 'DAY ${game.dailyGameDay}',
        isPaused: game.isDailyGamePaused,
        onTogglePause: game.toggleDailyPause,
        timerEnabled: game.settings.timerEnabled,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 4),
          // Row 1: Core Alpha
          _buildEquationRow(
            game: game,
            slots: const [0, 1, 2],
            template: puzzle.rowAlpha,
            target: puzzle.targetAlpha,
            isCorrect: isAlphaCorrect,
            slotSize: slotSize,
            opWidth: opWidth,
            parenWidth: parenWidth,
          ),
          // Connector 1
          _buildColumnConnectorRow(
            opSymbol: _displayOp(game, puzzle.colLink.op1),
            slotSize: slotSize,
            opWidth: opWidth,
            parenWidth: parenWidth,
          ),
          // Row 2: Core Beta
          _buildEquationRow(
            game: game,
            slots: const [3, 4, 5],
            template: puzzle.rowBeta,
            target: puzzle.targetBeta,
            isCorrect: isBetaCorrect,
            slotSize: slotSize,
            opWidth: opWidth,
            parenWidth: parenWidth,
          ),
          // Connector 2
          _buildColumnConnectorRow(
            opSymbol: _displayOp(game, puzzle.colLink.op2),
            slotSize: slotSize,
            opWidth: opWidth,
            parenWidth: parenWidth,
          ),
          // Row 3: Core Gamma
          _buildEquationRow(
            game: game,
            slots: const [6, 7, 8],
            template: puzzle.rowGamma,
            target: puzzle.targetGamma,
            isCorrect: isGammaCorrect,
            slotSize: slotSize,
            opWidth: opWidth,
            parenWidth: parenWidth,
          ),
          const SizedBox(height: 10),
          // Connected Resonance Link Status Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: isLinkCorrect
                  ? const Color(0xCC022C22)
                  : linkFilled
                      ? const Color(0xCC4C0519)
                      : const Color(0xBF0D2254),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isLinkCorrect
                    ? AppTheme.emerald
                    : linkFilled
                        ? AppTheme.rose
                        : AppTheme.cyanSky.withValues(alpha: 0.4),
              ),
            ),
            child: Wrap(
              alignment: WrapAlignment.center,
              crossAxisAlignment: WrapCrossAlignment.center,
              spacing: 6,
              children: [
                Text(
                  '🔗 LINK: α-2 ${_displayOp(game, puzzle.colLink.op1)} β-2 ${_displayOp(game, puzzle.colLink.op2)} γ-2 = ${puzzle.targetLink}',
                  style: AppTheme.hudNumberStyle(
                    fontSize: 10.5,
                    color: isLinkCorrect
                        ? const Color(0xFF6EE7B7)
                        : linkFilled
                            ? const Color(0xFFFDA4AF)
                            : AppTheme.cyanLight,
                  ),
                ),
                if (isLinkCorrect)
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0x99064E3B),
                      borderRadius: BorderRadius.circular(5),
                      border: Border.all(color: const Color(0x9934D399)),
                    ),
                    child: const Text(
                      '✓ LOCKED',
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF6EE7B7),
                      ),
                    ),
                  )
                else if (linkFilled && currentColVal != null)
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0x99881337),
                      borderRadius: BorderRadius.circular(5),
                      border: Border.all(color: const Color(0x99FB7185)),
                    ),
                    child: Text(
                      '≠ $currentColVal',
                      style: const TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFFFDA4AF),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Container(
            height: 1,
            width: double.infinity,
            color: AppTheme.cyanSky.withValues(alpha: 0.2),
          ),
          const SizedBox(height: 10),
          // 2-Row Emerald Number Tray
          NumberTray(
            numbers: puzzle.trayNumbers,
            usedNumbers: ans.values.toSet(),
            isDisabled: game.isDailyGamePaused || game.dailyGameTimeOver,
            largeFontEnabled: game.settings.largeFontEnabled,
            maxWidth: 318,
            onTapNumber: (numVal) => game.placeDailyNumber(numVal),
          ),
        ],
      ),
    );
  }

  String _displayOp(GameController game, String op) {
    return op == '÷' ? game.settings.divisionSymbol : op;
  }

  Widget _buildEquationRow({
    required GameController game,
    required List<int> slots,
    required DailyEquationTemplate template,
    required int target,
    required bool isCorrect,
    required double slotSize,
    required double opWidth,
    required double parenWidth,
  }) {
    return FittedBox(
      fit: BoxFit.scaleDown,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _paren('(', parenWidth),
          const SizedBox(width: 3),
          _buildDailySlot(game, slots[0], slotSize),
          const SizedBox(width: 3),
          _op(_displayOp(game, template.op1), opWidth),
          const SizedBox(width: 3),
          _buildDailySlot(game, slots[1], slotSize),
          const SizedBox(width: 3),
          _paren(')', parenWidth),
          const SizedBox(width: 3),
          _op(_displayOp(game, template.op2), opWidth),
          const SizedBox(width: 3),
          _buildDailySlot(game, slots[2], slotSize),
          const SizedBox(width: 3),
          _op('=', opWidth),
          const SizedBox(width: 3),
          _buildTargetTile(target, isCorrect, slotSize),
        ],
      ),
    );
  }

  Widget _buildColumnConnectorRow({
    required String opSymbol,
    required double slotSize,
    required double opWidth,
    required double parenWidth,
  }) {
    // Aligns directly beneath slots[1] (α-2 / β-2 / γ-2)
    final leftOffset = parenWidth + 3 + slotSize + 3 + opWidth + 3;
    final rightTotal =
        3 + parenWidth + 3 + opWidth + 3 + slotSize + 3 + opWidth + 3 + slotSize;

    return SizedBox(
      height: 22,
      child: FittedBox(
        fit: BoxFit.scaleDown,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(width: leftOffset),
            SizedBox(
              width: slotSize,
              child: Center(
                child: Text(
                  opSymbol,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: AppTheme.cyanLight,
                    height: 1.0,
                    shadows: [
                      Shadow(color: Color(0xB300E5FF), blurRadius: 8),
                    ],
                  ),
                ),
              ),
            ),
            SizedBox(width: rightTotal),
          ],
        ),
      ),
    );
  }

  Widget _paren(String symbol, double width) {
    return SizedBox(
      width: width,
      child: Center(
        child: Text(
          symbol,
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w800,
            color: AppTheme.cyanLight.withValues(alpha: 0.85),
          ),
        ),
      ),
    );
  }

  Widget _op(String symbol, double width) {
    return SizedBox(
      width: width,
      child: Center(
        child: Text(
          symbol,
          style: const TextStyle(
            fontSize: 15.5,
            fontWeight: FontWeight.w900,
            color: AppTheme.cyanLight,
            shadows: [
              Shadow(color: Color(0xB300E5FF), blurRadius: 8),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDailySlot(
    GameController game,
    int slotIdx,
    double size,
  ) {
    final val = game.dailyGameAnswers[slotIdx];
    final isSelected = game.dailyGameSelectedSlot == slotIdx;
    final isFilled = val != null;
    final isInteractive =
        !game.isDailyGamePaused && !game.dailyGameTimeOver;

    final String slotTag;
    final Color dashColor;
    final Color bgColor;
    final Color tagColor;
    if (slotIdx < 3) {
      slotTag = 'α-${slotIdx + 1}';
      dashColor = const Color(0xCC22D3EE);
      bgColor = const Color(0x8C102A63);
      tagColor = const Color(0xFFA5F3FC);
    } else if (slotIdx < 6) {
      slotTag = 'β-${slotIdx - 2}';
      dashColor = const Color(0xCCC084FC);
      bgColor = const Color(0x8C211756);
      tagColor = const Color(0xFFE9D5FF);
    } else {
      slotTag = 'γ-${slotIdx - 5}';
      dashColor = const Color(0xCC34D399);
      bgColor = const Color(0x8C0E2C22);
      tagColor = const Color(0xFFA7F3D0);
    }

    Widget slotContent = GestureDetector(
      onTap: !isInteractive
          ? null
          : () {
              if (isFilled) {
                game.removeDailyNumber(slotIdx);
              } else {
                game.selectDailySlot(slotIdx);
              }
            },
      child: AnimatedScale(
        scale: isSelected ? 1.06 : 1.0,
        duration: const Duration(milliseconds: 130),
        child: Container(
          width: size,
          height: size,
          decoration: isSelected
              ? BoxDecoration(
                  color: const Color(0x40FBBF24),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: const Color(0xFFFDE047),
                    width: 2,
                  ),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0xE6FBBF24),
                      blurRadius: 14,
                    ),
                  ],
                )
              : isFilled
                  ? BoxDecoration(
                      gradient: const LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Color(0xFF2563EB),
                          Color(0xFF1D4ED8),
                          Color(0xFF173887),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: const Color(0xFF67E8F9),
                        width: 1.6,
                      ),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0xFF0B1D4D),
                          offset: Offset(0, 3),
                          blurRadius: 0,
                        ),
                      ],
                    )
                  : BoxDecoration(
                      color: bgColor,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: dashColor, width: 1.4),
                    ),
          alignment: Alignment.center,
          padding: const EdgeInsets.all(2),
          child: isFilled
              ? FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    '$val',
                    style: AppTheme.hudNumberStyle(
                      fontSize: 15,
                      color: Colors.white,
                    ),
                  ),
                )
              : Text(
                  slotTag,
                  style: TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: isSelected ? const Color(0xFFFCD34D) : tagColor,
                  ),
                ),
        ),
      ),
    );

    if (!isInteractive) return slotContent;

    return DragTarget<int>(
      onWillAcceptWithDetails: (_) => true,
      onAcceptWithDetails: (details) {
        if (game.dailyGameAnswers.containsKey(slotIdx)) {
          game.removeDailyNumber(slotIdx);
        }
        game.selectDailySlot(slotIdx);
        game.placeDailyNumber(details.data);
      },
      builder: (context, candidate, _) {
        return AnimatedScale(
          scale: candidate.isNotEmpty ? 1.08 : 1.0,
          duration: const Duration(milliseconds: 100),
          child: slotContent,
        );
      },
    );
  }

  Widget _buildTargetTile(int val, bool isCorrect, double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: isCorrect
              ? const [
                  Color(0xFF059669),
                  Color(0xFF047857),
                  Color(0xFF064E3B),
                ]
              : const [
                  Color(0xFF2563EB),
                  Color(0xFF1D4ED8),
                  Color(0xFF173887),
                ],
        ),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: isCorrect
              ? const Color(0xFF6EE7B7)
              : const Color(0xFF67E8F9),
          width: 1.6,
        ),
        boxShadow: [
          BoxShadow(
            color: isCorrect
                ? const Color(0xFF022C22)
                : const Color(0xFF0B1D4D),
            offset: const Offset(0, 3),
            blurRadius: 0,
          ),
          if (isCorrect)
            const BoxShadow(
              color: Color(0xB310B981),
              blurRadius: 12,
            ),
        ],
      ),
      alignment: Alignment.center,
      padding: const EdgeInsets.all(2),
      child: FittedBox(
        fit: BoxFit.scaleDown,
        child: Text(
          '$val',
          style: AppTheme.hudNumberStyle(
            fontSize: 15,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  Widget _buildBottomActions(GameController game) {
    final undoCount = game.dailyGameHistory.length;
    final hasUndo = undoCount > 0;

    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 340),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            // 1. Daily Hub
            _DailyDockButton(
              gradientColors: const [
                Color(0xFF2563EB),
                Color(0xFF1D4ED8),
                Color(0xFF173887),
              ],
              borderColor: const Color(0xFF22D3EE),
              shadowColor: const Color(0xFF0C235C),
              onTap: () => game.navigateTo(AppScreen.daily),
              child: const Icon(
                Icons.grid_view_rounded,
                size: 23,
                color: Color(0xFFA5F3FC),
              ),
            ),
            // 2. Undo
            Stack(
              clipBehavior: Clip.none,
              children: [
                _DailyDockButton(
                  gradientColors: hasUndo
                      ? const [
                          Color(0xFF0284C7),
                          Color(0xFF0369A1),
                          Color(0xFF075985),
                        ]
                      : const [
                          Color(0x801B3670),
                          Color(0x800F2249),
                        ],
                  borderColor: hasUndo
                      ? const Color(0xFF67E8F9)
                      : const Color(0x3306B6D4),
                  shadowColor: hasUndo
                      ? const Color(0xFF082F49)
                      : const Color(0xFF0B1A38),
                  onTap: hasUndo ? game.undoDailyNumber : null,
                  child: Icon(
                    Icons.undo_rounded,
                    size: 23,
                    color: hasUndo ? Colors.white : const Color(0x6667E8F9),
                  ),
                ),
                if (hasUndo)
                  Positioned(
                    top: -6,
                    right: -6,
                    child: Container(
                      constraints: const BoxConstraints(
                        minWidth: 19,
                        minHeight: 19,
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF22D3EE), Color(0xFF7DD3FC)],
                        ),
                        borderRadius: BorderRadius.circular(999),
                        border: Border.all(color: Colors.white, width: 1.5),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        '$undoCount',
                        style: const TextStyle(
                          fontSize: 9.5,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF020617),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            // 3. Quantum Hint
            Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.bottomCenter,
              children: [
                _DailyDockButton(
                  gradientColors: const [
                    Color(0xFF38BDF8),
                    Color(0xFF0284C7),
                    Color(0xFF0369A1),
                  ],
                  borderColor: const Color(0xFFA5F3FC),
                  shadowColor: const Color(0xFF075985),
                  onTap: () => game.useDailyHint(),
                  child: const Icon(
                    Icons.lightbulb_rounded,
                    size: 23,
                    color: Colors.white,
                  ),
                ),
                Positioned(
                  bottom: -7,
                  child: _DockBadgePill(
                    label: 'HINT',
                    colors: const [
                      Color(0xFFA5F3FC),
                      Color(0xFF7DD3FC),
                      Color(0xFF22D3EE),
                    ],
                    textColor: const Color(0xFF083344),
                  ),
                ),
              ],
            ),
            // 4. Info / Instructions
            Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.bottomCenter,
              children: [
                _DailyDockButton(
                  gradientColors: const [
                    Color(0xFFFBBF24),
                    Color(0xFFF59E0B),
                    Color(0xFFD97706),
                  ],
                  borderColor: const Color(0xFFFEF08A),
                  shadowColor: const Color(0xFF92400E),
                  onTap: () {
                    game.showInterstitialAd(
                      force: true,
                      onClose: () {
                        if (mounted) {
                          setState(() => _showInstructions = true);
                        }
                      },
                    );
                  },
                  child: const Icon(
                    Icons.info_outline_rounded,
                    size: 24,
                    color: Colors.white,
                  ),
                ),
                Positioned(
                  bottom: -7,
                  child: _DockBadgePill(
                    label: 'INFO',
                    colors: const [
                      Color(0xFFFEF08A),
                      Color(0xFFFCD34D),
                      Color(0xFFFACC15),
                    ],
                    textColor: AppTheme.amberDeepText,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _DailyCircleButton extends StatelessWidget {
  const _DailyCircleButton({
    required this.onTap,
    required this.child,
    required this.tooltip,
  });

  final VoidCallback onTap;
  final Widget child;
  final String tooltip;

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: tooltip,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          customBorder: const CircleBorder(),
          child: Ink(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFF1E4BA6),
                  Color(0xFF163884),
                  Color(0xFF102A63),
                ],
              ),
              border: Border.all(
                color: const Color(0xCC22D3EE),
                width: 1.8,
              ),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x5900E5FF),
                  blurRadius: 8,
                ),
              ],
            ),
            child: Center(child: child),
          ),
        ),
      ),
    );
  }
}

class _DailyDockButton extends StatelessWidget {
  const _DailyDockButton({
    required this.gradientColors,
    required this.borderColor,
    required this.shadowColor,
    required this.child,
    this.onTap,
  });

  final List<Color> gradientColors;
  final Color borderColor;
  final Color shadowColor;
  final Widget child;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(15),
        child: Ink(
          width: 52,
          height: 52,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: gradientColors,
            ),
            borderRadius: BorderRadius.circular(15),
            border: Border.all(color: borderColor, width: 1.8),
            boxShadow: [
              BoxShadow(
                color: shadowColor,
                offset: const Offset(0, 3.5),
                blurRadius: 0,
              ),
              if (onTap != null)
                BoxShadow(
                  color: borderColor.withValues(alpha: 0.35),
                  offset: const Offset(0, 5),
                  blurRadius: 14,
                ),
            ],
          ),
          child: Center(child: child),
        ),
      ),
    );
  }
}

class _DockBadgePill extends StatelessWidget {
  const _DockBadgePill({
    required this.label,
    required this.colors,
    required this.textColor,
  });

  final String label;
  final List<Color> colors;
  final Color textColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: colors),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: const Color(0x66000000)),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 8.5,
          fontWeight: FontWeight.w900,
          color: textColor,
          letterSpacing: 0.6,
          height: 1.0,
        ),
      ),
    );
  }
}

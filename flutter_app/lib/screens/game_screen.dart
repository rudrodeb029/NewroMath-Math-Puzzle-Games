import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';
import '../widgets/crossmath_board.dart';
import '../widgets/game_modals.dart';
import '../widgets/number_tray.dart';

/// Main Campaign Cross-Math Gameplay Screen.
///
/// Mirrors `renderGameScreen` in `src/legacyApp.jsx` with:
/// - Top HUD (`‹` back, `Mission L{n}` pill, `ⓘ` instructions, `↻` reroll)
/// - 3D Peaked Roof Board Header (`GAME X/Y`, clean apex timer, difficulty, pause)
/// - Interactive 5x5 Cross-Math grid + Emerald Number Tray (tap & drag-swap)
/// - Bottom 3D Arcade Action Dock (History, Undo with count badge, Hint)
class GameScreen extends StatefulWidget {
  const GameScreen({super.key});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen>
    with SingleTickerProviderStateMixin {
  bool _showInstructions = false;
  bool _dismissedCorrect = false;
  bool _dismissedWrong = false;
  bool _dismissedTimeout = false;

  bool _prevCorrectOpen = false;
  bool _prevWrongOpen = false;
  bool _prevTimeOver = false;

  late final AnimationController _rerollSpinController;

  @override
  void initState() {
    super.initState();
    _rerollSpinController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 450),
    );
  }

  @override
  void dispose() {
    _rerollSpinController.dispose();
    super.dispose();
  }

  void _syncModalTransitions(GameController game) {
    if (game.isCorrectModalOpen && !_prevCorrectOpen) {
      _dismissedCorrect = false;
    }
    if (game.isWrongModalOpen && !_prevWrongOpen) {
      _dismissedWrong = false;
    }
    if (game.isTimeOver && !_prevTimeOver) {
      _dismissedTimeout = false;
    }
    _prevCorrectOpen = game.isCorrectModalOpen;
    _prevWrongOpen = game.isWrongModalOpen;
    _prevTimeOver = game.isTimeOver;
  }

  @override
  Widget build(BuildContext context) {
    final game = context.watch<GameController>();
    _syncModalTransitions(game);

    final puzzle = game.activePuzzle;
    final trayCount = puzzle.numbers.length;
    final blankCount = puzzle.slots.length;
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
              // Top Navigation & HUD Header
              _buildTopHeader(context, game),
              // Main Viewport-Locked Game Stage
              Expanded(
                child: SafeArea(
                  top: false,
                  bottom: false,
                  child: LayoutBuilder(
                    builder: (context, constraints) {
                      final availH = constraints.maxHeight;
                      final availW = constraints.maxWidth;
                      final reservedNonBoardH =
                          trayCount > 5 ? 245.0 : 205.0;
                      final maxBoardFromH =
                          math.max(165.0, availH - reservedNonBoardH);
                      final maxBoardFromW = math.min(
                        availW - 36.0,
                        (trayCount >= 11 || blankCount >= 7)
                            ? 248.0
                            : (trayCount >= 9 || blankCount >= 6)
                                ? 256.0
                                : 276.0,
                      );
                      final boardWidth =
                          math.min(maxBoardFromH, maxBoardFromW).clamp(160.0, 280.0);

                      return Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            // Mission Board Terminal with 3D Peaked Roof Header
                            Flexible(
                              child: FittedBox(
                                fit: BoxFit.scaleDown,
                                child: SizedBox(
                                  width: math.min(availW - 20, 336.0),
                                  child: PeakedBoardContainer(
                                    maxWidth: 336,
                                    padding: const EdgeInsets.fromLTRB(
                                      10,
                                      6,
                                      10,
                                      10,
                                    ),
                                    header: PeakedBoardHeader(
                                      timerText: game.formattedGameTimer,
                                      isWarning: game.gameTimerSeconds <= 15,
                                      difficultyLabel:
                                          puzzle.stageDifficulty.isNotEmpty
                                              ? puzzle.stageDifficulty
                                              : game.currentLevelMeta.difficulty,
                                      centerBadgeLabel:
                                          'GAME ${game.stageNum}/${game.stageTotal}',
                                      isPaused: game.isGamePaused,
                                      onTogglePause: game.togglePause,
                                      timerEnabled: game.settings.timerEnabled,
                                    ),
                                    child: Column(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        CrossmathBoard(
                                          puzzle: puzzle,
                                          answers: game.puzzleAnswers,
                                          selectedSlot: game.selectedPuzzleSlot,
                                          divisionSymbol:
                                              game.settings.divisionSymbol,
                                          largeFontEnabled:
                                              game.settings.largeFontEnabled,
                                          isInteractive: !game.isGamePaused &&
                                              !game.isTimeOver,
                                          maxBoardWidth: boardWidth,
                                          onSlotTap: (slotIdx) {
                                            if (game.puzzleAnswers
                                                .containsKey(slotIdx)) {
                                              game.removePuzzleNumber(slotIdx);
                                            } else {
                                              game.selectPuzzleSlot(slotIdx);
                                            }
                                          },
                                          onDropNumberOnSlot:
                                              (slotIdx, number) {
                                            if (game.puzzleAnswers
                                                .containsKey(slotIdx)) {
                                              game.removePuzzleNumber(slotIdx);
                                            }
                                            game.selectPuzzleSlot(slotIdx);
                                            game.placePuzzleNumber(number);
                                          },
                                        ),
                                        const SizedBox(height: 8),
                                        Container(
                                          height: 1,
                                          width: double.infinity,
                                          color: AppTheme.cyanSky
                                              .withValues(alpha: 0.2),
                                        ),
                                        const SizedBox(height: 8),
                                        NumberTray(
                                          numbers: puzzle.numbers,
                                          usedNumbers:
                                              game.puzzleAnswers.values.toSet(),
                                          isDisabled: game.isGamePaused ||
                                              game.isTimeOver,
                                          largeFontEnabled:
                                              game.settings.largeFontEnabled,
                                          maxWidth: boardWidth,
                                          onTapNumber: (number) {
                                            game.placePuzzleNumber(number);
                                          },
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            // Bottom 3D Cyber Arcade Action Controls
                            _buildBottomActions(game),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ),
            ],
          ),

          // Pause Overlay
          if (game.isGamePaused &&
              !game.isTimeOver &&
              !game.isCorrectModalOpen &&
              !game.isWrongModalOpen)
            PauseModal(
              title: 'Mission Paused',
              subtitle:
                  'Level ${game.selectedLevelNum} • Game ${game.stageNum}/${game.stageTotal}',
              exitLabel: 'Missions',
              onResume: game.togglePause,
              onRestart: () {
                game.togglePause();
                game.resetPuzzle();
              },
              onExit: () {
                game.togglePause();
                game.navigateTo(AppScreen.levels);
              },
            ),

          // Instructions Modal
          if (_showInstructions)
            InstructionsModal.campaign(
              levelNum: game.selectedLevelNum,
              onClose: () => setState(() => _showInstructions = false),
            ),

          // Timeout Modal
          if (game.isTimeOver && !_dismissedTimeout)
            TimeoutModal(
              onRestart: game.restartLevelAfterTimeout,
              onExtraTime: () {
                game.watchRewardedAd(
                  const AdRewardInfo(
                    type: 'time',
                    amount: 30,
                    title: '+30s Extra Time',
                  ),
                );
              },
              exitLabel: 'Missions',
              exitEmoji: '⊞',
              onExitHub: () => game.navigateTo(AppScreen.levels),
              onClose: () {
                setState(() => _dismissedTimeout = true);
                game.navigateTo(AppScreen.levels);
              },
            ),

          // Wrong Result Modal
          if (game.isWrongModalOpen && !_dismissedWrong)
            WrongResultModal(
              stageNum: game.stageNum,
              stageTotal: game.stageTotal,
              onRetry: game.retryCurrentStage,
              onHint: () {
                setState(() => _dismissedWrong = true);
                game.navigateTo(AppScreen.hint);
              },
              onLevels: () {
                setState(() => _dismissedWrong = true);
                game.navigateTo(AppScreen.levels);
              },
              onClose: () => setState(() => _dismissedWrong = true),
            ),

          // Victory / Correct Modal
          if (game.isCorrectModalOpen && !_dismissedCorrect)
            CorrectResultModal(
              result: game.lastResult,
              nextLevelNum: game.selectedLevelNum,
              nextStageNum: game.stageNum,
              stageTotal: game.stageTotal,
              onPrimaryAction: () {
                if (game.lastResult.levelCleared) {
                  setState(() => _dismissedCorrect = true);
                  game.showInterstitialAd(
                    force: true,
                    onClose: () => game.attemptStartLevel(),
                  );
                } else {
                  game.continueToNextStage();
                }
              },
              onLevels: () {
                setState(() => _dismissedCorrect = true);
                game.navigateTo(AppScreen.levels);
              },
              onHome: () {
                setState(() => _dismissedCorrect = true);
                game.navigateTo(AppScreen.home);
              },
              onClose: () => setState(() => _dismissedCorrect = true),
            ),
        ],
      ),
    );
  }

  Widget _buildTopHeader(BuildContext context, GameController game) {
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
              // Left: Back Button
              _HeaderSquareButton(
                onTap: () => game.navigateTo(AppScreen.levels),
                tooltip: 'Back to levels',
                child: const Icon(
                  Icons.chevron_left_rounded,
                  size: 22,
                  color: Color(0xFF67E8F9),
                ),
              ),
              // Center: Mission Level Pill
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xBF0D255A),
                  borderRadius: BorderRadius.circular(999),
                  border: Border.all(
                    color: AppTheme.cyanSky.withValues(alpha: 0.5),
                  ),
                ),
                child: Text(
                  'MISSION L${game.selectedLevelNum}',
                  style: AppTheme.displayStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    color: const Color(0xFFA5F3FC),
                    letterSpacing: 1.0,
                  ),
                ),
              ),
              // Right: Info & Reroll
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _HeaderSquareButton(
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
                    tooltip: 'Mission Instructions',
                    isAmber: true,
                    child: const Text(
                      'ⓘ',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  _HeaderSquareButton(
                    onTap: () {
                      _rerollSpinController.forward(from: 0);
                      game.rerollPuzzle();
                    },
                    tooltip: 'Change all puzzle numbers',
                    child: RotationTransition(
                      turns: Tween(begin: 0.0, end: 1.0)
                          .animate(_rerollSpinController),
                      child: const Icon(
                        Icons.refresh_rounded,
                        size: 18,
                        color: Color(0xFF67E8F9),
                      ),
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

  Widget _buildBottomActions(GameController game) {
    final undoCount = game.puzzleHistory.length;
    final hasUndo = undoCount > 0;

    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 320),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            // 1. History & Mission Records
            _ArcadeActionButton(
              gradientColors: const [
                Color(0xFF2563EB),
                Color(0xFF1D4ED8),
                Color(0xFF173887),
              ],
              borderColor: const Color(0xFF22D3EE),
              shadowColor: const Color(0xFF0C235C),
              onTap: () => game.navigateTo(AppScreen.history),
              child: const Icon(
                Icons.grid_view_rounded,
                size: 22,
                color: Color(0xFFA5F3FC),
              ),
            ),
            // 2. Undo Move Button with Count Badge
            Stack(
              clipBehavior: Clip.none,
              children: [
                _ArcadeActionButton(
                  gradientColors: hasUndo
                      ? const [
                          Color(0xFF0284C7),
                          Color(0xFF0369A1),
                          Color(0xFF075985),
                        ]
                      : const [
                          Color(0xCC1B3670),
                          Color(0xD9152C5C),
                          Color(0xE60F2249),
                        ],
                  borderColor: hasUndo
                      ? const Color(0xFF67E8F9)
                      : const Color(0x4D06B6D4),
                  shadowColor: hasUndo
                      ? const Color(0xFF082F49)
                      : const Color(0xFF0B1A38),
                  onTap: hasUndo ? game.undoPuzzleNumber : null,
                  child: Icon(
                    Icons.undo_rounded,
                    size: 22,
                    color: hasUndo ? Colors.white : const Color(0x9967E8F9),
                  ),
                ),
                if (hasUndo)
                  Positioned(
                    top: -6,
                    right: -6,
                    child: Container(
                      constraints: const BoxConstraints(
                        minWidth: 18,
                        minHeight: 18,
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
                          fontSize: 9,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF020617),
                          height: 1.0,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            // 3. Quantum Hint Button with 'HINT' Pill
            Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.bottomCenter,
              children: [
                _ArcadeActionButton(
                  gradientColors: const [
                    Color(0xFF38BDF8),
                    Color(0xFF0284C7),
                    Color(0xFF0369A1),
                  ],
                  borderColor: const Color(0xFFA5F3FC),
                  shadowColor: const Color(0xFF075985),
                  onTap: () => game.navigateTo(AppScreen.hint),
                  child: const Icon(
                    Icons.lightbulb_rounded,
                    size: 22,
                    color: Colors.white,
                  ),
                ),
                Positioned(
                  bottom: -6,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 7,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFFA5F3FC),
                          Color(0xFF7DD3FC),
                          Color(0xFF22D3EE),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(999),
                      border: Border.all(
                        color: const Color(0x66083344),
                      ),
                    ),
                    child: const Text(
                      'HINT',
                      style: TextStyle(
                        fontSize: 8.5,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF083344),
                        letterSpacing: 0.6,
                        height: 1.0,
                      ),
                    ),
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

class _HeaderSquareButton extends StatelessWidget {
  const _HeaderSquareButton({
    required this.onTap,
    required this.child,
    this.tooltip,
    this.isAmber = false,
  });

  final VoidCallback onTap;
  final Widget child;
  final String? tooltip;
  final bool isAmber;

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: tooltip ?? '',
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(9),
          child: Ink(
            width: 30,
            height: 30,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: isAmber
                    ? const [
                        Color(0xFFFBBF24),
                        Color(0xFFF59E0B),
                        Color(0xFFD97706),
                      ]
                    : const [Color(0xFF1B4394), Color(0xFF12306D)],
              ),
              borderRadius: BorderRadius.circular(9),
              border: Border.all(
                color: isAmber
                    ? const Color(0xFFFEF08A)
                    : const Color(0xB322D3EE),
              ),
              boxShadow: [
                BoxShadow(
                  color: isAmber
                      ? const Color(0x73F59E0B)
                      : const Color(0x4D00E5FF),
                  blurRadius: 10,
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

class _ArcadeActionButton extends StatelessWidget {
  const _ArcadeActionButton({
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
        borderRadius: BorderRadius.circular(13),
        child: Ink(
          width: 46,
          height: 46,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: gradientColors,
            ),
            borderRadius: BorderRadius.circular(13),
            border: Border.all(color: borderColor, width: 1.8),
            boxShadow: [
              BoxShadow(
                color: shadowColor,
                offset: const Offset(0, 3),
                blurRadius: 0,
              ),
              if (onTap != null)
                BoxShadow(
                  color: borderColor.withValues(alpha: 0.35),
                  offset: const Offset(0, 5),
                  blurRadius: 12,
                ),
            ],
          ),
          child: Center(child: child),
        ),
      ),
    );
  }
}

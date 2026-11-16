import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';

/// Puzzle History & Saved Archives screen (`renderHistoryScreen` parity).
class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<GameController>();
    final isSavedTab = controller.historyTab == 'saved';
    final records = controller.puzzleRecords;
    final savedIds = controller.savedPuzzleIds;
    final displayList = isSavedTab
        ? records.where((r) => savedIds.contains(r.id)).toList()
        : records;

    final totalSolved = records.where((r) => r.solved).length;
    final savedCount = savedIds.length;
    final accuracyRate = records.isNotEmpty
        ? ((totalSolved / records.length) * 100).round()
        : 100;

    return Container(
      decoration: const BoxDecoration(gradient: AppTheme.gameBackgroundGradient),
      child: Column(
        children: [
          _buildHeader(context, controller, isSavedTab, savedCount),
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(12, 12, 12, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildMetricsCard(totalSolved, savedCount, accuracyRate),
                  const SizedBox(height: 14),
                  _buildSegmentedTabs(
                    controller: controller,
                    isSavedTab: isSavedTab,
                    totalCount: records.length,
                    savedCount: savedCount,
                  ),
                  const SizedBox(height: 14),
                  if (displayList.isEmpty)
                    _buildEmptyState(controller, isSavedTab)
                  else
                    ...displayList.map(
                      (item) => _HistoryRecordCard(
                        item: item,
                        isSaved: savedIds.contains(item.id),
                        onCopy: () {
                          Clipboard.setData(ClipboardData(text: item.equation));
                          ScaffoldMessenger.of(context)
                            ..hideCurrentSnackBar()
                            ..showSnackBar(
                              SnackBar(
                                content:
                                    Text('📋 Formula copied: ${item.equation}'),
                                duration: const Duration(seconds: 2),
                              ),
                            );
                        },
                        onToggleSave: () => controller.toggleSavePuzzle(item.id),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(
    BuildContext context,
    GameController controller,
    bool isSavedTab,
    int savedCount,
  ) {
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
          GestureDetector(
            onTap: () => controller.navigateTo(AppScreen.home),
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
              ),
              alignment: Alignment.center,
              child: const Text(
                '‹',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFFA5F3FC),
                ),
              ),
            ),
          ),
          Column(
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('📜', style: TextStyle(fontSize: 16)),
                  const SizedBox(width: 6),
                  Text(
                    'PUZZLE ARCHIVES',
                    style: AppTheme.displayStyle(
                      fontSize: 16.5,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.0,
                      color: const Color(0xFFE0F2FE),
                    ),
                  ),
                ],
              ),
              Text(
                isSavedTab ? 'SAVED QUANTUM FORMULAS' : 'NEURAL MISSION LOGS',
                style: TextStyle(
                  fontSize: 9.5,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.3,
                  color: const Color(0xFF67E8F9).withValues(alpha: 0.8),
                ),
              ),
            ],
          ),
          GestureDetector(
            onTap: () {
              if (!isSavedTab) {
                if (controller.puzzleRecords.isNotEmpty) {
                  _confirmClearHistory(context, controller);
                } else {
                  ScaffoldMessenger.of(context)
                    ..hideCurrentSnackBar()
                    ..showSnackBar(
                      const SnackBar(
                        content: Text('No history records to clear'),
                        duration: Duration(seconds: 2),
                      ),
                    );
                }
              } else {
                ScaffoldMessenger.of(context)
                  ..hideCurrentSnackBar()
                  ..showSnackBar(
                    SnackBar(
                      content: Text('🔖 Total Saved Formulas: $savedCount'),
                      duration: const Duration(seconds: 2),
                    ),
                  );
              }
            },
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
              ),
              child: Icon(
                isSavedTab
                    ? Icons.bookmark_rounded
                    : Icons.delete_outline_rounded,
                size: 19,
                color: isSavedTab
                    ? const Color(0xFFFCD34D)
                    : const Color(0xFFFDA4AF),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricsCard(int totalSolved, int savedCount, int accuracyRate) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0x24FFFFFF), Color(0xA60F2766), Color(0xCC07163C)],
        ),
        border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          Expanded(
            child: _MetricBox(
              label: 'TOTAL SOLVED',
              value: '$totalSolved',
              labelColor: const Color(0xFF67E8F9),
              valueColor: Colors.white,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: _MetricBox(
              label: 'SAVED',
              value: '$savedCount',
              labelColor: const Color(0xFFFCD34D),
              valueColor: const Color(0xFFFCD34D),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: _MetricBox(
              label: 'ACCURACY',
              value: '$accuracyRate%',
              labelColor: const Color(0xFF6EE7B7),
              valueColor: const Color(0xFF6EE7B7),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSegmentedTabs({
    required GameController controller,
    required bool isSavedTab,
    required int totalCount,
    required int savedCount,
  }) {
    return Container(
      padding: const EdgeInsets.all(5),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: () => controller.setHistoryTab('history'),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(13),
                  gradient: !isSavedTab
                      ? const LinearGradient(
                          colors: [
                            Color(0xFF06B6D4),
                            Color(0xFF0EA5E9),
                            Color(0xFF2563EB),
                          ],
                        )
                      : null,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.access_time_rounded,
                      size: 16,
                      color: !isSavedTab
                          ? Colors.white
                          : const Color(0xB3A5F3FC),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'History',
                      style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w800,
                        color: !isSavedTab
                            ? Colors.white
                            : const Color(0xB3A5F3FC),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 7,
                        vertical: 1.5,
                      ),
                      decoration: BoxDecoration(
                        color: !isSavedTab
                            ? Colors.white.withValues(alpha: 0.22)
                            : Colors.white.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(99),
                      ),
                      child: Text(
                        '$totalCount',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: !isSavedTab
                              ? Colors.white
                              : const Color(0xFF67E8F9),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(width: 6),
          Expanded(
            child: GestureDetector(
              onTap: () => controller.setHistoryTab('saved'),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(13),
                  gradient: isSavedTab
                      ? const LinearGradient(
                          colors: [
                            Color(0xFFF59E0B),
                            Color(0xFFF97316),
                            Color(0xFFD97706),
                          ],
                        )
                      : null,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      isSavedTab
                          ? Icons.bookmark_rounded
                          : Icons.bookmark_outline_rounded,
                      size: 16,
                      color: isSavedTab
                          ? Colors.white
                          : const Color(0xB3A5F3FC),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'Saved',
                      style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w800,
                        color: isSavedTab
                            ? Colors.white
                            : const Color(0xB3A5F3FC),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 7,
                        vertical: 1.5,
                      ),
                      decoration: BoxDecoration(
                        color: isSavedTab
                            ? Colors.white.withValues(alpha: 0.22)
                            : Colors.white.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(99),
                      ),
                      child: Text(
                        '$savedCount',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: isSavedTab
                              ? Colors.white
                              : const Color(0xFFFCD34D),
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
    );
  }

  Widget _buildEmptyState(GameController controller, bool isSavedTab) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 34),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Colors.white.withValues(alpha: 0.08),
            Colors.white.withValues(alpha: 0.02),
          ],
        ),
        border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
      ),
      child: Column(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: isSavedTab
                    ? [
                        AppTheme.amber.withValues(alpha: 0.22),
                        const Color(0x33EA580C),
                      ]
                    : [
                        AppTheme.cyanNeon.withValues(alpha: 0.22),
                        const Color(0x332563EB),
                      ],
              ),
              border: Border.all(
                color: isSavedTab
                    ? AppTheme.amber.withValues(alpha: 0.35)
                    : AppTheme.cyanNeon.withValues(alpha: 0.35),
              ),
            ),
            alignment: Alignment.center,
            child: Text(
              isSavedTab ? '🔖' : '📜',
              style: const TextStyle(fontSize: 28),
            ),
          ),
          const SizedBox(height: 14),
          Text(
            isSavedTab ? 'No Saved Formulas Yet' : 'No History Logs Recorded',
            style: AppTheme.displayStyle(
              fontSize: 17,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            isSavedTab
                ? 'Tap the bookmark ribbon on any equation from the History tab to pin it here for rapid study.'
                : 'Complete math puzzles in Campaign or Daily Challenge to record equations in your neural archives.',
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFFCBD5E1),
              height: 1.45,
            ),
          ),
          const SizedBox(height: 18),
          GestureDetector(
            onTap: () {
              if (isSavedTab) {
                controller.setHistoryTab('history');
              } else {
                controller.attemptStartLevel();
              }
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 11),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(14),
                gradient: LinearGradient(
                  colors: isSavedTab
                      ? const [Color(0xFFF59E0B), Color(0xFFEA580C)]
                      : const [Color(0xFF06B6D4), Color(0xFF2563EB)],
                ),
              ),
              child: Text(
                isSavedTab
                    ? 'Browse History Archives'
                    : 'Launch A Puzzle Mission',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _confirmClearHistory(BuildContext context, GameController controller) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF0B1F4D),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
        ),
        title: const Text(
          'Clear History Logs?',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900),
        ),
        content: const Text(
          'All recorded puzzle logs will be removed from your local archive.',
          style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 13),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Color(0xFF94A3B8)),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.rose,
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              controller.clearHistory();
              Navigator.of(ctx).pop();
            },
            child: const Text('Clear'),
          ),
        ],
      ),
    );
  }
}

class _MetricBox extends StatelessWidget {
  const _MetricBox({
    required this.label,
    required this.value,
    required this.labelColor,
    required this.valueColor,
  });

  final String label;
  final String value;
  final Color labelColor;
  final Color valueColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 8.5,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.6,
              color: labelColor,
            ),
          ),
          const SizedBox(height: 3),
          Text(
            value,
            style: AppTheme.hudNumberStyle(
              fontSize: 16,
              color: valueColor,
            ),
          ),
        ],
      ),
    );
  }
}

class _HistoryRecordCard extends StatelessWidget {
  const _HistoryRecordCard({
    required this.item,
    required this.isSaved,
    required this.onCopy,
    required this.onToggleSave,
  });

  final PuzzleRecord item;
  final bool isSaved;
  final VoidCallback onCopy;
  final VoidCallback onToggleSave;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onCopy,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(13),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          gradient: const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0x1FFFFFFF),
              Color(0xA60D2258),
              Color(0xCC06143C),
            ],
          ),
          border: Border.all(
            color: isSaved
                ? AppTheme.amber.withValues(alpha: 0.48)
                : Colors.white.withValues(alpha: 0.16),
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(14),
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: isSaved
                      ? [
                          AppTheme.amber.withValues(alpha: 0.3),
                          const Color(0x80B45309),
                        ]
                      : [
                          AppTheme.cyanNeon.withValues(alpha: 0.25),
                          const Color(0x662563EB),
                        ],
                ),
                border: Border.all(
                  color: isSaved
                      ? AppTheme.amber.withValues(alpha: 0.6)
                      : AppTheme.cyanNeon.withValues(alpha: 0.4),
                ),
              ),
              alignment: Alignment.center,
              child: const Text('🔢', style: TextStyle(fontSize: 18)),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.equation,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppTheme.hudNumberStyle(
                      fontSize: 13.5,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.access_time_rounded,
                            size: 12,
                            color: Color(0xFF22D3EE),
                          ),
                          const SizedBox(width: 3),
                          Text(
                            item.timeLabel,
                            style: const TextStyle(
                              fontSize: 10.5,
                              color: Color(0xFFCBD5E1),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 7,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xCC083344),
                          borderRadius: BorderRadius.circular(99),
                          border: Border.all(
                            color: AppTheme.cyanNeon.withValues(alpha: 0.35),
                          ),
                        ),
                        child: Text(
                          'Level ${item.level}',
                          style: const TextStyle(
                            fontSize: 9.5,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF67E8F9),
                          ),
                        ),
                      ),
                      if (item.mode.isNotEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.12),
                            ),
                          ),
                          child: Text(
                            item.mode.toUpperCase(),
                            style: const TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFFCBD5E1),
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: onToggleSave,
              child: Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: isSaved
                      ? const LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [Color(0x4DF59E0B), Color(0x80B45309)],
                        )
                      : null,
                  color: isSaved ? null : Colors.white.withValues(alpha: 0.08),
                  border: Border.all(
                    color: isSaved
                        ? AppTheme.amber.withValues(alpha: 0.65)
                        : Colors.white.withValues(alpha: 0.2),
                  ),
                ),
                child: Icon(
                  isSaved
                      ? Icons.bookmark_rounded
                      : Icons.bookmark_outline_rounded,
                  size: 18,
                  color: isSaved
                      ? const Color(0xFFFCD34D)
                      : const Color(0xFF94A3B8),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

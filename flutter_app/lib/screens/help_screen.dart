import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';

/// Help & Support screen (`renderHelpScreen` parity).
class HelpScreen extends StatefulWidget {
  const HelpScreen({super.key});

  @override
  State<HelpScreen> createState() => _HelpScreenState();
}

class _HelpScreenState extends State<HelpScreen> {
  String _helpTab = 'all';
  int _openFaqIndex = -1;
  String _feedbackCategory = 'Bug Report';
  bool _feedbackSent = false;
  String _feedbackTicketId = '';
  bool _copiedEmail = false;
  final TextEditingController _emailCtrl = TextEditingController();
  final TextEditingController _feedbackCtrl = TextEditingController();

  static const List<({String id, String label, String icon})> _tabs = [
    (id: 'all', label: 'All Topics', icon: '🌐'),
    (id: 'rules', label: 'How to Play', icon: '📐'),
    (id: 'tools', label: 'Tools & Boosters', icon: '⚡'),
    (id: 'faqs', label: 'FAQs', icon: '❓'),
    (id: 'tips', label: 'Pro Tips', icon: '🧠'),
    (id: 'contact', label: 'Contact & Feedback', icon: '✉️'),
  ];

  static const List<({String q, String a, String icon})> _faqItems = [
    (
      q: 'How do I earn 3 Stars on each level?',
      a: 'To achieve a 3-Star mastery rating: (1) Complete the puzzle without making incorrect equation submissions, (2) Finish before the bonus time milestone, and (3) Use at most 1 hint. Flawless solves award bonus Coins and XP!',
      icon: '⭐',
    ),
    (
      q: 'How do intersecting equations work?',
      a: 'In Cross-Math, whenever a horizontal row and a vertical column cross, they share the exact same number tile. That tile must simultaneously balance both the row equation and the column equation.',
      icon: '📐',
    ),
    (
      q: 'What order of operations is used?',
      a: 'Equations evaluate in straightforward sequential order from left-to-right and top-to-bottom as written on the grid, matching classic arcade crossword math rules.',
      icon: '🔢',
    ),
    (
      q: 'What happens if I miss a Daily Challenge?',
      a: 'You can protect your streak using a Streak Saver shield or unlock missed calendar dates from the calendar view using your earned Coins to keep your Monthly Trophy progress on track.',
      icon: '📅',
    ),
    (
      q: 'Can I play NewroMath completely offline?',
      a: 'Yes! All campaign levels and offline practice modes are fully playable without an internet connection. Your stars, coins, and records will automatically sync to cloud leaderboards once reconnected.',
      icon: '📶',
    ),
    (
      q: 'How does the Weekly League Leaderboard work?',
      a: 'Earn XP across Campaign, Daily Challenges, and Speed Runs to rise through Bronze, Silver, Gold, Diamond, and Master Leagues. The top 10 solvers promote every Sunday midnight with rare reward chests!',
      icon: '🏆',
    ),
  ];

  @override
  void dispose() {
    _emailCtrl.dispose();
    _feedbackCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<GameController>();

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
                  if (_helpTab == 'all' || _helpTab == 'rules') ...[
                    _buildHowToPlayCard(),
                    const SizedBox(height: 16),
                  ],
                  if (_helpTab == 'all' || _helpTab == 'tools') ...[
                    _buildToolsCard(),
                    const SizedBox(height: 16),
                  ],
                  if (_helpTab == 'all' || _helpTab == 'tips') ...[
                    _buildProTipsCard(),
                    const SizedBox(height: 16),
                  ],
                  if (_helpTab == 'all' || _helpTab == 'faqs') ...[
                    _buildFaqCard(),
                    const SizedBox(height: 16),
                  ],
                  if (_helpTab == 'all' || _helpTab == 'contact') ...[
                    _buildContactCard(controller),
                    const SizedBox(height: 16),
                  ],
                  _buildLegalFooter(context),
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
        10,
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              GestureDetector(
                onTap: () {
                  if (controller.navigationStack.length > 1) {
                    controller.navigateBack();
                  } else {
                    controller.navigateTo(AppScreen.settings);
                  }
                },
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.2),
                    ),
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
              Expanded(
                child: Center(
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text('🛟', style: TextStyle(fontSize: 17)),
                        const SizedBox(width: 8),
                        Text(
                          'HELP & SUPPORT',
                          style: AppTheme.displayStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.1,
                            color: const Color(0xFFE0F2FE),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 40, height: 40),
            ],
          ),
          const SizedBox(height: 10),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            child: Row(
              children: _tabs.map((tab) {
                final selected = _helpTab == tab.id;
                return GestureDetector(
                  onTap: () => setState(() => _helpTab = tab.id),
                  child: Container(
                    margin: const EdgeInsets.only(right: 6),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 7,
                    ),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      gradient: selected
                          ? const LinearGradient(
                              colors: [Color(0xFF22D3EE), Color(0xFF2563EB)],
                            )
                          : null,
                      color:
                          selected ? null : Colors.white.withValues(alpha: 0.08),
                      border: Border.all(
                        color: selected
                            ? const Color(0xFF67E8F9)
                            : Colors.white.withValues(alpha: 0.12),
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(tab.icon, style: const TextStyle(fontSize: 12)),
                        const SizedBox(width: 5),
                        Text(
                          tab.label,
                          style: TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w800,
                            color: selected
                                ? Colors.white
                                : const Color(0xFFCBD5E1),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHowToPlayCard() {
    return _HelpSectionCard(
      icon: '📐',
      iconColor: AppTheme.cyanNeon,
      title: 'HOW TO PLAY CROSS-MATH',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Your goal is to complete the intersecting mathematical crossword by placing numbers from your dock into the blank grid tiles so that every row and column forms a valid equation.',
            style: TextStyle(
              fontSize: 12,
              color: Color(0xFFCBD5E1),
              height: 1.45,
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.4),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        'INTERACTIVE GRID PREVIEW',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF67E8F9),
                        ),
                      ),
                    ),
                    SizedBox(width: 8),
                    Text(
                      'Balanced ✓',
                      style: TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF34D399),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                _equationPreviewRow('ROW:', '7', '+', '5', '=', '12'),
                const SizedBox(height: 8),
                _equationPreviewRow('COL:', '5', '×', '3', '=', '15',
                    firstHighlight: true),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(9),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.06),
                    borderRadius: BorderRadius.circular(12),
                    border:
                        Border.all(color: Colors.white.withValues(alpha: 0.1)),
                  ),
                  child: const Text(
                    '💡 The shared tile [ 5 ] satisfies both equations simultaneously (7 + 5 = 12 and 5 × 3 = 15).',
                    style: TextStyle(
                      fontSize: 10.5,
                      color: Color(0xFFCBD5E1),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          const _StepRow(
            num: '1',
            title: 'Select & Place',
            desc:
                'Tap a number in your dock, then tap the target blank cell to place it.',
          ),
          const SizedBox(height: 8),
          const _StepRow(
            num: '2',
            title: 'Recall Anytime',
            desc:
                'Tap any placed number to instantly send it back to your dock with zero penalty.',
          ),
          const SizedBox(height: 8),
          const _StepRow(
            num: '3',
            title: 'Color Verification',
            desc:
                'Balanced equations glow emerald green, while mismatched totals highlight red.',
          ),
          const SizedBox(height: 8),
          const _StepRow(
            num: '4',
            title: '3-Star Mastery',
            desc:
                'Clear all equations within the target time to unlock the full 3-star rating!',
          ),
        ],
      ),
    );
  }

  Widget _equationPreviewRow(
    String tag,
    String a,
    String op,
    String b,
    String eq,
    String res, {
    bool firstHighlight = false,
  }) {
    return Row(
      children: [
        SizedBox(
          width: 38,
          child: Text(
            tag,
            style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8)),
          ),
        ),
        _previewTile(a, highlight: firstHighlight),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 6),
          child: Text(
            op,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w800,
              color: Color(0xFF67E8F9),
            ),
          ),
        ),
        _previewTile(b, highlight: !firstHighlight),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 6),
          child: Text(
            eq,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w800,
              color: Color(0xFF94A3B8),
            ),
          ),
        ),
        Container(
          width: 32,
          height: 28,
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.18),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.white.withValues(alpha: 0.25)),
          ),
          alignment: Alignment.center,
          child: Text(
            res,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: Color(0xFF6EE7B7),
            ),
          ),
        ),
      ],
    );
  }

  Widget _previewTile(String value, {bool highlight = false}) {
    return Container(
      width: 28,
      height: 28,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        gradient: highlight
            ? const LinearGradient(
                colors: [Color(0xFF22D3EE), Color(0xFF2563EB)],
              )
            : null,
        color: highlight ? null : Colors.white.withValues(alpha: 0.12),
        border: Border.all(
          color: highlight
              ? const Color(0xFFA5F3FC)
              : Colors.white.withValues(alpha: 0.2),
        ),
      ),
      alignment: Alignment.center,
      child: Text(
        value,
        style: TextStyle(
          fontSize: 12,
          fontWeight: highlight ? FontWeight.w900 : FontWeight.w700,
          color: Colors.white,
        ),
      ),
    );
  }

  Widget _buildToolsCard() {
    const tools = [
      (
        icon: '💡',
        title: 'Smart Hint',
        badge: '50 Coins',
        color: Color(0xFFFCD34D),
        desc:
            'Instantly reveals and secures the correct number in the most bottlenecked blank cell.',
      ),
      (
        icon: '🔄',
        title: 'Undo / Board Reset',
        badge: 'Free',
        color: Color(0xFF67E8F9),
        desc:
            'Recalls all placed tiles back into your tray so you can test alternative strategies without penalty.',
      ),
      (
        icon: '🎲',
        title: 'Tray Shuffle',
        badge: 'Free',
        color: Color(0xFFD8B4FE),
        desc:
            'Reorders your dock numbers to stimulate pattern recognition and spot complementary factor pairs.',
      ),
      (
        icon: '🛡️',
        title: 'Streak Saver',
        badge: 'Protective',
        color: Color(0xFFFDA4AF),
        desc:
            'Preserves your daily streak multiplier if you ever miss a calendar puzzle day.',
      ),
    ];

    return _HelpSectionCard(
      icon: '⚡',
      iconColor: AppTheme.amber,
      title: 'IN-GAME TOOLS & BOOSTERS',
      child: Column(
        children: tools
            .map(
              (t) => Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(11),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.06),
                  borderRadius: BorderRadius.circular(16),
                  border:
                      Border.all(color: Colors.white.withValues(alpha: 0.15)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: t.color.withValues(alpha: 0.18),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: t.color.withValues(alpha: 0.4)),
                      ),
                      alignment: Alignment.center,
                      child: Text(t.icon, style: const TextStyle(fontSize: 17)),
                    ),
                    const SizedBox(width: 11),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  t.title,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.w800,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 7,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: t.color.withValues(alpha: 0.12),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(
                                    color: t.color.withValues(alpha: 0.35),
                                  ),
                                ),
                                child: Text(
                                  t.badge,
                                  style: TextStyle(
                                    fontSize: 9.5,
                                    fontWeight: FontWeight.w800,
                                    color: t.color,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            t.desc,
                            style: const TextStyle(
                              fontSize: 11,
                              color: Color(0xFFCBD5E1),
                              height: 1.35,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            )
            .toList(),
      ),
    );
  }

  Widget _buildProTipsCard() {
    const tips = [
      (
        title: '🎯 1. Anchor Multiplication & Division First',
        body:
            'Multiplication and division equations have far fewer valid factor pairs than addition or subtraction. For example, _ × _ = 28 can only be 4 and 7. Solving these first anchors key grid intersections!',
      ),
      (
        title: '🧩 2. Intersection Cross-Checking',
        body:
            'When two candidate numbers could fit horizontally, inspect the vertical column equation. Only one candidate will satisfy both directions simultaneously.',
      ),
      (
        title: '⚖️ 3. Parity Elimination (Even vs. Odd)',
        body:
            'Use parity rules: Even + Odd = Odd and Even + Even = Even. If the target total is even and your known tile is odd, the missing tile MUST be odd. This cuts possibilities in half!',
      ),
    ];

    return _HelpSectionCard(
      icon: '🧠',
      iconColor: AppTheme.purple,
      title: 'PRO MATH STRATEGIES',
      child: Column(
        children: tips
            .map(
              (tip) => Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.06),
                  borderRadius: BorderRadius.circular(16),
                  border:
                      Border.all(color: Colors.white.withValues(alpha: 0.12)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      tip.title,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF67E8F9),
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      tip.body,
                      style: const TextStyle(
                        fontSize: 11,
                        color: Color(0xFFCBD5E1),
                        height: 1.45,
                      ),
                    ),
                  ],
                ),
              ),
            )
            .toList(),
      ),
    );
  }

  Widget _buildFaqCard() {
    return _HelpSectionCard(
      icon: '❓',
      iconColor: AppTheme.bluePrimary,
      title: 'FREQUENTLY ASKED QUESTIONS',
      child: Column(
        children: List.generate(_faqItems.length, (i) {
          final item = _faqItems[i];
          final isOpen = _openFaqIndex == i;
          return Container(
            margin: const EdgeInsets.only(bottom: 8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
            ),
            child: Column(
              children: [
                GestureDetector(
                  onTap: () =>
                      setState(() => _openFaqIndex = isOpen ? -1 : i),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      children: [
                        Text(item.icon, style: const TextStyle(fontSize: 15)),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            item.q,
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        Container(
                          width: 24,
                          height: 24,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.2),
                            ),
                          ),
                          child: Icon(
                            isOpen
                                ? Icons.keyboard_arrow_up_rounded
                                : Icons.keyboard_arrow_down_rounded,
                            size: 16,
                            color: const Color(0xFF67E8F9),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                if (isOpen)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.2),
                      border: Border(
                        top: BorderSide(
                          color: Colors.white.withValues(alpha: 0.1),
                        ),
                      ),
                    ),
                    child: Text(
                      item.a,
                      style: const TextStyle(
                        fontSize: 11.5,
                        color: Color(0xFFCBD5E1),
                        height: 1.45,
                      ),
                    ),
                  ),
              ],
            ),
          );
        }),
      ),
    );
  }

  Widget _buildContactCard(GameController controller) {
    const categories = [
      'Bug Report',
      'Feature Idea',
      'Math Question',
      'Account',
    ];

    return _HelpSectionCard(
      icon: '✉️',
      iconColor: AppTheme.emerald,
      title: 'CONTACT & IN-APP FEEDBACK',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.4),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
            ),
            child: Row(
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: AppTheme.cyanNeon.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: AppTheme.cyanNeon.withValues(alpha: 0.35),
                    ),
                  ),
                  alignment: Alignment.center,
                  child: const Text('📬', style: TextStyle(fontSize: 15)),
                ),
                const SizedBox(width: 10),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'OFFICIAL DEVELOPER SUPPORT',
                        style: TextStyle(
                          fontSize: 9.5,
                          color: Color(0xFF94A3B8),
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        'support@newromath.com',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFFA5F3FC),
                        ),
                      ),
                    ],
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    Clipboard.setData(
                      const ClipboardData(text: 'support@newromath.com'),
                    );
                    setState(() => _copiedEmail = true);
                    Future<void>.delayed(const Duration(milliseconds: 2400),
                        () {
                      if (mounted) setState(() => _copiedEmail = false);
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 7,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.2),
                      ),
                    ),
                    child: Text(
                      _copiedEmail ? '✓ Copied' : 'Copy',
                      style: const TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          if (_feedbackSent)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                gradient: LinearGradient(
                  colors: [
                    AppTheme.emerald.withValues(alpha: 0.2),
                    AppTheme.cyanNeon.withValues(alpha: 0.2),
                  ],
                ),
                border: Border.all(
                  color: AppTheme.emerald.withValues(alpha: 0.45),
                ),
              ),
              child: Column(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppTheme.emerald.withValues(alpha: 0.2),
                      border: Border.all(
                        color: AppTheme.emerald.withValues(alpha: 0.5),
                      ),
                    ),
                    alignment: Alignment.center,
                    child: const Text(
                      '✓',
                      style: TextStyle(fontSize: 24, color: Colors.white),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Message Received!',
                    style: AppTheme.displayStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Thank you for helping us polish NewroMath. We review submissions within 24-48 hours.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 11.5, color: Color(0xFFCBD5E1)),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.4),
                      borderRadius: BorderRadius.circular(99),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.2),
                      ),
                    ),
                    child: Text(
                      'Ticket Ref: $_feedbackTicketId',
                      style: const TextStyle(
                        fontSize: 10.5,
                        color: Color(0xFF67E8F9),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white.withValues(alpha: 0.12),
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () {
                      setState(() {
                        _feedbackSent = false;
                        _feedbackCtrl.clear();
                      });
                    },
                    child: const Text('Send Another Message'),
                  ),
                ],
              ),
            )
          else ...[
            const Text(
              'Select Category',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: Color(0xFFCBD5E1),
              ),
            ),
            const SizedBox(height: 6),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 6,
              crossAxisSpacing: 6,
              childAspectRatio: 4.0,
              children: categories.map((cat) {
                final selected = _feedbackCategory == cat;
                return GestureDetector(
                  onTap: () => setState(() => _feedbackCategory = cat),
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(11),
                      gradient: selected
                          ? const LinearGradient(
                              colors: [Color(0xFF22D3EE), Color(0xFF2563EB)],
                            )
                          : null,
                      color:
                          selected ? null : Colors.white.withValues(alpha: 0.06),
                      border: Border.all(
                        color: selected
                            ? const Color(0xFF67E8F9)
                            : Colors.white.withValues(alpha: 0.12),
                      ),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      cat,
                      style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w800,
                        color: selected
                            ? Colors.white
                            : const Color(0xFFCBD5E1),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 12),
            const Text(
              'Your Email (Optional for reply)',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: Color(0xFFCBD5E1),
              ),
            ),
            const SizedBox(height: 5),
            TextField(
              controller: _emailCtrl,
              keyboardType: TextInputType.emailAddress,
              style: const TextStyle(color: Colors.white, fontSize: 12.5),
              decoration: InputDecoration(
                filled: true,
                fillColor: Colors.black.withValues(alpha: 0.4),
                hintText: 'e.g. player@example.com',
                hintStyle: const TextStyle(color: Color(0xFF64748B)),
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(
                    color: Colors.white.withValues(alpha: 0.2),
                  ),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppTheme.cyanNeon),
                ),
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Description',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: Color(0xFFCBD5E1),
              ),
            ),
            const SizedBox(height: 5),
            TextField(
              controller: _feedbackCtrl,
              maxLines: 3,
              style: const TextStyle(color: Colors.white, fontSize: 12.5),
              decoration: InputDecoration(
                filled: true,
                fillColor: Colors.black.withValues(alpha: 0.4),
                hintText: 'Please provide details about your issue or idea...',
                hintStyle: const TextStyle(color: Color(0xFF64748B)),
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(
                    color: Colors.white.withValues(alpha: 0.2),
                  ),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppTheme.cyanNeon),
                ),
              ),
            ),
            const SizedBox(height: 12),
            GestureDetector(
              onTap: () async {
                final text = _feedbackCtrl.text.trim();
                if (text.isEmpty) {
                  ScaffoldMessenger.of(context)
                    ..hideCurrentSnackBar()
                    ..showSnackBar(
                      const SnackBar(
                        content: Text('Please enter feedback details first.'),
                        duration: Duration(seconds: 2),
                      ),
                    );
                  return;
                }
                await controller.submitFeedbackTicket(
                  category: _feedbackCategory,
                  message: text,
                  email: _emailCtrl.text.trim(),
                );
                if (!mounted) return;
                final ticketNum = 10000 + math.Random().nextInt(90000);
                setState(() {
                  _feedbackTicketId = 'NM-$ticketNum';
                  _feedbackSent = true;
                });
              },
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFF22D3EE),
                      Color(0xFF0EA5E9),
                      Color(0xFF2563EB),
                    ],
                  ),
                  border: Border.all(color: const Color(0xFF67E8F9)),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('🚀', style: TextStyle(fontSize: 13)),
                    SizedBox(width: 6),
                    Text(
                      'SUBMIT FEEDBACK',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.8,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildLegalFooter(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(99),
            border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
          ),
          child: const Text(
            '⚡ NewroMath v1.0.0 • Engine Build 2026',
            style: TextStyle(
              fontSize: 10.5,
              color: Color(0xFF67E8F9),
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        const SizedBox(height: 8),
        Wrap(
          alignment: WrapAlignment.center,
          crossAxisAlignment: WrapCrossAlignment.center,
          spacing: 4,
          children: [
            TextButton(
              onPressed: () => _showInfoDialog(
                context,
                'Privacy Policy',
                'NewroMath does not collect, sell, or transmit any personal identification data. All gameplay records, coins, and campaign achievements are stored safely on your device and private profile.',
              ),
              child: const Text(
                'Privacy Policy',
                style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
              ),
            ),
            const Text('•', style: TextStyle(color: Color(0xFF94A3B8))),
            TextButton(
              onPressed: () => _showInfoDialog(
                context,
                'Terms of Service',
                'NewroMath is provided free for cognitive mathematics practice, education, and entertainment. Play fair and enjoy sharpening your math mind!',
              ),
              child: const Text(
                'Terms of Service',
                style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
              ),
            ),
          ],
        ),
      ],
    );
  }

  void _showInfoDialog(BuildContext context, String title, String message) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF0B1F4D),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
        ),
        title: Text(
          title,
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900),
        ),
        content: Text(
          message,
          style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 13),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text(
              'Close',
              style: TextStyle(color: Color(0xFF67E8F9)),
            ),
          ),
        ],
      ),
    );
  }
}

class _HelpSectionCard extends StatelessWidget {
  const _HelpSectionCard({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.child,
  });

  final String icon;
  final Color iconColor;
  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0x24FFFFFF), Color(0xA60F2766), Color(0xCC07163C)],
        ),
        border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: iconColor.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: iconColor.withValues(alpha: 0.4)),
                ),
                alignment: Alignment.center,
                child: Text(icon, style: const TextStyle(fontSize: 14)),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.8,
                    color: Color(0xFFA5F3FC),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

class _StepRow extends StatelessWidget {
  const _StepRow({
    required this.num,
    required this.title,
    required this.desc,
  });

  final String num;
  final String title;
  final String desc;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: AppTheme.cyanNeon.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            alignment: Alignment.center,
            child: Text(
              num,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                color: Color(0xFF67E8F9),
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  desc,
                  style: const TextStyle(
                    fontSize: 10.5,
                    color: Color(0xFFCBD5E1),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

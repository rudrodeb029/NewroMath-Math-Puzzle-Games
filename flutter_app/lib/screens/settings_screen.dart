import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';

/// Settings screen (`renderSettingsScreen` parity).
class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<GameController>();
    final s = controller.settings;
    final isPro = controller.isProUser;
    final proPrice = controller.getProductPrice('newromath_pro_noads');

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
                  _SettingsSectionCard(
                    title: 'AUDIO & SENSORY FEEDBACK',
                    children: [
                      _GlassToggleRow(
                        label: 'Sound Effects',
                        sublabel: 'Tactile arcade clicks, fanfare & audio fx',
                        icon: Icons.volume_up_rounded,
                        variant: _IconVariant.cyan,
                        checked: s.soundEnabled,
                        onToggle: controller.toggleSound,
                      ),
                      const SizedBox(height: 8),
                      _GlassToggleRow(
                        label: 'Haptic Feedback',
                        sublabel:
                            'Vibration pulses on keypad presses and matches',
                        icon: Icons.vibration_rounded,
                        variant: _IconVariant.teal,
                        checked: s.hapticsEnabled,
                        onToggle: controller.toggleHaptics,
                      ),
                      const SizedBox(height: 8),
                      _GlassToggleRow(
                        label: 'Game Timer',
                        sublabel:
                            'Display countdown clock during puzzle battles',
                        icon: Icons.timer_rounded,
                        variant: _IconVariant.sky,
                        checked: s.timerEnabled,
                        onToggle: controller.toggleTimer,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _SettingsSectionCard(
                    title: 'GAMEPLAY & DISPLAY',
                    children: [
                      _GlassToggleRow(
                        label: 'Show Explanation Button',
                        sublabel: 'Reveal step-by-step mathematical reasoning',
                        icon: Icons.lightbulb_outline_rounded,
                        variant: _IconVariant.amber,
                        checked: s.explanationEnabled,
                        onToggle: controller.toggleExplanation,
                      ),
                      const SizedBox(height: 8),
                      _GlassToggleRow(
                        label: 'Auto Submit Answer',
                        sublabel: 'Automatically verify once equation is filled',
                        icon: Icons.bolt_rounded,
                        variant: _IconVariant.emerald,
                        checked: s.autoSubmitEnabled,
                        onToggle: controller.toggleAutoSubmit,
                      ),
                      const SizedBox(height: 8),
                      _GlassToggleRow(
                        label: 'Large Math Font',
                        sublabel: 'High-legibility enlarged arithmetic tiles',
                        icon: Icons.format_size_rounded,
                        variant: _IconVariant.indigo,
                        checked: s.largeFontEnabled,
                        onToggle: controller.toggleLargeFont,
                      ),
                      const SizedBox(height: 8),
                      _buildDivisionNotationRow(
                        currentSymbol: s.divisionSymbol,
                        onSelect: controller.setDivisionSymbol,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _SettingsSectionCard(
                    title: 'RULES & HELP',
                    children: [
                      _GlassNavRow(
                        label: 'How to Play',
                        sublabel: 'Master rules, tips & tactical formulas',
                        icon: Icons.menu_book_rounded,
                        variant: _IconVariant.emerald,
                        onTap: () => controller.navigateTo(AppScreen.help),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildMembershipCard(
                    controller: controller,
                    isPro: isPro,
                    proPrice: proPrice,
                  ),
                  const SizedBox(height: 16),
                  _buildResetCard(context, controller),
                  const SizedBox(height: 20),
                  Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 5,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(99),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.15),
                        ),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.auto_awesome_rounded,
                            size: 14,
                            color: Color(0xFF67E8F9),
                          ),
                          SizedBox(width: 6),
                          Text(
                            'NewroMath v1.0.0',
                            style: TextStyle(
                              fontSize: 10.5,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF67E8F9),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Center(
                    child: Text(
                      'Think • Solve • Grow',
                      style: TextStyle(
                        fontSize: 10,
                        color: Color(0xFF94A3B8),
                        fontWeight: FontWeight.w600,
                      ),
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
          GestureDetector(
            onTap: () => controller.navigateTo(AppScreen.profile),
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
              ),
              child: const Icon(
                Icons.chevron_left_rounded,
                color: Color(0xFFA5F3FC),
                size: 24,
              ),
            ),
          ),
          Text(
            'SETTINGS',
            style: AppTheme.displayStyle(
              fontSize: 17,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.2,
              color: const Color(0xFFE0F2FE),
            ),
          ),
          const SizedBox(width: 40, height: 40),
        ],
      ),
    );
  }

  Widget _buildDivisionNotationRow({
    required String currentSymbol,
    required ValueChanged<String> onSelect,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.07),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
      ),
      child: Row(
        children: [
          const _SkeuomorphicCircleIcon(
            icon: Icons.percent_rounded,
            variant: _IconVariant.indigo,
            active: true,
            customSymbol: '÷',
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Division Notation',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'Choose arithmetic operator symbol',
                  style: TextStyle(
                    fontSize: 10,
                    color: Color(0xFF94A3B8),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.42),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
            ),
            child: Row(
              children: ['÷', '/'].map((sym) {
                final selected = currentSymbol == sym;
                return GestureDetector(
                  onTap: () => onSelect(sym),
                  child: Container(
                    width: 36,
                    height: 28,
                    margin: const EdgeInsets.symmetric(horizontal: 2),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                      gradient: selected
                          ? const LinearGradient(
                              colors: [Color(0xFF22D3EE), Color(0xFF2563EB)],
                            )
                          : null,
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      sym,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        color:
                            selected ? Colors.white : const Color(0xFF94A3B8),
                      ),
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

  Widget _buildMembershipCard({
    required GameController controller,
    required bool isPro,
    required String proPrice,
  }) {
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
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Text(
                  'MEMBERSHIP & BILLING',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.9,
                    color: Color(0xFFFDE68A),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isPro
                      ? AppTheme.emerald.withValues(alpha: 0.2)
                      : Colors.white.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(99),
                  border: Border.all(
                    color: isPro
                        ? AppTheme.emerald.withValues(alpha: 0.45)
                        : Colors.white.withValues(alpha: 0.2),
                  ),
                ),
                child: Text(
                  isPro ? 'PRO VIP MEMBER' : 'FREE PLAYER',
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w900,
                    color: isPro
                        ? const Color(0xFF6EE7B7)
                        : const Color(0xFFCBD5E1),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (!isPro)
            GestureDetector(
              onTap: () => controller.navigateTo(AppScreen.rewards),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  gradient: const LinearGradient(
                    colors: [Color(0x33F59E0B), Color(0x33CA8A04)],
                  ),
                  border: Border.all(
                    color: AppTheme.amber.withValues(alpha: 0.45),
                  ),
                ),
                child: Row(
                  children: [
                    const _SkeuomorphicCircleIcon(
                      icon: Icons.workspace_premium_rounded,
                      variant: _IconVariant.amber,
                      active: true,
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Upgrade to PRO VIP Pass',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFFFDE68A),
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Remove ads & get bonus coins + gems',
                            style: TextStyle(
                              fontSize: 10,
                              color: Color(0xB3FCD34D),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 5,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.amber.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: AppTheme.amber.withValues(alpha: 0.45),
                        ),
                      ),
                      child: Text(
                        proPrice,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFFFCD34D),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            )
          else
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.emerald.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: AppTheme.emerald.withValues(alpha: 0.35),
                ),
              ),
              child: const Row(
                children: [
                  _SkeuomorphicCircleIcon(
                    icon: Icons.workspace_premium_rounded,
                    variant: _IconVariant.emerald,
                    active: true,
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'PRO VIP Lifetime Active',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFFA7F3D0),
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Enjoy unlimited ad-free math puzzles',
                          style: TextStyle(
                            fontSize: 10,
                            color: Color(0xB36EE7B7),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 8),
          _GlassNavRow(
            label: 'Restore Google Play Purchases',
            sublabel: 'Recover previous purchases on this account',
            icon: Icons.restore_rounded,
            variant: _IconVariant.cyan,
            onTap: () => controller.restorePurchases(),
          ),
        ],
      ),
    );
  }

  Widget _buildResetCard(BuildContext context, GameController controller) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0x1AFFFFFF), Color(0x991A1236), Color(0xBF100C24)],
        ),
        border: Border.all(color: AppTheme.rose.withValues(alpha: 0.35)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(left: 2, bottom: 12),
            child: Text(
              'CAMPAIGN MANAGEMENT',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                letterSpacing: 0.9,
                color: Color(0xFFFDA4AF),
              ),
            ),
          ),
          GestureDetector(
            onTap: () => _confirmReset(context, controller),
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.rose.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.rose.withValues(alpha: 0.35)),
              ),
              child: Row(
                children: [
                  const _SkeuomorphicCircleIcon(
                    icon: Icons.delete_outline_rounded,
                    variant: _IconVariant.rose,
                    active: true,
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Start Fresh from Level 1',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFFFECDD3),
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Reset campaign progress to beginning',
                          style: TextStyle(
                            fontSize: 10,
                            color: Color(0xB3FDA4AF),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xB34C0519),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: AppTheme.rose.withValues(alpha: 0.4),
                      ),
                    ),
                    child: const Text(
                      'Level 1',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFFFDA4AF),
                      ),
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

  void _confirmReset(BuildContext context, GameController controller) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF0B1F4D),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(color: AppTheme.rose.withValues(alpha: 0.45)),
        ),
        title: const Text(
          'Start Fresh from Level 1?',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900),
        ),
        content: const Text(
          'Your campaign level and unlocked stages will be reset to Level 1.',
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
              controller.resetAllProgress();
              Navigator.of(ctx).pop();
            },
            child: const Text('Reset'),
          ),
        ],
      ),
    );
  }
}

class _SettingsSectionCard extends StatelessWidget {
  const _SettingsSectionCard({
    required this.title,
    required this.children,
  });

  final String title;
  final List<Widget> children;

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
          Padding(
            padding: const EdgeInsets.only(left: 2, bottom: 12),
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                letterSpacing: 0.9,
                color: Color(0xFFA5F3FC),
              ),
            ),
          ),
          ...children,
        ],
      ),
    );
  }
}

class _GlassToggleRow extends StatelessWidget {
  const _GlassToggleRow({
    required this.label,
    required this.sublabel,
    required this.icon,
    required this.variant,
    required this.checked,
    required this.onToggle,
  });

  final String label;
  final String sublabel;
  final IconData icon;
  final _IconVariant variant;
  final bool checked;
  final VoidCallback onToggle;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onToggle,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.07),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
        ),
        child: Row(
          children: [
            _SkeuomorphicCircleIcon(
              icon: icon,
              variant: variant,
              active: checked,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    sublabel,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 10,
                      color: Color(0xFF94A3B8),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            AnimatedContainer(
              duration: const Duration(milliseconds: 220),
              width: 44,
              height: 24,
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(99),
                gradient: checked
                    ? const LinearGradient(
                        colors: [Color(0xFF22D3EE), Color(0xFF2563EB)],
                      )
                    : null,
                color: checked ? null : Colors.black.withValues(alpha: 0.42),
                border: Border.all(
                  color: checked
                      ? const Color(0xFF67E8F9)
                      : Colors.white.withValues(alpha: 0.2),
                ),
              ),
              child: AnimatedAlign(
                duration: const Duration(milliseconds: 220),
                alignment:
                    checked ? Alignment.centerRight : Alignment.centerLeft,
                child: Container(
                  width: 18,
                  height: 18,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                  ),
                  child: checked
                      ? const Icon(
                          Icons.check_rounded,
                          size: 12,
                          color: Color(0xFF0891B2),
                        )
                      : null,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _GlassNavRow extends StatelessWidget {
  const _GlassNavRow({
    required this.label,
    required this.sublabel,
    required this.icon,
    required this.variant,
    required this.onTap,
  });

  final String label;
  final String sublabel;
  final IconData icon;
  final _IconVariant variant;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.07),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
        ),
        child: Row(
          children: [
            _SkeuomorphicCircleIcon(
              icon: icon,
              variant: variant,
              active: true,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    sublabel,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 10,
                      color: Color(0xFF94A3B8),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
              ),
              child: const Icon(
                Icons.chevron_right_rounded,
                size: 18,
                color: Color(0xFF67E8F9),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

enum _IconVariant { cyan, teal, sky, amber, emerald, indigo, rose }

class _SkeuomorphicCircleIcon extends StatelessWidget {
  const _SkeuomorphicCircleIcon({
    required this.icon,
    required this.variant,
    required this.active,
    this.customSymbol,
  });

  final IconData icon;
  final _IconVariant variant;
  final bool active;
  final String? customSymbol;

  @override
  Widget build(BuildContext context) {
    final List<Color> rim;
    final List<Color> disc;
    final Color glyphColor;

    if (!active) {
      rim = [
        const Color(0x6694A3B8),
        const Color(0x66475569),
        const Color(0x990F172A),
      ];
      disc = [
        const Color(0xFF1E293B),
        const Color(0xFF0F172A),
        const Color(0xFF020617),
      ];
      glyphColor = const Color(0xFF64748B);
    } else {
      switch (variant) {
        case _IconVariant.cyan:
          rim = const [Color(0xFFA5F3FC), Color(0xFF38BDF8), Color(0xFF1D4ED8)];
          disc = const [
            Color(0xFF18458A),
            Color(0xFF0D2857),
            Color(0xFF041029),
          ];
          glyphColor = const Color(0xFFA5F3FC);
        case _IconVariant.teal:
          rim = const [Color(0xFF99F6E4), Color(0xFF2DD4BF), Color(0xFF047857)];
          disc = const [
            Color(0xFF115E59),
            Color(0xFF0F4842),
            Color(0xFF042F2E),
          ];
          glyphColor = const Color(0xFF99F6E4);
        case _IconVariant.sky:
          rim = const [Color(0xFFBAE6FD), Color(0xFF38BDF8), Color(0xFF1D4ED8)];
          disc = const [
            Color(0xFF0369A1),
            Color(0xFF075985),
            Color(0xFF082F49),
          ];
          glyphColor = const Color(0xFFBAE6FD);
        case _IconVariant.amber:
          rim = const [Color(0xFFFDE68A), Color(0xFFFBBF24), Color(0xFFB45309)];
          disc = const [
            Color(0xFF244585),
            Color(0xFF122752),
            Color(0xFF061129),
          ];
          glyphColor = const Color(0xFFFCD34D);
        case _IconVariant.emerald:
          rim = const [Color(0xFFA7F3D0), Color(0xFF34D399), Color(0xFF0F766E)];
          disc = const [
            Color(0xFF047857),
            Color(0xFF065F46),
            Color(0xFF022C22),
          ];
          glyphColor = const Color(0xFFA7F3D0);
        case _IconVariant.indigo:
          rim = const [Color(0xFFC7D2FE), Color(0xFF818CF8), Color(0xFF3730A3)];
          disc = const [
            Color(0xFF312E81),
            Color(0xFF1E1B4B),
            Color(0xFF0F172A),
          ];
          glyphColor = const Color(0xFFC7D2FE);
        case _IconVariant.rose:
          rim = const [Color(0xFFFECDD3), Color(0xFFFB7185), Color(0xFF991B1B)];
          disc = const [
            Color(0xFF881337),
            Color(0xFF4C0519),
            Color(0xFF1F020A),
          ];
          glyphColor = const Color(0xFFFECDD3);
      }
    }

    return Container(
      width: 32,
      height: 32,
      padding: const EdgeInsets.all(1.5),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: rim,
        ),
      ),
      child: Container(
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            center: const Alignment(0, -0.35),
            radius: 0.9,
            colors: disc,
          ),
        ),
        alignment: Alignment.center,
        child: customSymbol != null
            ? Text(
                customSymbol!,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: glyphColor,
                ),
              )
            : Icon(icon, size: 16, color: glyphColor),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../data/levels_catalog.dart';
import '../models/game_models.dart';
import '../state/game_controller.dart';
import '../theme/app_theme.dart';

/// Rewards & Google Play IAP Shop screen (`renderRewardsScreen` parity).
class RewardsShopScreen extends StatelessWidget {
  const RewardsShopScreen({super.key});

  static final NumberFormat _numFmt = NumberFormat('#,###');

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<GameController>();
    final coinPacks =
        controller.iapProducts.where((p) => p.type == 'coins').toList();
    final gemPacks =
        controller.iapProducts.where((p) => p.type == 'gems').toList();

    return Container(
      decoration: const BoxDecoration(gradient: AppTheme.gameBackgroundGradient),
      child: Stack(
        children: [
          const Positioned.fill(child: _BlueprintGridOverlay()),
          Column(
            children: [
              _buildHeader(context, controller),
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(14, 14, 14, 28),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 440),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          _buildDailyFreeGiftCard(controller),
                          const SizedBox(height: 16),
                          _buildProVipPassCard(controller),
                          const SizedBox(height: 18),
                          _buildWatchAdsSection(controller),
                          const SizedBox(height: 18),
                          _buildStoreSection(
                            title: 'Gold Coin Store',
                            headerIconAsset: AppAssets.goldCoin,
                            titleColor: const Color(0xFFFDE68A),
                            packs: coinPacks,
                            isGoldTheme: true,
                            controller: controller,
                          ),
                          const SizedBox(height: 18),
                          _buildStoreSection(
                            title: 'Diamond Store',
                            headerIconAsset: AppAssets.gem,
                            titleColor: const Color(0xFFA5F3FC),
                            packs: gemPacks,
                            isGoldTheme: false,
                            controller: controller,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
          if (controller.isIapLoading) _buildIapLoadingModal(),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context, GameController controller) {
    return Container(
      decoration: BoxDecoration(
        gradient: AppTheme.headerBackgroundGradient,
        border: Border(
          bottom: BorderSide(
            color: AppTheme.cyanNeon.withValues(alpha: 0.22),
          ),
        ),
      ),
      padding: EdgeInsets.fromLTRB(
        12,
        MediaQuery.of(context).padding.top + 8,
        12,
        10,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          GestureDetector(
            onTap: () => controller.navigateTo(AppScreen.home),
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: const Color(0xFF133273),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppTheme.cyanNeon.withValues(alpha: 0.6),
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.cyanNeon.withValues(alpha: 0.25),
                    blurRadius: 10,
                  ),
                ],
              ),
              child: const Icon(
                Icons.chevron_left_rounded,
                color: Color(0xFF67E8F9),
                size: 24,
              ),
            ),
          ),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _CurrencyChip(
                iconAsset: AppAssets.goldCoin,
                value: _numFmt.format(controller.coins),
                borderColor: AppTheme.amber.withValues(alpha: 0.55),
                textColor: const Color(0xFFFCD34D),
              ),
              const SizedBox(width: 8),
              _CurrencyChip(
                iconAsset: AppAssets.gem,
                value: _numFmt.format(controller.gems),
                borderColor: AppTheme.cyanNeon.withValues(alpha: 0.55),
                textColor: const Color(0xFFA5F3FC),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// Daily Free Gift Banner (no title text, no Instant pill).
  Widget _buildDailyFreeGiftCard(GameController controller) {
    final claimed = controller.dailyGiftClaimed;
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(26),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0x22FFFFFF),
            Color(0xAA15347A),
            Color(0xDD0C1F4D),
          ],
        ),
        border: Border.all(color: Colors.white.withValues(alpha: 0.25)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF030C26).withValues(alpha: 0.5),
            blurRadius: 24,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          Image.asset(
            'assets/images/reward_gift_dial_full.webp',
            width: 54,
            height: 54,
            fit: BoxFit.contain,
            errorBuilder: (_, _, _) => const Text('🎁', style: TextStyle(fontSize: 36)),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Wrap(
              spacing: 6,
              runSpacing: 6,
              children: [
                _RewardAmountPill(
                  iconAsset: AppAssets.goldCoin,
                  label: '+350',
                  textColor: const Color(0xFFFCD34D),
                  bgColor: AppTheme.amber.withValues(alpha: 0.16),
                  borderColor: AppTheme.amber.withValues(alpha: 0.38),
                ),
                _RewardAmountPill(
                  iconAsset: AppAssets.gem,
                  label: '+5',
                  textColor: const Color(0xFFA5F3FC),
                  bgColor: AppTheme.cyanNeon.withValues(alpha: 0.15),
                  borderColor: AppTheme.cyanNeon.withValues(alpha: 0.35),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: claimed ? null : () => controller.claimDailyGift(),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(14),
                gradient: claimed
                    ? null
                    : const LinearGradient(
                        colors: [Color(0xFFFBBF24), Color(0xFFF59E0B)],
                      ),
                color: claimed ? const Color(0x99334155) : null,
                border: Border.all(
                  color: claimed
                      ? const Color(0x80475569)
                      : const Color(0xFFFDE68A),
                ),
                boxShadow: claimed
                    ? null
                    : [
                        BoxShadow(
                          color: AppTheme.amber.withValues(alpha: 0.45),
                          blurRadius: 14,
                        ),
                      ],
              ),
              child: Text(
                claimed ? 'CLAIMED ✓' : 'CLAIM FREE',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 0.4,
                  color: claimed
                      ? const Color(0xFF94A3B8)
                      : const Color(0xFF451A03),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProVipPassCard(GameController controller) {
    final isPro = controller.isProUser;
    final proPrice = controller.getProductPrice('newromath_pro_noads');

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(26),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0x38FBBF24),
            Color(0xD827134D),
            Color(0xF0100624),
          ],
        ),
        border: Border.all(
          color: AppTheme.amber.withValues(alpha: 0.65),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: AppTheme.amber.withValues(alpha: 0.25),
            blurRadius: 28,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              const _SkeuomorphicPedestal(
                size: 52,
                rimColors: [
                  Color(0xFFFDE68A),
                  Color(0xFFFBBF24),
                  Color(0xFFB45309),
                ],
                glowColor: Color(0x66F59E0B),
                child: Text('👑', style: TextStyle(fontSize: 24)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'PRO VIP Lifetime Pass',
                      style: AppTheme.displayStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 2),
                    const Text(
                      'Permanent Ad-Free & Master Bundle',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFFFDE68A),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _VipPerkTile(
                  leading: const Text('🚫', style: TextStyle(fontSize: 14)),
                  label: 'Remove Ads Forever',
                  textColor: const Color(0xFFE2E8F0),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _VipPerkTile(
                  leading: Image.asset(AppAssets.goldCoin, width: 16, height: 16),
                  label: '+2,000 Bonus Coins',
                  textColor: const Color(0xFFFCD34D),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: _VipPerkTile(
                  leading: Image.asset(AppAssets.gem, width: 16, height: 16),
                  label: '+50 Bonus Diamonds',
                  textColor: const Color(0xFFA5F3FC),
                ),
              ),
              const SizedBox(width: 8),
              const Expanded(
                child: _VipPerkTile(
                  leading: Text('👑', style: TextStyle(fontSize: 14)),
                  label: 'VIP Crown Status',
                  textColor: Color(0xFFFCD34D),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (isPro)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 11),
              decoration: BoxDecoration(
                color: AppTheme.emerald.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: AppTheme.emerald.withValues(alpha: 0.5),
                ),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('👑', style: TextStyle(fontSize: 14)),
                  SizedBox(width: 8),
                  Text(
                    'ACTIVE PRO VIP MEMBER ✓',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.6,
                      color: Color(0xFF6EE7B7),
                    ),
                  ),
                ],
              ),
            )
          else
            GestureDetector(
              onTap: () => controller.purchaseProduct('newromath_pro_noads'),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 13),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFFFBBF24),
                      Color(0xFFFACC15),
                      Color(0xFFF59E0B),
                    ],
                  ),
                  border: Border.all(color: const Color(0xFFFDE68A)),
                  boxShadow: [
                    const BoxShadow(
                      color: Color(0xFFB45309),
                      offset: Offset(0, 4),
                    ),
                    BoxShadow(
                      color: AppTheme.amber.withValues(alpha: 0.4),
                      blurRadius: 18,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('⚡', style: TextStyle(fontSize: 14)),
                    const SizedBox(width: 8),
                    Text(
                      'UNLOCK PRO PASS — $proPrice',
                      style: const TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.6,
                        color: Color(0xFF451A03),
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

  Widget _buildWatchAdsSection(GameController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 2),
          child: Row(
            children: [
              Text('🎬', style: TextStyle(fontSize: 13)),
              SizedBox(width: 6),
              Text(
                'WATCH ADS & COLLECT FREE',
                style: TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 0.8,
                  color: Color(0xFFA5F3FC),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: _AdRewardCard(
                iconAsset: AppAssets.goldCoin,
                title: '+250 Coins',
                subtitle: 'Instant Reward',
                rimColors: const [
                  Color(0xFFFDE68A),
                  Color(0xFFFBBF24),
                  Color(0xFFB45309),
                ],
                glowColor: AppTheme.amber.withValues(alpha: 0.35),
                titleColor: const Color(0xFFFCD34D),
                buttonColors: const [Color(0xFFFBBF24), Color(0xFFF59E0B)],
                buttonShadowColor: const Color(0xFFB45309),
                buttonTextColor: const Color(0xFF451A03),
                buttonBorderColor: const Color(0xFFFDE68A),
                onTap: () => controller.watchRewardedAd(
                  const AdRewardInfo(
                    type: 'coins',
                    amount: 250,
                    coinAmount: 250,
                    title: 'Coin Sponsor Video',
                  ),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _AdRewardCard(
                iconAsset: AppAssets.gem,
                title: '+10 Diamonds',
                subtitle: 'Instant Reward',
                rimColors: const [
                  Color(0xFFA5F3FC),
                  Color(0xFF38BDF8),
                  Color(0xFF1D4ED8),
                ],
                glowColor: AppTheme.cyanNeon.withValues(alpha: 0.35),
                titleColor: const Color(0xFFA5F3FC),
                buttonColors: const [Color(0xFF22D3EE), Color(0xFF3B82F6)],
                buttonShadowColor: const Color(0xFF0284C7),
                buttonTextColor: const Color(0xFF082F49),
                buttonBorderColor: const Color(0xFFA5F3FC),
                onTap: () => controller.watchRewardedAd(
                  const AdRewardInfo(
                    type: 'gems',
                    amount: 10,
                    gemAmount: 10,
                    title: 'Diamond Sponsor Video',
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        // Chest Ad Banner (no "Jackpot Ad Chest" label)
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(22),
            gradient: const LinearGradient(
              colors: [
                Color(0x1EFFFFFF),
                Color(0x991C2C63),
                Color(0xCC12224D),
              ],
            ),
            border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF020A20).withValues(alpha: 0.4),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          child: Row(
            children: [
              _SkeuomorphicPedestal(
                size: 44,
                rimColors: const [
                  Color(0xFFE9D5FF),
                  Color(0xFFC084FC),
                  Color(0xFF4338CA),
                ],
                discColors: const [
                  Color(0xFF3B186B),
                  Color(0xFF200B3D),
                  Color(0xFF0E041A),
                ],
                glowColor: AppTheme.purple.withValues(alpha: 0.35),
                child: Image.asset(
                  AppAssets.chest3d,
                  width: 24,
                  height: 24,
                  fit: BoxFit.contain,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Row(
                  children: [
                    Image.asset(AppAssets.goldCoin, width: 14, height: 14),
                    const SizedBox(width: 4),
                    const Text(
                      '+600',
                      style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFFFCD34D),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Image.asset(AppAssets.gem, width: 14, height: 14),
                    const SizedBox(width: 4),
                    const Text(
                      '+15',
                      style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFFA5F3FC),
                      ),
                    ),
                  ],
                ),
              ),
              GestureDetector(
                onTap: () => controller.watchRewardedAd(
                  const AdRewardInfo(
                    type: 'jackpot',
                    amount: 600,
                    coinAmount: 600,
                    gemAmount: 15,
                    title: 'Jackpot Mega Sponsor',
                  ),
                ),
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    gradient: const LinearGradient(
                      colors: [Color(0xFFA855F7), Color(0xFF4F46E5)],
                    ),
                    border: Border.all(
                      color: const Color(0xFFD8B4FE).withValues(alpha: 0.75),
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0xFF581C87),
                        offset: Offset(0, 3),
                      ),
                    ],
                  ),
                  child: const Text(
                    '▶ Watch (15s)',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStoreSection({
    required String title,
    required String headerIconAsset,
    required Color titleColor,
    required List<IapProduct> packs,
    required bool isGoldTheme,
    required GameController controller,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 2),
          child: Row(
            children: [
              Image.asset(headerIconAsset, width: 16, height: 16),
              const SizedBox(width: 6),
              Text(
                title.toUpperCase(),
                style: TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 0.8,
                  color: titleColor,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 10),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: packs.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 0.86,
          ),
          itemBuilder: (context, idx) {
            final pack = packs[idx];
            final price = controller.getProductPrice(pack.id);
            return _IapPackCard(
              pack: pack,
              price: price,
              isGoldTheme: isGoldTheme,
              onBuy: () => controller.purchaseProduct(pack.id),
            );
          },
        ),
      ],
    );
  }

  Widget _buildIapLoadingModal() {
    return Container(
      color: Colors.black.withValues(alpha: 0.72),
      alignment: Alignment.center,
      padding: const EdgeInsets.all(24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 300),
        padding: const EdgeInsets.all(22),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(26),
          gradient: const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF152758), Color(0xFF0A1638)],
          ),
          border: Border.all(
            color: AppTheme.cyanNeon.withValues(alpha: 0.5),
          ),
          boxShadow: AppTheme.cyanGlowShadow(0.4),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppTheme.cyanNeon.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF67E8F9)),
              ),
              child: const Center(
                child: SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.5,
                    color: AppTheme.cyanNeon,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 14),
            Text(
              'Google Play In-App Billing',
              textAlign: TextAlign.center,
              style: AppTheme.displayStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Connecting to Google Play Store... Please complete the transaction in the Google Play dialog.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 12,
                color: Color(0xFFA5F3FC),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CurrencyChip extends StatelessWidget {
  const _CurrencyChip({
    required this.iconAsset,
    required this.value,
    required this.borderColor,
    required this.textColor,
  });

  final String iconAsset;
  final String value;
  final Color borderColor;
  final Color textColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: const Color(0xB30A1F4D),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.35),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Image.asset(iconAsset, width: 16, height: 16, fit: BoxFit.contain),
          const SizedBox(width: 6),
          Text(
            value,
            style: AppTheme.hudNumberStyle(
              fontSize: 12.5,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }
}

class _RewardAmountPill extends StatelessWidget {
  const _RewardAmountPill({
    required this.iconAsset,
    required this.label,
    required this.textColor,
    required this.bgColor,
    required this.borderColor,
  });

  final String iconAsset;
  final String label;
  final Color textColor;
  final Color bgColor;
  final Color borderColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(99),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Image.asset(iconAsset, width: 13, height: 13, fit: BoxFit.contain),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }
}

class _VipPerkTile extends StatelessWidget {
  const _VipPerkTile({
    required this.leading,
    required this.label,
    required this.textColor,
  });

  final Widget leading;
  final String label;
  final Color textColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
      ),
      child: Row(
        children: [
          leading,
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                color: textColor,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _AdRewardCard extends StatelessWidget {
  const _AdRewardCard({
    required this.iconAsset,
    required this.title,
    required this.subtitle,
    required this.rimColors,
    required this.glowColor,
    required this.titleColor,
    required this.buttonColors,
    required this.buttonShadowColor,
    required this.buttonTextColor,
    required this.buttonBorderColor,
    required this.onTap,
  });

  final String iconAsset;
  final String title;
  final String subtitle;
  final List<Color> rimColors;
  final Color glowColor;
  final Color titleColor;
  final List<Color> buttonColors;
  final Color buttonShadowColor;
  final Color buttonTextColor;
  final Color buttonBorderColor;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0x1EFFFFFF),
            Color(0xB30D2250),
            Color(0xDC071536),
          ],
        ),
        border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF020A20).withValues(alpha: 0.45),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          _SkeuomorphicPedestal(
            size: 56,
            rimColors: rimColors,
            glowColor: glowColor,
            child: Image.asset(iconAsset, width: 32, height: 32, fit: BoxFit.contain),
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w900,
              color: titleColor,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w500,
              color: Colors.white.withValues(alpha: 0.72),
            ),
          ),
          const SizedBox(height: 10),
          GestureDetector(
            onTap: onTap,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 8),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                gradient: LinearGradient(colors: buttonColors),
                border: Border.all(
                  color: buttonBorderColor.withValues(alpha: 0.8),
                ),
                boxShadow: [
                  BoxShadow(
                    color: buttonShadowColor,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Text(
                '▶ Watch Ad',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w900,
                  color: buttonTextColor,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _IapPackCard extends StatelessWidget {
  const _IapPackCard({
    required this.pack,
    required this.price,
    required this.isGoldTheme,
    required this.onBuy,
  });

  final IapProduct pack;
  final String price;
  final bool isGoldTheme;
  final VoidCallback onBuy;

  static final NumberFormat _numFmt = NumberFormat('#,###');

  @override
  Widget build(BuildContext context) {
    final rimColors = isGoldTheme
        ? const [Color(0xFFFDE68A), Color(0xFFFBBF24), Color(0xFFB45309)]
        : const [Color(0xFFA5F3FC), Color(0xFF38BDF8), Color(0xFF1D4ED8)];
    final glowColor = isGoldTheme
        ? AppTheme.amber.withValues(alpha: 0.35)
        : AppTheme.cyanNeon.withValues(alpha: 0.35);

    return Stack(
      clipBehavior: Clip.none,
      children: [
        Container(
          width: double.infinity,
          height: double.infinity,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            gradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0x1EFFFFFF),
                Color(0xB30D2250),
                Color(0xDC071536),
              ],
            ),
            border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF020A20).withValues(alpha: 0.45),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                children: [
                  const SizedBox(height: 2),
                  _SkeuomorphicPedestal(
                    size: 56,
                    rimColors: rimColors,
                    glowColor: glowColor,
                    child: pack.iconAsset != null
                        ? Image.asset(
                            pack.iconAsset!,
                            width: 32,
                            height: 32,
                            fit: BoxFit.contain,
                          )
                        : Text(
                            pack.emojiIcon ?? '💎',
                            style: const TextStyle(fontSize: 24),
                          ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    pack.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '+${_numFmt.format(pack.amount)}',
                    style: TextStyle(
                      fontSize: 13.5,
                      fontWeight: FontWeight.w900,
                      color: isGoldTheme
                          ? const Color(0xFFFCD34D)
                          : const Color(0xFFA5F3FC),
                    ),
                  ),
                ],
              ),
              GestureDetector(
                onTap: onBuy,
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    gradient: isGoldTheme
                        ? const LinearGradient(
                            colors: [Color(0xFFFBBF24), Color(0xFFF59E0B)],
                          )
                        : const LinearGradient(
                            colors: [
                              Color(0xFF22D3EE),
                              Color(0xFF3B82F6),
                              Color(0xFF6366F1),
                            ],
                          ),
                    border: Border.all(
                      color: isGoldTheme
                          ? const Color(0xFFFDE68A).withValues(alpha: 0.85)
                          : const Color(0xFF67E8F9).withValues(alpha: 0.5),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: isGoldTheme
                            ? const Color(0xFFB45309)
                            : const Color(0xFF0284C7),
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Text(
                    price,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w900,
                      color: isGoldTheme
                          ? const Color(0xFF451A03)
                          : Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        if (pack.badge != null)
          Positioned(
            top: -6,
            right: 8,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(99),
                gradient: isGoldTheme
                    ? const LinearGradient(
                        colors: [Color(0xFFFBBF24), Color(0xFFF97316)],
                      )
                    : const LinearGradient(
                        colors: [Color(0xFF22D3EE), Color(0xFF3B82F6)],
                      ),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.7),
                  width: 0.8,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.3),
                    blurRadius: 4,
                  ),
                ],
              ),
              child: Text(
                pack.badge!,
                style: TextStyle(
                  fontSize: 8.5,
                  fontWeight: FontWeight.w900,
                  color: isGoldTheme
                      ? const Color(0xFF451A03)
                      : const Color(0xFF082F49),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _SkeuomorphicPedestal extends StatelessWidget {
  const _SkeuomorphicPedestal({
    required this.size,
    required this.rimColors,
    required this.glowColor,
    required this.child,
    this.discColors = const [
      Color(0xFF244585),
      Color(0xFF122752),
      Color(0xFF061129),
    ],
  });

  final double size;
  final List<Color> rimColors;
  final List<Color> discColors;
  final Color glowColor;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      padding: const EdgeInsets.all(2),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: rimColors,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.55),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
          BoxShadow(color: glowColor, blurRadius: 14),
        ],
      ),
      child: Container(
        padding: const EdgeInsets.all(1.5),
        decoration: const BoxDecoration(
          shape: BoxShape.circle,
          color: Color(0xFF061129),
        ),
        child: Container(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              center: const Alignment(0, -0.4),
              radius: 0.9,
              colors: discColors,
            ),
          ),
          child: Stack(
            alignment: Alignment.center,
            children: [
              Positioned(
                top: 2,
                left: size * 0.14,
                right: size * 0.14,
                height: size * 0.34,
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(size),
                    ),
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.white.withValues(alpha: 0.42),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              ),
              child,
            ],
          ),
        ),
      ),
    );
  }
}

class _BlueprintGridOverlay extends StatelessWidget {
  const _BlueprintGridOverlay();

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: CustomPaint(painter: _BlueprintPainter()),
    );
  }
}

class _BlueprintPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppTheme.cyanNeon.withValues(alpha: 0.04)
      ..strokeWidth = 1;
    const step = 28.0;
    for (double x = 0; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

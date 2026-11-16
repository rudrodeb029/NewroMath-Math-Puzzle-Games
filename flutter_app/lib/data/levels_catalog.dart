import 'package:flutter/material.dart';
import '../models/game_models.dart';

/// Canonical Flutter asset path conventions for NewroMath WebP assets.
///
/// Source mapping from original React/Capacitor project:
/// - `assets/*.webp`        -> `assets/images/*.webp`
/// - `assets/awards/*.webp` -> `assets/images/awards/*.webp`
/// - `assets/levels/*.webp` -> `assets/images/levels/*.webp`
/// - `image/*.webp`         -> `assets/image/*.webp`
class AppAssets {
  AppAssets._();

  static const String imagesRoot = 'assets/images/';
  static const String awardsRoot = 'assets/images/awards/';
  static const String levelsRoot = 'assets/images/levels/';
  static const String legacyImageRoot = 'assets/image/';

  static const String heroScifi = 'assets/images/hero_scifi_clean.webp';
  static const String goldCoin = 'assets/images/icon_gold_coin_3d_clean.webp';
  static const String gem = 'assets/images/icon_gem_3d_clean.webp';
  static const String robotAvatar = 'assets/images/icon_robot_3d.webp';
  static const String trophy3d = 'assets/images/icon_trophy_3d.webp';
  static const String trophyPodium = 'assets/images/icon_trophy_podium.webp';
  static const String chest3d = 'assets/images/icon_chest_3d.webp';
  static const String dailyCalendar3d =
      'assets/images/icon_daily_calendar_3d.webp';
  static const String gamepad3d = 'assets/images/icon_gamepad_3d.webp';
  static const String target3d = 'assets/images/icon_target_3d.webp';
  static const String stopwatch3d = 'assets/images/icon_stopwatch_3d.webp';
  static const String star3d = 'assets/images/icon_star_3d.webp';
  static const String gift3d = 'assets/images/icon_gift_3d.webp';
  static const String cardDaily = 'assets/images/card_daily_clean.webp';
  static const String cardNewGame = 'assets/images/card_newgame_clean.webp';
  static const String cardContinue = 'assets/images/card_continue_clean_bg.webp';
  static const String cardLevel = 'assets/images/card_level_clean.webp';
  static const String cardRewards = 'assets/images/card_rewards_clean.webp';
  static const String btnCenterGift = 'assets/images/btn_center_gift.webp';
  static const String btnHdrBell = 'assets/images/btn_hdr_bell.webp';
  static const String btnHdrCalendar = 'assets/images/btn_hdr_calendar.webp';
  static const String btnHdrSettings = 'assets/images/btn_hdr_settings.webp';
  static const String btnHdrTrophy = 'assets/images/btn_hdr_trophy.webp';
  static const String badgeRank1 = 'assets/images/badge_rank1.webp';

  static String awardForLevel(int levelNum) {
    final clamped = levelNum.clamp(1, 25);
    final padded = clamped.toString().padLeft(2, '0');
    return '${awardsRoot}award_lvl_$padded.webp';
  }

  static String levelArtForLevel(int levelNum) {
    final idx = ((levelNum - 1) % 6) + 1;
    return '${levelsRoot}level_art_$idx.webp';
  }
}

/// Official Google AdMob Demo/Test Ad Unit IDs (Android).
class AdMobConfig {
  AdMobConfig._();

  static const String appId = 'ca-app-pub-3940256099942544~3347511713';
  static const String bannerAdUnitId = 'ca-app-pub-3940256099942544/6300978111';
  static const String interstitialAdUnitId =
      'ca-app-pub-3940256099942544/1033173712';
  static const String rewardedAdUnitId =
      'ca-app-pub-3940256099942544/5224354917';
  static const int interstitialCooldownMs = 45000;
}

/// Firebase configuration matching `src/services/firebaseService.ts`
/// and `android/app/google-services.json`.
class FirebaseConfig {
  FirebaseConfig._();

  static const String projectId = 'newromaths';
  static const String androidAppId =
      '1:380321074987:android:48c86bf1b43eab8ddaff6e';
  static const String webAppId = '1:380321074987:web:5f576dfdde6b963ddaff6e';
  static const String databaseUrl =
      'https://newromaths-default-rtdb.firebaseio.com';
  static const String firestoreBaseUrl =
      'https://firestore.googleapis.com/v1/projects/newromaths/databases/(default)/documents';
  static const String storageBucket = 'newromaths.firebasestorage.app';
  static const String messagingSenderId = '380321074987';
}

/// Starter defaults and security clamping bounds for player economy.
class GameDefaults {
  GameDefaults._();

  static const int defaultCoins = 500;
  static const int defaultGems = 50;
  static const int defaultPlayerLevel = 1;
  static const int defaultUnlockedLevel = 1;
  static const int defaultSelectedLevel = 1;
  static const int defaultPlayerXp = 0;
  static const int defaultLives = 3;
  static const String defaultPlayerName = 'Guest-JFNZLZ';
  static const String defaultPlayerCountry = 'United States';
  static const String defaultAvatarAsset = AppAssets.robotAvatar;

  static const int maxLevel = 25;
  static const int maxUnlockedLevel = 26;
  static const int maxCoins = 5000000;
  static const int maxGems = 100000;
  static const int maxXp = 10000000;
  static const int maxSingleCoinDelta = 100000;
  static const int maxSingleGemDelta = 10000;
  static const int maxSingleXpDelta = 25000;
}

/// Returns the number of puzzle stages inside a campaign level (10 -> 20).
int getStageCount(int levelNum) {
  final lvl = levelNum.clamp(1, 25);
  return (10 + ((lvl - 1) * 10) / 24).round();
}

/// Returns the exact entry fee (coins + gems) for launching [levelNum].
LevelEntryCost getLevelEntryCost(int levelNum) {
  final lvl = levelNum.clamp(1, 25);
  int coins;
  int gems;
  if (lvl <= 8) {
    coins = 100 + (lvl - 1) * 25;
    gems = 10 + (lvl - 1) * 2;
  } else if (lvl <= 17) {
    coins = 275 + (lvl - 8) * 40;
    gems = 24 + (lvl - 8) * 2;
  } else {
    coins = 635 + (lvl - 17) * 70;
    gems = 42 + (lvl - 17) * 4;
    if (lvl == 25) {
      coins = 1200;
      gems = 75;
    }
  }
  return LevelEntryCost(coins: coins, gems: gems);
}

/// Returns the target XP needed to complete [levelNum] (`xp * 10`).
int getLevelTargetXp(int levelNum) {
  final lvl = levelNum.clamp(1, 25);
  final match = levelsCatalog.firstWhere(
    (l) => l.num == lvl,
    orElse: () => levelsCatalog.first,
  );
  return match.xp * 10;
}

/// Returns the countdown timer in seconds for [levelNum] and [stage].
int getLevelTimerSeconds(int levelNum, {int stage = 1}) {
  final total = getStageCount(levelNum);
  final ratio = total > 1 ? ((stage.clamp(1, total)) - 1) / (total - 1) : 0.0;
  final int base;
  if (levelNum <= 5) {
    base = 55;
  } else if (levelNum <= 10) {
    base = 48;
  } else if (levelNum <= 15) {
    base = 42;
  } else if (levelNum <= 20) {
    base = 38;
  } else {
    base = 35;
  }
  final computed = (base - ratio * 10).round();
  return computed < 25 ? 25 : computed;
}

LevelConfig _buildLevel({
  required int num,
  required String title,
  required String difficulty,
  required String range,
  required int xp,
  required int coins,
  required String tag,
  required PuzzleDifficulty tier,
}) {
  return LevelConfig(
    num: num,
    title: title,
    difficulty: difficulty,
    range: range,
    xp: xp,
    coins: coins,
    tag: tag,
    tier: tier,
    cost: getLevelEntryCost(num),
    stageCount: getStageCount(num),
    targetXp: xp * 10,
    artAsset: AppAssets.levelArtForLevel(num),
  );
}

/// Exact 25 campaign mission levels (World 1 Easy: 1-8, World 2 Medium: 9-17, World 3 Hard: 18-25).
final List<LevelConfig> levelsCatalog = List<LevelConfig>.unmodifiable([
  // World 1: Easy (Levels 1 - 8)
  _buildLevel(
    num: 1,
    title: 'Warm-Up Ignition',
    difficulty: 'Easy',
    range: '0 - 50',
    xp: 15,
    coins: 10,
    tag: 'WARM-UP',
    tier: PuzzleDifficulty.easy,
  ),
  _buildLevel(
    num: 2,
    title: 'Addition Circuit',
    difficulty: 'Easy',
    range: '51 - 100',
    xp: 20,
    coins: 12,
    tag: 'CIRCUIT',
    tier: PuzzleDifficulty.easy,
  ),
  _buildLevel(
    num: 3,
    title: 'Cross Pulse',
    difficulty: 'Easy',
    range: '101 - 150',
    xp: 25,
    coins: 14,
    tag: 'CURRENT',
    tier: PuzzleDifficulty.easy,
  ),
  _buildLevel(
    num: 4,
    title: 'Binary Junction',
    difficulty: 'Easy',
    range: '151 - 200',
    xp: 25,
    coins: 16,
    tag: 'LOGIC',
    tier: PuzzleDifficulty.easy,
  ),
  _buildLevel(
    num: 5,
    title: 'Equation Dash',
    difficulty: 'Easy',
    range: '201 - 250',
    xp: 30,
    coins: 18,
    tag: 'EQUATION',
    tier: PuzzleDifficulty.easy,
  ),
  _buildLevel(
    num: 6,
    title: 'Number Quest',
    difficulty: 'Easy',
    range: '251 - 300',
    xp: 30,
    coins: 20,
    tag: 'QUEST',
    tier: PuzzleDifficulty.easy,
  ),
  _buildLevel(
    num: 7,
    title: 'Cipher Key',
    difficulty: 'Easy',
    range: '301 - 350',
    xp: 35,
    coins: 22,
    tag: 'CIPHER',
    tier: PuzzleDifficulty.easy,
  ),
  _buildLevel(
    num: 8,
    title: 'Milestone Arena',
    difficulty: 'Easy',
    range: '351 - 400',
    xp: 35,
    coins: 25,
    tag: 'ARENA',
    tier: PuzzleDifficulty.easy,
  ),

  // World 2: Medium (Levels 9 - 17)
  _buildLevel(
    num: 9,
    title: 'Vector Flux',
    difficulty: 'Medium',
    range: '401 - 450',
    xp: 40,
    coins: 26,
    tag: 'FLUX',
    tier: PuzzleDifficulty.medium,
  ),
  _buildLevel(
    num: 10,
    title: 'Hyper Matrix',
    difficulty: 'Medium',
    range: '451 - 500',
    xp: 40,
    coins: 28,
    tag: 'MATRIX',
    tier: PuzzleDifficulty.medium,
  ),
  _buildLevel(
    num: 11,
    title: 'Photon Grid',
    difficulty: 'Medium',
    range: '501 - 550',
    xp: 45,
    coins: 30,
    tag: 'PHOTON',
    tier: PuzzleDifficulty.medium,
  ),
  _buildLevel(
    num: 12,
    title: 'Quantum Leap',
    difficulty: 'Medium',
    range: '551 - 600',
    xp: 45,
    coins: 32,
    tag: 'QUANTUM',
    tier: PuzzleDifficulty.medium,
  ),
  _buildLevel(
    num: 13,
    title: 'Delta Shift',
    difficulty: 'Medium',
    range: '601 - 650',
    xp: 50,
    coins: 34,
    tag: 'DELTA',
    tier: PuzzleDifficulty.medium,
  ),
  _buildLevel(
    num: 14,
    title: 'Synapse Overload',
    difficulty: 'Medium',
    range: '651 - 700',
    xp: 50,
    coins: 36,
    tag: 'SYNAPSE',
    tier: PuzzleDifficulty.medium,
  ),
  _buildLevel(
    num: 15,
    title: 'Cosmic Ray',
    difficulty: 'Medium',
    range: '701 - 750',
    xp: 55,
    coins: 38,
    tag: 'COSMIC',
    tier: PuzzleDifficulty.medium,
  ),
  _buildLevel(
    num: 16,
    title: 'Plasma Core',
    difficulty: 'Medium',
    range: '751 - 800',
    xp: 55,
    coins: 40,
    tag: 'PLASMA',
    tier: PuzzleDifficulty.medium,
  ),
  _buildLevel(
    num: 17,
    title: 'Mastery Trial',
    difficulty: 'Medium',
    range: '801 - 850',
    xp: 60,
    coins: 45,
    tag: 'TRIAL',
    tier: PuzzleDifficulty.medium,
  ),

  // World 3: Hard (Levels 18 - 25)
  _buildLevel(
    num: 18,
    title: 'Vortex Rift',
    difficulty: 'Hard',
    range: '851 - 920',
    xp: 65,
    coins: 48,
    tag: 'VORTEX',
    tier: PuzzleDifficulty.hard,
  ),
  _buildLevel(
    num: 19,
    title: 'Singularity Node',
    difficulty: 'Hard',
    range: '921 - 1000',
    xp: 70,
    coins: 50,
    tag: 'NODE',
    tier: PuzzleDifficulty.hard,
  ),
  _buildLevel(
    num: 20,
    title: 'Dark Matter Maze',
    difficulty: 'Hard',
    range: '1001 - 1100',
    xp: 75,
    coins: 55,
    tag: 'DARK',
    tier: PuzzleDifficulty.hard,
  ),
  _buildLevel(
    num: 21,
    title: 'Neutron Blitz',
    difficulty: 'Hard',
    range: '1101 - 1200',
    xp: 80,
    coins: 60,
    tag: 'BLITZ',
    tier: PuzzleDifficulty.hard,
  ),
  _buildLevel(
    num: 22,
    title: 'Chrono Shift',
    difficulty: 'Hard',
    range: '1201 - 1300',
    xp: 85,
    coins: 65,
    tag: 'CHRONO',
    tier: PuzzleDifficulty.hard,
  ),
  _buildLevel(
    num: 23,
    title: 'Supernova Grid',
    difficulty: 'Hard',
    range: '1301 - 1400',
    xp: 90,
    coins: 70,
    tag: 'NOVA',
    tier: PuzzleDifficulty.hard,
  ),
  _buildLevel(
    num: 24,
    title: 'Omega Frontier',
    difficulty: 'Hard',
    range: '1401 - 1490',
    xp: 95,
    coins: 80,
    tag: 'OMEGA',
    tier: PuzzleDifficulty.hard,
  ),
  _buildLevel(
    num: 25,
    title: 'Apex Boss Stage',
    difficulty: 'Hard',
    range: '1491 - 1600',
    xp: 100,
    coins: 100,
    tag: 'APEX BOSS',
    tier: PuzzleDifficulty.hard,
  ),
]);

/// Exact 25 level award badges / unlockable 3D avatars.
final List<AwardBadge> levelAwards = List<AwardBadge>.unmodifiable([
  AwardBadge(
    level: 1,
    title: 'Chrono Speedster',
    iconAsset: AppAssets.awardForLevel(1),
    description: 'Conquered Level 1 arithmetic time challenge',
    gradientColors: const [Color(0xFFFBBF24), Color(0xFFF97316)],
  ),
  AwardBadge(
    level: 2,
    title: 'Logic Cipher',
    iconAsset: AppAssets.awardForLevel(2),
    description: 'Mastered Level 2 puzzle sequences',
    gradientColors: const [Color(0xFF22D3EE), Color(0xFF3B82F6)],
  ),
  AwardBadge(
    level: 3,
    title: 'Matrix Cube',
    iconAsset: AppAssets.awardForLevel(3),
    description: 'Solved Level 3 isometric logic blocks',
    gradientColors: const [Color(0xFFC084FC), Color(0xFF6366F1)],
  ),
  AwardBadge(
    level: 4,
    title: 'Neural Flash',
    iconAsset: AppAssets.awardForLevel(4),
    description: 'Discharged Level 4 high-voltage reasoning',
    gradientColors: const [Color(0xFFFDE047), Color(0xFFF59E0B)],
  ),
  AwardBadge(
    level: 5,
    title: 'Synapse Spark',
    iconAsset: AppAssets.awardForLevel(5),
    description: 'Illuminated Level 5 cognitive breakthroughs',
    gradientColors: const [Color(0xFFFCD34D), Color(0xFFEAB308)],
  ),
  AwardBadge(
    level: 6,
    title: 'Arithmetic Matrix',
    iconAsset: AppAssets.awardForLevel(6),
    description: 'Calculated Level 6 cyber theorems',
    gradientColors: const [Color(0xFF60A5FA), Color(0xFF4F46E5)],
  ),
  AwardBadge(
    level: 7,
    title: 'Golden Sovereign',
    iconAsset: AppAssets.awardForLevel(7),
    description: 'Minted Level 7 golden arithmetic ratios',
    gradientColors: const [Color(0xFFFACC15), Color(0xFFD97706)],
  ),
  AwardBadge(
    level: 8,
    title: 'Daily Chronicler',
    iconAsset: AppAssets.awardForLevel(8),
    description: 'Completed Level 8 calendar challenges',
    gradientColors: const [Color(0xFF38BDF8), Color(0xFF0891B2)],
  ),
  AwardBadge(
    level: 9,
    title: 'Bullseye Marksman',
    iconAsset: AppAssets.awardForLevel(9),
    description: 'Scored Level 9 pinpoint precision equations',
    gradientColors: const [Color(0xFFF87171), Color(0xFFE11D48)],
  ),
  AwardBadge(
    level: 10,
    title: 'Cosmic Ascendant',
    iconAsset: AppAssets.awardForLevel(10),
    description: 'Launched Level 10 supersonic ascension',
    gradientColors: const [Color(0xFFFB923C), Color(0xFFDC2626)],
  ),
  AwardBadge(
    level: 11,
    title: 'Aegis Defender',
    iconAsset: AppAssets.awardForLevel(11),
    description: 'Fortified Level 11 shield defenses',
    gradientColors: const [Color(0xFF22D3EE), Color(0xFF14B8A6)],
  ),
  AwardBadge(
    level: 12,
    title: 'Supernova Burst',
    iconAsset: AppAssets.awardForLevel(12),
    description: 'Ignited Level 12 blazing solve streaks',
    gradientColors: const [Color(0xFFF97316), Color(0xFFE11D48)],
  ),
  AwardBadge(
    level: 13,
    title: 'Grand Vault',
    iconAsset: AppAssets.awardForLevel(13),
    description: 'Unwrapped Level 13 mystery treasuries',
    gradientColors: const [Color(0xFFF472B6), Color(0xFF9333EA)],
  ),
  AwardBadge(
    level: 14,
    title: 'Vault Keymaster',
    iconAsset: AppAssets.awardForLevel(14),
    description: 'Unlocked Level 14 secret vault doors',
    gradientColors: const [Color(0xFFFBBF24), Color(0xFFEAB308)],
  ),
  AwardBadge(
    level: 15,
    title: 'Diamond Mind',
    iconAsset: AppAssets.awardForLevel(15),
    description: 'Faceted Level 15 flawless math perfection',
    gradientColors: const [Color(0xFF67E8F9), Color(0xFF2563EB)],
  ),
  AwardBadge(
    level: 16,
    title: 'Victory Chime',
    iconAsset: AppAssets.awardForLevel(16),
    description: 'Rang the Level 16 victory bell',
    gradientColors: const [Color(0xFFFACC15), Color(0xFFF59E0B)],
  ),
  AwardBadge(
    level: 17,
    title: 'Celestial Starlight',
    iconAsset: AppAssets.awardForLevel(17),
    description: 'Attained Level 17 astral mastery',
    gradientColors: const [Color(0xFFFCD34D), Color(0xFFFACC15)],
  ),
  AwardBadge(
    level: 18,
    title: 'Omni Sphere',
    iconAsset: AppAssets.awardForLevel(18),
    description: 'Harmonized Level 18 multidimensional orbits',
    gradientColors: const [Color(0xFF2DD4BF), Color(0xFF0891B2)],
  ),
  AwardBadge(
    level: 19,
    title: 'Titan Battleaxe',
    iconAsset: AppAssets.awardForLevel(19),
    description: 'Cleaved Level 19 titan challenges',
    gradientColors: const [Color(0xFFFB7185), Color(0xFFDC2626)],
  ),
  AwardBadge(
    level: 20,
    title: 'Cipher Lockbreaker',
    iconAsset: AppAssets.awardForLevel(20),
    description: 'Decrypted Level 20 heavy cipher locks',
    gradientColors: const [Color(0xFFFBBF24), Color(0xFFEA580C)],
  ),
  AwardBadge(
    level: 21,
    title: 'Grandmaster Bishop',
    iconAsset: AppAssets.awardForLevel(21),
    description: 'Outplayed Level 21 tactical chessboards',
    gradientColors: const [Color(0xFF818CF8), Color(0xFF7C3AED)],
  ),
  AwardBadge(
    level: 22,
    title: 'Medal of Honor',
    iconAsset: AppAssets.awardForLevel(22),
    description: 'Decorated with Level 22 medal of courage',
    gradientColors: const [Color(0xFFFACC15), Color(0xFFF59E0B)],
  ),
  AwardBadge(
    level: 23,
    title: 'Imperial Sovereign',
    iconAsset: AppAssets.awardForLevel(23),
    description: 'Crowned sovereign of Level 23 math realm',
    gradientColors: const [Color(0xFFFCD34D), Color(0xFFEAB308)],
  ),
  AwardBadge(
    level: 24,
    title: 'Champion Cup',
    iconAsset: AppAssets.awardForLevel(24),
    description: 'Raised Level 24 golden championship cup',
    gradientColors: const [Color(0xFFFACC15), Color(0xFFD97706)],
  ),
  AwardBadge(
    level: 25,
    title: 'Apex Grandmaster',
    iconAsset: AppAssets.awardForLevel(25),
    description: 'Ascended to the supreme Level 25 apex throne',
    gradientColors: const [Color(0xFFFCD34D), Color(0xFFFACC15)],
  ),
]);

/// Exact In-App Purchase (IAP) catalog matching `src/services/purchaseService.ts`.
const List<IapProduct> iapCatalog = [
  IapProduct(
    id: 'newromath_pro_noads',
    type: 'pro',
    amount: 1,
    name: 'PRO VIP Lifetime Pass',
    defaultPrice: r'$1.99',
    badge: 'POPULAR VIP',
    emojiIcon: '👑',
    isConsumable: false,
    description:
        'Permanent Ad-Free Experience + 2,000 Gold Coins + 50 Gems + VIP Crown Status',
  ),
  IapProduct(
    id: 'coins_1500',
    type: 'coins',
    amount: 1500,
    name: 'Handful of Gold',
    defaultPrice: r'$0.49',
    iconAsset: AppAssets.goldCoin,
    isConsumable: true,
    gemsCost: 10,
    description: '1,500 Gold Coins for solving hints and entering missions',
  ),
  IapProduct(
    id: 'coins_5000',
    type: 'coins',
    amount: 5000,
    name: 'Pouch of Gold',
    defaultPrice: r'$0.99',
    badge: 'POPULAR',
    iconAsset: 'assets/images/awards/award_lvl_07.webp',
    isConsumable: true,
    gemsCost: 25,
    description: '5,000 Gold Coins with bonus value',
  ),
  IapProduct(
    id: 'coins_15000',
    type: 'coins',
    amount: 15000,
    name: 'Chest of Gold',
    defaultPrice: r'$1.99',
    badge: 'BEST VALUE',
    iconAsset: AppAssets.chest3d,
    isConsumable: true,
    gemsCost: 65,
    description: '15,000 Gold Coins for serious math masters',
  ),
  IapProduct(
    id: 'coins_45000',
    type: 'coins',
    amount: 45000,
    name: 'Vault of Gold',
    defaultPrice: r'$3.99',
    badge: 'MEGA PACK',
    iconAsset: 'assets/images/awards/award_lvl_20.webp',
    isConsumable: true,
    gemsCost: 160,
    description: '45,000 Gold Coins - unlimited puzzle unlocking',
  ),
  IapProduct(
    id: 'gems_50',
    type: 'gems',
    amount: 50,
    name: 'Pile of Gems',
    defaultPrice: r'$0.49',
    iconAsset: AppAssets.gem,
    isConsumable: true,
    description: '50 Premium Diamonds for streak recovery and power-ups',
  ),
  IapProduct(
    id: 'gems_200',
    type: 'gems',
    amount: 200,
    name: 'Crystal Casket',
    defaultPrice: r'$0.99',
    badge: 'HOT',
    iconAsset: 'assets/images/awards/award_lvl_18.webp',
    isConsumable: true,
    description: '200 Premium Diamonds with extra bonus gems',
  ),
  IapProduct(
    id: 'gems_600',
    type: 'gems',
    amount: 600,
    name: 'Crown of Gems',
    defaultPrice: r'$2.49',
    badge: 'POPULAR',
    iconAsset: 'assets/images/awards/award_lvl_23.webp',
    isConsumable: true,
    description: '600 Premium Diamonds for elite puzzle solvers',
  ),
  IapProduct(
    id: 'gems_2000',
    type: 'gems',
    amount: 2000,
    name: 'Diamond Mountain',
    defaultPrice: r'$4.99',
    badge: 'BEST DEAL',
    iconAsset: 'assets/images/awards/award_lvl_15.webp',
    isConsumable: true,
    description: '2,000 Premium Diamonds - the ultimate master treasury',
  ),
];

/// Featured Top Champions reel on the Home Dashboard.
final List<ChampionEntry> topChampions = List<ChampionEntry>.unmodifiable([
  ChampionEntry(
    id: 1,
    name: 'Alex_Prime',
    country: 'United States',
    flag: '🇺🇸',
    rank: 'Rank #1',
    rankNum: 1,
    levelsCompleted: 25,
    levelDisplay: '25/25',
    iconAsset: AppAssets.awardForLevel(25),
    coins: '50,000',
    gems: '250',
    primaryColor: const Color(0xFF1D4F9E),
    secondaryColor: const Color(0xFFFBBF24),
    glowColor: const Color(0x73F59E0B),
  ),
  ChampionEntry(
    id: 2,
    name: 'Elena_Cyber',
    country: 'Japan',
    flag: '🇯🇵',
    rank: 'Rank #2',
    rankNum: 2,
    levelsCompleted: 23,
    levelDisplay: '23/25',
    iconAsset: AppAssets.awardForLevel(23),
    coins: '35,000',
    gems: '180',
    primaryColor: const Color(0xFF51239E),
    secondaryColor: const Color(0xFFC084FC),
    glowColor: const Color(0x73A855F7),
  ),
  ChampionEntry(
    id: 3,
    name: 'Cipher_Nova',
    country: 'Germany',
    flag: '🇩🇪',
    rank: 'Rank #3',
    rankNum: 3,
    levelsCompleted: 21,
    levelDisplay: '21/25',
    iconAsset: AppAssets.awardForLevel(21),
    coins: '25,000',
    gems: '120',
    primaryColor: const Color(0xFF0E6952),
    secondaryColor: const Color(0xFF34D399),
    glowColor: const Color(0x7310B981),
  ),
  ChampionEntry(
    id: 4,
    name: 'Vortex_99',
    country: 'United Kingdom',
    flag: '🇬🇧',
    rank: 'Rank #4',
    rankNum: 4,
    levelsCompleted: 19,
    levelDisplay: '19/25',
    iconAsset: AppAssets.awardForLevel(19),
    coins: '18,000',
    gems: '90',
    primaryColor: const Color(0xFF8C3D14),
    secondaryColor: const Color(0xFFFB923C),
    glowColor: const Color(0x73F97316),
  ),
  ChampionEntry(
    id: 5,
    name: 'Aria_Math',
    country: 'Canada',
    flag: '🇨🇦',
    rank: 'Rank #5',
    rankNum: 5,
    levelsCompleted: 15,
    levelDisplay: '15/25',
    iconAsset: AppAssets.awardForLevel(15),
    coins: '12,000',
    gems: '60',
    primaryColor: const Color(0xFF105A96),
    secondaryColor: const Color(0xFF22D3EE),
    glowColor: const Color(0x7306B6D4),
  ),
]);

/// Bot score thresholds used to compute local player rank when offline.
const List<int> leaderboardBotScores = [
  2490680,
  2385400,
  2290150,
  2250680,
  2187730,
  2128024,
  2097730,
  2053538,
];

/// Fallback global leaderboard entries used when offline or Firebase is empty.
final List<LeaderboardEntry> fallbackLeaderboard =
    List<LeaderboardEntry>.unmodifiable([
  LeaderboardEntry(
    rank: 1,
    playerId: 'bot_1',
    name: 'RW',
    country: 'United Kingdom',
    flag: '🇬🇧',
    avatarAsset: AppAssets.awardForLevel(25),
    level: 25,
    xp: 25000,
    score: 2490680,
    coins: 50000,
    isProUser: true,
    title: 'Apex Sovereign',
  ),
  LeaderboardEntry(
    rank: 2,
    playerId: 'bot_2',
    name: 'Guest-7MUET',
    country: 'Laos',
    flag: '🇱🇦',
    avatarAsset: AppAssets.awardForLevel(23),
    level: 24,
    xp: 23000,
    score: 2385400,
    coins: 42000,
    isProUser: true,
    title: 'Imperial Master',
  ),
  LeaderboardEntry(
    rank: 3,
    playerId: 'bot_3',
    name: 'Guest-JFTL4',
    country: 'Germany',
    flag: '🇩🇪',
    avatarAsset: AppAssets.awardForLevel(24),
    level: 23,
    xp: 21500,
    score: 2290150,
    coins: 36000,
    isProUser: false,
    title: 'Champion Elite',
  ),
  LeaderboardEntry(
    rank: 4,
    playerId: 'bot_4',
    name: 'Top',
    country: 'Hong Kong',
    flag: '🇭🇰',
    avatarAsset: AppAssets.awardForLevel(22),
    level: 22,
    xp: 19800,
    score: 2250680,
    coins: 30000,
    isProUser: false,
    title: 'Grandmaster IV',
  ),
  LeaderboardEntry(
    rank: 5,
    playerId: 'bot_5',
    name: 'Guest-Y9PMW',
    country: 'United States',
    flag: '🇺🇸',
    avatarAsset: AppAssets.awardForLevel(20),
    level: 21,
    xp: 18500,
    score: 2187730,
    coins: 27000,
    isProUser: false,
    title: 'Cyber Ace I',
  ),
  LeaderboardEntry(
    rank: 6,
    playerId: 'bot_6',
    name: 'Guest-N45T5',
    country: 'South Africa',
    flag: '🇿🇦',
    avatarAsset: AppAssets.awardForLevel(18),
    level: 20,
    xp: 17200,
    score: 2128024,
    coins: 24000,
    isProUser: false,
    title: 'Quantum Elite II',
  ),
  LeaderboardEntry(
    rank: 7,
    playerId: 'bot_7',
    name: 'So So',
    country: 'Hong Kong',
    flag: '🇭🇰',
    avatarAsset: AppAssets.awardForLevel(16),
    level: 19,
    xp: 16100,
    score: 2097730,
    coins: 21500,
    isProUser: false,
    title: 'Neural Legend III',
  ),
  LeaderboardEntry(
    rank: 8,
    playerId: 'bot_8',
    name: 'Guest-FCNUD',
    country: 'United States',
    flag: '🇺🇸',
    avatarAsset: AppAssets.awardForLevel(15),
    level: 18,
    xp: 15000,
    score: 2053538,
    coins: 19000,
    isProUser: false,
    title: 'Matrix Master',
  ),
]);

/// All 30 selectable countries in the Player Profile modal.
const List<PlayerCountry> playerCountries = [
  PlayerCountry(code: 'US', name: 'United States', flag: '🇺🇸'),
  PlayerCountry(code: 'GB', name: 'United Kingdom', flag: '🇬🇧'),
  PlayerCountry(code: 'CA', name: 'Canada', flag: '🇨🇦'),
  PlayerCountry(code: 'AU', name: 'Australia', flag: '🇦🇺'),
  PlayerCountry(code: 'DE', name: 'Germany', flag: '🇩🇪'),
  PlayerCountry(code: 'FR', name: 'France', flag: '🇫🇷'),
  PlayerCountry(code: 'JP', name: 'Japan', flag: '🇯🇵'),
  PlayerCountry(code: 'IN', name: 'India', flag: '🇮🇳'),
  PlayerCountry(code: 'BD', name: 'Bangladesh', flag: '🇧🇩'),
  PlayerCountry(code: 'BR', name: 'Brazil', flag: '🇧🇷'),
  PlayerCountry(code: 'ES', name: 'Spain', flag: '🇪🇸'),
  PlayerCountry(code: 'IT', name: 'Italy', flag: '🇮🇹'),
  PlayerCountry(code: 'KR', name: 'South Korea', flag: '🇰🇷'),
  PlayerCountry(code: 'CN', name: 'China', flag: '🇨🇳'),
  PlayerCountry(code: 'NL', name: 'Netherlands', flag: '🇳🇱'),
  PlayerCountry(code: 'MX', name: 'Mexico', flag: '🇲🇽'),
  PlayerCountry(code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪'),
  PlayerCountry(code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦'),
  PlayerCountry(code: 'SG', name: 'Singapore', flag: '🇸🇬'),
  PlayerCountry(code: 'SE', name: 'Sweden', flag: '🇸🇪'),
  PlayerCountry(code: 'CH', name: 'Switzerland', flag: '🇨🇭'),
  PlayerCountry(code: 'TR', name: 'Turkey', flag: '🇹🇷'),
  PlayerCountry(code: 'ZA', name: 'South Africa', flag: '🇿🇦'),
  PlayerCountry(code: 'PK', name: 'Pakistan', flag: '🇵🇰'),
  PlayerCountry(code: 'ID', name: 'Indonesia', flag: '🇮🇩'),
  PlayerCountry(code: 'MY', name: 'Malaysia', flag: '🇲🇾'),
  PlayerCountry(code: 'PH', name: 'Philippines', flag: '🇵🇭'),
  PlayerCountry(code: 'VN', name: 'Vietnam', flag: '🇻🇳'),
  PlayerCountry(code: 'NZ', name: 'New Zealand', flag: '🇳🇿'),
  PlayerCountry(code: 'IE', name: 'Ireland', flag: '🇮🇪'),
];

/// Starter puzzle history archive records.
final List<PuzzleRecord> defaultPuzzleRecords =
    List<PuzzleRecord>.unmodifiable([
  PuzzleRecord(
    id: 'rec-1',
    equation: '(12 + 8) × 2 - 6 = 34',
    timeLabel: 'Today',
    level: 3,
    mode: 'Main Game',
    solved: true,
    xp: 45,
    timestampMs: DateTime.now().millisecondsSinceEpoch - 3600000,
  ),
  PuzzleRecord(
    id: 'rec-2',
    equation: '(15 - 7) × 3 = 24',
    timeLabel: 'Today',
    level: 2,
    mode: 'Main Game',
    solved: true,
    xp: 35,
    timestampMs: DateTime.now().millisecondsSinceEpoch - 7200000,
  ),
  PuzzleRecord(
    id: 'rec-3',
    equation: '8 + 6 ÷ 2 = 11',
    timeLabel: 'Yesterday',
    level: 1,
    mode: 'Main Game',
    solved: true,
    xp: 25,
    timestampMs: DateTime.now().millisecondsSinceEpoch - 86400000,
  ),
  PuzzleRecord(
    id: 'rec-4',
    equation: '(9 × 4) ÷ 2 = 38',
    timeLabel: 'Yesterday',
    level: 3,
    mode: 'Daily Matrix',
    solved: true,
    xp: 50,
    timestampMs: DateTime.now().millisecondsSinceEpoch - 90000000,
  ),
  PuzzleRecord(
    id: 'rec-5',
    equation: '(14 - 7) × 2 = 14',
    timeLabel: 'Dec 12',
    level: 2,
    mode: 'Main Game',
    solved: false,
    xp: 0,
    timestampMs: DateTime.now().millisecondsSinceEpoch - 172800000,
  ),
  PuzzleRecord(
    id: 'rec-6',
    equation: '12 + 3 ÷ 5 = 9',
    timeLabel: 'Dec 11',
    level: 1,
    mode: 'Daily Matrix',
    solved: false,
    xp: 0,
    timestampMs: DateTime.now().millisecondsSinceEpoch - 259200000,
  ),
]);

const List<String> defaultSavedPuzzleIds = ['rec-1', 'rec-2'];

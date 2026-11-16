import 'package:flutter/material.dart';

/// All 21 screen routes supported by NewroMath, matching `src/legacyApp.jsx`.
enum AppScreen {
  splash,
  onboarding,
  home,
  categories,
  levels,
  game,
  hint,
  correct,
  wrong,
  daily,
  dailyGame,
  battle,
  stats,
  achievements,
  leaderboard,
  history,
  profile,
  settings,
  help,
  offline,
  rewards,
}

/// Page transition direction for the custom route animator.
enum TransitionDirection {
  forward,
  back,
  hint,
  fade,
}

/// Puzzle difficulty tiers.
enum PuzzleDifficulty {
  easy,
  medium,
  hard,
}

/// Cell types inside a 5x5 Cross-Math puzzle grid.
enum CrossmathCellType {
  empty,
  number,
  operatorSymbol,
  equals,
  result,
  blank,
}

/// Resource entry cost (coins + gems) required to launch a campaign level.
@immutable
class LevelEntryCost {
  const LevelEntryCost({
    required this.coins,
    required this.gems,
  });

  final int coins;
  final int gems;
}

/// Static configuration for one of the 25 campaign mission levels.
@immutable
class LevelConfig {
  const LevelConfig({
    required this.num,
    required this.title,
    required this.difficulty,
    required this.range,
    required this.xp,
    required this.coins,
    required this.tag,
    required this.tier,
    required this.cost,
    required this.stageCount,
    required this.targetXp,
    required this.artAsset,
  });

  final int num;
  final String title;
  final String difficulty; // 'Easy', 'Medium', 'Hard'
  final String range;
  final int xp;
  final int coins;
  final String tag;
  final PuzzleDifficulty tier;
  final LevelEntryCost cost;
  final int stageCount;
  final int targetXp;
  final String artAsset;
}

/// Dynamic procedural generation difficulty profile per level & stage.
@immutable
class StageDifficultyProfile {
  const StageDifficultyProfile({
    required this.tierName,
    required this.mode,
    required this.blankCount,
    required this.trayCount,
    required this.minVal,
    required this.maxVal,
    this.minM = 2,
    this.maxM = 5,
    this.minD = 2,
    this.maxD = 3,
    this.progress = 0.0,
  });

  final String tierName;
  final String mode; // 'add', 'sub', 'sub_both', 'mul', 'div', 'mul_div', 'div_mul'
  final int blankCount;
  final int trayCount;
  final int minVal;
  final int maxVal;
  final int minM;
  final int maxM;
  final int minD;
  final int maxD;
  final double progress;
}

/// Unlockable 3D trophy/avatar award badge tied to each of the 25 levels.
@immutable
class AwardBadge {
  const AwardBadge({
    required this.level,
    required this.title,
    required this.iconAsset,
    required this.description,
    required this.gradientColors,
  });

  final int level;
  final String title;
  final String iconAsset;
  final String description;
  final List<Color> gradientColors;
}

/// Featured champion entry for the Home "Top Champions" sliding reel.
@immutable
class ChampionEntry {
  const ChampionEntry({
    required this.id,
    required this.name,
    required this.country,
    required this.flag,
    required this.rank,
    required this.rankNum,
    required this.levelsCompleted,
    required this.levelDisplay,
    required this.iconAsset,
    required this.coins,
    required this.gems,
    required this.primaryColor,
    required this.secondaryColor,
    required this.glowColor,
  });

  final int id;
  final String name;
  final String country;
  final String flag;
  final String rank;
  final int rankNum;
  final int levelsCompleted;
  final String levelDisplay;
  final String iconAsset;
  final String coins;
  final String gems;
  final Color primaryColor;
  final Color secondaryColor;
  final Color glowColor;
}

/// Global leaderboard entry (remote Firebase RTDB/Firestore or fallback).
@immutable
class LeaderboardEntry {
  const LeaderboardEntry({
    required this.rank,
    required this.playerId,
    required this.name,
    required this.country,
    required this.flag,
    required this.avatarAsset,
    required this.level,
    required this.xp,
    required this.score,
    required this.coins,
    required this.isProUser,
    required this.title,
    this.isCurrentUser = false,
  });

  final int rank;
  final String playerId;
  final String name;
  final String country;
  final String flag;
  final String avatarAsset;
  final int level;
  final int xp;
  final int score;
  final int coins;
  final bool isProUser;
  final String title;
  final bool isCurrentUser;
}

/// One fillable answer slot in a Cross-Math puzzle grid.
@immutable
class CrossmathSlot {
  const CrossmathSlot({
    required this.slotIndex,
    required this.row,
    required this.column,
    required this.answer,
  });

  final int slotIndex;
  final int row;
  final int column;
  final int answer;
}

/// Immutable cell model inside a Cross-Math grid.
@immutable
class CrossmathCell {
  const CrossmathCell({
    required this.id,
    required this.row,
    required this.col,
    required this.type,
    this.value,
    this.solution,
    this.isGiven = false,
    this.hasStar = false,
    this.slotIndex,
  });

  final String id;
  final int row;
  final int col;
  final CrossmathCellType type;
  final String? value;
  final int? solution;
  final bool isGiven;
  final bool hasStar;
  final int? slotIndex;
}

/// Complete generated Cross-Math puzzle for a given level/stage/seed.
@immutable
class CrossmathPuzzle {
  const CrossmathPuzzle({
    required this.id,
    required this.seed,
    required this.cols,
    required this.rowsCount,
    required this.level,
    required this.stage,
    required this.totalStages,
    required this.stageDifficulty,
    required this.solvedText,
    required this.hintStep,
    required this.slots,
    required this.rows,
    required this.numbers,
  });

  final String id;
  final int seed;
  final int cols;
  final int rowsCount;
  final int level;
  final int stage;
  final int totalStages;
  final String stageDifficulty;
  final String solvedText;
  final String hintStep;
  final List<CrossmathSlot> slots;
  final List<List<CrossmathCell>> rows;
  final List<int> numbers;

  static const CrossmathPuzzle empty = CrossmathPuzzle(
    id: 'empty',
    seed: 0,
    cols: 5,
    rowsCount: 5,
    level: 1,
    stage: 1,
    totalStages: 10,
    stageDifficulty: 'INTRO ✦',
    solvedText: '',
    hintStep: '',
    slots: [],
    rows: [],
    numbers: [],
  );
}

/// Operator pair used in a Daily Challenge matrix row or column link.
@immutable
class DailyEquationTemplate {
  const DailyEquationTemplate({
    required this.id,
    required this.op1,
    required this.op2,
  });

  final String id;
  final String op1;
  final String op2;

  int evaluate(int x, int y, int z) {
    int mid;
    switch (op1) {
      case '+':
        mid = x + y;
      case '−':
      case '-':
        mid = x - y;
      case '×':
      case '*':
        mid = x * y;
      case '÷':
      case '/':
        mid = y == 0 ? 0 : x ~/ y;
      default:
        mid = x + y;
    }
    switch (op2) {
      case '+':
        return mid + z;
      case '−':
      case '-':
        return mid - z;
      case '×':
      case '*':
        return mid * z;
      case '÷':
      case '/':
        return z == 0 ? 0 : mid ~/ z;
      default:
        return mid + z;
    }
  }
}

/// Daily Challenge 3x3 interconnected arithmetic matrix puzzle.
@immutable
class DailyChallengePuzzle {
  const DailyChallengePuzzle({
    required this.year,
    required this.month,
    required this.day,
    required this.protocolId,
    required this.difficulty,
    required this.rowAlpha,
    required this.rowBeta,
    required this.rowGamma,
    required this.colLink,
    required this.targetAlpha,
    required this.targetBeta,
    required this.targetGamma,
    required this.targetLink,
    required this.answers,
    required this.trayNumbers,
  });

  final int year;
  final int month;
  final int day;
  final int protocolId;
  final String difficulty;
  final DailyEquationTemplate rowAlpha;
  final DailyEquationTemplate rowBeta;
  final DailyEquationTemplate rowGamma;
  final DailyEquationTemplate colLink;
  final int targetAlpha;
  final int targetBeta;
  final int targetGamma;
  final int targetLink;
  final Map<int, int> answers;
  final List<int> trayNumbers;
}

/// Google Play In-App Purchase product definition.
@immutable
class IapProduct {
  const IapProduct({
    required this.id,
    required this.type,
    required this.amount,
    required this.name,
    required this.defaultPrice,
    required this.isConsumable,
    required this.description,
    this.badge,
    this.emojiIcon,
    this.iconAsset,
    this.gemsCost,
  });

  final String id;
  final String type; // 'pro' | 'coins' | 'gems'
  final int amount;
  final String name;
  final String defaultPrice;
  final String? badge;
  final String? emojiIcon;
  final String? iconAsset;
  final bool isConsumable;
  final int? gemsCost;
  final String description;
}

/// Rewarded Ad payload metadata.
@immutable
class AdRewardInfo {
  const AdRewardInfo({
    required this.type,
    required this.amount,
    required this.title,
    this.coinAmount = 0,
    this.gemAmount = 0,
  });

  final String type; // 'coins' | 'gems' | 'hint' | 'time' | 'both' | 'jackpot'
  final int amount;
  final String title;
  final int coinAmount;
  final int gemAmount;
}

/// Single solved/attempted puzzle history entry.
@immutable
class PuzzleRecord {
  const PuzzleRecord({
    required this.id,
    required this.equation,
    required this.timeLabel,
    required this.level,
    required this.mode,
    required this.solved,
    required this.xp,
    required this.timestampMs,
    this.stage = 1,
  });

  final String id;
  final String equation;
  final String timeLabel;
  final int level;
  final int stage;
  final String mode; // 'Main Game' | 'Daily Matrix'
  final bool solved;
  final int xp;
  final int timestampMs;

  Map<String, dynamic> toJson() => {
        'id': id,
        'eq': equation,
        'time': timeLabel,
        'level': level,
        'stage': stage,
        'mode': mode,
        'solved': solved,
        'xp': xp,
        'date': timestampMs,
      };

  factory PuzzleRecord.fromJson(Map<String, dynamic> json) {
    return PuzzleRecord(
      id: (json['id'] ?? '').toString(),
      equation: (json['eq'] ?? json['equation'] ?? '').toString(),
      timeLabel: (json['time'] ?? json['timeLabel'] ?? 'Recent').toString(),
      level: (json['level'] as num?)?.toInt() ?? 1,
      stage: (json['stage'] as num?)?.toInt() ?? 1,
      mode: (json['mode'] ?? 'Main Game').toString(),
      solved: json['solved'] == true,
      xp: (json['xp'] as num?)?.toInt() ?? 0,
      timestampMs: (json['date'] as num?)?.toInt() ??
          (json['timestampMs'] as num?)?.toInt() ??
          0,
    );
  }
}

/// Calendar day status for the Daily Challenge season grid.
@immutable
class DailyDayRecord {
  const DailyDayRecord({
    required this.year,
    required this.month,
    required this.day,
    required this.isCompleted,
    required this.isToday,
    required this.isFuture,
    required this.isMissed,
  });

  final int year;
  final int month;
  final int day;
  final bool isCompleted;
  final bool isToday;
  final bool isFuture;
  final bool isMissed;
}

/// Summary of the most recent completed puzzle stage.
@immutable
class GameResultSummary {
  const GameResultSummary({
    required this.level,
    required this.stage,
    required this.totalStages,
    required this.levelCleared,
    required this.solvedText,
    required this.coinsEarned,
    required this.gemsEarned,
    required this.xpEarned,
  });

  final int level;
  final int stage;
  final int totalStages;
  final bool levelCleared;
  final String solvedText;
  final int coinsEarned;
  final int gemsEarned;
  final int xpEarned;

  static const GameResultSummary empty = GameResultSummary(
    level: 1,
    stage: 1,
    totalStages: 10,
    levelCleared: false,
    solvedText: '',
    coinsEarned: 0,
    gemsEarned: 0,
    xpEarned: 0,
  );
}

/// State payload for the Insufficient Funds modal.
@immutable
class InsufficientFundsInfo {
  const InsufficientFundsInfo({
    this.isOpen = false,
    this.targetLevel = 1,
    this.cost = const LevelEntryCost(coins: 100, gems: 10),
    this.missingCoins = 0,
    this.missingGems = 0,
  });

  final bool isOpen;
  final int targetLevel;
  final LevelEntryCost cost;
  final int missingCoins;
  final int missingGems;
}

/// State payload for unlocking a missed/replay Daily Challenge day via Ad/Coins.
@immutable
class DailyAdPromptInfo {
  const DailyAdPromptInfo({
    this.isOpen = false,
    this.targetDay = 1,
    this.fee = 50,
    this.reason = 'missed_day',
  });

  final bool isOpen;
  final int targetDay;
  final int fee;
  final String reason;
}

/// Country choice for Player Profile.
@immutable
class PlayerCountry {
  const PlayerCountry({
    required this.code,
    required this.name,
    required this.flag,
  });

  final String code;
  final String name;
  final String flag;
}

/// Persistent user gameplay & accessibility preferences.
@immutable
class PlayerSettings {
  const PlayerSettings({
    this.isDarkMode = false,
    this.soundEnabled = true,
    this.hapticsEnabled = true,
    this.notificationsEnabled = true,
    this.timerEnabled = true,
    this.explanationEnabled = true,
    this.autoSubmitEnabled = false,
    this.largeFontEnabled = true,
    this.divisionSymbol = '÷',
  });

  final bool isDarkMode;
  final bool soundEnabled;
  final bool hapticsEnabled;
  final bool notificationsEnabled;
  final bool timerEnabled;
  final bool explanationEnabled;
  final bool autoSubmitEnabled;
  final bool largeFontEnabled;
  final String divisionSymbol; // '÷' | '/' | ':'

  PlayerSettings copyWith({
    bool? isDarkMode,
    bool? soundEnabled,
    bool? hapticsEnabled,
    bool? notificationsEnabled,
    bool? timerEnabled,
    bool? explanationEnabled,
    bool? autoSubmitEnabled,
    bool? largeFontEnabled,
    String? divisionSymbol,
  }) {
    return PlayerSettings(
      isDarkMode: isDarkMode ?? this.isDarkMode,
      soundEnabled: soundEnabled ?? this.soundEnabled,
      hapticsEnabled: hapticsEnabled ?? this.hapticsEnabled,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      timerEnabled: timerEnabled ?? this.timerEnabled,
      explanationEnabled: explanationEnabled ?? this.explanationEnabled,
      autoSubmitEnabled: autoSubmitEnabled ?? this.autoSubmitEnabled,
      largeFontEnabled: largeFontEnabled ?? this.largeFontEnabled,
      divisionSymbol: divisionSymbol ?? this.divisionSymbol,
    );
  }
}

/// Persistent player profile & VIP identity.
@immutable
class PlayerProfile {
  const PlayerProfile({
    required this.playerId,
    required this.name,
    required this.country,
    required this.countryFlag,
    this.phone = '',
    this.email = '',
    this.equippedAvatarAsset = 'assets/images/icon_robot_3d.webp',
    this.isProUser = false,
  });

  final String playerId;
  final String name;
  final String country;
  final String countryFlag;
  final String phone;
  final String email;
  final String equippedAvatarAsset;
  final bool isProUser;

  PlayerProfile copyWith({
    String? playerId,
    String? name,
    String? country,
    String? countryFlag,
    String? phone,
    String? email,
    String? equippedAvatarAsset,
    bool? isProUser,
  }) {
    return PlayerProfile(
      playerId: playerId ?? this.playerId,
      name: name ?? this.name,
      country: country ?? this.country,
      countryFlag: countryFlag ?? this.countryFlag,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      equippedAvatarAsset: equippedAvatarAsset ?? this.equippedAvatarAsset,
      isProUser: isProUser ?? this.isProUser,
    );
  }
}

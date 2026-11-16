import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Theme configuration for a single mission level card in the 2-column grid.
@immutable
class LevelCardTheme {
  const LevelCardTheme({
    required this.borderColor,
    required this.glowColor,
    required this.cardGradientColors,
    required this.badgeBgColor,
    required this.badgeBorderColor,
    required this.badgeTextColor,
    required this.buttonGradientColors,
    required this.buttonTextColor,
  });

  final Color borderColor;
  final Color glowColor;
  final List<Color> cardGradientColors;
  final Color badgeBgColor;
  final Color badgeBorderColor;
  final Color badgeTextColor;
  final List<Color> buttonGradientColors;
  final Color buttonTextColor;
}

/// Exact color palette, gradients, shadows, and typography for NewroMath.
///
/// Mirrors the visual design system in `index.html` and `src/legacyApp.jsx`:
/// - Primary navy stage surfaces (`#173272` / `#183278`)
/// - 3-stop sci-fi game background & cyan header gradients
/// - Neon cyan, emerald, gold/amber, cobalt, and magenta accents
/// - Cormorant Garamond display/serif typography with tabular lining figures
class AppTheme {
  AppTheme._();

  // Core Navy Stage Colors
  static const Color navyStage = Color(0xFF173272);
  static const Color navyRoot = Color(0xFF183278);
  static const Color navyDeep = Color(0xFF0E1D47);
  static const Color navyTop = Color(0xFF1B357D);
  static const Color navyMid = Color(0xFF162B69);
  static const Color navyBottom = Color(0xFF0F1E4D);
  static const Color navyCardDark = Color(0xFF0A1638);
  static const Color navyCardMid = Color(0xFF152758);
  static const Color navyGlass = Color(0xFF0D2254);

  // Header Gradient Colors
  static const Color headerTop = Color(0xFF1686B5);
  static const Color headerMid = Color(0xFF1573A8);
  static const Color headerBottom = Color(0xFF1B357D);

  // Primary Neon Accents
  static const Color cyanNeon = Color(0xFF00E5FF);
  static const Color cyanBright = Color(0xFF00D4FF);
  static const Color cyanSky = Color(0xFF38BDF8);
  static const Color cyanLight = Color(0xFFBAE6FD);
  static const Color bluePrimary = Color(0xFF2D63D8);
  static const Color blueRoyal = Color(0xFF1B4394);
  static const Color blueDeep = Color(0xFF12306D);

  // Emerald / Success Accents
  static const Color emeraldNeon = Color(0xFF00F5B4);
  static const Color emerald = Color(0xFF10B981);
  static const Color teal = Color(0xFF14B8A6);
  static const Color emeraldDark = Color(0xFF065F46);

  // Gold / Amber / Coin Accents
  static const Color goldBright = Color(0xFFFDE047);
  static const Color gold = Color(0xFFFBBF24);
  static const Color amber = Color(0xFFF59E0B);
  static const Color amberDark = Color(0xFFD97706);
  static const Color amberDeepText = Color(0xFF451A03);

  // Purple / Magenta / Rose Accents
  static const Color magenta = Color(0xFFD946EF);
  static const Color purple = Color(0xFFA855F7);
  static const Color indigo = Color(0xFF6366F1);
  static const Color rose = Color(0xFFF43F5E);
  static const Color redError = Color(0xFFEF4444);

  // Light Surface Colors (Reference / Modal Cards)
  static const Color lightCanvas = Color(0xFFF2F5FF);
  static const Color lightInk = Color(0xFF151923);
  static const Color lightMuted = Color(0xFF9299A8);

  // Gradients
  static const LinearGradient gameBackgroundGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [navyTop, navyMid, navyBottom],
    stops: [0.0, 0.5, 1.0],
  );

  static const LinearGradient headerBackgroundGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [headerTop, headerMid, headerBottom],
    stops: [0.0, 0.65, 1.0],
  );

  static const LinearGradient cyanActionGradient = LinearGradient(
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
    colors: [Color(0xFF0055FF), Color(0xFF0088FF), cyanBright],
  );

  static const LinearGradient emeraldActionGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFF34D399), emerald, Color(0xFF0D9488)],
  );

  static const LinearGradient goldActionGradient = LinearGradient(
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
    colors: [amber, gold, goldBright],
  );

  static const LinearGradient progressGradient = LinearGradient(
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
    colors: [Color(0xFF22D3EE), Color(0xFF2DD4BF), Color(0xFF34D399)],
  );

  // Shadows
  static List<BoxShadow> cyanGlowShadow([double opacity = 0.35]) => [
        BoxShadow(
          color: cyanNeon.withValues(alpha: opacity),
          blurRadius: 16,
          spreadRadius: 0,
        ),
      ];

  static List<BoxShadow> cardElevationShadow({
    Color glowColor = const Color(0x4D000000),
  }) =>
      [
        BoxShadow(
          color: glowColor,
          blurRadius: 18,
          offset: const Offset(0, 6),
        ),
        const BoxShadow(
          color: Color(0x80000000),
          blurRadius: 8,
          offset: Offset(0, 3),
        ),
      ];

  // Typography
  static const List<FontFeature> tabularLiningFeatures = [
    FontFeature.liningFigures(),
    FontFeature.tabularFigures(),
  ];

  static TextStyle displayStyle({
    double fontSize = 18,
    FontWeight fontWeight = FontWeight.w800,
    Color color = Colors.white,
    double? letterSpacing,
    double? height,
  }) {
    try {
      return GoogleFonts.cormorantGaramond(
        fontSize: fontSize,
        fontWeight: fontWeight,
        color: color,
        letterSpacing: letterSpacing,
        height: height,
      ).copyWith(fontFeatures: tabularLiningFeatures);
    } catch (_) {
      return TextStyle(
        fontFamily: 'Georgia',
        fontSize: fontSize,
        fontWeight: fontWeight,
        color: color,
        letterSpacing: letterSpacing,
        height: height,
        fontFeatures: tabularLiningFeatures,
      );
    }
  }

  static TextStyle hudNumberStyle({
    double fontSize = 14,
    Color color = Colors.white,
    FontWeight fontWeight = FontWeight.w900,
  }) {
    return TextStyle(
      fontFamily: 'monospace',
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      fontFeatures: tabularLiningFeatures,
    );
  }

  static TextStyle bodyStyle({
    double fontSize = 13,
    FontWeight fontWeight = FontWeight.w600,
    Color color = Colors.white,
    double? height,
  }) {
    return displayStyle(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      height: height,
    );
  }

  /// Returns the 6 rotating card themes (plus locked state) matching
  /// `getLevelCardTheme` in `src/legacyApp.jsx`.
  static LevelCardTheme levelCardTheme(int levelNum, {required bool isLocked}) {
    if (isLocked) {
      return const LevelCardTheme(
        borderColor: Color(0x99334155),
        glowColor: Color(0x80000000),
        cardGradientColors: [
          Color(0xFF131A33),
          Color(0xFF0D1226),
          Color(0xFF080C1A),
        ],
        badgeBgColor: Color(0xCC1E293B),
        badgeBorderColor: Color(0x9964748B),
        badgeTextColor: Color(0xFFCBD5E1),
        buttonGradientColors: [Color(0xCC1E293B), Color(0xCC1E293B)],
        buttonTextColor: Color(0xFF94A3B8),
      );
    }

    switch ((levelNum - 1) % 6) {
      case 0: // Emerald / Teal
        return const LevelCardTheme(
          borderColor: emeraldNeon,
          glowColor: Color(0x7300F5B4),
          cardGradientColors: [
            Color(0xFF0E4459),
            Color(0xFF093041),
            Color(0xFF05202C),
          ],
          badgeBgColor: Color(0xCC064E3B),
          badgeBorderColor: Color(0xCC6EE7B7),
          badgeTextColor: Color(0xFFA7F3D0),
          buttonGradientColors: [Color(0xFF0066FF), Color(0xFF0099FF), emeraldNeon],
          buttonTextColor: Colors.white,
        );
      case 1: // Electric Cyan / Blue
        return const LevelCardTheme(
          borderColor: cyanBright,
          glowColor: Color(0x7300D4FF),
          cardGradientColors: [
            Color(0xFF14479E),
            Color(0xFF0E3375),
            Color(0xFF092254),
          ],
          badgeBgColor: Color(0xCC164E63),
          badgeBorderColor: Color(0xCC67E8F9),
          badgeTextColor: Color(0xFFA5F3FC),
          buttonGradientColors: [Color(0xFF0055FF), Color(0xFF0088FF), cyanBright],
          buttonTextColor: Colors.white,
        );
      case 2: // Neon Magenta / Purple
        return const LevelCardTheme(
          borderColor: magenta,
          glowColor: Color(0x73D946EF),
          cardGradientColors: [
            Color(0xFF561585),
            Color(0xFF3E0D61),
            Color(0xFF290742),
          ],
          badgeBgColor: Color(0xCC701A75),
          badgeBorderColor: Color(0xCCF0ABFC),
          badgeTextColor: Color(0xFFF5D0FE),
          buttonGradientColors: [Color(0xFF9333EA), Color(0xFFC084FC), Color(0xFFE879F9)],
          buttonTextColor: Colors.white,
        );
      case 3: // Cyber Teal / Cyan
        return const LevelCardTheme(
          borderColor: Color(0xFF06B6D4),
          glowColor: Color(0x7306B6D4),
          cardGradientColors: [
            Color(0xFF0C4E5E),
            Color(0xFF083845),
            Color(0xFF052731),
          ],
          badgeBgColor: Color(0xCC134E4A),
          badgeBorderColor: Color(0xCC5EEAD4),
          badgeTextColor: Color(0xFF99F6E4),
          buttonGradientColors: [Color(0xFF0284C7), Color(0xFF06B6D4), teal],
          buttonTextColor: Colors.white,
        );
      case 4: // Radiant Gold / Amber
        return const LevelCardTheme(
          borderColor: amber,
          glowColor: Color(0x73F59E0B),
          cardGradientColors: [
            Color(0xFF783C07),
            Color(0xFF572903),
            Color(0xFF3B1A01),
          ],
          badgeBgColor: Color(0xCC78350F),
          badgeBorderColor: Color(0xCCFCD34D),
          badgeTextColor: Color(0xFFFDE68A),
          buttonGradientColors: [amber, gold, goldBright],
          buttonTextColor: amberDeepText,
        );
      case 5: // Deep Indigo / Cobalt
      default:
        return const LevelCardTheme(
          borderColor: indigo,
          glowColor: Color(0x736366F1),
          cardGradientColors: [
            Color(0xFF2E3299),
            Color(0xFF1F226E),
            Color(0xFF151750),
          ],
          badgeBgColor: Color(0xCC312E81),
          badgeBorderColor: Color(0xCCA5B4FC),
          badgeTextColor: Color(0xFFC7D2FE),
          buttonGradientColors: [Color(0xFF4F46E5), indigo, cyanSky],
          buttonTextColor: Colors.white,
        );
    }
  }

  static ThemeData get darkTheme {
    final base = ThemeData.dark(useMaterial3: true);
    return base.copyWith(
      scaffoldBackgroundColor: navyStage,
      primaryColor: cyanNeon,
      colorScheme: const ColorScheme.dark(
        primary: cyanNeon,
        secondary: amber,
        tertiary: emerald,
        surface: navyCardDark,
        error: redError,
        onPrimary: navyDeep,
        onSecondary: amberDeepText,
        onSurface: Colors.white,
      ),
      textTheme: base.textTheme.apply(
        bodyColor: Colors.white,
        displayColor: Colors.white,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: headerTop,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
    );
  }

  static ThemeData get lightTheme {
    final base = ThemeData.light(useMaterial3: true);
    return base.copyWith(
      scaffoldBackgroundColor: lightCanvas,
      primaryColor: bluePrimary,
      colorScheme: const ColorScheme.light(
        primary: bluePrimary,
        secondary: amber,
        tertiary: emerald,
        surface: Colors.white,
        error: redError,
        onPrimary: Colors.white,
        onSecondary: amberDeepText,
        onSurface: lightInk,
      ),
    );
  }
}

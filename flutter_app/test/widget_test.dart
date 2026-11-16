import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:newromath/main.dart';
import 'package:newromath/models/game_models.dart';
import 'package:newromath/state/game_controller.dart';
import 'package:shared_preferences/shared_preferences.dart';

void _mockPluginChannels() {
  final messenger =
      TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger;
  for (final channelName in const [
    'xyz.luan/audioplayers.global',
    'xyz.luan/audioplayers',
    'plugins.flutter.io/in_app_purchase',
    'plugins.flutter.io/firebase_core',
  ]) {
    messenger.setMockMethodCallHandler(
      MethodChannel(channelName),
      (MethodCall call) async => null,
    );
  }
  messenger.setMockMessageHandler(
    'plugins.flutter.io/google_mobile_ads',
    (ByteData? message) async =>
        const StandardMethodCodec().encodeSuccessEnvelope(null),
  );
  messenger.setMockMessageHandler(
    'xyz.luan/audioplayers.global/events',
    (ByteData? message) async => null,
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
    _mockPluginChannels();
  });

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  testWidgets(
      'NewroMathApp boots to Home with starter 500 coins / 50 gems and navigates cleanly',
      (WidgetTester tester) async {
    tester.view.physicalSize = const Size(412 * 2, 915 * 2);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    final controller = GameController(initialScreen: AppScreen.home);
    await tester.runAsync(() async {
      await controller.init().timeout(
        const Duration(seconds: 3),
        onTimeout: () {},
      );
    });
    addTearDown(controller.dispose);

    await tester.pumpWidget(NewroMathApp(controller: controller));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 250));

    expect(find.text('500'), findsWidgets);
    expect(find.text('50'), findsWidgets);
    expect(find.textContaining('ca-app-pub-39402560999'), findsOneWidget);

    // Navigate across every screen to verify zero layout/overflow/runtime errors.
    final screensToTest = <AppScreen>[
      AppScreen.levels,
      AppScreen.game,
      AppScreen.hint,
      AppScreen.daily,
      AppScreen.dailyGame,
      AppScreen.battle,
      AppScreen.rewards,
      AppScreen.profile,
      AppScreen.leaderboard,
      AppScreen.achievements,
      AppScreen.history,
      AppScreen.settings,
      AppScreen.help,
      AppScreen.offline,
      AppScreen.onboarding,
      AppScreen.splash,
      AppScreen.home,
    ];

    for (final screen in screensToTest) {
      controller.navigateTo(screen);
      await tester.pump(const Duration(milliseconds: 50));
      await tester.pump(const Duration(milliseconds: 350));

      if (screen == AppScreen.rewards) {
        // Verify recent Rewards UI cleanups
        expect(find.text(r'$1.99'), findsWidgets);
        expect(find.text('Daily Mystery Chest'), findsNothing);
        expect(find.text('Jackpot Ad Chest'), findsNothing);
        expect(find.text('Google Play or Gems'), findsNothing);
        expect(find.text('Premium Gems'), findsNothing);
      }

      if (screen == AppScreen.daily) {
        expect(find.textContaining('SEASON 11'), findsNothing);
        expect(find.textContaining('0 Days Completed'), findsNothing);
      }

      if (screen == AppScreen.game) {
        expect(find.textContaining('GAME 1/'), findsOneWidget);
      }
    }
  });
}

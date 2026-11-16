import 'package:flutter_test/flutter_test.dart';
import 'package:newromath/main.dart';
import 'package:newromath/state/game_controller.dart';

void main() {
  testWidgets('NewroMathApp renders scaffold shell', (WidgetTester tester) async {
    final controller = GameController();
    await tester.pumpWidget(NewroMathApp(controller: controller));
    expect(find.text('NewroMath • Level 1'), findsOneWidget);
  });
}

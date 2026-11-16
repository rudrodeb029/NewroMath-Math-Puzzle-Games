import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

/// 3D Emerald Number Tray Keyboard aligned beneath Cross-Math & Daily Matrix boards.
///
/// Automatically arranges 1–5 numbers in a single 5-column aligned row, or
/// splits 6+ numbers into two balanced centered rows. Supports both tap-to-place
/// and drag-to-place/swap gestures.
class NumberTray extends StatelessWidget {
  const NumberTray({
    super.key,
    required this.numbers,
    required this.usedNumbers,
    required this.onTapNumber,
    this.isDisabled = false,
    this.largeFontEnabled = true,
    this.maxWidth = 264,
    this.enableDrag = true,
  });

  final List<int> numbers;
  final Set<int> usedNumbers;
  final ValueChanged<int> onTapNumber;
  final bool isDisabled;
  final bool largeFontEnabled;
  final double maxWidth;
  final bool enableDrag;

  @override
  Widget build(BuildContext context) {
    if (numbers.isEmpty) {
      return const SizedBox.shrink();
    }

    final trayCount = numbers.length;
    final isCompact = trayCount >= 6;
    final isVeryCompact = trayCount >= 9;
    final gap = isVeryCompact ? 3.5 : 5.0;

    if (trayCount <= 5) {
      return Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: maxWidth),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              for (var i = 0; i < 5; i++) ...[
                if (i > 0) SizedBox(width: gap),
                Expanded(
                  child: i < numbers.length
                      ? _TrayTileButton(
                          number: numbers[i],
                          isUsed: usedNumbers.contains(numbers[i]),
                          isDisabled: isDisabled,
                          isCompact: isCompact,
                          isVeryCompact: isVeryCompact,
                          largeFontEnabled: largeFontEnabled,
                          enableDrag: enableDrag,
                          onTap: () => onTapNumber(numbers[i]),
                        )
                      : const AspectRatio(aspectRatio: 1),
                ),
              ],
            ],
          ),
        ),
      );
    }

    final splitIndex = (trayCount / 2).ceil();
    final row1 = numbers.sublist(0, splitIndex);
    final row2 = numbers.sublist(splitIndex);

    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildBalancedRow(
              row1,
              gap: gap,
              isCompact: isCompact,
              isVeryCompact: isVeryCompact,
            ),
            if (row2.isNotEmpty) ...[
              SizedBox(height: gap),
              _buildBalancedRow(
                row2,
                gap: gap,
                isCompact: isCompact,
                isVeryCompact: isVeryCompact,
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildBalancedRow(
    List<int> rowNumbers, {
    required double gap,
    required bool isCompact,
    required bool isVeryCompact,
  }) {
    final k = rowNumbers.length;
    final cols = k < 5 ? 5 : k;
    final rowFraction = k < 5 ? k / 5.0 : 1.0;

    return FractionallySizedBox(
      widthFactor: rowFraction,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          for (var i = 0; i < rowNumbers.length; i++) ...[
            if (i > 0) SizedBox(width: gap),
            Expanded(
              child: _TrayTileButton(
                number: rowNumbers[i],
                isUsed: usedNumbers.contains(rowNumbers[i]),
                isDisabled: isDisabled,
                isCompact: cols >= 6 || isCompact,
                isVeryCompact: cols >= 7 || isVeryCompact,
                largeFontEnabled: largeFontEnabled,
                enableDrag: enableDrag,
                onTap: () => onTapNumber(rowNumbers[i]),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _TrayTileButton extends StatefulWidget {
  const _TrayTileButton({
    required this.number,
    required this.isUsed,
    required this.isDisabled,
    required this.isCompact,
    required this.isVeryCompact,
    required this.largeFontEnabled,
    required this.enableDrag,
    required this.onTap,
  });

  final int number;
  final bool isUsed;
  final bool isDisabled;
  final bool isCompact;
  final bool isVeryCompact;
  final bool largeFontEnabled;
  final bool enableDrag;
  final VoidCallback onTap;

  @override
  State<_TrayTileButton> createState() => _TrayTileButtonState();
}

class _TrayTileButtonState extends State<_TrayTileButton> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final inactive = widget.isUsed || widget.isDisabled;
    final text = widget.number.toString();

    final tileBody = AspectRatio(
      aspectRatio: 1,
      child: AnimatedOpacity(
        opacity: widget.isUsed ? 0.24 : 1.0,
        duration: const Duration(milliseconds: 140),
        child: AnimatedScale(
          scale: widget.isUsed ? 0.94 : (_pressed && !inactive ? 0.93 : 1.0),
          duration: const Duration(milliseconds: 110),
          child: Container(
            decoration: widget.isUsed
                ? BoxDecoration(
                    color: const Color(0x731E293B),
                    borderRadius: BorderRadius.circular(9),
                    border: Border.all(
                      color: const Color(0xCC334155),
                      width: 1.2,
                    ),
                  )
                : BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Color(0xFF1FC786),
                        Color(0xFF10B981),
                        Color(0xFF047857),
                      ],
                      stops: [0.0, 0.5, 1.0],
                    ),
                    borderRadius: BorderRadius.circular(9),
                    border: Border.all(
                      color: const Color(0xFF6EE7B7),
                      width: 1.5,
                    ),
                    boxShadow: _pressed && !inactive
                        ? const [
                            BoxShadow(
                              color: Color(0xFF064E3B),
                              offset: Offset(0, 1.5),
                              blurRadius: 0,
                            ),
                          ]
                        : const [
                            BoxShadow(
                              color: Color(0xFF064E3B),
                              offset: Offset(0, 3),
                              blurRadius: 0,
                            ),
                            BoxShadow(
                              color: Color(0x73000000),
                              offset: Offset(0, 5),
                              blurRadius: 10,
                            ),
                          ],
                  ),
            alignment: Alignment.center,
            padding: const EdgeInsets.all(2),
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                text,
                style: _trayTextStyle(
                  text.length,
                  isUsed: widget.isUsed,
                  isCompact: widget.isCompact,
                  isVeryCompact: widget.isVeryCompact,
                  largeFontEnabled: widget.largeFontEnabled,
                ),
              ),
            ),
          ),
        ),
      ),
    );

    if (inactive) {
      return tileBody;
    }

    final tappable = GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) {
        setState(() => _pressed = false);
        widget.onTap();
      },
      onTapCancel: () => setState(() => _pressed = false),
      child: tileBody,
    );

    if (!widget.enableDrag) {
      return tappable;
    }

    return Draggable<int>(
      data: widget.number,
      feedback: Material(
        color: Colors.transparent,
        child: SizedBox(
          width: 48,
          height: 48,
          child: Container(
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFF34D399),
                  Color(0xFF10B981),
                  Color(0xFF059669),
                ],
              ),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFFA7F3D0), width: 1.5),
              boxShadow: const [
                BoxShadow(
                  color: Color(0xBF34D399),
                  blurRadius: 16,
                ),
              ],
            ),
            alignment: Alignment.center,
            child: Text(
              text,
              style: _trayTextStyle(
                text.length,
                isUsed: false,
                isCompact: false,
                isVeryCompact: false,
                largeFontEnabled: true,
              ),
            ),
          ),
        ),
      ),
      childWhenDragging: Opacity(opacity: 0.35, child: tileBody),
      child: tappable,
    );
  }
}

TextStyle _trayTextStyle(
  int charLength, {
  required bool isUsed,
  required bool isCompact,
  required bool isVeryCompact,
  required bool largeFontEnabled,
}) {
  double size;
  if (charLength >= 3) {
    size = isVeryCompact
        ? 10.0
        : isCompact
            ? 11.0
            : (largeFontEnabled ? 13.0 : 11.5);
  } else if (charLength == 2) {
    size = isVeryCompact
        ? 11.5
        : isCompact
            ? 13.0
            : (largeFontEnabled ? 16.0 : 14.0);
  } else {
    size = isVeryCompact
        ? 13.5
        : isCompact
            ? 15.5
            : (largeFontEnabled ? 19.0 : 16.5);
  }

  return TextStyle(
    fontSize: size,
    fontWeight: FontWeight.w900,
    color: isUsed ? const Color(0xFF64748B) : Colors.white,
    height: 1.0,
    fontFeatures: AppTheme.tabularLiningFeatures,
    shadows: isUsed
        ? null
        : const [
            Shadow(
              color: Color(0xB3000000),
              offset: Offset(0, 1),
              blurRadius: 2,
            ),
          ],
  );
}

import 'package:flutter/material.dart';
import '../models/game_models.dart';
import '../theme/app_theme.dart';

/// Standard cubic easing matching `cubic-bezier(0.22, 0.61, 0.36, 1)` in `index.html`.
const Curve kSlidePageCurve = Cubic(0.22, 0.61, 0.36, 1.0);
const Duration kSlidePageDuration = Duration(milliseconds: 300);

/// GPU-accelerated route transition supporting `forward`, `back`, `hint`, and `fade`.
class SlidePageRoute<T> extends PageRouteBuilder<T> {
  SlidePageRoute({
    required WidgetBuilder builder,
    this.direction = TransitionDirection.forward,
    super.settings,
  }) : super(
          transitionDuration: kSlidePageDuration,
          reverseTransitionDuration: kSlidePageDuration,
          opaque: direction != TransitionDirection.hint,
          barrierColor:
              direction == TransitionDirection.hint ? const Color(0x9906122D) : null,
          pageBuilder: (context, animation, secondaryAnimation) =>
              builder(context),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            final curvedIn = CurvedAnimation(
              parent: animation,
              curve: kSlidePageCurve,
              reverseCurve: kSlidePageCurve,
            );
            final curvedOut = CurvedAnimation(
              parent: secondaryAnimation,
              curve: kSlidePageCurve,
              reverseCurve: kSlidePageCurve,
            );

            switch (direction) {
              case TransitionDirection.forward:
                final enterOffset = Tween<Offset>(
                  begin: const Offset(1.0, 0.0),
                  end: Offset.zero,
                ).animate(curvedIn);
                final exitOffset = Tween<Offset>(
                  begin: Offset.zero,
                  end: const Offset(-0.25, 0.0),
                ).animate(curvedOut);
                return SlideTransition(
                  position: exitOffset,
                  child: SlideTransition(
                    position: enterOffset,
                    child: child,
                  ),
                );
              case TransitionDirection.back:
                final enterOffset = Tween<Offset>(
                  begin: const Offset(-0.25, 0.0),
                  end: Offset.zero,
                ).animate(curvedIn);
                final exitOffset = Tween<Offset>(
                  begin: Offset.zero,
                  end: const Offset(1.0, 0.0),
                ).animate(curvedOut);
                return SlideTransition(
                  position: exitOffset,
                  child: SlideTransition(
                    position: enterOffset,
                    child: child,
                  ),
                );
              case TransitionDirection.hint:
                final enterOffset = Tween<Offset>(
                  begin: const Offset(0.0, 1.0),
                  end: Offset.zero,
                ).animate(curvedIn);
                return SlideTransition(
                  position: enterOffset,
                  child: child,
                );
              case TransitionDirection.fade:
                return FadeTransition(
                  opacity: curvedIn,
                  child: child,
                );
            }
          },
        );

  final TransitionDirection direction;
}

/// Dual-layer GPU-accelerated screen switcher used by the root app stage.
///
/// Mirrors the exact CSS keyframes in `index.html`:
/// - `forward`: new screen slides in `100% -> 0` (right-to-left) over old `0 -> -25%`.
/// - `back`: old screen slides out `0 -> 100%` (left-to-right) over incoming `-25% -> 0`.
/// - `hint`: hint overlay slides up `100% -> 0` and down `0 -> 100%`.
/// - `fade`: smooth cross-fade.
class SlideTransitionStage extends StatefulWidget {
  const SlideTransitionStage({
    super.key,
    required this.screenKey,
    required this.direction,
    required this.child,
    this.isHintOverlay = false,
  });

  final ValueKey<AppScreen> screenKey;
  final TransitionDirection direction;
  final Widget child;
  final bool isHintOverlay;

  @override
  State<SlideTransitionStage> createState() => _SlideTransitionStageState();
}

class _SlideTransitionStageState extends State<SlideTransitionStage>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late Animation<double> _curved;

  Widget? _outgoingChild;
  ValueKey<AppScreen>? _outgoingKey;
  bool _outgoingWasHint = false;
  TransitionDirection _activeDirection = TransitionDirection.forward;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: kSlidePageDuration,
      value: 1.0,
    );
    _curved = CurvedAnimation(
      parent: _controller,
      curve: kSlidePageCurve,
    );
    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed && mounted) {
        setState(() {
          _outgoingChild = null;
          _outgoingKey = null;
          _outgoingWasHint = false;
        });
      }
    });
  }

  @override
  void didUpdateWidget(covariant SlideTransitionStage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.screenKey != widget.screenKey) {
      _outgoingChild = oldWidget.child;
      _outgoingKey = oldWidget.screenKey;
      _outgoingWasHint = oldWidget.isHintOverlay;
      _activeDirection = widget.direction;
      _controller.forward(from: 0.0);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final currentLayer = KeyedSubtree(
      key: widget.screenKey,
      child: RepaintBoundary(
        child: Material(
          color: widget.isHintOverlay ? Colors.transparent : AppTheme.navyStage,
          child: widget.child,
        ),
      ),
    );

    if (_outgoingChild == null) {
      return SizedBox.expand(child: currentLayer);
    }

    final outgoingLayer = KeyedSubtree(
      key: _outgoingKey,
      child: IgnorePointer(
        child: RepaintBoundary(
          child: Material(
            color: _outgoingWasHint ? Colors.transparent : AppTheme.navyStage,
            child: _outgoingChild,
          ),
        ),
      ),
    );

    return ClipRect(
      child: AnimatedBuilder(
        animation: _curved,
        builder: (context, _) {
          final t = _curved.value;

          if (_activeDirection == TransitionDirection.fade) {
            return Stack(
              fit: StackFit.expand,
              children: [
                Opacity(opacity: 1.0 - t, child: outgoingLayer),
                Opacity(opacity: t, child: currentLayer),
              ],
            );
          }

          if (_activeDirection == TransitionDirection.hint) {
            // Hint overlay slides up from bottom when opening, or slides down when closing.
            if (widget.isHintOverlay) {
              return Stack(
                fit: StackFit.expand,
                children: [
                  outgoingLayer,
                  FractionalTranslation(
                    translation: Offset(0.0, 1.0 - t),
                    child: currentLayer,
                  ),
                ],
              );
            } else {
              return Stack(
                fit: StackFit.expand,
                children: [
                  currentLayer,
                  FractionalTranslation(
                    translation: Offset(0.0, t),
                    child: outgoingLayer,
                  ),
                ],
              );
            }
          }

          if (_activeDirection == TransitionDirection.back) {
            // Back: incoming slides -0.25 -> 0 underneath, outgoing slides 0 -> +1.0 on top.
            return Stack(
              fit: StackFit.expand,
              children: [
                FractionalTranslation(
                  translation: Offset(-0.25 * (1.0 - t), 0.0),
                  child: currentLayer,
                ),
                FractionalTranslation(
                  translation: Offset(t, 0.0),
                  child: outgoingLayer,
                ),
              ],
            );
          }

          // Forward: outgoing slides 0 -> -0.25 underneath, incoming slides +1.0 -> 0 on top.
          return Stack(
            fit: StackFit.expand,
            children: [
              FractionalTranslation(
                translation: Offset(-0.25 * t, 0.0),
                child: outgoingLayer,
              ),
              FractionalTranslation(
                translation: Offset(1.0 - t, 0.0),
                child: currentLayer,
              ),
            ],
          );
        },
      ),
    );
  }
}

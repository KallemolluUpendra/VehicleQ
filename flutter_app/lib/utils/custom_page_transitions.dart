import 'package:flutter/material.dart';

/// A simple slide transition that moves incoming pages from right->left
/// and moves outgoing pages left->right when popping. This gives a
/// smooth left/right page switching effect on all platforms.
class CustomPageTransitionsBuilder extends PageTransitionsBuilder {
  const CustomPageTransitionsBuilder();

  @override
  Widget buildTransitions<T>(
    PageRoute<T> route,
    BuildContext context,
    Animation<double> animation,
    Animation<double> secondaryAnimation,
    Widget child,
  ) {
    // Slide from right to left when pushing, and reverse when popping.
    final tween = Tween<Offset>(begin: const Offset(1.0, 0.0), end: Offset.zero)
        .chain(CurveTween(curve: Curves.easeInOut));

    return SlideTransition(
      position: animation.drive(tween),
      child: child,
    );
  }
}

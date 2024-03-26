import 'dart:math';

import 'package:flutter/material.dart';

// Define primary color and button color
const Color primaryColor = Color(0xFF1565C0); // Blue
const Color buttonColor = Color(0xFF1565C0); // Blue for buttons
const Color logoColor = Color(0xFFED4A25); // Logo color mostly used in appbar

// Define accent colors
const Color orangeAccent = Color(0xFFFFA726); // Orange
const Color blueAccent = Color(0xFF42A5F5); // Blue
const Color whiteAccent = Colors.white; // White
const Color blackAccent = Colors.black; // Black
const Color greyAccent = Colors.grey; // Grey


ThemeData lightMode = ThemeData(
  brightness: Brightness.light,
  colorScheme: ColorScheme.light(
    background: Colors.grey.shade200,
    primary: Colors.grey.shade700,
    secondary: logoColor,
  ),

);

ThemeData darkMode = ThemeData(
  brightness: Brightness.dark,
  colorScheme: ColorScheme.dark(
    background: Colors.grey.shade900,
    primary: Colors.grey.shade300,
    secondary: logoColor,

  ),

);

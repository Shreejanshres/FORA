
import 'package:flutter/material.dart';
import 'package:user/Pages/DetailRecipe.dart';
import 'package:user/Pages/dashboard.dart';
import 'package:user/RestaurantSystem/ItemPage.dart';
import 'package:user/RestaurantSystem/restaurantpage.dart';
import 'package:provider/provider.dart';
import 'package:user/Theme/Theme.dart';
import 'package:user/Pages/splashscreen.dart';
import 'package:geocoding/geocoding.dart';
import 'package:user/Theme/theme_provider.dart';

void main() {
  GeocodingPlatform.instance = GeocodingPlatform.instance;
  runApp(ChangeNotifierProvider(create: (context)=>ThemeProvider(),child: const MyApp(),));
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: Provider.of<ThemeProvider>(context).themeData,

      debugShowCheckedModeBanner: false,
      home: const SplashScreen(),
      routes: {
        '/splashscreen': (context) => const SplashScreen(),
        '/restaurantpage': (context) => const RestaurantPage(),
        '/detailrestaurant': (context)=> const DetailRecipe(  ),
        '/itempage': (context)=> const ItemPage(),

      },
    );
  }
}

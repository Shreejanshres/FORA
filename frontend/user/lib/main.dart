import 'package:flutter/material.dart';
import 'package:khalti_flutter/khalti_flutter.dart';
import 'package:user/Pages/DetailCart.dart';
import 'package:user/Pages/DetailRecipe.dart';
import 'package:user/Pages/Information.dart';
import 'package:user/PostSystem/postpage.dart';
import 'package:user/RestaurantSystem/ItemPage.dart';
import 'package:user/RestaurantSystem/restaurantpage.dart';
import 'package:provider/provider.dart';
import 'package:user/Settings/OrderHistory.dart';
import 'package:user/Settings/Profile.dart';
import 'package:user/Settings/TrackOrder.dart';
import 'package:user/Settings/UserProfile.dart';
import 'package:user/Theme/Theme.dart';
import 'package:user/Pages/splashscreen.dart';
import 'package:geocoding/geocoding.dart';
import 'package:user/Theme/theme_provider.dart';

void main() {
  GeocodingPlatform.instance = GeocodingPlatform.instance;
  runApp(ChangeNotifierProvider(
    create: (context) => ThemeProvider(),
    child: const MyApp(),
  ));
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return KhaltiScope(
        publicKey: '77133b6ac1af449d8779b3027044189d',
        enabledDebugging: true,
        builder: (context, navigatorKey) {
          return MaterialApp(
            theme: Provider.of<ThemeProvider>(context).themeData,
            debugShowCheckedModeBanner: false,
            home: const SplashScreen(),
            routes: {
              '/splashscreen': (context) => const SplashScreen(),
              '/restaurantpage': (context) => const RestaurantPage(),
              '/detailrestaurant': (context) => const DetailRecipe(),
              '/itempage': (context) => const ItemPage(),
              '/detailpost': (context) => const postPage(),
              '/information': (context) => const informationpage(),
              '/editprofile': (context) => const userProfile(),
              '/profile':(context) => const Profile(),
              '/detailcart':(context) => const DetailCart(),
              '/orderhistory': (context) => const Orderhistory(),
              '/trackorder': (context) => const trackOrder(),
            },
            navigatorKey: navigatorKey,
            localizationsDelegates: const [KhaltiLocalizations.delegate],
          );
        });
  }
}

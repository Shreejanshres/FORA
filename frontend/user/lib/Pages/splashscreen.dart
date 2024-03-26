import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:user/Pages/dashboard.dart';
import 'login.dart'; // Import your login page file
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    // Call a function to handle navigation after 5 seconds
    _navigateAfterDelay();
  }

  Future<void> _navigateAfterDelay() async {
    await Future.delayed(const Duration(seconds: 5));
    await _getUserLocation();
    // After 5 seconds, check user data and navigate accordingly
    bool userDataExists = await checkUserDataExists();
    await _requestLocationPermission();
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => userDataExists ? const Dashboard() : const LoginPage(),
      ),
    );
  }

  Future<bool> checkUserDataExists() async {
    var prefs = await SharedPreferences.getInstance();
    return prefs.containsKey('id') && prefs.containsKey('name');
  }

  Future<void> _requestLocationPermission() async {
    // Request ACCESS_FINE_LOCATION permission
    var locationStatus = await Permission.location.request();
    if (locationStatus.isGranted) {
      // Location permission granted, now get the current location
    } else if (locationStatus.isDenied) {
      // Handle the case where the user denies the location permission
    } else if (locationStatus.isPermanentlyDenied) {
      // Open app settings
      openAppSettings();
    }
  }
  Future<void> _getUserLocation() async {
    try {
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      // Get address from coordinates
      List<Placemark> placemarks = await placemarkFromCoordinates(position.latitude,position.longitude);
      String userLocation='${placemarks[0].street},${placemarks[0].subLocality},${placemarks[0].locality}';
      var prefs = await SharedPreferences.getInstance();
      prefs.setString('currentlocation',userLocation );
    } catch (e) {
      print('Error getting location: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: const Color(0xFFED4A25)),
      body: RegularSplashScreen(),
    );
  }

  Widget RegularSplashScreen() {
    return Container(
      width: double.infinity,
      color: const Color(0xFFED4A25),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SvgPicture.asset(
            'images/logo.svg', // Replace with your image URL
            width: 200,
            height: 200,

          ),
        ],
      ),
    );
  }
}

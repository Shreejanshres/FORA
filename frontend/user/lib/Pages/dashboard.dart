
import 'package:flutter/material.dart';
import 'package:user/Pages/CartPage.dart';
import 'package:user/Pages/Settings.dart';

import 'package:user/RestaurantSystem/homepage.dart';
import 'package:user/Pages/recipepage.dart';
class Dashboard extends StatefulWidget {
  const Dashboard({super.key});


  @override
  State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  int currentIndex = 0;


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _getPage(currentIndex),
      bottomNavigationBar: bottomNavigationBar(),
    );
  }
  Widget _getPage(int index) {
    switch (index) {
      case 0:
        return const Homepage(); // Use the correct class name
      case 1:
        return RecipePage();
      case 2:
        return Cart();
      case 3:
        return SettingsPage();
      default:
        return const Homepage(); // Default to the home page if index is not recognized
    }
  }

  BottomNavigationBar bottomNavigationBar() {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed, // Add this lines
      currentIndex: currentIndex,
      onTap: (index) {
        setState(() {
          currentIndex = index;
        });
      },
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.book),
          label: 'Recipe',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.shopping_cart_rounded),
          label: 'Cart',
        ),
        BottomNavigationBarItem(
            icon: Icon(Icons.settings,
            ),
            label:'Settings',
        )
      ],
    );
  }



}

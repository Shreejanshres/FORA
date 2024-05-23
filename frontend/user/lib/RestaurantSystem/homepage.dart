import 'dart:math';

import 'package:dio/dio.dart';
import 'package:easy_search_bar/easy_search_bar.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:user/Controllers/RestaurantController.dart';

class Homepage extends StatefulWidget {
  const Homepage({Key? key}) : super(key: key);

  @override
  State<Homepage> createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  String userLocation = '';
  Restaurant restaurant = Restaurant(); // Initialize your Restaurant class
  bool isLoading = true;
  late List<dynamic> alldata;
  late List<dynamic> allPromotion;
  String searchValue = '';
  List<Map<String, dynamic>> suggestions = [];
  @override
  void initState() {
    super.initState();
    data(); // Call the data function when the widget is first created
    getdata();
    getpromotion();
  }

  Future<void> data() async {
    var prefs = await SharedPreferences.getInstance();
    setState(() {
      userLocation = prefs.getString('currentlocation') ?? '';
    });
  }

  Future<void> getdata() async {
    try {
      await restaurant
          .getrestaurantdata(); // Assuming getRestaurantData() is an asynchronous method
      setState(() {
        alldata = restaurant.restaurants;
      });
    } catch (e) {
      // Handle error if any
      print('Error loading restaurant data: $e');
    }
  }

  Future<void> getpromotion() async {
    try {
      var response = await restaurant
          .getpromotion(); // Assuming getRestaurantData() is an asynchronous method
      if (response['success']) {
        setState(() {
          allPromotion = response['message'];
          isLoading = false;
        });
      }
    } catch (e) {
      // Handle error if any
      print('Error loading promotion data: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: appBar(),
      body: _buildRestaurantBody(),
    );
  }

  Widget _buildRestaurantBody() {
    if (isLoading) {
      return Center(child: CircularProgressIndicator());
    } else {
      return body();
    }
  }

  Widget body() {
    return SingleChildScrollView(
      child: Container(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Restaurants"),
            SizedBox(
              height: 150,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: restaurant.restaurantNames.length,
                itemBuilder: (context, index) {
                  return restaurantDisplay(index);
                },
              ),
            ),
            Text("Menu Items"),
            SizedBox(
              height: 10,
            ),
            Container(
              height: 150,
              // color: Colors.red,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: 8,
                separatorBuilder: (BuildContext context, int index) {
                  return SizedBox(width: 10); // Adjust the width as needed
                },
                itemBuilder: (BuildContext context, int index) {
                  if (index < allPromotion.length && allPromotion.isNotEmpty) {
                    final randomIndex = Random().nextInt(allPromotion.length);
                    return promotion(randomIndex);
                  }
                },
              ),
            ),
            SizedBox(
              height: 10,
            ),
            Container(
              height: 250,
              color: Colors.red,
              child: ListView.separated(
                itemCount: 1,
                separatorBuilder: (BuildContext context, int index) {
                  return SizedBox(width: 10); // Adjust the width as needed
                },
                itemBuilder: (BuildContext context, int index) {
                  if (index < allPromotion.length && allPromotion.isNotEmpty) {
                    final randomIndex = Random().nextInt(allPromotion.length);
                    return Container(
                      height:
                          250, // Set the height equal to the container height
                      child: Image.network(
                        "${restaurant.baseUrl}${allPromotion[randomIndex]['picture']}",
                        fit: BoxFit
                            .cover, // Ensure the image fills the container
                      ),
                    );
                  }
                },
              ),
            ),
            SizedBox(
              height: 10,
            ),
            Text(
              "More restaurant",
              style: TextStyle(fontFamily: "Poppins", fontSize: 14),
            ),
            SizedBox(
              height: 10,
            ),
            Container(
              child: GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 10.0,
                  mainAxisSpacing: 10.0,
                ),
                itemCount: restaurant.restaurantNames.length,
                itemBuilder: (context, index) {
                  if (index < restaurant.restaurantNames.length &&
                      restaurant.restaurantNames.isNotEmpty) {
                    final randomIndex =
                        Random().nextInt(restaurant.restaurantNames.length);
                    return restaurantDisplay(randomIndex);
                  } else {
                    return const Placeholder();
                  }
                },
              ),
            )
          ],
        ),
      ),
    );
  }

  // AppBar appBar() {
  //   return AppBar(
  //     backgroundColor: Colors.transparent,
  //     elevation: 1,
  //     title: InkWell(
  //         onTap: () {},
  //         // splashColor: const Color(0xFFED4A25),
  //         splashFactory: InkRipple.splashFactory,
  //         child: Column(
  //           crossAxisAlignment: CrossAxisAlignment.start,
  //           children: [
  //             const Row(
  //               children: [
  //                 Icon(Icons.location_pin, size: 15.0),
  //                 SizedBox(height: 10.0),
  //                 Text("Your location", style: TextStyle(fontSize: 15.0)),
  //               ],
  //             ),
  //             Text(
  //               userLocation,
  //               style: const TextStyle(fontSize: 15.0),
  //             )
  //           ],
  //         )),
  //     actions: [
  //       IconButton(
  //           onPressed: () {
  //             // showSearch(context: context, delegate: SearchBar());
  //           },
  //           icon: const Icon(Icons.search_rounded))
  //     ],
  //   );
  // }

  Future<List<Map<String, dynamic>>> _fetchSuggestions(
      String searchValue) async {
    await Future.delayed(const Duration(milliseconds: 750));

    List<Map<String, dynamic>> suggestions = [];

    // Fetch restaurant data if not already fetched
    if (restaurant.restaurants == null) {
      await restaurant.getrestaurantdata();
    }

    suggestions = restaurant.restaurants
        .where((restaurant) => restaurant['name']
            .toString()
            .toLowerCase()
            .contains(searchValue.toLowerCase()))
        .map((restaurant) {
      return {
        'name': restaurant['name'].toString(),
        'id':
            restaurant['id'], // Assuming ID is present in your restaurant data
      };
    }).toList();

    return suggestions;
  }

  EasySearchBar appBar() {
    return EasySearchBar(
      backgroundColor: Colors.white,
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.location_pin, size: 12.0),
              SizedBox(height: 5.0),
              Text("Your location", style: TextStyle(fontSize: 12.0)),
            ],
          ),
          Text(
            userLocation,
            style: const TextStyle(fontSize: 15.0),
          )
        ],
      ),
      onSearch: (value) => setState(() => searchValue = value),
      asyncSuggestions: (value) async {
        suggestions = await _fetchSuggestions(value);
        // Convert the List<Map<String, dynamic>> to List<String>
        return suggestions
            .map((suggestion) => suggestion['name'].toString())
            .toList();
      },
      onSuggestionTap: (String suggestion) {
        var selectedSuggestion =
            suggestions.firstWhere((s) => s['name'] == suggestion);
        Navigator.pushNamed(context, '/restaurantpage',
            arguments: selectedSuggestion['id']);
      },
    );
  }

  InkWell restaurantDisplay(int index) {
    String name = restaurant.restaurants[index]['name'];
    String pictureUrl = restaurant.restaurants[index]['picture'] ?? '';
    int id = restaurant.restaurants[index]['id'] ?? 0;
    return InkWell(
      onTap: () {
        Navigator.pushNamed(context, '/restaurantpage', arguments: id);
      },
      child: Container(
        width: 110,
        height: 120,
        // color: Colors.amber,
        padding: EdgeInsets.all(10),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            pictureUrl.isNotEmpty
                ? Image.network(
                    restaurant.baseUrl + pictureUrl,
                    width: 50,
                    height: 50,
                  )
                : Image.asset(
                    'images/Logo.png',
                    width: 50,
                    height: 50,
                  ),
            Text(name),
          ],
        ),
      ),
    );
  }

  Widget promotion(index) {
    return InkWell(
      onTap: () {
        Navigator.pushNamed(context, '/restaurantpage',
            arguments: allPromotion[index]['restaurant']['id']);
      },
      child: Container(
        width: 120,
        decoration: BoxDecoration(
          // color: Colors.white,
          border: Border.all(
            color: Colors.grey, // Border color
            width: 1.0, // Border width
          ),
          borderRadius: BorderRadius.circular(8.0), // Border radius
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          // mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: double.infinity,
              height: 110,
              child: Image.network(
                "${restaurant.baseUrl}${allPromotion[index]['picture']}",
                fit: BoxFit.cover,
              ),
            ),
            SizedBox(
              height: 10,
            ),
            Text(
              "${allPromotion[index]['restaurant']['name']}",
              style: TextStyle(
                fontFamily: "Poppins",
                fontSize: 15,
              ),
            )
          ],
        ),
      ),
    );
  }
}

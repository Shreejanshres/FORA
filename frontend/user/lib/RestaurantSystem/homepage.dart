import 'package:dio/dio.dart';
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
  String baseUrl = 'http://192.168.1.66:8000';
  Restaurant restaurant = Restaurant(); // Initialize your Restaurant class
  bool isLoading=true;
  @override
  void initState() {
    super.initState();
    data(); // Call the data function when the widget is first created
    getdata();
  }

  Future<void> data() async {
    var prefs = await SharedPreferences.getInstance();
    setState(() {
      userLocation = prefs.getString('currentlocation') ?? '';
    });
  }

  Future<void> getdata() async {
    try {
      await restaurant.getrestaurantdata(); // Assuming getRestaurantData() is an asynchronous method
      setState(() {
        isLoading=false;
      }); // Update the state to rebuild the UI with the fetched data
    } catch (e) {
      // Handle error if any
      print('Error loading restaurant data: $e');
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

  Container body() {
    return Container(
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
                String name = restaurant.restaurants[index]['name'];
                String pictureUrl =
                    restaurant.restaurants[index]['picture'] ?? '';
                print(baseUrl + pictureUrl);
                int id= restaurant.restaurants[index]['id'] ?? 0;
                return restaurantDisplay(name,id, index, baseUrl + pictureUrl);
              },
            ),
          ),
          Text("Menu Items")
        ],
      ),
    );
  }

  AppBar appBar() {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 1,
      title: InkWell(
          onTap: () {},
          splashColor: const Color(0xFFED4A25),
          splashFactory: InkRipple.splashFactory,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.location_pin, size: 15.0),
                  SizedBox(height: 10.0),
                  Text("Your location", style: TextStyle(fontSize: 15.0)),
                ],
              ),
              Text(
                userLocation,
                style: const TextStyle(fontSize: 15.0),
              )
            ],
          )),
      actions: [
        IconButton(
            onPressed: () {
              // showSearch(context: context, delegate: SearchBar());
            },
            icon: const Icon(Icons.search_rounded))
      ],
    );
  }

  InkWell restaurantDisplay(String name, int id,int index, String pictureUrl) {
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
            Image.network(
              pictureUrl,
              width: 50,
              height: 50,
            ),
            Text(name),
          ],
        ),
      ),
    );
  }
}

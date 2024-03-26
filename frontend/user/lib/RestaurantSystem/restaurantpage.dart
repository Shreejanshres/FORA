import 'dart:convert';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:user/Controllers/RestaurantController.dart';

class RestaurantPage extends StatefulWidget {
  const RestaurantPage({Key? key}) : super(key: key);

  @override
  _RestaurantPageState createState() => _RestaurantPageState();
}

class _RestaurantPageState extends State<RestaurantPage> {
  late int id;
  bool isLoading = true;
  Restaurant restaurant = new Restaurant();

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    id = ModalRoute.of(context)?.settings.arguments as int;
    getmenu();
  }

  Future<void> getmenu() async {
    try {
      await restaurant.GetMenu(id);
      setState(() {
        isLoading = false;
      });
    } catch (e) {
      print('Error loading restaurant data: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appbar(),
      body: isLoading ? Center(child: CircularProgressIndicator()) : body(),
    );
  }

  SingleChildScrollView body() {
    String BaseUrl = 'https://192.168.1.66:8000';
    return SingleChildScrollView(
      child: Container(
        width: double.maxFinite,
        child: Column(
          children: [
            Stack(
              children: [
                Container(
                  height: 250,
                  width: double.maxFinite,
                  child: Opacity(
                    opacity: 0.7,
                    child: Image.network(
                      '${BaseUrl}${restaurant.restrodata['coverphoto']}',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Positioned(
                  bottom: 0,
                  left: 0,
                  child: Container(
                    color: Colors.white,
                    height: 100,
                    width: 100,
                    child: Image.network(
                      '${BaseUrl}${restaurant.restrodata['picture']}',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ],
            ),
            Container(
              // color: Colors.cyan,
              width: double.maxFinite,
              padding: EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    restaurant.restrodata['name'] ?? '',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      fontFamily: "Poppins",
                    ),
                  ),
                  Row(
                    children: [
                      Icon(Icons.location_on_outlined, size: 15),
                      SizedBox(width: 2),
                      Text(
                        restaurant.restrodata['address'] ?? '',
                        style: TextStyle(fontSize: 12, fontFamily: "Poppins"),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      Icon(Icons.phone_android, size: 15),
                      SizedBox(width: 2),
                      Text(
                        restaurant.restrodata['phonenumber'] ?? '',
                        style: TextStyle(fontSize: 12, fontFamily: "Poppins"),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      Icon(
                        Icons.access_time_outlined,
                        size: 15,
                      ),
                      SizedBox(width: 2),
                      Text(
                        restaurant.restrodata['delivery_time'] ?? '',
                        style: const TextStyle(
                          fontSize: 12,
                          fontFamily: "Poppins",
                        ),
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  Container( child: menu())
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Column menu() {
    return Column(
      children: [
        Text(
          "Menu",
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            fontFamily: "Poppins",
          ),
        ),
        ListView.builder(
          shrinkWrap: true,
          itemCount: restaurant.headingdata.length,
          itemBuilder: (context, index) {
            return Column(
              children: [
                Text(
                  restaurant.headingdata[index]['heading_name'] ?? '',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    fontFamily: "Poppins",
                  ),
                ),
                Column(
                  children: restaurant.headingdata[index]["menuitem_set"]
                      .map<Widget>((item) => menuitem(item))
                      .toList(),
                ),
              ],
            );
          },
        )
      ],
    );
  }

  Widget menuitem(dynamic item) {
    return Container(
      height: 45,
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: Colors.grey, // Change color as needed
            width: 2.0, // Adjust the width as needed
          ),
        ),
      ),
      child:  InkWell(
          onTap: (){
            item['restaurant_id'] = restaurant.restrodata['id'];
            Navigator.pushNamed(context, '/itempage', arguments: item);
          },
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                item['item_name'] ?? '',
                style: TextStyle(
                  fontSize: 15,

                ),
              ),
              Text(item['price'] ?? '',
                style: TextStyle(
                  fontSize: 15,
                ),
              ),

            ],
          ),
        ),
    );
  }

  AppBar appbar() {
    return AppBar(
      title: Text(restaurant.restrodata['name'] ?? ''),
      backgroundColor: Color(0xFFED4A25),
      centerTitle: true,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_rounded),
        onPressed: () {
          Navigator.pop(context);
        },
      ),
    );
  }
}

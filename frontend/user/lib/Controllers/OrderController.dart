import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import "package:dio/dio.dart";
class Order{
  String baseUrl='http://192.168.1.66:8000';
  // String baseUrl='http://shreejan.pythonanywhere.com';
  late List<dynamic> cartitem;
  late String name;
  late String picture;
  List<int> quantity=[];
  List<double> price = [];
  List<String> notes=[];
  double subtotal=0.0;

  Future<int?> getData()async {
    var prefs = await SharedPreferences.getInstance();
    String? userIdString = prefs.getString('id');
    if (userIdString != null) {
      try {
        int userId = int.parse(userIdString);
        return userId;
      } catch (e) {
        print("Error parsing user ID: $e");
        return null;
      }
    }
    return null; // Return null if SharedPreferences value is null
  }
  Future<Map<String,dynamic>> addtocart(int restaurant, int item, int quantity, String notes) async {
    int? userId = await getData();
    Map<String, dynamic> data = {
      "user_id": userId,
      "restaurant": restaurant,
      "item": item,
      "quantity": quantity,
      "notes": notes
    };
    String postData = json.encode(data);
      var response = await Dio().post('$baseUrl/restaurant/addtocart/$userId/', data: postData);
      return response.data;
  }

  Future<void> getcart() async {
    int? userId = await getData();
    var response = await Dio().get('$baseUrl/restaurant/getcart/$userId/');
    // int restaurant=response.data['cart_item'][0]['restaurant'];
    // print(response.data['cart_item'][0]['restaurant']);
    cartitem=response.data['cart']['cart_item'];
    for(int i=0;i<cartitem.length;i++){
      double priceValue = double.parse(cartitem[i]['item']['price']); // Parse as double
      price.add(priceValue);
      quantity.add(cartitem[i]['quantity']);
      notes.add(cartitem[i]['notes']);
    }
    for(int i=0;i<price.length;i++){
      double total=price[i]*quantity[i];
      subtotal+=total;
    }
    name=response.data['restaurant'];
    picture=baseUrl+response.data['picture'];
  }

  void updatesubtotal() {
    subtotal=0;
    for(int i=0;i<price.length;i++){
      double total=price[i]*quantity[i];
      subtotal+=total;
    }
  }
}
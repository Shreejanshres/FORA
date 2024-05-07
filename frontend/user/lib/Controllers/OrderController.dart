import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import "package:dio/dio.dart";
class Order{
  // String baseUrl='http://10.22.10.79:8000';
  String baseUrl='http://192.168.1.66:8000';
  // String baseUrl='http://10.22.31.33:8000';
  // String baseUrl='http://192.168.1.116:8000';
  // String baseUrl='http://shresthashreejan.com.np';
   List<dynamic> cartitem=[];
  List<dynamic> names=[];
  List<dynamic> pictures=[];
  List<dynamic> restroid=[];

  String name='';
  String picture='';
  List<int> quantity=[];
  List<double> price = [];
  List<String> notes=[];
  double subtotal=0.0;
  int cartid=0;

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
    print(postData);
      var response = await Dio().post('$baseUrl/restaurant/addtocart/', data: postData);
      return response.data;
  }

  Future<void> getcart() async {
    int? userId = await getData();
    var response = await Dio().get('$baseUrl/restaurant/getcart/$userId/');
    print(response.data);
    if(response.data['success']){
      names=response.data['restaurant'];
      List<dynamic> picturePaths = response.data['picture'];
      for (String path in picturePaths) {
        String picture = baseUrl + path;
        pictures.add(picture);
      }
      restroid=response.data['id'];

      // picture=response.data['picture'] != null ? baseUrl + response.data['picture'] : '';

    }
    print(names);
    print(pictures);
    print(restroid);
  }
  Future<Map<String,dynamic>> getindividualcart(int id) async {
    int? userId = await getData();
    var data={
      "user_id":userId,
      "restaurant_id":id
    };
    var response = await Dio().get('$baseUrl/restaurant/getindividualcart/',data: data);
    // print(response.data);
    if(response.data['success']){
      cartitem=response.data['cart'];
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
      picture=response.data['picture'] != null ? baseUrl + response.data['picture'] : '';

    }
    // print("cartitem: ${cartitem}");
    // print("notes: ${notes.length}");
    // print("price${price}");
    // print("price${quantity}");
    // print("price${subtotal}");
    return response.data;
  }

  void updateSubtotal() {
    subtotal=0;
    for(int i=0;i<price.length;i++){
      double total=price[i]*quantity[i];
      subtotal+=total;
    }
  }

  Future<bool> delete(int id) async {
    var response = await Dio().delete('$baseUrl/restaurant/delete/$id/');
    print(response);
    if(response.data['success']){
      getcart();
      return true;
    }
    else{
      return false;
    }
  }
  Future<Map<String,dynamic>> updatecart() async {
    for(int i=0;i<cartitem.length;i++){
      cartitem[i]['quantity']=quantity[i];
      cartitem[i]['notes']=notes[i];
    }
    var response = await Dio().put('$baseUrl/restaurant/update/',data: jsonEncode(cartitem));
    return response.data;

  }
  Future<Map<String,dynamic>> getbill() async{
    int? userId = await getData();
    var response= await Dio().get('$baseUrl/restaurant/getbill/$userId/');
    return response.data;
  }

  Future<Map<String,dynamic>> order(String payment_method, bool ispaid, String address, double totalprice,int restro_id)async{
    int? userId = await getData();
  print("from order function: ");
  Map<String,dynamic> data={
    "user_id": userId,
    "restaurant_id":restro_id,
    "is_paid":ispaid,
    "address":address,
    "payment_method": payment_method,
    "total_price":totalprice,
  };
  print(data);
  var response= await Dio().post('$baseUrl/restaurant/order/',data: jsonEncode(data));
  return response.data;
  }

  Future<Map<String,dynamic>> getorderhistory() async {
    int? userId = await getData();
    var response = await Dio().get('$baseUrl/restaurant/getorderbyuser/$userId/',);
    return response.data;
  }
  
  Future<Map<String,dynamic>> verifypayment(token,int amount ,String productname,idx)async{
    var prefs = await SharedPreferences.getInstance();
    String? email = prefs.getString('email');

    var data={
      "token": token,
       "amount":amount,
      "email":email,
      "product_name": productname,
      "idx":idx,
    };
    print(data);
    print(token);
    print(amount);
    print(email);

    var response = await Dio().get('$baseUrl/payment/', data: data);
    print(response);
    return response.data;
  }
}
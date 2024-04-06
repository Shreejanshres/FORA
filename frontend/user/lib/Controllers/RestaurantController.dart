import 'package:dio/dio.dart';

class Restaurant {
  List<String> restaurantNames = [];
  List<dynamic> restaurants = [];
  Map<String, dynamic> restrodata = {};
  List<dynamic> headingdata = [];
  String baseUrl = 'http://10.22.10.79:8000';
  // String baseUrl = 'http://shreejan.pythonanywhere.com';

  Future<void> getrestaurantdata() async {
    try {
      var response = await Dio().get('$baseUrl/admin/viewrestaurant/');
      print(response.data);
      if (response.statusCode == 200) {
        restaurants = response.data;
        restaurantNames = restaurants.map((restaurant) {
          return restaurant['name'].toString();
        }).toList();
        print("finish get restaurant");
      } else {
        print('Error fetching restaurant data. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching restaurant data: $e');
      // Handle the error, e.g., show an error message to the user
    }
  }

  Future<void> GetMenu(int id) async {
    try {
      var response = await Dio().get('$baseUrl/restaurant/display_headings/$id/');
      print(response.data);
      if (response.statusCode == 200) {
        Map<String, dynamic> jsonDataMap = response.data;
        restrodata = jsonDataMap['data'][0];
        headingdata = jsonDataMap['data'][0]['heading_set'];
        print(restrodata);
        print(headingdata);

        print("finish get restaurant");
      } else {
        print('Error fetching restaurant data. Status code: ${response.statusCode}');
      }
      // await storeInLocal(jsonDataMap);
    } catch (e) {
      print('Error fetching restaurant data: $e');
      // Handle the error, e.g., show an error message to the user
    }
  }
}

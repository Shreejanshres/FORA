import 'package:dio/dio.dart';

class Restaurant {
  List<String> restaurantNames = [];
  List<dynamic> restaurants = [];
  Map<String, dynamic> restrodata = {};
  List<dynamic> headingdata = [];
  // String baseUrl = 'http://10.22.10.79:8000';
  String baseUrl='http://192.168.1.66:8000';
  // String baseUrl='http://shresthashreejan.com.np';
  // String baseUrl='http://192.168.1.116:8000';

  Future<void> getrestaurantdata() async {
    try {
      var response = await Dio().get('$baseUrl/admin/viewrestaurant/');
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
      if (response.statusCode == 200) {
        Map<String, dynamic> jsonDataMap = response.data;
        restrodata = jsonDataMap['data'][0];
        headingdata = jsonDataMap['data'][0]['heading_set'];

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

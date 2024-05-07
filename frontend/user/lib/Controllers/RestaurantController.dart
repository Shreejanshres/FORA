
import 'package:dio/dio.dart';

class Restaurant {
  List<String> restaurantNames = [];
  List<dynamic> restaurants = [];
  Map<String, dynamic> restrodata = {};
  List<dynamic> headingdata = [];
  // String baseUrl = 'http://10.22.31.33:8000';
  String baseUrl='http://192.168.1.66:8000';
  // String baseUrl='http://172.23.240.1:8000';
  // String baseUrl='http://shresthashreejan.com.np';
  // String baseUrl='http://192.168.1.116:8000';

  Future<void> getrestaurantdata() async {
    try {
      var response = await Dio().get('$baseUrl/restaurant/viewmenu/');
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

  Future<Map<String,dynamic>> getpromotion() async{
      var response = await Dio().get('$baseUrl/restaurant/getpromotion');
      return response.data;
  }

  Future<List<Map<String, dynamic>>> fetchSuggestions(String searchValue) async {
    await Future.delayed(const Duration(milliseconds: 750));

    List<Map<String, dynamic>> suggestions = [];

    // Fetch restaurant data if not already fetched
    if (restaurants == null) {
      await getrestaurantdata();
    }

    suggestions = restaurants
        .where((restaurant) => restaurant['name'].toString().toLowerCase().contains(searchValue.toLowerCase()))
        .map((restaurant) {
      return {
        'name': restaurant['name'].toString(),
        'id': restaurant['id'], // Assuming ID is present in your restaurant data
      };
    }).toList();

    return suggestions;
  }
}

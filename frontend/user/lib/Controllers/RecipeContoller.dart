import "dart:convert";

import "package:dio/dio.dart";
import "package:image_picker/image_picker.dart";
import "package:shared_preferences/shared_preferences.dart";

class Recipe {
  List<String> titles = [];
  List<String> descriptions = [];
  List<String> imageUrls = [];
  List<String> timeTaken = [];
  List<String> ingredients = [];
  List<String> directions = [];
  List<String> userNames = [];
  List<String> profileUrls = [];
  List<int> id = [];
  // String baseUrl='http://10.22.10.79:8000';
  String baseUrl='http://192.168.1.66:8000';
  // String baseUrl='http://192.168.1.116:8000';
  // String baseUrl='http://shreejan.pythonanywhere.com';
  bool isLoading=true;

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

  Future<void> getRecipe() async {
    if (titles.isEmpty) {
      try {
        var response = await Dio().get('$baseUrl/getrecipe/');
        List<dynamic> recipes = response.data['message'];
        for (var recipe in recipes) {
          titles.add(recipe['title'] ?? '');
          descriptions.add(recipe['description'] ?? '');
          imageUrls.add((baseUrl + recipe['image']) ?? '');
          timeTaken.add(recipe['time'] ?? '');
          ingredients.add(recipe['ingredients'] ?? '');
          directions.add(recipe['directions'] ?? '');
          userNames.add(recipe['username'] ?? '');
          id.add(recipe['id']?? '');
          if (recipe['profile_pic'] != null) {
            profileUrls.add(baseUrl + recipe['profile_pic']);
          } else {
            profileUrls.add('');
          }
    }
    print("finish recipe");
    isLoading=false;
    } catch (e) {
    print('Error fetching recipe data: $e');
    }
  }

  }
  Future<Map<String, dynamic>> addRecipe(String jsonData) async {
    int? userId = await getData(); // Assuming this function retrieves the user ID
    try {
      Map<String, dynamic> recipeData = jsonDecode(jsonData);
      recipeData['user'] = userId;
      String updatedJsonData = jsonEncode(recipeData);
      var response = await Dio().post(
        '$baseUrl/addrecipe/',
        data: updatedJsonData,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
          },
        ),
      );
      return response.data;
    } catch (e) {
      print("Error in adding recipe: $e");
      throw e;
    }
  }
  Future<Map<String,dynamic>> getrecipebyid(id) async{
    var response = await Dio().get(
      '$baseUrl/getrecipebyid/${id}',
    );
    var responseData = response.data;

    return responseData;
  }

  Future<Map<String,dynamic>> follow(followingto) async{
    int? userId = await getData(); // Assuming this function retrieves the user ID
    var postdata={
      "followingto":followingto,
      "followedby":userId,
    };
    var response = await Dio().post(
      '$baseUrl/addfollow/',
      data: postdata
    );
    var responseData = response.data;
    return responseData;
  }

  Future<Map<String,dynamic>> checkfollower(followingto) async{
    int? userId = await getData(); // Assuming this function retrieves the user ID
    var postdata={
      "followingto":followingto,
      "followedby":userId,
    };
    print(postdata);
    var response = await Dio().get(
        '$baseUrl/checkfollow/',
        data: postdata
    );
    var responseData = response.data;
    return responseData;
  }
  Future<Map<String,dynamic>> deletefollower(followingto) async{
    int? userId = await getData(); // Assuming this function retrieves the user ID
    var postdata={
      "followingto":followingto,
      "followedby":userId,
    };
    print(postdata);
    var response = await Dio().delete(
        '$baseUrl/deletefollow/',
        data: postdata
    );
    var responseData = response.data;
    return responseData;
  }

  Future<bool> checkifsameuser(user) async{
    int? userId = await getData(); // Assuming this function retrieves the user ID
    print("from recipe: ${user}");
    print("from userid: ${userId}");
    if(user==userId){
      return true;
    }
    else{
      return false;
    }
  }
}
pickImage(ImageSource source) async{
  final ImagePicker _imagePicker = ImagePicker();
  XFile? _file = await _imagePicker.pickImage(source: source);
  if(_file != null){
    return await _file.readAsBytes();
  }
  print(" no Image Selected");
}

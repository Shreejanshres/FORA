import "package:dio/dio.dart";

class Recipe {
  List<String> titles = [];
  List<String> descriptions = [];
  List<String> imageUrls = [];
  List<String> timeTaken = [];
  List<String> ingredients = [];
  List<String> directions = [];
  List<String> userNames = [];
  List<String> profileUrls = [];
  String baseUrl='http://192.168.1.66:8000';
  // String baseUrl='http://shreejan.pythonanywhere.com';
  bool isLoading=true;
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
          profileUrls.add((baseUrl + recipe['profile_pic']) ?? '');
        }
        print("finish recipe");
        isLoading=false;
      } catch (e) {
        print('Error fetching restaurant data: $e');
      }
    }
  }
}

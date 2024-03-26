import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
class User{
  bool isLogged=false;
  String errormessage = "";
  String baseUrl='http://192.168.1.66:8000';
  // String baseUrl='http://shreejan.pythonanywhere.com';
  Future<void> login(email,password)async{
    try {
      var response = await Dio().post(
          '$baseUrl/login/',
        data: {'email': email, 'password': password},
      );
      var responseData = response.data;
      print(responseData);
      if (responseData['success']) {
        await saveUserDataToSharedPreferences(responseData['message']);
        isLogged=true;
      }
      else{
        errormessage=responseData['message'];
      }
    } catch (error) {
      print('Error during login: $error');
    }
  }
  Future<void> saveUserDataToSharedPreferences(
      Map<String, dynamic> userData) async {
    var prefs = await SharedPreferences.getInstance();
    userData.forEach((key, value) {
      final dataToSave = value != null ? value.toString() : 'no data';
      prefs.setString(key, dataToSave);
    });
  }

}
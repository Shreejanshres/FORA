import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
class User{
  // String baseUrl='http://10.22.10.79:8000';
  String baseUrl='http://192.168.1.66:8000';
  // String baseUrl='http://shreejan.pythonanywhere.com';
  Future<Map<String,dynamic>> login(email,password)async{
      var response = await Dio().post(
          '$baseUrl/login/',
        data: {'email': email, 'password': password},
      );
      var responseData = response.data;
      print(responseData);
      if (responseData['success']) {
        await saveUserDataToSharedPreferences(responseData['message']);
      }
     return responseData;

  }
  Future<void> saveUserDataToSharedPreferences(
      Map<String, dynamic> userData) async {
    var prefs = await SharedPreferences.getInstance();
    userData.forEach((key, value) {
      final dataToSave = value != null ? value.toString() : 'no data';
      prefs.setString(key, dataToSave);
    });
  }

  Future<Map<String,dynamic>> userSignup(data) async {
    data=jsonEncode(data);
    var response = await Dio().post(
      '$baseUrl/',
      data:data,
    );
    var responseData = response.data;
    return responseData;
  }
  Future<Map<String,dynamic>> forgetpassword(email) async {
      var response = await Dio().post(
        '$baseUrl/forgetpassword/',
        data: {'email': email},
      );
      var responseData = response.data;
      print(responseData['success']);
      return responseData;
      }

  Future<Map<String,dynamic>> validatation(otp) async {
      var prefs = await SharedPreferences.getInstance();
      var email = prefs.getString('email');
      var data={
        "otp": otp,
        "email":email
      };
      var response = await Dio().post(
        '$baseUrl/validateotp/',
        data: data,
      );
      var responseData = response.data;
      print(responseData);
      return responseData;
  }

  Future<Map<String,dynamic>> changepassword(password) async{
    var prefs = await SharedPreferences.getInstance();
    var email = prefs.getString('email');
    var data={
      "newpassword": password,
      "email":email
    };
    var response = await Dio().post(
      '$baseUrl/updatepassword/',
      data:data ,
    );
    var responseData = response.data;
    print(responseData);
    return responseData;
  }

}
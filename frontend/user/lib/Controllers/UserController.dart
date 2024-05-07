import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
class User{
  // String baseUrl='http://10.22.31.33:8000';
  String baseUrl='http://192.168.1.66:8000';
  // String baseUrl='http://192.168.1.116:8000';
  // String baseUrl='http://shresthashreejan.com.np';
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
    print("hi");
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

  Future<Map<String,dynamic>> updatepic(data) async{
    var response = await Dio().post(
      '$baseUrl/updatepicture/',
      data:data ,
    );
    var responseData = response.data;
    if(responseData['success']){
      await saveUserDataToSharedPreferences(responseData['data']);
    }
    return responseData;
  }

  Future<int> getfollowers(id) async{
    var response = await Dio().get(
      '$baseUrl/getfollow/${id}',
    );
    var responseData = response.data;
    List<dynamic> message= responseData['message'];
    print('Variable type of message: ${message.runtimeType}');
    return message.length;
  }

  Future<int> getfollowing(id) async{
    var response = await Dio().get(
      '$baseUrl/getfollowing/${id}',
    );
    var responseData = response.data;
    List<dynamic> message= responseData['message'];
    print('Variable type of message: ${message.runtimeType}');
    return message.length;
  }
  Future<List<dynamic>> getpostbyuser(id) async{
    var response = await Dio().get(
      '$baseUrl/getpostbyuser/${id}',
    );
    var responseData = response.data;
    List<dynamic> message= responseData['message'];
    return message;
  }
  Future<List<dynamic>> getrecipebyuser(id) async{
    var response = await Dio().get(
      '$baseUrl/getrecipebyuser/${id}',
    );
    var responseData = response.data;
    List<dynamic?> message= responseData['message'];
    return message;
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


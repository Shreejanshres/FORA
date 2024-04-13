import 'dart:convert';

import "package:dio/dio.dart";
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:timeago/timeago.dart' as timeago;




class Post{
  List<String> caption=[];
  List<String> postedAt=[];
  List<String?> imageUrl = [];
  List<String> likeCount=[];
  List<String> comment=[];
  List<String> commentUser=[];
  List<String> commentPicUrl=[];
  List<String> commentedAt=[];
  List<Map<String, dynamic>> data = [];
  List<Map<String, dynamic>> commentdata = [];
  bool isLoading=true;
  // String baseUrl='http://10.22.10.79:8000';
  String baseUrl='http://192.168.1.66:8000';
  // String baseUrl='http://shreejan.pythonanywhere.com';

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
    return null;
  }

  Future<void> getPost() async {
    if(data.isEmpty) {
      try {
        var response = await Dio().get('$baseUrl/getpost/');
        List<dynamic> posts = response.data['message'];

        for (var post in posts) {
          DateTime createdAt = DateTime.parse(post['created_at']);
          String timeAgo = timeago.format(createdAt, locale: 'en_short');

          Map<String, dynamic> postJson = {
            'id': post['id']?? '',
            'caption': post['caption'] ?? '',
            'postedAt': timeAgo,
            'imageUrl': post['image'] != null ? (baseUrl + post['image']) : ' ',
            'likeCount': post['likes_count']?.toString() ?? '',
            'user': post['username'] ?? '',
            'profileUrl': post['profile_pic'] != null ? (baseUrl + post['profile_pic']) : ' ' ,
          };
          data.add(postJson);
        }

        print("finish post");
        isLoading=false;
      } catch (error) {
        print('Error fetching posts: $error');
      }
    }
  }
  Future<void> getComment(id) async {
    if(commentdata.isEmpty) {
      try {
        var response = await Dio().get('$baseUrl/getcomment/$id');
        List<dynamic> comments = response.data['message'];
        for (var comment in comments) {
          DateTime createdAt = DateTime.parse(comment['created_at']);
          String timeAgo = timeago.format(createdAt, locale: 'en_short');

          Map<String, dynamic> commentJson = {
            'id': comment['id']?? '',
            'username': comment['username'] ?? '',
            'profileUrl': comment['profile_pic'] != null ? (baseUrl + comment['profile_pic']) : null ,
            'postedAt': timeAgo,
            'text': comment['text']?? ''

          };
          commentdata.add(commentJson);
        }
        print(commentdata);
        print("finish comment");
        isLoading=false;
      } catch (error) {
        print('Error fetching posts: $error');
      }
    }
  }

  Future<Map<String, dynamic>> addPost(String jsonData) async {
    int? userId = await getData(); // Assuming this function retrieves the user ID
    try {
      Map<String, dynamic> postdata = jsonDecode(jsonData);
      postdata['user'] = userId;
      String updatedJsonData = jsonEncode(postdata);
      var response = await Dio().post(
        '$baseUrl/addpost/',
        data: updatedJsonData,
        options: Options(
          headers: {
            'Content-Type': 'application/json',
          },
        ),
      );
      print(response.data);
      return response.data;
    } catch (e) {
      print("Error in adding recipe: $e");
      throw e;
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

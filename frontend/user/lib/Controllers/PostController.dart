import "package:dio/dio.dart";
import 'package:timeago/timeago.dart' as timeago;

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';


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
  bool isLoading=true;
  String baseUrl='http://192.168.1.66:8000';
  // String baseUrl='http://shreejan.pythonanywhere.com';

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
    if(data.isEmpty) {
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
          data.add(commentJson);
        }
        print("finish comment");
        isLoading=false;
      } catch (error) {
        print('Error fetching posts: $error');
      }
    }
  }
}


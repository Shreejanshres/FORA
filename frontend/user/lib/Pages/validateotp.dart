import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:user/Pages/login.dart';

class validateOtp extends StatefulWidget {
  const validateOtp({super.key});

  @override
  State<validateOtp> createState() => _validateOtpState();
}

class _validateOtpState extends State<validateOtp> {
  TextEditingController otpController = TextEditingController();
  String otp = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: topbar(),
      body: body(),
    );
  }

  void validatation() async {
    try {
      var prefs = await SharedPreferences.getInstance();
      var email = prefs.getString('email');
      print('$email + $otp');
      var response = await Dio().post(
        'https://fora-1.onrender.com/validateotp/',
        data: {'email': email, 'otp': otp},
      );
      var responseData = response.data;
      print(responseData);
      if (responseData['success']) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginPage()),
        );
      }
    } catch (error) {
      print("Error sending otp: $error");
    }
  }

  Container body() {
    double screenHeight = MediaQuery.of(context).size.height;
    return Container(
      height: screenHeight,
      padding: const EdgeInsets.all(30),
      child: Column(
        children: [
          const Text(
            'Enter One-Time Password (OTP) that we have send in email to verify it is  you',
            style: TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 20),
          TextField(
            controller: otpController,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              labelText: 'Otp',
              hintText: 'Enter your otp',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              otp = otpController.text;

              validatation();
            },
            style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1565C0)),
            child: const Text(
              'Send OTP',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  AppBar topbar() {
    return AppBar(
      title: const Text("Enter Otp"),
      centerTitle: true,
    );
  }
}

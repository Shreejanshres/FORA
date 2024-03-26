import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:user/Pages/validateotp.dart';
import 'package:shared_preferences/shared_preferences.dart';
class ForgotPassword extends StatefulWidget {
  const ForgotPassword({super.key});

  @override
  State<ForgotPassword> createState() => _ForgotPasswordState();
}

class _ForgotPasswordState extends State<ForgotPassword> {
  TextEditingController emailController=TextEditingController();
  String email='';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: topbar(),
      body:body(),
    );
  }

  void handleotp() async {
    try {
      var response = await Dio().post(
        'https://fora-1.onrender.com/forgetpassword/',
        data: {'email': email},
      );
      var responseData = response.data;
      print(responseData['success']);
      if (responseData['success']) {
        var prefs = await SharedPreferences.getInstance();
        prefs.setString('email', email);

        // Use setState to trigger a rebuild of the UI after setting the email
        setState(() {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const validateOtp()),
          );
        });
      }
    } catch (error) {
      print("Error sending OTP: $error");
    }
  }

  Container body(){
    double screenHeight = MediaQuery.of(context).size.height;
    return Container(
      height: screenHeight,
      padding: const EdgeInsets.all(30),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Text(
            'Enter your email to receive a One-Time Password (OTP) for password reset.',
            style: TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 20),
          TextField(
            controller: emailController,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              labelText: 'Email',
              hintText: 'Enter your email',
              border: OutlineInputBorder(),

            ),

          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              email=emailController.text;
              print(email);
              // Navigator.pushReplacement(
              //   context,
              //   MaterialPageRoute(builder: (context) => validateOtp()),
              // );
              handleotp();
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1565C0)),
            child: const Text('Send OTP',style: TextStyle(color: Colors.white),),
          ),
        ],
      )
   );
  }

  AppBar topbar(){
    return AppBar(
      title: const Text("Forgot Password"),
      centerTitle: true,
      leading: IconButton(icon:const Icon(Icons.arrow_back_rounded),onPressed: (){print("back to login");},),
    );
  }
}

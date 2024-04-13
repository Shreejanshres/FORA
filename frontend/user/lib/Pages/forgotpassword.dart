import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:user/Controllers/UserController.dart';
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
  User user =new User();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: topbar(),
      body:body(),
    );
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
            onPressed: () async{
              email=emailController.text;
              print(email);
              var response =await user.forgetpassword(email);
              print(response);
              if(response['success']){
                var prefs = await SharedPreferences.getInstance();
                prefs.setString('email', email);
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => validateOtp()),
                );
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(response['message']),
                    duration: Duration(seconds: 3),
                  ),
                );
              }
              else{
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(response['message']),
                    duration: Duration(seconds: 3),
                  ),
                );
              }

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

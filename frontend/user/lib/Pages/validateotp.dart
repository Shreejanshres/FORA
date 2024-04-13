import 'package:flutter/material.dart';
import 'package:user/Controllers/UserController.dart';
import 'package:user/Pages/changePassword.dart';

class validateOtp extends StatefulWidget {
  const validateOtp({super.key});

  @override
  State<validateOtp> createState() => _validateOtpState();
}

class _validateOtpState extends State<validateOtp> {
  TextEditingController otpController = TextEditingController();
  String otp = '';
  User user=new User();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: topbar(),
      body: body(),
    );
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
            onPressed: () async{
              otp = otpController.text;
              var response= await user.validatation(otp);
              if (response['success']) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const changePassword()),
                );
              }
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

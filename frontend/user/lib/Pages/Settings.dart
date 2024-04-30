import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:user/Pages/forgotpassword.dart';
import 'package:user/Pages/loginPage.dart';
import 'package:user/Theme/theme_provider.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({Key? key}) : super(key: key);

  @override
  _SettingsPageState createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool light = true; // Assuming this is your switch state

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: Text(
          "Settings",
          style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: FutureBuilder<String>(
        future: _getDataFromSharedPreferences(),
        builder: (BuildContext context, AsyncSnapshot<String> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else {
            return body(snapshot.data ?? 'no data');
          }
        },
      ),
    );
  }

  Future<String> _getDataFromSharedPreferences() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String data = prefs.getString('profile_pic') ?? 'no data';
    return data;
  }

  Widget body(String data) {
    // String baseUrl = 'https://shreejan.pythonanywhere.com';
    String baseUrl = 'http://192.168.1.66:8000';
    // String baseUrl='http://192.168.1.116:8000';
    return Container(
      width: double.infinity,
      child: Column(
        children: [
          Center(
            child: Column(
              children: [
                Container(
                  width: 150,
                  height: 150,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    image: DecorationImage(
                      image: data != 'no data'
                          ? NetworkImage('$baseUrl$data')
                              as ImageProvider<Object>
                          : AssetImage('images/defaultimage.png'),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                SizedBox(height: 10),
                OutlinedButton(
                  onPressed: () {
                    Navigator.pushNamed(context,'/editprofile');
                  },
                  child: Text(
                    "Edit Profile",
                  ),
                )
              ],
            ),
          ),
          SizedBox(height: 20),
          InkWell(
            onTap: () {
              Navigator.pushNamed(context,'/profile');
            },
            child: ListTile(
              title: Text("Accounts"),
              leading: Icon(Icons.person),
            ),
          ),
          SizedBox(height: 10),
          InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const ForgotPassword()),
              );
            },
            child: ListTile(
              title: Text("Change Password"),
              leading: Icon(Icons.security),
            ),
          ),
          SizedBox(height: 10),
          InkWell(
            onTap: () {
              Navigator.pushNamed(context, '/orderhistory');
            },
            child: ListTile(
              title: Text("Order History"),
              leading: Icon(Icons.shopping_basket),
            ),
          ),
          SizedBox(height: 10),
          InkWell(
            onTap: () {},
            child: ListTile(
              title: Text("FAQ"),
              leading: Icon(Icons.question_answer),
            ),
          ),

          SizedBox(height: 10),
          InkWell(
            onTap: () async{
              SharedPreferences prefs = await SharedPreferences.getInstance();
              await prefs.clear();
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                    builder: (context) => const LoginPage()),
              );
            },
            child: ListTile(
              title: Text("Logout"),
              leading: Icon(Icons.output),
            ),
          ),
          Switch(
            value: light,
            activeColor: Colors.grey.shade600,
            onChanged: (bool value) {
              setState(() {
                Provider.of<ThemeProvider>(context, listen: false)
                    .toggleTheme();
                light = value;
              });
            },
          )
        ],
      ),
    );
  }
}

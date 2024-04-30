
import 'package:flutter/material.dart';
import 'package:user/Controllers/RecipeContoller.dart';

class DetailRecipe extends StatefulWidget {
  const DetailRecipe({Key? key}) : super(key: key);

  @override
  _DetailRecipeState createState() => _DetailRecipeState();
}

class _DetailRecipeState extends State<DetailRecipe> {
  Recipe recipe = Recipe();
  bool isLoading = true;
  Map<String, dynamic> data = {};
  late int id;
  bool isfollowed=false;
  bool issame=false;


  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Access ModalRoute.of(context) here
    id = ModalRoute.of(context)?.settings.arguments as int;
    fetchRecipe(id);
  }

  Future<void> fetchRecipe(int id) async {
    try {
      var response = await recipe.getrecipebyid(id);
      print(response['message']);
      setState(() {
        data = response['message'];
      });
    } catch (e) {
      print("Error fetching recipe: $e");
      // Handle error gracefully
      setState(() {
        isLoading = false;
      });
    }
    checkfollow();
    checksameuser();
  }
  Future<void> checkfollow() async {
    try {
      var response = await recipe.checkfollower(data['user']);
      print(response);
      if(response['message']){
        setState(() {
          isfollowed=true;
          isLoading = false;
        });
      }
      else{
        setState(() {
          isLoading = false;
        });
      }
    } catch (e) {
      print("Error fetching recipe: $e");
      // Handle error gracefully
      setState(() {
        isLoading = false;
      });
    }
  }
  Future<void> checksameuser() async {
    try {
      var response = await recipe.checkifsameuser(data['user']);
      if(response) {
        setState(() {
          issame=true;
          isLoading = false;
        });
      }
      else{
        setState(() {
          issame=false;
          isLoading = false;
        });
      }
    } catch (e) {
      print("Error fetching recipe: $e");
      // Handle error gracefully
      setState(() {
        isLoading = false;
      });
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: isLoading ? Text('Loading...') : Text(data['title'] ?? 'Recipe Title'),
        centerTitle: true,
      ),
      body: isLoading? CircularProgressIndicator() : body(),
    );
  }

  Widget body() {
    return SingleChildScrollView(
      child: Container(
        padding: EdgeInsets.all(15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              height: 300,
              child: Image.network("${recipe.baseUrl}${data['image']} ", fit: BoxFit.cover)
            ),
            SizedBox(height: 5,),
            Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    image: DecorationImage(
                      image: data['profile_pic'] != null ? NetworkImage("${recipe.baseUrl}${data['profile_pic']}") as ImageProvider<Object> : AssetImage('images/defaultimage.png'),

                      fit: BoxFit.cover,

                    ),
                  ),
                ),
                SizedBox(
                  width: 15,
                ),
                Text(
                  "${data['username']}",
                  style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            SizedBox(height: 5,),
            Text('${data['description']}',
              style: TextStyle(
                fontSize: 15,
              ),
            ),
            Divider(thickness: 2,),
            Center(
              child: Text("Ingredients",
              style:TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ) ,
              ),
            ),
            Text("${data["ingredients"]}"),
            Divider(thickness: 2),
            Center(
              child: Text("Directions",
                style:TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ) ,
              ),
            ),
            Text("${data['directions']}"),
            Divider(thickness: 2),
            issame ? SizedBox(height: 5,): Container(
              child: Column(
                children: [
                  Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        image: DecorationImage(
                          image: data['profile_pic'] != null ? NetworkImage("${recipe.baseUrl}${data['profile_pic']}") as ImageProvider<Object> : AssetImage('images/defaultimage.png'),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),

                  Row(
                    mainAxisAlignment:MainAxisAlignment.center,
                    children: [
                      Text("Created by"),
                      SizedBox(width: 2,),
                      Text(
                        "${data['username']}",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  ElevatedButton(
                        onPressed: () async {
                          var response;
                          if (isfollowed) {
                            response = await recipe.deletefollower(data['user']);
                          } else {
                            response = await recipe.follow(data['user']);
                          }
                          print(response);
                          if (response['success']) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(response['message']),
                              ),
                            );
                            setState(() {
                              isfollowed=!isfollowed;
                            });


                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text("Error "),
                              ),
                            );
                          }
                        },
                        child: Text(
                          isfollowed ? 'Followed' : 'Follow',
                          style: TextStyle(color: Colors.white),
                        ),
                        style: ButtonStyle(
                          backgroundColor: MaterialStateProperty.all<Color>( isfollowed ? Colors.grey : Color(0xFFED4A25)),
                          shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                            RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8.0), // Set the border radius
                              side: BorderSide(color: Colors.transparent), // Add a slight border
                            ),
                          ),
                          minimumSize: MaterialStateProperty.all<Size>(
                            Size(150, 40), // Set the width to double.infinity and height to 50
                          ),
                        ),
                      )

                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}


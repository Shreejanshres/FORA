import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
// import 'package:flutter/widgets.dart';
import 'package:user/Controllers/RecipeContoller.dart';
import 'package:user/Controllers/PostController.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:user/Pages/AddRecipe.dart';
import 'dart:math';


class RecipePage extends StatefulWidget {
  const RecipePage({super.key});

  @override
  State<RecipePage> createState() => _RecipePageState();
}

class _RecipePageState extends State<RecipePage> {
  Recipe recipe = new Recipe();
  Post post = new Post();
  final random = Random();
  // @override
  // void initState() {
  //   super.initState();
  //   _loadRecipe(); // Call method to load recipe data when the widget is initialized
  // }
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _loadRecipe();
  }
  Future<void> _loadRecipe() async {
    try {
      await recipe
          .getRecipe(); // Assuming getRecipe() is an asynchronous method
      await post.getPost();
      setState(() {}); // Update the state to rebuild the UI with the fetched data
    } catch (e) {
      // Handle error if any
      print('Error loading recipe: $e');
    }
  }
  Future<void> _printSharedPreferences() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    Set<String> keys = prefs.getKeys();
    keys.forEach((key) {
      print('$key: ${prefs.get(key)}');
    });
  }
  @override
  Widget build(BuildContext context) {

    return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          title: Text("Recipes",style: TextStyle(fontWeight: FontWeight.bold)),
          actions: [
          ElevatedButton(onPressed: (){
            _printSharedPreferences();
            Navigator.push(
              context,
              PageRouteBuilder(
                pageBuilder: (context, animation, secondaryAnimation) => addRecipe(),
                transitionsBuilder: (context, animation, secondaryAnimation, child) {
                  var begin = Offset(0.0, 1.0);
                  var end = Offset.zero;
                  var curve = Curves.ease;
                  var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
                  return SlideTransition(
                    position: animation.drive(tween),
                    child: child,
                  );
                },
              ),
            );
            }, child: Row(
            children: [
              Icon(Icons.book_outlined,color: Colors.white,),
              Text("Add Recipe",style: TextStyle(color: Colors.white),)
            ],
          ),
            style: ButtonStyle(
              backgroundColor: MaterialStateProperty.all<Color>(Color(0xFFED4A25)),
              shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10.0), // Set the border radius
                  side: BorderSide(color: Colors.red), // Add a slight border
                ),
              ),
              minimumSize: MaterialStateProperty.all<Size>(
                Size(120, 40),
              ),
            ),
          )
          ],
        ),
        body: _buildRecipeBody()
    );
  }

  Widget _buildRecipeBody() {
    if (recipe.isLoading && post.isLoading) {
      // Show loading indicator while data is being fetched
      return Center(child: CircularProgressIndicator());
    } else {
      // Data is ready, display the recipe
      return body();
    }
  }

  SingleChildScrollView body() {
    return SingleChildScrollView(
      child: Container(

        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.black, width: 1),
                borderRadius: BorderRadius.circular(10),
              ),
              padding: EdgeInsets.symmetric(horizontal: 5),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      decoration: InputDecoration(
                        border: InputBorder.none,
                        labelText: 'Search',
                      ),
                    ),
                  ),
                  SizedBox(width: 10),
                  IconButton(
                    icon: Icon(Icons.search),
                    onPressed: () {},
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            Container(
              // color: Colors.yellow,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Feeling to cook?",style: TextStyle(fontSize: 25),),
                 Container(
                   // color:Colors.green,
                   height: 310,
                  child: ListView.separated(
                    scrollDirection: Axis.vertical,
                    shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    itemCount: 2,
                    separatorBuilder: (context, index) => SizedBox(height: 10),
                    itemBuilder: (context, index) {
                    if (index < recipe.imageUrls.length && recipe.imageUrls[index].isNotEmpty) {
                      final randomIndex = random.nextInt(recipe.titles.length);
                      return recipeContain(randomIndex);
                    }else{
                      return Container();
                    }
                    },
                  ),
                 ),
                  SizedBox(height: 20),
                  Text("Some great shares",style: TextStyle(fontSize: 25),),
                  Container(
                    // color: Colors.red,
                    height:150,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: post.data.length,
                      separatorBuilder: (context, index) => SizedBox(width:15),
                      itemBuilder: (context, index) {
                      if (index < post.data.length && post.data.isNotEmpty) {
                        final randomIndex = random.nextInt(post.data.length);
                        return postContain(randomIndex);
                      }else{
                        Container();
                      }
                      },
                    ),
                  ),
                  SizedBox(height: 20),
                  Text("New Recipe",style: TextStyle(fontSize: 25),),
                  Container(
                    // height:200,
                    child: GridView.builder(
                          shrinkWrap: true,
                          physics: NeverScrollableScrollPhysics(),
                          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount:2,
                            crossAxisSpacing: 10.0,
                            mainAxisSpacing: 10.0,
                          ),
                          itemCount: recipe.titles.length,
                          itemBuilder: (context, index) {
                          if (index < recipe.imageUrls.length && recipe.imageUrls[index].isNotEmpty) {
                            final randomIndex = random.nextInt(
                                recipe.titles.length);
                            return recipeContain(randomIndex);
                          }else{
                            return Placeholder();
                          }
                          },
                        ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }



  InkWell recipeContain(int index) {
    return InkWell(
        onTap: () {
          Navigator.pushNamed(context, '/detailrestaurant', arguments: index);
        },

        child: Stack(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(10.0),
              // Adjust the radius as needed
              child: Container(
                height: 150,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: NetworkImage(recipe.imageUrls[index]),
                    fit: BoxFit.cover,
                    colorFilter: ColorFilter.mode(
                        Colors.black.withOpacity(0.3), BlendMode.colorBurn),
                  ),
                ),
              ),
            ),

            Positioned(
              bottom: 10, // Adjust position as needed
              left: 10, // Adjust position as needed
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 30,
                        height: 30,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          image: DecorationImage(
                            image: recipe.profileUrls[index]!= null ?
                            NetworkImage(recipe.profileUrls[index])
                            :AssetImage('images/Logo.png') as ImageProvider,
                            fit: BoxFit.fitWidth,
                          ),
                        ),
                      ),
                      SizedBox(
                        width: 15,
                      ),
                      Text(
                        recipe.userNames[index],
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Text(
                    recipe.titles[index],
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        )
    );
  }

  InkWell postContain(int index) {
    return InkWell(
        onTap: () {
          },

        child: ClipRRect(
              borderRadius: BorderRadius.circular(10.0),

              child: Container(
                width: 250,

                padding: EdgeInsets.all(5),
                decoration: BoxDecoration(
                  // color: Colors.deepPurple,
                  borderRadius: BorderRadius.circular(10.0),
                  border: Border.all(
                    color: Colors.black,
                    width: 2.0,
                  ),
                ),
                child:Row(
                  children: [
                      Container(
                        width: 120,

                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 30,
                                  height: 30,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    image: DecorationImage(
                                     image: post.data[index]['profileUrl'] != null
                                            ? NetworkImage(post.data[index]['profileUrl'].toString().trim())
                                          : AssetImage('images/Logo.png') as ImageProvider,
                                      fit: BoxFit.fitWidth,
                                    ),
                                  ),
                                ),
                                SizedBox(width: 5),
                                Text(post.data[index]['user'])
                              ],
                            ),
                            Text(post.data[index]['postedAt']+'ago'),
                           Container(
                             height: 60,
                             child:  Text(post.data[index]['caption']),
                           ),
                            Row(
                              children: [
                               Icon(CupertinoIcons.heart_fill,color: Colors.red,size: 15,),
                               Text(post.data[index]['likeCount'])
                              ],
                            )
                          ],
                        ),


                      ),
                    Expanded(
                      child: Container(
                        height:130,
                        child: Image.network(
                          post.data[index]['imageUrl'],
                          fit: BoxFit.fitHeight,// Ensure the image covers the entire container
                        ),
                      ),
                    ),



                  ],
                ),
                ),
              ),

    );
  }
}

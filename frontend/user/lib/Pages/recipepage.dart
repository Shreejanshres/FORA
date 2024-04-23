import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
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
  Recipe recipe = Recipe();
  Post post = Post();
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
      setState(
          () {}); // Update the state to rebuild the UI with the fetched data
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
          title: const Text("Recipes",
              style: TextStyle(fontWeight: FontWeight.bold)),
          actions: [
            ElevatedButton(
              onPressed: () {
                _printSharedPreferences();
                Navigator.push(
                  context,
                  PageRouteBuilder(
                    pageBuilder: (context, animation, secondaryAnimation) =>
                        const addRecipe(),
                    transitionsBuilder:
                        (context, animation, secondaryAnimation, child) {
                      var begin = const Offset(0.0, 1.0);
                      var end = Offset.zero;
                      var curve = Curves.ease;
                      var tween = Tween(begin: begin, end: end)
                          .chain(CurveTween(curve: curve));
                      return SlideTransition(
                        position: animation.drive(tween),
                        child: child,
                      );
                    },
                  ),
                );
              },
              style: ButtonStyle(
                backgroundColor:
                    MaterialStateProperty.all<Color>(const Color(0xFFED4A25)),
                shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                  RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.circular(10.0), // Set the border radius
                    side: const BorderSide(
                        color: Colors.red), // Add a slight border
                  ),
                ),
                minimumSize: MaterialStateProperty.all<Size>(
                  const Size(120, 40),
                ),
              ),
              child: const Row(
                children: [
                  Icon(
                    Icons.book_outlined,
                    color: Colors.white,
                  ),
                  Text(
                    "Add Recipe",
                    style: TextStyle(color: Colors.white),
                  )
                ],
              ),
            )
          ],
        ),
        body: _buildRecipeBody());
  }

  Widget _buildRecipeBody() {
    if (recipe.isLoading && post.isLoading) {
      // Show loading indicator while data is being fetched
      return const Center(child: CircularProgressIndicator());
    } else {
      // Data is ready, display the recipe
      return body();
    }
  }

  SingleChildScrollView body() {
    return SingleChildScrollView(
      child: Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.black, width: 1),
                borderRadius: BorderRadius.circular(10),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 5),
              child: Row(
                children: [
                  const Expanded(
                    child: TextField(
                      decoration: InputDecoration(
                        border: InputBorder.none,
                        labelText: 'Search',
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  IconButton(
                    icon: const Icon(Icons.search),
                    onPressed: () {},
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Feeling to cook?",
                  style: TextStyle(fontSize: 25),
                ),
                SizedBox(
                  // color:Colors.green,
                  height: 310,
                  child: ListView.separated(
                    scrollDirection: Axis.vertical,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: 2,
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      if (index < recipe.imageUrls.length &&
                          recipe.imageUrls[index].isNotEmpty) {
                        final randomIndex =
                            random.nextInt(recipe.titles.length);
                        return recipeContain(randomIndex);
                      } else {
                        return Container();
                      }
                    },
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  "Some great shares",
                  style: TextStyle(fontSize: 25),
                ),
                SizedBox(
                  // color: Colors.red,
                  height: 150,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: post.data.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(width: 15),
                    itemBuilder: (context, index) {
                      if (index < post.data.length && post.data.isNotEmpty) {
                        final randomIndex = random.nextInt(post.data.length);
                        return postContain(randomIndex);
                      } else {
                        Container();
                      }
                    },
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  "New Recipe",
                  style: TextStyle(fontSize: 25),
                ),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 10.0,
                    mainAxisSpacing: 10.0,
                  ),
                  itemCount: recipe.titles.length,
                  itemBuilder: (context, index) {
                    if (index < recipe.imageUrls.length &&
                        recipe.imageUrls[index].isNotEmpty) {
                      final randomIndex = random.nextInt(recipe.titles.length);
                      return recipeContain(randomIndex);
                    } else {
                      return const Placeholder();
                    }
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  InkWell recipeContain(int index) {
    String imageUrl = recipe.imageUrls[index];
    String profileUrl = recipe.profileUrls[index] ?? 'images/Logo.png'; // Use a default image if profile URL is null
    String userName = recipe.userNames[index];
    String title = recipe.titles[index];
    int id = recipe.id[index];
    print(id);
    return InkWell(
      onTap: () {
        Navigator.pushNamed(context, '/detailrestaurant', arguments: id);
      },
      child: Stack(
        children: [
          if (imageUrl.isNotEmpty) // Check if imageUrl is not empty
            ClipRRect(
              borderRadius: BorderRadius.circular(10.0),
              child: Container(
                height: 150,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: NetworkImage(imageUrl),
                    fit: BoxFit.cover,
                    colorFilter: ColorFilter.mode(
                      Colors.black.withOpacity(0.3),
                      BlendMode.colorBurn,
                    ),
                  ),
                ),
              ),
            ),
          Positioned(
            bottom: 10,
            left: 10,
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
                          image: NetworkImage(profileUrl),
                          fit: BoxFit.fitWidth,
                        ),
                      ),
                    ),
                    SizedBox(width: 15),
                    Text(
                      userName,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                Text(
                  title,
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
      ),
    );
  }


  InkWell postContain(int index) {
    String imageUrl = post.data[index]['imageUrl'];
    String profileUrl = post.data[index]['profileUrl'] ?? 'images/Logo.png'; // Use a default image if profile URL is null
    String userName = post.data[index]['user'];
    String caption = post.data[index]['caption'];
    String likeCount = post.data[index]['likeCount'];
    int id = post.data[index]['id'];

    return InkWell(
      onTap: () {
        Navigator.pushNamed(context, '/detailpost', arguments: id);
      },
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10.0),
        child: Container(
          width: 250,
          padding: EdgeInsets.all(5),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10.0),
            border: Border.all(
              color: Colors.black,
              width: 2.0,
            ),
          ),
          child: Row(
            children: [
              SizedBox(
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
                              image: NetworkImage(profileUrl),
                              fit: BoxFit.fitWidth,
                            ),
                          ),
                        ),
                        SizedBox(width: 5),
                        Text(userName),
                      ],
                    ),
                    Text('postedAt ago'), // Replace 'postedAt ago' with the actual value
                    SizedBox(
                      height: 60,
                      child: Text(caption),
                    ),
                    Row(
                      children: [
                        Icon(
                          CupertinoIcons.heart_fill,
                          color: Colors.red,
                          size: 15,
                        ),
                        Text(likeCount),
                      ],
                    ),
                  ],
                ),
              ),
              Expanded(
                child: SizedBox(
                  height: 130,
                  child: imageUrl.isNotEmpty
                      ? Image.network(
                    imageUrl,
                    fit: BoxFit.fitHeight,
                  )
                      : Placeholder(), // Placeholder widget or any other fallback UI
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

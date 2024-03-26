
import 'package:flutter/material.dart';
import 'package:user/Controllers/RecipeContoller.dart';

class DetailRecipe extends StatefulWidget {
  const DetailRecipe({Key? key}) : super(key: key);

  @override
  _DetailRecipeState createState() => _DetailRecipeState();
}

class _DetailRecipeState extends State<DetailRecipe> {
  late Recipe recipe;
  bool isLoading = true;


  @override
  void initState() {
    super.initState();
    fetchRecipe();
  }

  Future<void> fetchRecipe() async {
    recipe = Recipe(); // Initialize the Recipe instance
    await recipe.getRecipe();
    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final int index = ModalRoute.of(context)?.settings.arguments as int;

    return Scaffold(
      appBar: AppBar(
        title: isLoading ? Text('Loading...') : Text(recipe.titles[index]),
        centerTitle: true,
      ),
      body: isLoading ? Center(child: CircularProgressIndicator()) : body(index),
    );
  }

  Widget body(int index) {
    return SingleChildScrollView(
      child: Container(
        padding: EdgeInsets.all(15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              height: 300,
              child: Image.network(recipe.imageUrls[index],fit: BoxFit.cover,),
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
                      image: NetworkImage(recipe.profileUrls[index]),
                      fit: BoxFit.cover,

                    ),
                  ),
                ),
                SizedBox(
                  width: 15,
                ),
                Text(
                  recipe.userNames[index],
                  style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            SizedBox(height: 5,),
            Text(recipe.descriptions[index],
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
            Text(recipe.ingredients[index]),
            Divider(thickness: 2),
            Center(
              child: Text("Directions",
                style:TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ) ,
              ),
            ),
            Text(recipe.directions[index]),
            Divider(thickness: 2),
            Center(
              child: Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  image: DecorationImage(
                    image: NetworkImage(recipe.profileUrls[index]),
                    fit: BoxFit.cover,

                  ),
                ),
              ),
            ),
            Row(
              mainAxisAlignment:MainAxisAlignment.center,
                children: [
                  Text("Created by"),
                  SizedBox(width: 2,),
                  Text(
                    recipe.userNames[index],
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            Center(
              child:
              ElevatedButton(
                onPressed: (){

                },
                child: Text("Follow",style: TextStyle(color: Colors.white)),
                style: ButtonStyle(
                  backgroundColor: MaterialStateProperty.all<Color>(Color(0xFFED4A25)),
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
            )
          ],
        ),
      ),
    );
  }
}

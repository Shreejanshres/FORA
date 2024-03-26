import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:user/Controllers/OrderController.dart';

class ItemPage extends StatefulWidget {
  const ItemPage({super.key});

  @override
  State<ItemPage> createState() => _ItemPageState();
}

class _ItemPageState extends State<ItemPage> {
  Map<String, dynamic>? itemData;
  int quantity=1;
  TextEditingController notescontroller = TextEditingController();
  String notes='';
  Order order =new Order();
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    itemData = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    print("hi");
    print(itemData);

    setState(() {
    });
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(title:Text("Add to cart"),centerTitle: true,
        backgroundColor: Color(0xFFED4A25),
      ),
      body: body(),
      bottomNavigationBar: BottomAppBar(
        color: Color(0xFFED4A25),
        child: InkWell(
          onTap: () async {
            int restaurant_id=itemData!['restaurant_id'];
            int item_id=itemData!['id'];
            notes=notescontroller.text;
            try {
              Map<String,dynamic> response = (await order.addtocart(restaurant_id, item_id, quantity, notes)) as Map<String,dynamic>;
              if (response['success']) {
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(response['message']),
                  ),
                );
              } else {
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(response['message']),
                  ),
                );
              }
            } catch (e) {
              // Handle any errors that might occur during the process
              print("Error: $e");
            }
          },
          splashColor: Colors.red.shade700,
          child: Container(
            width: double.maxFinite,
            padding: EdgeInsets.all(10),
            child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text("Add to Cart",style: TextStyle(color: Colors.white,fontSize:25,fontFamily: "Poppins"),),

              ],
            )
          ),
        ),
      ),
    );
  }

  Widget body(){
    return SingleChildScrollView(
      child:
      Container(
        width: double.infinity,
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(itemData!['item_name'],
              style: TextStyle(
                fontFamily: 'Poppins',
                fontWeight: FontWeight.bold,
                fontSize: 20,
              ),
            ),
            SizedBox(height: 30,),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(itemData!['price'],
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 20,
                  ),
                ),
                Row(
                  children: [
                    SizedBox(
                      height: 40,
                      width: 40,
                      child: Container(
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: IconButton(
                          onPressed: () {
                            quantity+=1;
                            setState(() {});
                          },
                          icon: Icon(Icons.add),
                        ),
                      ),
                    ),
                    SizedBox(width: 8),
                    Text(
                      '$quantity',
                      style: TextStyle(
                        fontSize: 25,
                      ),
                    ),
                    SizedBox(width: 8),
                    SizedBox(
                      height: 40,
                      width: 40,
                      child: Container(
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey), // Border color
                          borderRadius: BorderRadius.circular(8), // Border radius
                        ),
                        child: IconButton(
                            onPressed: () {
                              if(quantity!=1){
                                quantity-=1;
                              }
                              setState(() {});
                            },
                            icon: Icon(Icons.remove),
                          ),

                      ),
                    ),
                  ],
                ),
              ],
            ),
            SizedBox(height: 30,),
            Text("Notes",style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 15,
            ),),
            Container(
              height: 200,
              decoration: BoxDecoration(
                color: Color(0xFFF3F1F1),
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(8),
              ),
              child: TextField(
                controller: notescontroller,
                maxLines: null,
                decoration: InputDecoration(
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(horizontal: 10,vertical: 10),
                ),
              ),
            ),
            SizedBox(height: 40,),

          ],
        )
      ),
    );
  }
}

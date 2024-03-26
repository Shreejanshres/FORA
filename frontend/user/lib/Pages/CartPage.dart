import 'package:flutter/material.dart';
import 'package:user/Controllers/OrderController.dart';

class Cart extends StatefulWidget {
  const Cart({Key? key}) : super(key: key);

  @override
  State<Cart> createState() => _CartState();
}

class _CartState extends State<Cart> {
  Order order = new Order();
  bool isLoading = true;
  List<TextEditingController> notesControllers = [];

  @override
  void initState() {
    super.initState();
    _getCartData();

  }

  Future<void> _getCartData() async {
    await order.getcart();
    for (int i = 0; i < order.cartitem.length; i++) {
      notesControllers.add(TextEditingController(text: order.notes[i]));
    }
    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Cart",
        ),
        centerTitle: true,
        backgroundColor: Color(0xFFED4A25),
      ),
      body: isLoading ? LinearProgressIndicator() : body(),
      bottomNavigationBar:
      isLoading ? SizedBox(width:10,height: 10,) : placeOrder(),
    );
  }

  SingleChildScrollView body() {
    return SingleChildScrollView(
      child: Container(
        width: double.infinity,
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            Container(
              color: Colors.green,
              height: 400,
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    Row(
                      children: [
                        order.picture.isEmpty ? SizedBox(width: 50, height: 50) :
                        Image.network(
                          order.picture,
                          width: 50,
                          height: 50,
                        ),
                        SizedBox(width: 10),
                        Text(
                          order.name,
                          style: TextStyle(
                            fontFamily: "Poppins",
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    order.cartitem.isEmpty
                        ? Container(
                      padding: EdgeInsets.symmetric(vertical: 20),
                      child: Text(
                        'No items in the cart',
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.grey,
                        ),
                      ),
                    )
                        : ListView.builder(
                      shrinkWrap: true,
                      itemCount: order.cartitem.length,
                      itemBuilder: (context, index) {
                        return items(index);
                      },
                    ),
                  ],
                ),
              )
            ),
          ],
        ),
      ),
    );
  }

  Widget placeOrder() {
    return BottomAppBar(
      color: Color(0xFFED4A25),
      child: InkWell(
        onTap: () {
          order.placeorder();
        },
        splashColor: Colors.red.shade700,
        child: Container(
          width: double.maxFinite,
          padding: EdgeInsets.all(10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "Place Order",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 25,
                  fontFamily: "Poppins",
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget items(int index) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(10),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    order.cartitem[index]['item']['item_name'],
                    style: TextStyle(
                      fontSize: 15,
                      fontFamily: 'Poppins',
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    '\$${order.price[index].toStringAsFixed(2)}',
                    style: TextStyle(
                      fontSize: 14,
                      fontFamily: 'Poppins',
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  Column(
                    children: [
                      IconButton(
                        onPressed: () {
                          order.quantity[index] += 1;
                          order.updateSubtotal();
                          setState(() {});
                        },
                        icon: Icon(Icons.add),
                      ),
                      Text('${order.quantity[index]}'),
                      IconButton(
                        onPressed: () {
                          if (order.cartitem[index]['quantity'] != 1) {
                            order.quantity[index] -= 1;
                          }
                          order.updateSubtotal();
                          setState(() {});
                        },
                        icon: Icon(Icons.remove),
                      ),
                    ],
                  ),
                  IconButton(
                    onPressed: () async {
                      print(order.cartitem[index]['id']);
                      bool response = await order.delete(order.cartitem[index]['id']);
                      if(response){
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text("Item deleted"),
                          ),
                        );
                        setState(() {
                          _getCartData();
                        });
                      }
                      else{
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text("failed to delete"),
                          ),
                        );

                      }
                    },
                    icon: Icon(
                      Icons.delete,
                      color: Colors.red.shade800,
                    ),
                  )
                ],
              ),
            ],
          ),
          Container(
            height: 100,
            decoration: BoxDecoration(
              color: Color(0xFFF3F1F1),
              border: Border.all(color: Colors.grey),
              borderRadius: BorderRadius.circular(8),
            ),
            child: TextField(
              controller: notesControllers[index],
              maxLines: null,
              onChanged: (value) {
                order.notes[index] = value;
                print(order.notes[index]);
              },
              decoration: InputDecoration(
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 10),
              ),
            ),
          ),
          Divider(),
        ],
      ),
    );
  }
}

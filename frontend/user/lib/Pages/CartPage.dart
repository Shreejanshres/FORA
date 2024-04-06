import 'package:flutter/material.dart';
import 'package:user/Controllers/OrderController.dart';

class Cart extends StatefulWidget {
  const Cart({super.key});

  @override
  State<Cart> createState() => _CartState();
}

class _CartState extends State<Cart> {
  Order order = Order();
  bool isLoading = true;
  List<TextEditingController> notesControllers = [];

  @override
  void initState() {
    super.initState();
    _getCartData();
  }

  Future<void> _getCartData() async {
    isLoading = true;
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
        title: const Text(
          "Cart",
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFFED4A25),
      ),
      body: isLoading ? const LinearProgressIndicator() : body(),
    );
  }

  SingleChildScrollView body() {
    return SingleChildScrollView(
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        child:  order.cartitem.isEmpty?Container(
          alignment: Alignment.center,
          child: const Text(
            'No items in the cart',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey,
            ),
          ),
        ):Column(
          children: [
                Container(
                  height: 80,
                  color: Colors.white,
                  child: Row(
                    children: [
                      order.picture.isEmpty
                          ? const SizedBox(width: 50, height: 50)
                          : Image.network(
                              order.picture,
                              width: 50,
                              height: 50,
                            ),
                      const SizedBox(width: 10),
                      Text(
                        order.name,
                        style: const TextStyle(
                          fontFamily: "Poppins",
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
               SingleChildScrollView(
                        child: Column(
                          children: [
                            ListView.builder(
                              physics: const NeverScrollableScrollPhysics(),
                              shrinkWrap: true,
                              itemCount: order.cartitem.length,
                              itemBuilder: (context, index) {
                                return items(index);
                              },
                            ),
                          ],
                        ),
                      ),
                const SizedBox(
                  height: 15,
                ),
                Container(
                  width: 150,
                  child: ElevatedButton(
                    onPressed: () async {
                      print(order.notes);
                     Map<String,dynamic> response= await order.updatecart();
                     if(response['success']){
                       print(order.cartitem[0]['restaurant']);
                       Navigator.pushNamed(context, '/information');
                     }else {
                       ScaffoldMessenger.of(context).showSnackBar(
                         SnackBar(
                           content: Text(response['message']),
                         ),
                       );
                     }

                    },
                    style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.all<Color>(
                          const Color(0xFFED4A25)),
                    ),
                    child: const Text("Continue",
                        style: TextStyle(fontSize: 18, color: Colors.white)),
                  ),
                )

          ],
        ),
      ),
    );
  }

  Widget items(int index) {
    return Container(
      color: Colors.white,
      width: double.infinity,
      padding: const EdgeInsets.all(10),
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
                    style: const TextStyle(
                      fontSize: 14,
                      fontFamily: 'Poppins',
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    '\$${order.price[index].toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 14,
                      fontFamily: 'Poppins',
                    ),
                  ),
                  Row(
                    children: [
                      IconButton(
                        onPressed: () {
                          order.quantity[index] += 1;
                          order.updateSubtotal();
                          setState(() {});
                        },
                        icon: const Icon(Icons.add),
                      ),
                      Text(
                        '${order.quantity[index]}',
                        style: const TextStyle(fontSize: 14),
                      ),
                      IconButton(
                        onPressed: () {
                          if (order.cartitem[index]['quantity'] >= 1) {
                            order.quantity[index] -= 1;
                          }
                          order.updateSubtotal();
                          setState(() {});
                        },
                        icon: const Icon(Icons.remove),
                      ),
                    ],
                  ),
                ],
              ),
              IconButton(
                onPressed: () async {
                  print(order.cartitem[index]['id']);
                  bool response =
                      await order.delete(order.cartitem[index]['id']);
                  if (response) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text("Item deleted"),
                      ),
                    );
                    _getCartData();
                    setState(() {
                      _getCartData();
                    });
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
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
          Container(
            height: 100,
            decoration: BoxDecoration(
              color: const Color(0xFFF3F1F1),
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
              decoration: const InputDecoration(
                border: InputBorder.none,
                contentPadding:
                    EdgeInsets.symmetric(horizontal: 10, vertical: 10),
              ),
            ),
          ),
          const Divider(),
        ],
      ),
    );
  }
}

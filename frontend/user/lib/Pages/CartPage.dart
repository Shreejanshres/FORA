import 'package:flutter/cupertino.dart';
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
        child:  order.names.isEmpty?Container(
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
                // Container(
                //   height: 80,
                //   color: Colors.white,
                //   child: Row(
                //     children: [
                //       order.picture.isEmpty
                //           ? const SizedBox(width: 50, height: 50)
                //           : Image.network(
                //               order.picture,
                //               width: 50,
                //               height: 50,
                //             ),
                //       const SizedBox(width: 10),
                //       Text(
                //         order.name,
                //         style: const TextStyle(
                //           fontFamily: "Poppins",
                //           fontSize: 16,
                //           fontWeight: FontWeight.w600,
                //         ),
                //       ),
                //     ],
                //   ),
                // ),
                const SizedBox(
                  height: 10,
                ),
               // SingleChildScrollView(
               //          child: Column(
               //            children: [
               //              ListView.builder(
               //                physics: const NeverScrollableScrollPhysics(),
               //                shrinkWrap: true,
               //                itemCount: order.cartitem.length,
               //                itemBuilder: (context, index) {
               //                  return items(index);
               //                },
               //              ),
               //            ],
               //          ),
               //        ),
            SingleChildScrollView(
              child: Column(
                children: [
                  ListView.separated(
                    physics: const NeverScrollableScrollPhysics(),
                    shrinkWrap: true,
                    itemCount: order.names.length,
                    separatorBuilder: (context, index) => SizedBox(height: 30,), // Add your custom separator widget here
                    itemBuilder: (context, index) {
                      return restro(index);
                    },
                  ),
                ],
              ),
            ),
                const SizedBox(
                  height: 15,
                ),

          ],
        ),
      ),
    );
  }

  Widget restro(int index) {
    int id=order.restroid[index];
    return Container(
      height: 80,
      decoration: BoxDecoration(
        color: Colors.white, // Set background color to white
        borderRadius: BorderRadius.circular(10), // Set border radius
      ),
      child: InkWell(
        onTap: (){
          Navigator.pushNamed(context, "/detailcart",arguments: id);
        },
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                order.pictures.isEmpty
                    ? SizedBox(width: 50, height: 50)
                    : Image.network(
                  order.pictures[index],
                  width: 50,
                  height: 50,
                ),
                SizedBox(width: 10),
                Text(
                  order.names[index],
                  style: TextStyle(
                    fontFamily: "Poppins",
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
           IconButton(onPressed: (){
           },splashColor: Colors.red,icon:  Icon(Icons.keyboard_arrow_right_outlined))
          ],
        )

      ),
    );
  }

}

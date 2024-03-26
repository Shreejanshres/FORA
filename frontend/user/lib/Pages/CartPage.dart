import 'package:flutter/material.dart';
import 'package:user/Controllers/OrderController.dart';

class Cart extends StatefulWidget {
  const Cart({super.key});

  @override
  State<Cart> createState() => _CartState();
}

class _CartState extends State<Cart> {
  Order order=new Order();
  bool isLoading=true;
  Map<String,dynamic> data= {};
  late List<dynamic> cart;
  int quantity= 0;
  @override
  void initState() {
    super.initState();
    _getcartdata();
  }
  void _getcartdata() async{
    await order.getcart();
    print(order.cartitem);
    setState(() {
      isLoading=false;
    });
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Cart",), centerTitle: true, backgroundColor: Color(0xFFED4A25), ),
      body: isLoading ? LinearProgressIndicator(): body()
    );
  }
  SingleChildScrollView body(){
    return SingleChildScrollView(
      child: Container(
        padding: EdgeInsets.all(20),

        child: Column(
          children: [
            Row(
                children: [
                  Image.network(order.picture, width: 50, height: 50,),
                  SizedBox(width:10),
                  Text(order.name,style: TextStyle(
                    fontFamily: "Poppins",
                    fontSize: 20,
                    fontWeight: FontWeight.w600
                  ),)
                ]

            ),
            ListView.builder(
              shrinkWrap: true,
              itemCount: order.cartitem.length,
              itemBuilder: (context, index) {
                return items(index);
              },
            ),
            Text("${order.subtotal}"),
          ],
        ),
      ),
    );
  }

  Widget items(int index){
    return Container(
      padding: EdgeInsets.all(10),
      // color:Colors.red,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
            Text(order.cartitem[index]['item']['item_name'],
            style:TextStyle(
              fontSize: 15,
              fontFamily: 'Poppins',
              fontWeight: FontWeight.w500,
            ),
              ),
              Text('\$${order.price[index].toStringAsFixed(2)}',
              style:TextStyle(
                fontSize: 14,
                fontFamily: 'Poppins',
              )
            ),
          ],),
          Row(
            children: [
              Column(
                children: [
                  IconButton(onPressed: (){
                    order.quantity[index]+=1;
                    order.updatesubtotal();
                    setState(() {});
                  }, icon: Icon(Icons.add)),
                  Text('${ order.quantity[index]}'),
                  IconButton(onPressed: (){
                    if(order.cartitem[index]['quantity']!=1){
                      order.quantity[index]-=1;
                    }
                    order.updatesubtotal();
                    setState(() {});
                  }, icon: Icon(Icons.remove)),
                ],
              ),
              IconButton(onPressed: ()  {}, icon: Icon(Icons.delete,color: Colors.red.shade800,))
            ],
          ),
          IconButton(onPressed: (){}, icon: Icon(Icons.confirmation_num_sharp)),
        ],
      )



    );
  }
}

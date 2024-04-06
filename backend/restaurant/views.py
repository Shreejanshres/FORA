from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json
from django.contrib.auth.hashers import make_password, check_password
import jwt
from django.core.serializers.json import DjangoJSONEncoder
from .models import *
from .serializers import *
from django.db import IntegrityError


def response(success, message):
    return JsonResponse({"success": success, "message": message})

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data_json = json.loads(request.body)
        email= data_json.get("email")
        password = data_json.get("password")
        try:
            user=RestaurantUser.objects.get(email=email)
            if check_password(password,user.password):
                serialized=RestaurantUserSerializer(user,many=False)
                request.session['data'] = serialized.data
                payload = {"data": serialized.data}
                request.session['data'] = serialized.data
                token = jwt.encode(payload, "secret", algorithm="HS256")
                return JsonResponse({"success": True, "message": token}, encoder=DjangoJSONEncoder)
            else :  
                return response(False,"password doesn't match")
        except:
            return response(False,"User with given email doesn't exist")
    else:
        return response(False,"The method should be POST")
    
@csrf_exempt
# only by admin
def addtags(request):
    if request.method=="POST":
        data_json=json.loads(request.body)
        serializer=TagSerializer(data=data_json,many=False)
        if  serializer.is_valid():
            serializer.save()
            return response(True,"Tags added successfully")
        else:
            return  response(False,str(serializer.errors))
    else:
        return response(False,"The method should be POST")

@csrf_exempt
def add_heading(request):
    if request.method == "POST":
        data_json = json.loads(request.body)
        print(data_json)
        serializer = HeadingSerializer(data=data_json, many=False)
        if serializer.is_valid():
            serializer.save()
            return response(True, "Heading added successfully")
        else:
            return response(False, str(serializer.errors))
    else:
        return response(False, "The method should be POST")
        
@csrf_exempt
def display_headings(request, id):
    if request.method == "GET":
        try:
            # Assuming you have a Heading model and a HeadingSerializer
            restro = RestaurantUser.objects.filter(id=id)
            serialized = DetailDataSerializer(restro, many=True)
            token = jwt.encode({"data": serialized.data}, "heading", algorithm="HS256")
            payload = {"data": serialized.data, "token": token}
            return JsonResponse(payload, safe=False)
        except Heading.DoesNotExist:
            return JsonResponse({"error": "No headings found for this restaurant"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "The method should be GET"}, status=400)

@csrf_exempt
def addmenu(request):
    if  request.method=='POST':
        data_json=json.loads(request.body)
        serializer=MenuSerializer(data=data_json,many=False)
        if  serializer.is_valid():
            serializer.save()
            return response(True,"Menu added successfully")
        else:
            return  response(False,str(serializer.errors))
    else:
        return response(False,"The method should be POST")

@csrf_exempt
def viewmenu(request):
    if request.method=="GET":
        data=json.loads(request.body)
        id=data.get( "id" )
        tag=data.get("tag")
        try:
            menuitem=MenuItem.objects.filter(restaurant=id)
            serialized=MenuSerializer(menuitem,many=True)
            return  JsonResponse(serialized.data,safe=False)
        except:
            return  response( False , "No Menu found for this restaurant" )
    else:
        return response(False,"The method should be GET")
    
@csrf_exempt
def getcart(request, id):
    if request.method == "GET":
        try:
            cart = CartTable.objects.get(user_id=id)
            serialized = CartTableSerializer(cart, many=False)
            
            # Retrieve the restaurant ID from the first item in the cart
            restaurant_id = serialized.data.get("cart_item")[0]['restaurant']
            restaurant = RestaurantUser.objects.get(id=restaurant_id);

  
            restaurant_serialized = RestaurantUserSerializer(restaurant, many=False)

  
            restaurant_name = restaurant_serialized.data['name']
            restaurant_picture = restaurant_serialized.data['picture']
  
            data={
                "success": True,
                "cart": serialized.data,
                "restaurant": restaurant_name,
                "picture": restaurant_picture,               
            }
            print(data)
          
            return JsonResponse(data, safe=False)
            # return JsonResponse({"success": False, "message": data},safe=False)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)})
    else:
        return JsonResponse({"success": False, "message": "The method should be GET"})






@csrf_exempt  
def addtocart(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user_id")
        item_id = data.get("item")
        restro_id = data.get("restaurant")
        print(user_id,item_id,restro_id)
        user = get_object_or_404(CustomerUser, id=user_id)
        try:
            cart, _ = CartTable.objects.get_or_create(user_id=user)
            
            existing_items = Cartitem.objects.filter(cart=cart, item=item_id)
            if existing_items.exists():
                return JsonResponse({"success": False, "message": "Item already exists in cart"})
            
            existing_restaurant = Cartitem.objects.filter(cart=cart).first()
            if existing_restaurant is not None and existing_restaurant.restaurant_id != restro_id:
                return JsonResponse({"success": False, "message": "You can't add items from different restaurants"})
            
            data['cart'] = cart.id
            print(data)
            serializer = AddCartItemSerializer(data=data)
           
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({"success": True, "message": "Item added to cart successfully"})
            else:
                return JsonResponse({"success": False, "message": serializer.errors})
        except IntegrityError as e:
            return JsonResponse({"success": False, "message": str(e)})
    else:
        return JsonResponse({"success": False, "message": "The method should be POST"})

@csrf_exempt
def deletefromcart(request,id):
    if request.method == "DELETE":
        try:
            cart = CartTable.objects.get(user_id=id)
            print(cart)
            cart_items = Cartitem.objects.filter(cart=cart)
            for item in cart_items:
                item.delete()
            return JsonResponse({"success": True, "message": "Item deleted from cart successfully"})
        except CartTable.DoesNotExist:
            return JsonResponse({"success": False, "message": "Cart not found"})
        except Cartitem.DoesNotExist:
            return JsonResponse({"success": False, "message": "Item not found in cart"})
    else:
        return JsonResponse({"success": False, "message": "The method should be Delete"})
    
@csrf_exempt
def delete(request,id):
    if request.method=="DELETE":
        try:
            cart=Cartitem.objects.get(id=id)
            cart.delete()
            return response(True,"Cart deleted successfully")
        except:
            return response(False,"Cart not found")
    else:
        return response(False,"The method should be DELETE")
@csrf_exempt
def update(request):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            for item_data in data:
                try:
                    id = item_data.get("id")
                    cart = Cartitem.objects.get(id=id)
                    itemid = item_data.get("item").get("id")
                    item_data["item"] = itemid

                    serializer = AddCartItemSerializer(cart, data=item_data, many=False)
                    if serializer.is_valid():
                        serializer.save()
                       
                    else:
                        return JsonResponse({"success": False, "error": str(serializer.errors)})
                except Cartitem.DoesNotExist:
                    return JsonResponse({"success": False, "message": "Cart not found"})
            return JsonResponse({"success": True, "message": "Cart updated successfully"})
        except Exception as e:
            return JsonResponse({"success": False, "message": "An error occurred: " + str(e)})
    else:
        return JsonResponse({"success": False, "message": "The method should be PUT"})

def getbill(request,id):
    if request.method=="GET":
        try:
            print("inside")
            cart=CartTable.objects.get(user_id=id).id
            print(cart)
            cart_items = Cartitem.objects.filter(cart=cart)
            subtotal=0
            for item in cart_items:
                subtotal+=item.item.price*item.quantity
            subtotal=round(float(subtotal),2)
            delivery_charge=50
            print("hji")
            print(subtotal)
            tax = round(float(subtotal) * 0.13,2)
            print("Tax:", tax)
            try:
                total=subtotal+delivery_charge+tax
            except Exception as e:
                print(e)
            print(total)
            return JsonResponse({"success": True, "message": {"subtotal": subtotal, "delivery_charge": delivery_charge, "tax": tax, "total": total}})
        except:
            return  response( False , "No Cart found for this user" )
    else:
        return response(False,"The method should be GET")

@csrf_exempt
def getrestro(id):
    try:
        cart = CartTable.objects.get(user_id=id)
        serialized = CartTableSerializer(cart, many=False)
        # Retrieve the restaurant ID from the first item in the cart
        restaurant_id = serialized.data.get("cart_item")[0]['restaurant']
        # Fetch the RestaurantUser instance using the restaurant_id
        restaurant_user = RestaurantUser.objects.get(id=restaurant_id)
        return restaurant_user
    except Exception as e:
        return None
   

@csrf_exempt
def addtoorder(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
            is_paid = data.get("is_paid")
            address = data.get("address")
            payment_method = data.get("payment_method")
            total_price = data.get("total_price")
            print(user_id, is_paid, address, payment_method, total_price)
            
            # Fetch user and restaurant instances
            user = CustomerUser.objects.get(id=user_id)
            restro = getrestro(user_id)  # Assuming this function returns the RestaurantUser instance
            
            # Check if all required fields are provided
            if None in [user, is_paid, address, payment_method, total_price, restro]:
                raise ValueError("Required fields are missing")
            
            # Create order
            order = Order.objects.create(user=user, restaurant=restro, ispaid=is_paid, address=address, 
                                         payment_method=payment_method, total_price=total_price)
            
            # Get cart items
            cart = CartTable.objects.get(user_id=user_id)
            cart_items = Cartitem.objects.filter(cart=cart)
            
            # Create order items from cart items
            for item in cart_items:
                OrderItem.objects.create(order=order, item=item.item, quantity=item.quantity,
                                          notes=item.notes, subtotal=item.item.price * item.quantity)
            
            # Clear cart items
            cart_items.delete()
            
            return JsonResponse({"success": True, "message": "Order placed successfully"})
        
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)})
    
    else:
        return JsonResponse({"success": False, "message": "The method should be POST"})

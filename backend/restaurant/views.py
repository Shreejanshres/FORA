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
                payload = {"data": serialized.data}
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
    
def getcart(request,id):
    if request.method=="GET":
        print(id)
        try:
            cart=CartTable.objects.get(user_id=id)
            print(cart)
            serialized=CartTableSerializer(cart,many=False)
           
            return  JsonResponse(serialized.data,safe=False)
        except:
            return  response( False , "No Cart found for this user" )
    else:
        return response(False,"The method should be GET")

# @csrf_exempt  
# def addtocart(request):
#     if request.method == "POST":
#         data=json.loads(request.body)
#         user_id=data.get("user_id")
#         restro_id=data.get("restaurant")
#         if(CartTable.objects.filter(user_id=user_id).exists()):
#             cartid=CartTable.objects.get(user_id=user_id)
#             if(Cartitem.objects.filter(cart=cartid).exists()):
#                 if(Cartitem.objects.filter(cart=cartid,restaurant=restro_id).exists()):
#                     item =MenuItem.objects.get(id=data.get("item"))
#                     if(Cartitem.objects.filter(cart=cartid,restaurant=restro_id,item=item).exists()):
#                        return response(False,"Item already exists in cart")
#                     else:
#                         serializers=CartItemSerializer(data=data,many=False)
#                         if serializers.is_valid():
#                             serializers.save()
#                             return response(True,"Item added to cart successfully")
#                         else:
#                             return response(False,str(serializers.errors))
                    
#                 else:
#                     return response(False,"You can't add items from different restaurants")
#             else:
#                 serializers=CartItemSerializer(data=data,many=False)
#                 if serializers.is_valid():
#                     serializers.save()
#                     return response(True,"Item added to cart successfully")
#                 else:
#                     return response(False,str(serializers.errors))
           
#         else:
#             cartserializer = CartTableSerializer(data={"user_id": user_id})
#             if cartserializer.is_valid():
#                 cartserializer.save()
#                 serializers=CartItemSerializer(data=data,many=False)
#                 if serializers.is_valid():
#                     serializers.save()
#                     return response(True,"Item added to cart successfully")
#                 else:
#                     return response(False,str(serializers.errors))
#             else:
#                 return response(False,str(cartserializer.errors))

#     else:
#         return response(False,"The method should be POST")

from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

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
def deletefromcart(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user_id")
        item_id = data.get("item")
        try:
            cart = CartTable.objects.get(user_id=user_id)
            item = Cartitem.objects.get(cart=cart, item=item_id)
            item.delete()
            return JsonResponse({"success": True, "message": "Item deleted from cart successfully"})
        except CartTable.DoesNotExist:
            return JsonResponse({"success": False, "message": "Cart not found"})
        except Cartitem.DoesNotExist:
            return JsonResponse({"success": False, "message": "Item not found in cart"})
    else:
        return JsonResponse({"success": False, "message": "The method should be POST"})
    
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
def update(request,id):
    if request.method=="PUT":
        data=json.loads(request.body)
        try:
            cart=Cartitem.objects.get(id=id)
            serializer=AddCartItemSerializer(cart,data=data,many=False)
            if serializer.is_valid():
                serializer.save()
                return response(True,"Cart updated successfully")
            else:
                return response(False,str(serializer.errors))
        except:
            return response(False,"Cart not found")
    else:
        return response(False,"The method should be PUT")
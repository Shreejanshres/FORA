import base64
import datetime
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
from django.core.files.base import ContentFile


def customresponse(success, message):
    return JsonResponse({"success": success, "message": message})

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data_json = json.loads(request.body)
        email= data_json.get("email")
        password = data_json.get("password")
        print(password)

        try:
            user=RestaurantUser.objects.get(email=email)
            if check_password(password,user.password):
                serialized=RestaurantUserSerializer(user,many=False)
                payload = {"data": serialized.data}
                is_active = payload.get("data").get("is_active")
                token = jwt.encode(payload, "secret", algorithm="HS256")
                response= JsonResponse({"success": True, "message": token,"is_active":is_active}, encoder=DjangoJSONEncoder)
                response.set_cookie('token', token)
                response.set_cookie('is_logged_in', True)
                return response
            else :  
                return JsonResponse({"success": False, "message": "Invalid password"})
        except:
            return JsonResponse({"success": False, "message": "User not found"})
    else:
        return JsonResponse({"success": False, "message": "The method should be POST"})
@csrf_exempt
def update_password(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        email = data.get("email")
        old_password = data.get("old_password")
        new_password = data.get("new_password")
        try:
            user = RestaurantUser.objects.get(email=email)
            if check_password(old_password, user.password):
                user.password = make_password(new_password)
                user.is_active = True
                user.save()
                return JsonResponse({"success": True, "message": "Password updated successfully"})
            else:
                return JsonResponse({"success": False, "message": "Invalid old password"})
        except RestaurantUser.DoesNotExist:
            return JsonResponse({"success": False, "message": "User not found"})
    else:
        return JsonResponse({"success": False, "message": "The method should be PUT"})

@csrf_exempt
# only by admin
def addtags(request):
    if request.method=="POST":
        data_json=json.loads(request.body)
        serializer=TagSerializer(data=data_json,many=False)
        if  serializer.is_valid():
            serializer.save()
            return JsonResponse({"success":True,"message":"Tags added successfully"})
        else:
            return JsonResponse({"success":False,"message":str(serializer.errors)})
    else:
        return JsonResponse({"success":False,"message":"The method should be POST"})

@csrf_exempt
def displaytags(request):
    if request.method=="GET":
        try:
            tags=Tags.objects.all()
            serialized=TagSerializer(tags,many=True)
            return JsonResponse(serialized.data,safe=False)
        except:
            return  JsonResponse({"success":False,"message":"No tags found"})
    else:
        return JsonResponse({"success":False,"message":"The method should be GET"})

@csrf_exempt
def add_heading(request):
    if request.method == "POST":
        data_json = json.loads(request.body)
        print(data_json)
        restro=RestaurantUser.objects.get(id=data_json.get("restaurant"))
        data_json["restaurant"] = restro.id
        serializer = HeadingSerializer(data=data_json, many=False)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"success": True, "message": "Heading added successfully"})
        else:
            return JsonResponse({"success": False, "message": str(serializer.errors)})
    else:
        return JsonResponse({"success": False, "message": "The method should be POST"})
        
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
            return  JsonResponse({"success": False, "message": str(e)})
    else:
        return JsonResponse({"success": False, "message": "The method should be GET"})

@csrf_exempt
def addmenu(request):
    if request.method == 'POST':
        try:
            data_json = json.loads(request.body)
            print("Received data:", data_json)

            tags = Tags.objects.get(id=data_json.get("tags"))
            heading = Heading.objects.get(id=data_json.get("heading"))
            data_json["tag"] = tags.id
            data_json["heading"] = heading.id
            print("Processed data:", data_json)
            serializer = MenuSerializer(data=data_json)
            if serializer.is_valid():
                serializer.save()
                return  JsonResponse({"success": True, "message": "Menu added successfully"})
            else:
                return JsonResponse({"success": False, "message": str(serializer.errors)})
        except Exception as e:
            print("Error processing request:", e)
            return JsonResponse({"success": False, "message": str(e)})
    else:
        return JsonResponse({"success": False, "message": "The method should be POST"})

@csrf_exempt
def viewmenu(request):
    if request.method=="GET":
        # data=json.loads(request.body)
        # id=data.get( "id" )
        # tag=data.get("tag")
        try:
            menuitem=RestaurantUser.objects.all()
            serialized=DetailDataSerializer(menuitem,many=True)
            return  JsonResponse(serialized.data,safe=False)
        except:
            return JsonResponse({"success":False,"message":"No menu found"})
    else:
        return JsonResponse({"success":False,"message":"The method should be GET"})

@csrf_exempt
def getindividualcart(request):
    if request.method == "GET":
        data=json.loads(request.body)
        userid=data.get("user_id")
        restroid=data.get("restaurant_id")

        print(userid,restroid)
        try:
            cart = CartTable.objects.get(user_id=userid)
            cart_items = Cartitem.objects.filter(cart=cart,restaurant=restroid)
            print("hi");
            serialized = CartItemSerializer(cart_items, many=True)
            restaurant = RestaurantUser.objects.get(id=restroid);
            restaurant_serialized = RestaurantUserSerializer(restaurant, many=False)

            restaurant_name = restaurant_serialized.data['name']
            restaurant_picture = restaurant_serialized.data['picture']

            data={
                "success": True,
                "cart": serialized.data,
                "restaurant": restaurant_name,
                "picture": restaurant_picture,          
            }
            return JsonResponse(data, safe=False)
        except:
            return JsonResponse({"success": False, "message": "No cart items found"})
    else:
        return JsonResponse({"success": False, "message": "The method should be GET"})


@csrf_exempt
def getcart(request, id):
    if request.method == "GET":
        try:
            cart = CartTable.objects.get(user_id=id)
            serialized = CartTableSerializer(cart, many=False)
            
            # Retrieve the restaurant ID from the first item in the cart
            restaurant_id = serialized.data.get("cart_item")[0]['restaurant']
            restaurant = RestaurantUser.objects.get(id=restaurant_id);
            # Retrieve the restaurant ID from the first item in the cart
        
  
            restaurant_serialized = RestaurantUserSerializer(restaurant, many=False)
            

            #for many items in cart
            cart_items = serialized.data.get("cart_item")
                
                # List to store restaurant IDs
            restaurant_ids = []
                
                # Iterate over each item in the cart
            for item in cart_items:
                restaurant_id = item.get('restaurant')
                restaurant_ids.append(restaurant_id)
                
                # Retrieve restaurants for all the restaurant IDs
            restaurants = RestaurantUser.objects.filter(id__in=restaurant_ids)

            restaurant_serialized = RestaurantUserSerializer(restaurants, many=True)
            restaurant_ids.clear()
            restaurant_name=[]
            restaurant_picture=[]
            for restaurant_data in restaurant_serialized.data:
                restaurant_name.append(restaurant_data['name'])
                restaurant_picture.append(restaurant_data['picture'])
                restaurant_ids.append(restaurant_data['id'])

            # restaurant_name = restaurant_serialized.data['name']
            # restaurant_picture = restaurant_serialized.data['picture']
  
            data={
                "success": True,
                "cart": serialized.data,
                "restaurant": restaurant_name,
                "picture": restaurant_picture,          
                "id":restaurant_ids   
            }
            print(data['restaurant'])
          
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
            
            # existing_restaurant = Cartitem.objects.filter(cart=cart).first()
            # # if existing_restaurant is not None and existing_restaurant.restaurant_id != restro_id:
            # #     return JsonResponse({"success": False, "message": "You can't add items from different restaurants"})
            
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
            return JsonResponse({"success":True,"message":"Cart deleted successfully"})
        except:
            return JsonResponse({"success":False,"message":"Cart not found"})
    else:
        return JsonResponse({"success":False,"message":"The method should be DELETE"})
    
@csrf_exempt
def deletemenuitem(request,id):
    if request.method == "DELETE":
        try:
            menuitem = MenuItem.objects.get(id=id)
            menuitem.delete()
            return JsonResponse({"success": True, "message": "Menu item deleted successfully"})
        except MenuItem.DoesNotExist:
            return JsonResponse({"success": False, "message": "Menu item not found"})
    else:
        return JsonResponse({"success": False, "message": "The method should be DELETE"})

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
            return  JsonResponse({"success": False, "message": "No cart found"})
    else:
        return JsonResponse({"success": False, "message": "The method should be GET"})

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
            restro_id = data.get("restaurant_id")
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
            cart_items = Cartitem.objects.filter(cart=cart,restaurant=restro_id)
            
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

# get order of a restaurant
@csrf_exempt
def getorderbyrestaurant(request, id):
    if request.method == "GET":
        try:
            orders = Order.objects.filter(restaurant_id=id)
            if orders.exists():
                serialized = OrderSerializer(orders, many=True)
                for order in serialized.data:
                    user = CustomerUser.objects.get(id=order['user'])
                    order['user'] = user.name
                return JsonResponse({'success': True, 'orders': serialized.data})
            else:
                return JsonResponse({'success': False,"message": "No orders found for this restaurant"})
        except Exception as e:
            return JsonResponse({'success': False,"message": str(e)}, status=500)
    else:
        return JsonResponse({'success': False,"message": "The method should be GET"}, status=405)

@csrf_exempt
def getorderbyuser(request, id):
    if request.method == "GET":
        print (id)
        try:
            orders = Order.objects.filter(user_id=id)
            if orders.exists():
                serialized = OrderSerializer(orders, many=True)
                for order in serialized.data:
                    restaurant = RestaurantUser.objects.get(id=order['restaurant'])
                    order['restaurant'] = restaurant.name
                    updated_at = order['updated_at']
                    if isinstance(updated_at, str):
                        # Do nothing if already formatted
                        pass
                    else:
                        order['updated_at'] = datetime.fromisoformat(updated_at[:-1]).strftime("%Y-%m-%d %H:%M:%S")

                return JsonResponse({'success': True, 'orders': serialized.data})
            else:
                return JsonResponse({'success': False,"message": "No orders found for this user"})
        except Exception as e:
            return JsonResponse({'success': False,"message": str(e)}, status=500)
    else:
        return JsonResponse({'success': False,"message": "The method should be GET"}, status=405)

#update order status
@csrf_exempt
def update_order_status(request, id):
    try:
        order = Order.objects.get(id=id)
        if request.method == 'PUT':
            data = json.loads(request.body)
            status = data.get('status')
            if status is not None:
                order.status = status
                order.save()
                return JsonResponse({'success': True, 'message': 'Order status updated successfully.'})
            else:
                return JsonResponse({'success': False, 'message': 'Status is required.'}, status=400)
        else:
            return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=400)
    except Order.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Order not found.'}, status=404)
    

@csrf_exempt
def changeopenstatus(request):
    if request.method=="PUT":
        data=json.loads(request.body)
        id=data.get("id")
        status=data.get("status")
        try:
            restro=RestaurantUser.objects.get(id=id)
            restro.open=status
            restro.save()
            restro = RestaurantUser.objects.get(id=id)
            serialized = RestaurantUserSerializer(restro, many=False)
            payload = {"data": serialized.data}
            token = jwt.encode(payload, "secret", algorithm="HS256")
            return JsonResponse({"success":True,"message": "Status changed successfully","token":token}, encoder=DjangoJSONEncoder)
        except:
            return JsonResponse({"success":False,"message":"Restaurant not found"})
    else:
        return JsonResponse({"success":False,"message":"The method should be PUT"})
    
@csrf_exempt
def updaterestro(request,id):
    if request.method=="PUT":
        data=json.loads(request.body)
        delivery = data.get("delivery_time")
        description = data.get("description")
        profile = data.get("picture")
        coverphoto = data.get("coverphoto")
        try:
            restro=RestaurantUser.objects.get(id=id)
            restro.delivery_time=delivery
            restro.description=description
            if profile is not None:
                profile_data = base64.b64decode(profile.split(',')[1])
                profile_name = f"{restro.id}_profile.jpg"
                restro.picture.save(profile_name, ContentFile(profile_data), save=False)
            if coverphoto is not None:
                # restro.coverphoto.save(temp_cover_name, temp_cover_file)
                coverphoto_data = base64.b64decode(coverphoto.split(',')[1])
                coverphoto_name = f"{restro.id}_cover.jpg"
                restro.coverphoto.save(coverphoto_name, ContentFile(coverphoto_data), save=False)
            restro.save()

            serializers = RestaurantUserSerializer(restro, many=False)
            payload = {"data": serializers.data}
            token = jwt.encode(payload , "secret", algorithm="HS256")
            print(token)
            return JsonResponse({"success":True,"message":"Restaurant updated successfully","token":token})
        except:
            return JsonResponse({"success":False,"message":"Restaurant not found"})



@csrf_exempt
def addpromotion(request):
    if request.method=="POST":
        data=json.loads(request.body)
        id = data.get("restaurant")
        profile = data.get("picture")
        try:
            restro = RestaurantUser.objects.get(id=id)
            print(restro)
            if profile is not None:
                profile_data = base64.b64decode(profile.split(',')[1])
                profile_name = f"{restro.id}_profile.jpg"
                profile = ContentFile(profile_data, profile_name)
    
            promotion = promotionimage.objects.create(restaurant=restro, picture=profile)
            promotion.save()
            return JsonResponse({"success":True,"message":"Promotion added successfully"})
        except:
            return JsonResponse({"success":False,"message":"Restaurant not found"})
    else:
        return JsonResponse({"success":False,"message":"The method should be POST"})
    
@csrf_exempt
def getpromotion(request):
    if request.method=="GET":
        try:
            promotions=promotionimage.objects.all()
            serialized=PromotionImageSerializer(promotions,many=True)
            return JsonResponse({"success":True,"message":serialized.data})
        except:
            return JsonResponse({"success":False,"message":"No promotions found"})
    else:
        return JsonResponse({"success":False,"message":"The method should be GET"})

@csrf_exempt
def getpromotionbyid(request, id):
    if request.method == "GET":
        try:
            # Filter promotion images by restaurant id
            promotions = promotionimage.objects.filter(restaurant=id)
            
            # Serialize the queryset
            serialized = PromotionImageSerializer(promotions, many=True)
            
            # Return serialized data as JSON response
            return JsonResponse(serialized.data, safe=False)
        except promotionimage.DoesNotExist:
            return JsonResponse({"success": False, "message": "Promotion not found"})

@csrf_exempt
def deletepromotion(request,id):
    if request.method=="DELETE":
        try:
            promotion=promotionimage.objects.get(id=id)
            promotion.delete()
            return JsonResponse({"success":True,"message":"Promotion deleted successfully"})
        except:
            return JsonResponse({"success":False,"message":"Promotion not found"})
    else:
        return JsonResponse({"success":False,"message":"The method should be DELETE"})
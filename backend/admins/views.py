from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import jwt
from rest_framework.decorators import api_view
import json
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate, login
from .models import *
from .serializers import *
import random
import string
from django.core.mail import send_mail
from django.conf import settings
from restaurant.models import RestaurantData
from restaurant.serializers import RestaurantDataSerializer

from django.core.serializers.json import DjangoJSONEncoder

def response(success, message):
    return JsonResponse({"success": success, "message": message})


# Create your views here.
@csrf_exempt
def adminsignup(request):
    if request.method == "POST":
        data_json = json.loads(request.body)
        serializer = AdminDataSerializer(data=data_json)
        if serializer.is_valid():
            user = serializer.save()
            print(user)
            # Hash the password before saving to the database
            user.password = make_password(data_json['password'])
            user.save()
            return response(True,"Signup Sucessful")
        else:
            # If the data is not valid, return the errors
            return response(False,serializer.errors)
    else:
        return response(False,"The method should be POST")

@csrf_exempt
def adminlogin(request):
    if request.method == 'POST':
        data_json = json.loads(request.body)
        email= data_json.get("email")
        password = data_json.get("password")
        try:
            user=AdminData.objects.get(email=email)

            if check_password(password,user.password):
                payload={
                    "id":user.id,
                    "email":user.email,
                    "name":user.name,
                    "phone":user.phonenumber,
                    "address":user.address,
                }
                token = jwt.encode(payload, "secret", algorithm="HS256")
                return JsonResponse({"success": True, "message": token}, encoder=DjangoJSONEncoder)
            else :  
                return response(False,"password doesn't match")
        except Exception as e:
            return response(False,e)
    else:
        return response(False,"The method should be POST")

@csrf_exempt
def get_data(request):
    # The user is authenticated, and you can access user data
    user = request.user
    jwt_token = request.headers.get("Authorization")

    if jwt_token:
        try:
           
            payload = jwt.decode(jwt_token.split(" ")[1], "secret", algorithms=["HS256"])
            user = AdminData.objects.get(id=payload["id"])
            data = {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "address": user.address,
                "phone": user.phonenumber,

            }
            return response(True,data)
        except:
            return response(False,"Token has expired")
 

    

@csrf_exempt
def addrestaurant(request):
    if request.method=="POST":
        restaurantdata = json.loads(request.body)
        serializer=RestaurantDataSerializer(data=restaurantdata)
        if serializer.is_valid():
            random_password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
            hased_password = make_password(random_password)           
            serializer.validated_data['password'] = hased_password
            print(random_password,hased_password)
            user=serializer.save()
            subject = 'Creation of Account'
            message = f'Welcome {user.name},\nYour account has been created in FoodFuse. You can use your email: {user.email} and password:{random_password} for login. We encourage to change the password at first. Welcome to our team.'            
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [user.email]
        # Send the email using Gmail
            send_mail(subject, message, from_email,recipient_list, fail_silently=True)
            return response(True,"Restaurant added successfully")
        else:
            return response(False,serializer.errors)

    else:
        return response(False,"The method should be POST")

@csrf_exempt
def getrestaurantdata(request):
    if request.method=="GET":
        alldata= RestaurantData.objects.all()
        serialized_data = RestaurantDataSerializer(alldata,many=True)
        return JsonResponse(serialized_data.data,safe=False)
        # return  JsonResponse(RestaurantDataviews.as_view()(request))
    else:
        return response(False,"The method should be GET")
    
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import jwt
import json
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token

from rest_framework.authtoken.models import Token
from .models import *
from .serializers import *
import random
import string
from django.core.mail import send_mail
from django.conf import settings
from restaurant.models import RestaurantUser
from restaurant.serializers import RestaurantUserSerializer
from django.core.serializers.json import DjangoJSONEncoder

def response(success, message):
    return JsonResponse({"success": success, "message": message})


# Create your views here.
@csrf_exempt
def adminsignup(request):
    if request.method == "POST":
        data_json = json.loads(request.body)
        serializer = AdminUserSerializer(data=data_json)
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
            user=AdminUser.objects.get(email=email)
            if check_password(password,user.password):
                serialized=AdminUserSerializer(user,many=False)
                payload = {"data": serialized.data}
                token = jwt.encode(payload, "secret", algorithm="HS256")
                return JsonResponse({"success": True, "message": token}, encoder=DjangoJSONEncoder)
            else :  
                return response(False,"password doesn't match")
        except Exception as e:
            return response(False,e)
    else:
        return response(False,"The method should be POST")




    

@csrf_exempt
def addrestaurant(request):
    if request.method=="POST":
        restaurantdata = json.loads(request.body)
        serializer=RestaurantUserSerializer(data=restaurantdata)
        if serializer.is_valid():
            random_password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
            hased_password = make_password(random_password)           
            serializer.validated_data['password'] = hased_password
            print(random_password,hased_password)
            user=serializer.save()
            subject = 'Creation of Account'
            message = f'Welcome {user.ownername},\nYour account has been created in FoodFuse for {user.name}. You can use your email: {user.email} and password:{random_password} for login. We encourage to change the password at first. Welcome to our team.'            
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
        alldata= RestaurantUser.objects.all()
        serialized_data = RestaurantUserSerializer(alldata,many=True)
        return JsonResponse(serialized_data.data,safe=False)
    else:
        return response(False,"The method should be GET")

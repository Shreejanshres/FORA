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

import base64
from django.core.files.base import ContentFile


# Create your views here.
@csrf_exempt
def adminsignup(request):
    if request.method == "POST":
        data_json = json.loads(request.body)
        print(data_json)
        serializer = AdminUserSerializer(data=data_json)
        if serializer.is_valid():
            random_password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
            hased_password = make_password(random_password)           
            serializer.validated_data['password'] = hased_password
            print(random_password,hased_password)
            user=serializer.save()
            subject = 'Creation of Account'
            message = f'Welcome {user.name},\nYou can use your email: {user.email} and password:{random_password} for login. We encourage to change the password at first. Welcome to our team.'            
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [user.email]
        # Send the email using Gmail
            send_mail(subject, message, from_email,recipient_list, fail_silently=True)
            return JsonResponse({"success": True, "message": "Admin added successfully"})
        else:
            # If the data is not valid, return the errors
            return JsonResponse({"success": False, "message": serializer.errors})   
    else:
        return JsonResponse({"success": False, "message": "The method should be POST"})

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
                return JsonResponse({"success": False, "message": "Invalid password"})
        except Exception as e:
            return JsonResponse({"success": False, "message": "Invalid email"})
    else:
        return JsonResponse({"success": False, "message": "The method should be POST"})

@csrf_exempt
def getadmins(request):
    if request.method == 'GET':
        alladmins = AdminUser.objects.all()
        serialized = AdminUserSerializer(alladmins, many=True)
        return JsonResponse(serialized.data, safe=False)
    else:
        return JsonResponse({"success": False, "message": "The method should be GET"})

    

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
            return JsonResponse({"success": True, "message": "Restaurant added successfully"})
        else:
            return JsonResponse({"success": False, "message": serializer.errors})
    else:
        return JsonResponse({"success": False, "message": "The method should be POST"})

@csrf_exempt
def getrestaurantdata(request):
    if request.method=="GET":
        alldata= RestaurantUser.objects.all()
        serialized_data = RestaurantUserSerializer(alldata,many=True)
        return JsonResponse(serialized_data.data,safe=False)
    else:
        return JsonResponse({"success": False, "message": "The method should be GET"})

@csrf_exempt
def deleteadmin(request,id):
    if request.method=="DELETE":
        try:
            admin=AdminUser.objects.get(id=id)
            admin.delete()
            return JsonResponse({"success": True, "message": "Admin deleted successfully"})
        except Exception as e:
            return JsonResponse({"success": False, "message": "Admin not found"})
    else:
        return JsonResponse({"success": False, "message": "The method should be POST"})
    
@csrf_exempt
def deleterestaurant(request,id):
    if request.method=="DELETE":
        try:
            restaurant=RestaurantUser.objects.get(id=id)
            restaurant.delete()
            return JsonResponse({"success": True, "message": "Restaurant deleted successfully"})
        except Exception as e:
            return JsonResponse({"success": False, "message": "Restaurant not found"})
    else:
        return JsonResponse({"success": False, "message": "The method should be POST"})
    

@csrf_exempt
def updateadmin(request,id):
    if request.method=="PUT":
        data=json.loads(request.body)
        profile = data.get("picture")
        try:
            restro=AdminUser.objects.get(id=id)
            if profile is not None:
                profile_data = base64.b64decode(profile.split(',')[1])
                profile_name = f"{restro.id}_profile.jpg"
                restro.picture.save(profile_name, ContentFile(profile_data), save=False)
            restro.save()

            serializers = AdminUserSerializer(restro, many=False)
            payload = {"data": serializers.data}
            token = jwt.encode(payload , "secret", algorithm="HS256")
            print(token)
            return JsonResponse({"success":True,"message":"Restaurant updated successfully","token":token})
        except:
            return JsonResponse({"success":False,"message":"Restaurant not found"})

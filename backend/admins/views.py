from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate, login
from .models import *
from .serializers import *

from restaurant.models import RestaurantData
from restaurant.serializers import RestaurantDataSerializer



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
                return response(True,"Logged in successfully")
            else :  
                return response(False,"password doesn't match")
        except:
            return response(False,"User with given email doesn't exist")
    else:
        return response(False,"The method should be POST")

@csrf_exempt
def addrestaurant(request):
    if request.method=="POST":
        restaurantdata = json.loads(request.body)
        serializer=RestaurantDataSerializer(data=restaurantdata)
        if serializer.is_valid():
            user= serializer.save()
            print(user)
            user.password=make_password(restaurantdata['password'])
            user.save()
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
    
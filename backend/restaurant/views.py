from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json
from django.contrib.auth.hashers import make_password, check_password

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
            user=RestaurantData.objects.get(email=email)
            if check_password(password,user.password):
                 return response(True,"Logged in successfully")
            else :  
                return response(False,"password doesn't match")
        except:
            return response(False,"User with given email doesn't exist")
    else:
        return response(False,"The method should be POST")
    
@csrf_exempt
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
            menuitem=Menu.objects.filter(restaurant=id)
            serialized=MenuSerializer(menuitem,many=True)
            return  JsonResponse(serialized.data,safe=False)
        except:
            return  response( False , "No Menu found for this restaurant" )
    else:
        return response(False,"The method should be GET")
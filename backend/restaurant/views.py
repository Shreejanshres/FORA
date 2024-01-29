from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json
from django.contrib.auth.hashers import make_password, check_password

from .models import restaurantData
@csrf_exempt
def login(request):
    if request.method == 'POST':
        data_json = json.loads(request.body)
        email= data_json.get("email")
        password = data_json.get("password")
        data=restaurantData.objects.get()
        print("fro user:",email,password)
        print("from data:",data.email,data.password)
        try:
            user=restaurantData.objects.get(email=email)
            if check_password(password,user.password):
                return JsonResponse({"sucess":True,"message":"You are logged in"})
            else :  
                return JsonResponse({"sucess":False,"message":"password doesn't match"})
        except:
            return JsonResponse({"sucess":False,"message":"User with given email doesn't exist"})
    return JsonResponse({"sucess":False,"message": "The request should be POST"})


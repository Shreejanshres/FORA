from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json
from rest_framework import status
from .models import UserData
from .serializer import UserDataSerializer
from django.contrib.auth import authenticate , login, logout

@csrf_exempt
@api_view(['POST'])
def signup(request):
    if request.method == "POST":
        data_json = json.loads(request.body)
        serializer = UserDataSerializer(data=data_json)
        if serializer.is_valid():
            serializer.save()
     
        return Response({"message": "done"}, status=200)  # Added status code and wrapped response in a dictionary
    return Response({"message": "The method should be POST"}, status=405)  # Method not allowed status code

@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        data_json = json.loads(request.body)
        d_name = data_json.get('name')
        d_email = data_json.get('email') 
        # print(name,email)
        data=UserData.objects.get()
        print(data)
        if UserData.objects.filter(name=d_name, email=d_email).exists():
            return Response("Logged")
        else :  
            return Response("not logged")
        
    return Response("no GET")
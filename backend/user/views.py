from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json
from .models import *
from .serializer import *
from django.contrib.auth import authenticate , login, logout
from django.contrib.auth.hashers import make_password, check_password


#for mail
from django.core.mail import send_mail
from django.conf import settings
import random

@csrf_exempt
@api_view(['POST'])
def signup(request):
    if request.method == "POST":
        data_json = json.loads(request.body)
        serializer = UserDataSerializer(data=data_json)
        
        if serializer.is_valid():
            user = serializer.save()
            print(user)
            # Hash the password before saving to the database
            user.password = make_password(data_json['password'])
            user.save()
            
            return Response({"sucess":True,"message": "Signup successful"})
        else:
            # If the data is not valid, return the errors
            return Response({"sucess":False,"message": "Invalid data", "errors": serializer.errors})
    return Response({"sucess":False,"message": "The request should be POST"})


@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        data_json = json.loads(request.body)
        email= data_json.get("email")
        password = data_json.get("password")
        data=UserData.objects.get()
        print("fro user:",email,password)
        print("from data:",data.email,data.password)
        try:
            user=UserData.objects.get(email=email)
            if check_password(password,user.password):
                return Response({"sucess":True,"message":"You are logged in"})
            else :  
                return Response({"sucess":False,"message":"password doesn't match"})
        except:
            return Response({"sucess":False,"message":"User with given email doesn't exist"})
    return Response({"sucess":False,"message": "The request should be POST"})

@csrf_exempt
@api_view(['POST'])
def forgetpassword(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        if(UserData.objects.filter(email=email).exists()):
            otp = str(random.randint(100000, 999999))
            # Compose the email message
            subject = 'Your OTP for password reset'
            message = f'Your OTP is {otp}.'
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [email]
        # Send the email using Gmail
            send_mail(subject, message, from_email,recipient_list, fail_silently=True)
        # Store the OTP in the session for later verification
            request.session['otp'] = otp
            request.session['email'] = email
            saveotp(otp,email)
            respose_data = {'otp': otp, 'success': True}
            return Response({"sucess":True,"message":respose_data})
        else:
            return Response({"sucess":False,"message":"User with the email doesn't exist"})
    else:
        return Response({'success': False, 'message': 'need to be POST'})

def saveotp(otp,email):
    serialized=OtpLogSerializer(data={otp,email})
    if serialized.is_valid():
        serialized.save()
    else:
        # If the data is not valid, return the errors
        return Response({"sucess":False,"message": "Invalid data", "errors": serialized.errors})   
    


@csrf_exempt
def updatepassword(request):
    if request.method=='POST':
        data=json.loads(request.body)
        password=data.get('newpassword')
        email=data.get('email')
        if(UserData.objects.filter(email=email).exists):
            data = UserData.objects.get(email=email)
            data.password = password
            data.save()
            return JsonResponse({'success': True, 'message': 'Password changed successfully'})
        return Response("no user")
    return Response("It should be post")

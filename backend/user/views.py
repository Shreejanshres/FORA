from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json
from .models import UserData
from .serializer import UserDataSerializer
from django.contrib.auth import authenticate , login, logout

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
            serializer.save()
            return Response({"message": "done"})  # Added status code and wrapped response in a dictionary
        else:
            return Response({"message":"not valid"})
    return Response({"message": "The method should be POST"})  # Method not allowed status code

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
            return Response("not found")
    return Response("The method should be POST")

@csrf_exempt
def forgetpassword(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        print(email)
        otp = str(random.randint(100000, 999999))
        # Compose the email message
        subject = 'Your OTP for password reset'
        message = f'Your OTP is {otp}.'
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]
        # Send the email using Gmail
        send_mail(subject, message, from_email,
                  recipient_list, fail_silently=True)
        # Store the OTP in the session for later verification
        request.session['otp'] = otp
        request.session['email'] = email
        respose_data = {'otp': otp, 'success': True}
        return JsonResponse(respose_data)
    else:
        return JsonResponse({'success': True, 'message': 'Password changed successfully'})
    
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

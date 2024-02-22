
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.core.serializers.json import DjangoJSONEncoder

import json

from .models import *
from .serializer import *
from .utils import saveotp

from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from datetime import timedelta , datetime


#for mail
from django.core.mail import send_mail
from django.conf import settings
import random

@csrf_exempt
# @api_view(['POST'])
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
            
            return JsonResponse({"success":True,"message": "Signup successful"})
        else:
            # If the data is not valid, return the errors
            return JsonResponse({"success":False,"message": "Invalid data", "errors": serializer.errors})
    return JsonResponse({"success":False,"message": "The request should be POST"})


@csrf_exempt
def login(request):
    if request.method == 'POST':
        data_json = json.loads(request.body)
        email= data_json.get("email")
        password = data_json.get("password")
        print(email,password)
        try:
            user=UserData.objects.get(email=email)
            resposedata=UserDataSerializer(user)
           
            if check_password(password,user.password):
                return JsonResponse({"success":True,"message":resposedata.data},encoder=DjangoJSONEncoder)
            else :  
                return JsonResponse({"success":False,"message":"password doesn't match"})
        except:
            return JsonResponse({"success":False,"message":"User with given email doesn't exist"})
    return JsonResponse({"success":False,"message": "The request should be POST"})

@csrf_exempt
def forgetpassword(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        print(email)
        nofrequest = OtpLog.objects.filter(email=email, created_time__gte=timezone.now() - timedelta(seconds=20)).count()
        # Limit for the number of requests within 5 minutes
        REQUEST_LIMIT = 2
        if nofrequest >= REQUEST_LIMIT:
            # User has exceeded the limit for OTP requests within 5 minutes
            return JsonResponse({"success": False, "message": "Exceeded the limit for OTP requests. Try again later."})
        else:
            if UserData.objects.filter(email=email).exists() :
                OtpLog.objects.filter(email=email, is_active=True).update(is_active=False)
                otp = str(random.randint(100000, 999999))
                # Compose the email message
                subject = 'Your OTP for password reset'
                message = f'Your OTP is {otp}.'
                from_email = settings.EMAIL_HOST_USER
                recipient_list = [email]
            # Send the email using Gmail
                send_mail(subject, message, from_email,recipient_list, fail_silently=True)
            # Store the OTP in the session for later verification
                saveotp(email, otp)
                timestamp = datetime.now().timestamp()  # Current timestamp
                request.session['otp'] = otp
                request.session['otp_timestamp'] = str(timestamp)
                request.session['email'] = email
                
                respose_data = {'otp': otp}
                return JsonResponse({"success":True,"message":respose_data})
            else:
                return JsonResponse({"success":False,"message":"User with the email doesn't exist"})
    else:
        return JsonResponse({'success': False, 'message': 'need to be POST'})
  



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
        return JsonResponse("no user")
    return JsonResponse("It should be post")

@csrf_exempt
def validate_otp(request):
    if request.method=='POST':
        data=json.loads(request.body)
        email=data.get('email')
        otp=data.get('otp')
        print(email,otp)
        valid= OtpLog.objects.filter(email=email,otp=otp,is_active=True).exists()
        print(valid)
        if valid:
            OtpLog.objects.filter(email=email, is_active=True).update(is_active=False)
            return JsonResponse({"success":True,"message":"Validated OTP"})
        else:
            return JsonResponse({"success":False,"message":"Already used"})

    else:
        return JsonResponse({"success":False, "message":"The request should be POST"})
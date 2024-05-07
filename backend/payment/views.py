import json
from django.conf import settings
from django.shortcuts import render
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from rest_framework.response import Response
# Create your views here.
@csrf_exempt
def khalti(request):
    data = json.loads(request.body)
    token = data.get('token')
    amount = data.get('amount')
    email = data.get('email')
    print(request.body)
    payload = {
        "token":token,
        "amount":amount,
    }
    print(payload)
    headers = {
        "Authorization": "Key {}".format(settings.KHALTI_SECRET_KEY)
    }
    try:
        response = requests.post(settings.KHALTI_VERIFY_URL,{data.get('idx')},{headers})
        print(response.json())
        if response.status_code == 200 :
            invoice(email,amount, data.get('product_name'), data.get('idx'))
            return JsonResponse({
                'success':True,
                'message':response.json(),
            })

        else:
            return JsonResponse({
                'success':False,
                'message':response.json(),
            })

    except Exception as e:
        return JsonResponse({
            'success':False,
            'message':str(e),
        })

def invoice(email, amount, product_name, idx):
    print(email, amount, product_name, idx)
    
    subject = 'FoodFuse Payment Invoice'
    message = f'Your amount for {product_name} is {amount}.'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]

    # Print for testing, comment out in production
    print(subject, message, from_email, recipient_list)

    # Send the email using Gmail
    send_mail(subject, message, from_email, recipient_list, fail_silently=True)

    return Response({'success':True})
from .serializer import OtpLogSerializer
from django.http import JsonResponse



from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import OtpLog

@shared_task
def deactivate_expired_otps():
    five_minutes_ago = timezone.now() - timedelta(minutes=1)
    count = OtpLog.objects.filter(is_active=True, timestamp__lte=five_minutes_ago).update(is_active=False)
    return {"status": "success", "count": count}



def saveotp(email,otp):
    serialized=OtpLogSerializer(data={"email":email,"otp":otp})
    if serialized.is_valid():
        serialized.save()
        return JsonResponse({"success":True,"message":"Saved"})
    else:
        # If the data is not valid, return the errors
        return JsonResponse({"sucess":False,"message": "Invalid data", "errors": serialized.errors}) 
    


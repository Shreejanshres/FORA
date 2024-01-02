from .serializer import OtpLogSerializer
from django.http import JsonResponse

def saveotp(email,otp):
    serialized=OtpLogSerializer(data={"email":email,"otp":otp})
    if serialized.is_valid():
        serialized.save()
        return JsonResponse({"success":True,"message":"Saved"})
    else:
        # If the data is not valid, return the errors
        return JsonResponse({"sucess":False,"message": "Invalid data", "errors": serialized.errors}) 
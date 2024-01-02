from rest_framework import serializers
from .models import *

class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = '__all__'

class OtpLogSerializer(serializers.ModelSerializer):
    class Meta:
        model=OtpLog
        fields = '__all__'
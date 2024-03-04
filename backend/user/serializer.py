from rest_framework import serializers
from .models import *

class CustomerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerUser
        fields = '__all__'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Remove the 'password' field from the serialized data
        data.pop('password', None)
        return data

class OtpLogSerializer(serializers.ModelSerializer):
    class Meta:
        model=OtpLog
        fields = '__all__'
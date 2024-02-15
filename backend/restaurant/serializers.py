from rest_framework import serializers
from .models import *

class RestaurantDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantData
        fields = '__all__'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Remove the 'password' field from the serialized data
        data.pop('password', None)
        return data

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model=Tags
        fields='__all__'

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model=Menu
        fields='__all__'
        extra_kwargs = {'picture': {'required': False}}
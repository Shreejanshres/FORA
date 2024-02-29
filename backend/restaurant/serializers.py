from rest_framework import serializers
from .models import *

class RestaurantDataSerializer(serializers.ModelSerializer):
    picture=serializers.ImageField(required=False)
    delivery_time=serializers.CharField(required=False)
    description=serializers.CharField(required=False)
    password=serializers.CharField(required=False)
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
        model=MenuItem
        fields='__all__'
        extra_kwargs = {'picture': {'required': False}}

class HeadingSerializer(serializers.ModelSerializer):
    menuitem_set = MenuSerializer(many=True, read_only=True)
    class Meta:
        model=Heading
        fields='__all__'
        extra_kwargs = {'restaurant': {'required': False}}
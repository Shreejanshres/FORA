from rest_framework import serializers
from .models import *

class RestaurantUserSerializer(serializers.ModelSerializer):
    picture=serializers.ImageField(required=False)
    coverphoto=serializers.ImageField(required=False)
    delivery_time=serializers.CharField(required=False)
    description=serializers.CharField(required=False)
    password=serializers.CharField(required=False)
    class Meta:
        model = RestaurantUser
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
    tag = TagSerializer(many=False, read_only=True)
    class Meta:
        model=MenuItem
        fields='__all__'
        

class HeadingSerializer(serializers.ModelSerializer):
    menuitem_set = MenuSerializer(many=True, read_only=True)
    class Meta:
        model=Heading
        fields='__all__'
        extra_kwargs = {'restaurant': {'required': False}}

class DetailDataSerializer(serializers.ModelSerializer):
    heading_set= HeadingSerializer(many=True, read_only=True)
    class Meta:
        model=RestaurantUser
        fields='__all__'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Remove the 'password' field from the serialized data
        data.pop('password', None)
        return data

class AddCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=Cartitem
        fields='__all__'

class CartItemSerializer(serializers.ModelSerializer):
    item=MenuSerializer(many=False, read_only=True)
    class Meta:
        model=Cartitem
        fields='__all__'

    
class CartTableSerializer(serializers.ModelSerializer):
    cart_item=CartItemSerializer(many=True, read_only=True) 
    restaurantname=RestaurantUserSerializer(many=False, read_only=True)
    class Meta:
        model=CartTable
        fields='__all__'
    

class OrderItemSerializer(serializers.ModelSerializer):
    item=MenuSerializer(many=False, read_only=True)
    class Meta:
        model=OrderItem
        fields='__all__'

class OrderSerializer(serializers.ModelSerializer):
    status=serializers.CharField(required=False)
    order_items=OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model=Order
        fields='__all__'

class RestaurantUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model=RestaurantUser
        fields=['picture','coverphoto','delivery_time','description']


class PromotionImageSerializer(serializers.ModelSerializer):
    restaurant=RestaurantUserSerializer(many=False, read_only=True)
    class Meta:
        model=promotionimage
        fields='__all__'
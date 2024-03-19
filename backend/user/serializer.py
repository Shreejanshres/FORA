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

class RecipeSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    username = serializers.CharField(source='user.name', read_only=True)
    profile_pic = serializers.ImageField(source='user.profile_pic', read_only=True)
    class Meta:
        model=Recipe
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.name', read_only=True)
    profile_pic = serializers.ImageField(source='user.profile_pic', read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'username','profile_pic', 'text', 'created_at'] 


class LikeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.name', read_only=True)
    class Meta:
        model=Like
        fields = ['id', 'username' , 'created_at'] 

class PostSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False) 
    username = serializers.CharField(source='user.name', read_only=True)
    comment= CommentSerializer(many=True, read_only=True)
    profile_pic = serializers.ImageField(source='user.profile_pic', read_only=True)
    class Meta:
        model=Post
        fields = '__all__'
    def get_likes_count(self, obj):
        return obj.likes.count()

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model=Follow
        fields = '__all__'

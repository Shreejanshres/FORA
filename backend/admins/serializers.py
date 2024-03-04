from rest_framework import serializers
from .models import *

class AdminUserSerializer(serializers.ModelSerializer):
    picture = serializers.ImageField(required=False)
    username = serializers.CharField(required=False)
    groups = serializers.CharField(required=False)
    user_permissions = serializers.CharField(required=False)
    class Meta:
        model = AdminUser
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Remove the 'password' field from the serialized data
        data.pop('password', None)
        return data
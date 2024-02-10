from rest_framework import serializers
from .models import *

class AdminDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminData
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Remove the 'password' field from the serialized data
        data.pop('password', None)
        return data
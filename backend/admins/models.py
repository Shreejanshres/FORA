from django.db import models
from django.contrib.auth.models import AbstractUser

class AdminData(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField()
    address = models.CharField()
    phonenumber = models.CharField()

   

    def __str__(self):
        return self.name

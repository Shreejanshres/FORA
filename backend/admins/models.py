from django.db import models

# Create your models here.

class AdminData(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password=models.CharField()
    address=models.CharField()
    phonenumber=models.CharField()

    def __str__(self):
        return self.name
    
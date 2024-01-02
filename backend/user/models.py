from django.db import models

class UserData(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password=models.CharField()
    address=models.CharField()
    phonenumber=models.CharField()

    def __str__(self):
        return self.name

class OtpLog(models.Model):
    email=models.CharField()
    otp=models.CharField()
    is_active=models.BooleanField(default=True)
    created_time=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.is_active)
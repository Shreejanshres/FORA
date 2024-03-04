from django.db import models

class AdminUser(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField()
    address = models.CharField()
    phonenumber = models.CharField()
    picture = models.ImageField(upload_to='admins/')

    def __str__(self):
        return self.name

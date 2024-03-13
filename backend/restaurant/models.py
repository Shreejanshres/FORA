from django.db import models
# Create your models here.    
class RestaurantUser(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password=models.CharField(max_length=255)
    ownername=models.CharField(max_length=50)
    address=models.CharField(max_length=100)
    phonenumber=models.CharField(max_length=15)
    delivery_time=models.CharField(max_length=5)
    picture=models.ImageField(upload_to='images/')
    coverphoto=models.ImageField(upload_to='coverphotos/')
    description=models.TextField(max_length=500)
    open=models.BooleanField(default=True)
    def __str__(self):
        return self.name
    
   
    
class Tags(models.Model):
    tag=models.CharField(max_length=50)
    
    def __str__(self):
        return self.tag

class Heading(models.Model):
    heading_name = models.CharField(max_length=255)
    restaurant = models.ForeignKey(RestaurantUser, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.restaurant.name} - {self.heading_name}"

    
class MenuItem(models.Model):
    item_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    tags = models.ManyToManyField(Tags)
    heading = models.ForeignKey(Heading, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.item_name} - {self.price}"
    
    
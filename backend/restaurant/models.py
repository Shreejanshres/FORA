from django.db import models

# Create your models here.
class RestaurantData(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password=models.CharField()
    address=models.CharField()
    phonenumber=models.CharField()
    delivery_time=models.CharField()

    def __str__(self):
        return self.name
    
   
    
class Tags(models.Model):
    name=models.CharField(max_length=50)
    restaurant=models.ForeignKey(RestaurantData,on_delete=models.CASCADE,related_name="tags")
    
    def __str__(self):
        return self.name
    
class Menu(models.Model):
    name=models.CharField(max_length=100)
    description=models.TextField()
    restaurant=models.ForeignKey(RestaurantData,on_delete=models.CASCADE,related_name="menu_items")
    tags=models.ManyToManyField(Tags,related_name="menu_items",blank=True)

    def __str__(self):
        return self.name
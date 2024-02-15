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
    tag=models.CharField(max_length=50)
    restaurant=models.ForeignKey(RestaurantData,on_delete=models.CASCADE,related_name="tags")
    
    def __str__(self):
        return self.tag
    
class Menu(models.Model):
    name=models.CharField(max_length=100)
    description=models.TextField()
    price=models.DecimalField(max_digits=6,decimal_places=2)
    picture=models.ImageField(upload_to='menu/')
    restaurant=models.ForeignKey(RestaurantData,on_delete=models.CASCADE,related_name="menu_items")
    tags=models.ManyToManyField(Tags,related_name="menu_items",blank=True)

    def __str__(self):
        return self.name
    
    
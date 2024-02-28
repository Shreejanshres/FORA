from django.db import models

# Create your models here.
class RestaurantData(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password=models.CharField(max_length=255)
    ownername=models.CharField(max_length=50)
    address=models.CharField(max_length=100)
    phonenumber=models.CharField(max_length=15)
    delivery_time=models.CharField(max_length=5)
    picture=models.ImageField(upload_to='restaurant/')

    def __str__(self):
        return self.name
    
   
    
class Tags(models.Model):
    tag=models.CharField(max_length=50)
    
    def __str__(self):
        return self.tag

class RestaurantTag(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.restaurant.restaurant_name} - {self.tag.tag_name}"
    
class Menu(models.Model):
    name=models.CharField(max_length=100)
    description=models.TextField()
    price=models.DecimalField(max_digits=6,decimal_places=2)
    restaurant=models.ForeignKey(RestaurantData,on_delete=models.CASCADE,related_name="menu_items")
    restaurant_tags = models.ManyToManyField(RestaurantTag) 
    tags=models.ManyToManyField(Tags,related_name="menu_items",blank=True)

    def __str__(self):
        return self.name
    
    
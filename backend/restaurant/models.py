from django.db import models
# Create your models here.    
from user.models import CustomerUser
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
    open=models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
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
    tag = models.ForeignKey(Tags, on_delete=models.CASCADE)
    heading = models.ForeignKey(Heading, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.item_name} - {self.price}"
    

class CartTable(models.Model):
    user_id= models.OneToOneField(CustomerUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.user_id.name}"

class Cartitem(models.Model):
    cart= models.ForeignKey(CartTable,related_name="cart_item", on_delete=models.CASCADE)
    item= models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity= models.IntegerField()
    notes= models.TextField(null=True, blank=True)
    restaurant= models.ForeignKey(RestaurantUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.quantity} x {self.item.item_name} in {self.cart}"
    
class Order(models.Model):
    user = models.ForeignKey(CustomerUser, on_delete=models.CASCADE)
    restaurant= models.ForeignKey(RestaurantUser, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=50)
    ispaid=models.BooleanField()
    address=models.CharField(max_length=100)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    PENDING = 'Pending'
    PROCESSING = 'Processing'
    COMPLETED = 'Completed'
    Delivering = 'Delivering'
    Delivered = 'Delivered'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (PROCESSING, 'Processing'),
        (COMPLETED, 'Completed'),
        (Delivering, 'Delivering'),
        (Delivered, 'Delivered'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order by {self.user.name} - Total: ${self.total_price}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='order_items', on_delete=models.CASCADE)
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    notes = models.TextField(null=True, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.subtotal = self.item.price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.item.item_name} in Order {self.order.id}"
    

class promotionimage(models.Model):
    picture=models.ImageField(upload_to='promotionimages/')
    restaurant=models.ForeignKey(RestaurantUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.restaurant
    
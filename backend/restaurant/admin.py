from django.contrib import admin

# Register your models here.
from .models import *
admin.site.register(RestaurantUser)
admin.site.register(Tags)
admin.site.register(MenuItem)
admin.site.register(Heading) 
admin.site.register(Cartitem)
admin.site.register(CartTable)
admin.site.register(Order)
admin.site.register(OrderItem)\


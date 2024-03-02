from django.contrib import admin

# Register your models here.
from .models import *
admin.site.register(RestaurantData)
admin.site.register(Tags)
admin.site.register(MenuItem)
admin.site.register(Heading)    


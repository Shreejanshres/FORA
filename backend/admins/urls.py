from django.urls import path
from .views import *
urlpatterns = [
    path('',adminlogin,name="adminlogin"),
    path('adminsignup/',adminsignup,name="adminsignup"),
    path('addrestaurant/',addrestaurant,name="addrestaurant"),
    path('viewrestaurant/',getrestaurantdata,name="getrestaurantdata"),
     path('getdata/',get_data,name="getrestaurantdata"),
]
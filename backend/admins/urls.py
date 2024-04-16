from django.urls import path
from .views import *
urlpatterns = [
    path('',adminlogin,name="adminlogin"),
    path('adminsignup/',adminsignup,name="adminsignup"),
    path('getadmins/',getadmins,name="getadmins"),
    path('addrestaurant/',addrestaurant,name="addrestaurant"),
    path('viewrestaurant/',getrestaurantdata,name="getrestaurantdata"),
]
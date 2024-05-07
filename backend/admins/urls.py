from django.urls import path
from .views import *
urlpatterns = [
    path('',adminlogin,name="adminlogin"),
    path('adminsignup/',adminsignup,name="adminsignup"),
    path('getadmins/',getadmins,name="getadmins"),
    path("updateadmin/<int:id>/",updateadmin,name="updateadmin"),
    path('addrestaurant/',addrestaurant,name="addrestaurant"),
    path('viewrestaurant/',getrestaurantdata,name="getrestaurantdata"),
    path('deleteadmin/<int:id>/',deleteadmin,name="deleteadmin"),
    path('deleterestaurant/<int:id>/',deleterestaurant,name="deleterestaurant"),
]
from django.urls import path
from .views import *
urlpatterns = [
    path('',signup,name="signup"),
    path('login/',login,name="login"),
    path('forgetpassword/',forgetpassword,name="forgetpassword"),
]

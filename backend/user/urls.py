from django.urls import path
from .views import *
urlpatterns = [
    path('',signup,name="signup"),
    path('login/',login,name="login"),
    path('forgetpassword/',forgetpassword,name="forgetpassword"),
    path('validateotp/',validate_otp,name="validate_otp"),
    path("updatepassword/",updatepassword,name="updatepassword"),
]

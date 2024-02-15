from django.urls import path
from .views import *
urlpatterns = [
    path('',login,name="login"),
    path('addtag/',addtags,name='addtags'),
    path('addmenu/',addmenu,name='addmenu'),
   path('viewmenu/',viewmenu,name='viewmenu'),
   
]

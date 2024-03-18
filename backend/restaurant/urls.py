from django.urls import path
from .views import *
urlpatterns = [
    path('',login,name="login"),
    path('addtag/',addtags,name='addtags'),
    path('addmenu/',addmenu,name='addmenu'),
    path('viewmenu/',viewmenu,name='viewmenu'),
    path('display_headings/<int:>',display_headings,name='display_headings'),
    path('add_heading/',add_heading,name='add_heading'),
]

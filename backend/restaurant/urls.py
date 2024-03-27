from django.urls import path
from .views import *
urlpatterns = [
    path('',login,name="login"),
    path('addtag/',addtags,name='addtags'),
    path('addmenu/',addmenu,name='addmenu'),
    path('viewmenu/',viewmenu,name='viewmenu'),
    path('display_headings/<int:id>/',display_headings,name='display_headings'),
    path('add_heading/',add_heading,name='add_heading'),
    # cart
    path('getcart/<int:id>/',getcart,name='getcart'),
    path('addtocart/',addtocart,name='addtocart'),
    path('deletefromcart/<int:id>/',deletefromcart,name='removefromcart'),
    path('delete/<int:id>/',delete,name='delete'),
    path('update/<int:id>/',update,name='update'),
]

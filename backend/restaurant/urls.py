from django.urls import path
from .views import *
urlpatterns = [
    path('',login,name="login"),
    path('addtag/',addtags,name='addtags'),
    path('displaytags/',displaytags,name='displaytags '),
    path('addmenu/',addmenu,name='addmenu'),
    path('viewmenu/',viewmenu,name='viewmenu'),
    path('display_headings/<int:id>/',display_headings,name='display_headings'),
    path('add_heading/',add_heading,name='add_heading'),
    # cart
    path('getcart/<int:id>/',getcart,name='getcart'),
    path('addtocart/',addtocart,name='addtocart'),
    path('deletefromcart/<int:id>/',deletefromcart,name='removefromcart'),
    path('delete/<int:id>/',delete,name='delete'),
    path('update/',update,name='update'),
    path('getbill/<int:id>/',getbill,name='register'),

    #order
    path('order/',addtoorder,name='addtoorder'),
    path('getorder/<int:id>/',getorderbyrestaurant,name='getorderbyrestaurant'),
    path('updateorder/<int:id>/',update_order_status,name='update_order_status'),

]


from django.urls import path
from .views import *
urlpatterns = [
    path('',login,name="login"),
    path('updatepassword/',update_password,name='update_password'),
    path('addtag/',addtags,name='addtags'),
    path('displaytags/',displaytags,name='displaytags '),
    path('addmenu/',addmenu,name='addmenu'),
    path('viewmenu/',viewmenu,name='viewmenu'),
    path ('deletemenu/<int:id>/',deletemenuitem,name='deletemenuitem'),
    path('display_headings/<int:id>/',display_headings,name='display_headings'),
    path('add_heading/',add_heading,name='add_heading'),
    # cart
    path('getcart/<int:id>/',getcart,name='getcart'),
    path('getindividualcart/',getindividualcart,name='getindividualcart'),
    path('addtocart/',addtocart,name='addtocart'),
    path('deletefromcart/<int:id>/',deletefromcart,name='removefromcart'),
    path('delete/<int:id>/',delete,name='delete'),
    path('update/',update,name='update'),
    path('getbill/<int:id>/',getbill,name='register'),

    #order
    path('order/',addtoorder,name='addtoorder'),
    path('getorder/<int:id>/',getorderbyrestaurant,name='getorderbyrestaurant'),
    path ('getorderbyuser/<int:id>/',getorderbyuser,name='getorder'),
    path('updateorder/<int:id>/',update_order_status,name='update_order_status'),

    path('updateopen/',changeopenstatus,name='changeopenstatus'),
    path('updaterestro/<int:id>/',updaterestro,name='updaterestro'),

    path("addpromotion/",addpromotion,name="addpromotion"),
    path("getpromotion/",getpromotion,name="getpromotion"),
    path("getpromotionbyid/<int:id>/",getpromotionbyid,name="getpromotionbyid"),
    path("deletepromotion/<int:id>/",deletepromotion,name="deletepromotion"),

]


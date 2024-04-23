from django.urls import path
from .views import *
urlpatterns = [
    path('',signup,name="signup"),
    path('login/',login,name="login"),
    path('forgetpassword/',forgetpassword,name="forgetpassword"),
    path('validateotp/',validate_otp,name="validate_otp"),
    path("updatepassword/",updatepassword,name="updatepassword"),
    path('updatepicture/',updatepic,name="updatepic"),

    path("addrecipe/",add_recipe,name="aadd_recipe"),
    path("getrecipe/",get_recipe,name="get_recipe"),
    path("deleterecipe/<int:id>",delete_recipe,name="delete_recipe"),
    path("getrecipebyid/<int:id>",get_recipe_by_id,name="get_recipe_by_id"),

    path("addpost/",add_post,name="add_post"),
    path("getpost/",get_post_with_comments_and_likes,name="get_post"),
    path("getpostbyid/<int:id>",get_post,name="get_post"),
    path("deletepost/<int:id>",delete_post,name="delete_post"),

    path("addcomment/",add_comment,name="add_comment"),
    path("getcomment/<int:id>",get_comment,name="get_comment"),
    path("deletecomment/<int:id>",delete_comment,name="delete_comment"),

    path("addlike/",add_like,name="add_like"),
    path("isliked/",isliked,name="get_like"),
    path("deletelike/",delete_like,name="delete_like"),

    path("addfollow/",add_follow,name="add_follow"),
    path ("checkfollow/",checkfollower,name="checkfollower"),
    path("getfollow/<int:id>",get_follow,name="get_follow"),
    path("getfollowing/<int:id>",get_following,name="get_following"),
    path("deletefollow/",delete_follow,name="delete_follow"),

    path("getpostbyuser/<int:id>",getpostbyuser,name="getpostbyuser"),
    path("getrecipebyuser/<int:id>",getrecipebyuser,name="getrecipebyuser"),

]


import base64
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.core.serializers.json import DjangoJSONEncoder
from django.core.files.base import ContentFile

import json

from .models import *
from .serializer import *
from .utils import saveotp

from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from datetime import timedelta , datetime


#for mail
from django.core.mail import send_mail
from django.conf import settings
import random

@csrf_exempt
# @api_view(['POST'])
def signup(request):
    if request.method == "POST":
        data_json = json.loads(request.body)
        serializer = CustomerUserSerializer(data=data_json)
        
        if serializer.is_valid():
            user = serializer.save()
            print(user)
            # Hash the password before saving to the database
            user.password = make_password(data_json['password'])
            user.save()
            return JsonResponse({"success":True,"message": "Signup successful"})
        else:
            # If the data is not valid, return the errors
            return JsonResponse({"success":False,"message": "Invalid data", "errors": serializer.errors})
    return JsonResponse({"success":False,"message": "The request should be POST"})


@csrf_exempt
def login(request):
    if request.method == 'POST':
        data_json = json.loads(request.body)
        email= data_json.get("email")
        password = data_json.get("password")
        print(email,password)
        try:
            user=CustomerUser.objects.get(email=email)
            responsedata=CustomerUserSerializer(user)
           
            if check_password(password,user.password):
                return JsonResponse({"success":True,"message":responsedata.data},encoder=DjangoJSONEncoder)
            else :  
                return JsonResponse({"success":False,"message":"password doesn't match"})
        except:
            return JsonResponse({"success":False,"message":"User with given email doesn't exist"})
    return JsonResponse({"success":False,"message": "The request should be POST"})

@csrf_exempt
def forgetpassword(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        print(email)
        nofrequest = OtpLog.objects.filter(email=email, created_time__gte=timezone.now() - timedelta(seconds=20)).count()
        # Limit for the number of requests within 5 minutes
        REQUEST_LIMIT = 2
        if nofrequest >= REQUEST_LIMIT:
            # User has exceeded the limit for OTP requests within 5 minutes
            return JsonResponse({"success": False, "message": "Exceeded the limit for OTP requests. Try again later."})
        else:
            if CustomerUser.objects.filter(email=email).exists() :
                OtpLog.objects.filter(email=email, is_active=True).update(is_active=False)
                otp = str(random.randint(100000, 999999))
                # Compose the email message
                subject = 'Your OTP for password reset'
                message = f'Your OTP is {otp}.'
                from_email = settings.EMAIL_HOST_USER
                recipient_list = [email]
            # Send the email using Gmail
                send_mail(subject, message, from_email,recipient_list, fail_silently=True)
            # Store the OTP in the session for later verification
                saveotp(email, otp)
                timestamp = datetime.now().timestamp()  # Current timestamp
                request.session['otp'] = otp
                request.session['otp_timestamp'] = str(timestamp)
                request.session['email'] = email
                
                respose_data = {'otp': otp}
                return JsonResponse({"success":True,"message":respose_data})
            else:
                return JsonResponse({"success":False,"message":"User with the email doesn't exist"})
    else:
        return JsonResponse({'success': False, 'message': 'need to be POST'})
  



@csrf_exempt
def updatepassword(request):
    if request.method=='POST':
        data=json.loads(request.body)
        password=data.get('newpassword')
        email=data.get('email')
        if(CustomerUser.objects.filter(email=email).exists):
            data = CustomerUser.objects.get(email=email)
            data.password = password
            data.save()
            return JsonResponse({'success': True, 'message': 'Password changed successfully'})
        return JsonResponse("no user")
    return JsonResponse("It should be post")

@csrf_exempt
def validate_otp(request):
    if request.method=='POST':
        data=json.loads(request.body)
        email=data.get('email')
        otp=data.get('otp')
        print(email,otp)
        valid= OtpLog.objects.filter(email=email,otp=otp,is_active=True).exists()
        print(valid)
        if valid:
            OtpLog.objects.filter(email=email, is_active=True).update(is_active=False)
            return JsonResponse({"success":True,"message":"Validated OTP"})
        else:
            return JsonResponse({"success":False,"message":"Already used"})

    else:
        return JsonResponse({"success":False, "message":"The request should be POST"})
    


#recipe code
@csrf_exempt
def add_recipe(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        title=data.get('title')
        description=data.get('description')
        image=data.get('image')
        time=data.get('time')
        ingredients=data.get('ingredients')
        directions=data.get('directions')
        user_id = data.get('user')
        try:
            user = CustomerUser.objects.get(id=user_id)
        except CustomerUser.DoesNotExist:
            return JsonResponse({"success": False, "message": "Invalid user ID"})
      
        try:
            image_binary = base64.b64decode(image)
            image_file = ContentFile(image_binary, name='temp_image.jpg')
        except Exception as e:
            return JsonResponse({"success": False, "message": f"Error decoding image data: {str(e)}"})
        
        print(title,description,time,ingredients,directions,user)
        try:
            recipe = Recipe.objects.create(
                title=title,
                description=description,
                image=image_file,
                time=time,
                ingredients=ingredients,
                directions=directions,
                user=user
            )
            return JsonResponse({"success": True, "message": "Recipe added successfully"})
        except Exception as e:
            return JsonResponse({"success": False, "message": f"Error creating recipe: {str(e)}"})

    else:
        return JsonResponse({"success":False,"message":"The request should be POST"})

# @csrf_exempt
# def add_recipe_with_image(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         serializer = RecipeSerializer(data=data)
#         if serializer.is_valid():
#             try:
#                 # Decode the Base64 image data into binary
#                 image_data = data.get('image')
#                 image_binary = base64.b64decode(image_data)
#                 image_file = ContentFile(image_binary, name='temp_image.jpg')
                
#                 # Save the recipe instance
#                 serializer.save(image=image_file)

#                 return JsonResponse({"success": True, "message": "Recipe added successfully"})
#             except Exception as e:
#                 return JsonResponse({"success": False, "message": f"Error adding recipe: {e}"})
#         else:
#             return JsonResponse({"success": False, "message": serializer.errors})
#     else:
#         return JsonResponse({"success": False, "message": "The request should be POST"})



@csrf_exempt
def get_recipe(request):
    if request.method == 'GET':
        recipes = Recipe.objects.all()
        serializer = RecipeSerializer(recipes, many=True)
        return JsonResponse({"success":True,"message":serializer.data})
    else:
        return JsonResponse({"success":False,"message":"The request should be GET"})



@csrf_exempt
def delete_recipe(request, id):
    if request.method == 'DELETE':
        recipe = Recipe.objects.get(id=id)
        recipe.delete()
        return JsonResponse({"success":True,"message":"Recipe deleted successfully"})
    else:
        return JsonResponse({"success":False,"message":"The request should be DELETE"})

@csrf_exempt
def get_recipe_by_id(request, id):
    if request.method == 'GET':
        recipe = Recipe.objects.get(id=id)
        serializer = RecipeSerializer(recipe)
        return JsonResponse({"success":True,"message":serializer.data})
    else:
        return JsonResponse({"success":False,"message":"The request should be GET"})

#post code
@csrf_exempt
def add_post(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        userId=data.get('user')
        caption=data.get('caption')
        image=data.get('image')
        print(userId,caption,image)
        try:
            user = CustomerUser.objects.get(id=userId)
        except CustomerUser.DoesNotExist:
            return JsonResponse({"success": False, "message": "Invalid user ID"})
        
        if(image is not None):
            image_binary = base64.b64decode(image)
            image_file = ContentFile(image_binary, name='temp_image.jpg')
        else:
            return JsonResponse({"success": False, "message": "Please upload Image as well"})
        
        try:
            post = Post.objects.create(
                user=user,
                caption=caption,
                image=image_file
            )
            return JsonResponse({"success":True,"message":"Post added successfully"})
        except Exception as e:
            return JsonResponse({"success":False,"message":f"Error creating post: {str(e)}"})

        return JsonResponse({"success":True,"message":"Post added successfully"})
    else:
        return JsonResponse({"success":False,"message":"The request should be POST"})

@csrf_exempt
def get_post_with_comments_and_likes(request):
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        data = serializer.data
        return JsonResponse({"success": True, "message": data})
    else:
        return JsonResponse({"success": False, "message": "The request should be GET"})

@csrf_exempt
def delete_post(request, id):
    if request.method == 'DELETE':
        post = Post.objects.get(id=id)
        post.delete()
        return JsonResponse({"success":True,"message":"Post deleted successfully"})
    else:
        return JsonResponse({"success":False,"message":"The request should be DELETE"})


#comment code
@csrf_exempt
def add_comment(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = CustomerUser.objects.get(id=data.get('user'))
        post = Post.objects.get(id=data.get('post'))
        comment = Comment.objects.create(
            text=data.get('text'),
            user=user,
            post=post
        )
        return JsonResponse({"success":True,"message":"Comment added successfully"})
    else:
        return JsonResponse({"success":False,"message":"The request should be POST"})

@csrf_exempt
def get_comment(request,id):
    if request.method == 'GET':
        comments = Comment.objects.filter(post=id).all()
        serializer = CommentSerializer(comments, many=True)
        return JsonResponse({"success":True,"message":serializer.data})
    else:
        return JsonResponse({"success":False,"message":"The request should be GET"})

@csrf_exempt
def delete_comment(request, id):
    if request.method == 'DELETE':
        comment = Comment.objects.get(id=id)
        comment.delete()
        return JsonResponse({"success":True,"message":"Comment deleted successfully"})
    else:
        return JsonResponse({"success":False,"message":"The request should be DELETE"})

#like code
@csrf_exempt
def add_like(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = CustomerUser.objects.get(id=data.get('user'))
        post = Post.objects.get(id=data.get('post'))
        like = Like.objects.create(
            user=user,
            post=post
        )
        return JsonResponse({"success":True,"message":"Like added successfully"})
    else:
        return JsonResponse({"success":False,"message":"The request should be POST"})

@csrf_exempt
def isliked(request):
    if request.method == 'GET':
        data=json.loads(request.body)
        user=data.get('user') 
        post=data.get('post')
        likes = Like.objects.filter(user=user, post=post).exists()
        return JsonResponse({"success":True,"message":likes})
    else:
        return JsonResponse({"success":False,"message":"The request should be GET"})

@csrf_exempt
def delete_like(request, id):
    if request.method == 'DELETE':
        like = Like.objects.get(id=id)
        like.delete()
        return JsonResponse({"success":True,"message":"Like deleted successfully"})
    else:
        return JsonResponse({"success":False,"message":"The request should be DELETE"})

#follow code
@csrf_exempt
def add_follow(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        follower = CustomerUser.objects.get(id=data.get('follower'))
        following = CustomerUser.objects.get(id=data.get('following'))
        follow = Follow.objects.create(
            follower=follower,
            following=following
        )
        return JsonResponse({"success":True,"message":"Follow added successfully"})
    else:
        return JsonResponse({"success":False,"message":"The request should be POST"})

@csrf_exempt
def get_follow(request):
    if request.method == 'GET':
        follows = Follow.objects.all()
        serializer = FollowSerializer(follows, many=True)
        return JsonResponse({"success":True,"message":serializer.data})
    else:
        return JsonResponse({"success":False,"message":"The request should be GET"})

@csrf_exempt
def delete_follow(request, id):
    if request.method == 'DELETE':
        follow = Follow.objects.get(id=id)
        follow.delete()
        return JsonResponse({"success":True,"message":"Follow deleted successfully"})
    else:
        return JsonResponse({"success":False,"message":"The request should be DELETE"})
    

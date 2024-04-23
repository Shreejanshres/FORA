from django.db import models

class CustomerUser(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password=models.CharField(max_length=100)
    address=models.CharField(max_length=100)
    phonenumber=models.CharField(max_length=100)
    profile_pic=models.ImageField(upload_to='customerprofilepic/', blank=True, null=True)
    
    def __str__(self):
        return self.name

class OtpLog(models.Model):
    email=models.CharField(max_length=100)
    otp=models.CharField(max_length=10)
    is_active=models.BooleanField(default=True)
    created_time=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.is_active)
    

class Recipe(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='recipeimage/', blank=True, null=True)
    time = models.CharField(max_length=100)
    ingredients = models.TextField()
    directions = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user=models.ForeignKey(CustomerUser,on_delete=models.CASCADE)
    def __str__(self):
        return self.title

class Post(models.Model):
    user = models.ForeignKey(CustomerUser, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    caption = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    user = models.ForeignKey(CustomerUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Like(models.Model):
    user = models.ForeignKey(CustomerUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

class Follow(models.Model):
    user = models.ForeignKey(CustomerUser, related_name='following', on_delete=models.CASCADE)
    following = models.ForeignKey(CustomerUser, related_name='user', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'following')



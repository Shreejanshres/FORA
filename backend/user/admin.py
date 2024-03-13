from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(CustomerUser)
admin.site.register(OtpLog)
admin.site.register(Recipe)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Follow)

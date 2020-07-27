from django.contrib import admin

# Register your models here.

from.models import User, Recipe, Cookbook, Follow, Like, Message

# Register your models here.
admin.site.register(User)
admin.site.register(Recipe)
admin.site.register(Cookbook)
admin.site.register(Follow)
admin.site.register(Like)
admin.site.register(Message)

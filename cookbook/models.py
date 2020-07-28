from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import json

# Create your models here.

class User(AbstractUser):
    recipes = models.ForeignKey('Recipe', on_delete=models.DO_NOTHING, null=True, related_name="creator")
    cookbooks = models.ForeignKey('Cookbook', on_delete=models.DO_NOTHING, null=True, related_name="Author")

class Recipe(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name="madeRecipe")
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=512)
    instructions = models.CharField(max_length=2560)
    ingredients = models.CharField(max_length=2560)
    number_of_likes = models.IntegerField(default=0)
    picture = models.ImageField(upload_to = 'media/static/', blank=True, null=True, default='no-image.png')
    date_created = models.DateTimeField(auto_now_add=True)

    def serialize(self, request):
        if(request.user.is_authenticated):
            user_liked = Like.objects.filter(recipe=self, user_origin=request.user)
            if (user_liked):
                liked = 'True';
            else:
                liked = 'False';
        else:
            liked = 'False'
        if(not self.picture):
            self.picture = '/media/static/no-image.png'


        return {
            "id": self.id,
            "user_id": self.user.id,
            "name": self.name,
            "username": self.user.username,
            "description": self.description,
            "instructions_list": self.instructions,
            "ingredients_list": self.ingredients,
            "number_of_likes": self.number_of_likes,
            "picture": self.picture.url,
            "date_created": self.date_created.strftime("%b %-d %Y, %-I:%M %p"),
            "liked": liked
        }

    def __uncode__ (self):
        return self.name

class Cookbook(models.Model):
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=256)
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name="madeCookbook")
    recipes = models.ManyToManyField('Recipe', verbose_name="Recipes included")
    picture = models.ImageField(upload_to = 'media/static/', blank=True, null=True, default='no-image.png')
    date_created = models.DateTimeField(auto_now_add=True)

    def serialize(self, request):
        if(not self.picture):
            self.picture = '/media/static/no-image.png'

        return {
            "id": self.id,
            "username": self.user.username,
            "user_id": self.user.id,
            "name": self.name,
            "description": self.description,
            "picture": self.picture.url,
            "date_created": self.date_created.strftime("%b %-d %Y, %-I:%M %p")
            }

class Follow(models.Model):
    user_origin = models.ForeignKey('User', on_delete=models.CASCADE, related_name="followinglist")
    user_end = models.ForeignKey('User', on_delete=models.CASCADE, related_name="followedlist")

class Like(models.Model):
    user_origin = models.ForeignKey('User', on_delete=models.CASCADE, related_name="liked")
    recipe = models.ForeignKey('Recipe', on_delete=models.CASCADE, related_name="likes")

class Message(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name="messaged")
    to = models.ForeignKey('User', on_delete=models.CASCADE, blank=True, null=True, related_name="messagedby")
    body = models.CharField(max_length=512)
    recipes = models.ForeignKey('Recipe', on_delete=models.CASCADE, null=True, related_name="havemessages")
    cookbook = models.ForeignKey('Cookbook', on_delete=models.CASCADE, null=True, related_name="messagescookbook")
    private = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)

    def serialize(self, request):
        if self.private:
            private = 'True'
        else:
            private = 'False'
        return {
            "id": self.id,
            "user_id": self.user.id,
            "username": self.user.username,
            "body": self.body,
            "date_created": self.date_created.strftime("%b %-d %Y, %-I:%M %p"),
            "private": private
        }

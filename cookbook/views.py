import json
import datetime
from django import forms
from django.forms import ModelForm
from django.forms import formset_factory
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from itertools import chain
from django.views.decorators.csrf import csrf_exempt

from .models import User, Recipe, Cookbook, Follow, Like, Message

# Create your views here.


class NewRecipeForm(forms.Form):
    recipe_name = forms.CharField(
        label='Name of recipe:',
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter recipe name here'
        })
    )
    recipe_ingredients = forms.CharField(
        label='Ingredients:',
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Seperate each ingredient with a comma'
        })
    )
    recipe_instructions = forms.CharField(
        label='Instructions:',
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Seperate each instruction with a comma'
        })
    )

    description = forms.CharField(
        label='Describe your recipe:',
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your description here'
        })
    )

    image = forms.ImageField(required=False)

class NewCookbookForm(forms.ModelForm):

    class Meta:
        model = Cookbook
        fields = ['recipes', 'name', 'description', 'picture']
        exclude = ["user"]

    recipes = forms.ModelMultipleChoiceField(queryset=None)

    name = forms.CharField(
        label='Name of Cookbook:',
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter cookbook name here'
        })
    )
    description = forms.CharField(
        label='Description:',
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter description here'
        })
    )

    picture = forms.ImageField(required=True)

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super(NewCookbookForm, self).__init__(*args, **kwargs)
        self.fields['recipes'].widget =  forms.widgets.CheckboxSelectMultiple()

        self.fields['recipes'].queryset = Recipe.objects.filter(user=self.user)
        self.fields['recipes'].label_from_instance = lambda obj: "%s" % obj.__uncode__()





def index(request):
    return render(request, "cookbook/index.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "cookbook/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "cookbook/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "cookbook/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "cookbook/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "cookbook/register.html")

def search(request):
    name = request.GET.get('search')
    recipes = list(Recipe.objects.all())

    try:
        recipes = list(Recipe.objects.all())
    except Recipe.DoesNotExist:
        message = "Could not find any recipe"

    finally:
        return render(request, "cookbook/search.html",{
            "recipes": recipes
        })

@login_required
def newrecipe(request):
    if request.method == "POST":
        form = NewRecipeForm(request.POST, request.FILES)
        if form.is_valid():
            user = request.user
            recipe_name = request.POST["recipe_name"]
            recipe_ingredients = request.POST["recipe_ingredients"]
            recipe_instructions = request.POST["recipe_instructions"]
            description = request.POST["description"]
            picture = form.cleaned_data['image']
            recipe_ingredients = recipe_ingredients.split(',')
            recipe_instructions = recipe_instructions.split(',')
            current_date = (datetime.datetime.now())

            new_recipe = Recipe(user=user, description=description, name=recipe_name, instructions=json.dumps(recipe_instructions), ingredients=json.dumps(recipe_ingredients), picture=picture)
            new_recipe.save()


            return HttpResponseRedirect(reverse("profile", args=(request.user.username,)))
    else:
        return render(request, "cookbook/newrecipe.html", {
            "form": NewRecipeForm()
        })

@login_required
def newcookbook(request):
    if request.method == "POST":
        form = NewCookbookForm(request.POST, request.FILES, user=request.user)
        if form.is_valid():
            user = request.user
            current_date = (datetime.datetime.now())
            picture = form.cleaned_data['picture']
            newcookbook = form.save(commit=False)
            newcookbook.picture = picture
            newcookbook.user = user
            newcookbook.save()
            form.save_m2m()

        return HttpResponseRedirect(reverse("profile", args=(request.user.username,)))
    else:
        return render(request, "cookbook/newcookbook.html", {
            "form": NewCookbookForm(user=request.user)
        })

def profile(request, username):
    user = User.objects.get(username=username)

    recipes = Recipe.objects.filter(user=user)
    cookbooks = Cookbook.objects.filter(user=user)
    following = Follow.objects.filter(user_origin=user).count()
    followers = Follow.objects.filter(user_end=user).count()
    messages_recieve = Message.objects.filter(to=user)
    messages_sent = Message.objects.filter(user=user,private=True)


    if request.user.username == username:
        own_profile = True
        is_following = True
    else:
        own_profile = False

    try:
        check = Follow.objects.get(user_origin=request.user, user_end=user)
        is_following = True
    except Follow.DoesNotExist:
        is_following = False

    return render(request, "cookbook/profile.html", {
        "user": user,
        "recipes" : recipes,
        "cookbooks" : cookbooks,
        "recipes": recipes,
        "following": following,
        "followers": followers,
        "messages_recieve": messages_recieve,
        "messages_sent": messages_sent,
        "own_profile": own_profile,
        "is_following": is_following
    })

def viewrecipes(request, page, profile):
    try:
        #loads all post in the ALl Post
        if profile == "none":
            posts = Recipe.objects.all()
            posts = posts.order_by("-date_created").all()

        #loads only post from users that the signed-in user is followin

        elif (request.user.is_authenticated and profile == "following") :
            posts=[]
            for follows in Follow.objects.filter(user_origin=request.user):
                posts=list(chain(posts,Recipe.objects.filter(user=follows.user_end).order_by("-date_created")))

        #loads the post for the profile page visited
        else:
            user = User.objects.get(username=profile)
            posts = Recipe.objects.filter(user=user)
            posts = posts.order_by("-date_created").all()

        #Paginate the posts
        paginator = Paginator(posts, 6)
        page_obj = paginator.get_page(page)

        post_data = {
            'page': page,  # Current page
            'totalpages': paginator.num_pages,  # Total pages.
            'page_objects': [post.serialize(request) for post in page_obj]
        }

        return JsonResponse(post_data, safe=False);

    except Recipe.DoesNotExist:
        return JsonResponse({"error": "Post does not exist."}, status=404)
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=404)

def cookbook(request, cookbook_id):

    cookbook = Cookbook.objects.get(pk=cookbook_id)
    recipes = cookbook.recipes.all()

    for recipe in recipes:
        print("one recipe")
        print(recipe.picture)
    print(cookbook.picture)

    try:
        comments = Message.objects.filter(cookbook=cookbook)
        comments_ser = []
        for comment in comments:
            comment_ser = comment.serialize(request)
            comments_ser.append(comment_ser)
    except Message.DoesNotExist:
        comments_ser = ['comments does not exist']

    return render(request, "cookbook/cookbook.html", {
        "cookbook": cookbook.serialize(request),
        "recipes": recipes,
        "comments": comments_ser
    })

def viewcookbooks(request, page, profile):
    try:
        if profile == "none":
            cookbooks = Cookbook.objects.all()
            cookbooks = cookbooks.order_by("-date_created").all()
        else:
        #loads the cookbook by their profile
            user = User.objects.get(username=profile)
            cookbooks = Cookbook.objects.filter(user=user)
            cookbooks = cookbooks.order_by("-date_created").all()

        print(cookbooks)
        #Paginate the posts
        paginator = Paginator(cookbooks, 6)
        page_obj = paginator.get_page(page)

        post_data = {
            'page': page,  # Current page
            'totalpages': paginator.num_pages,  # Total pages.
            'page_objects': [cookbook.serialize(request) for cookbook in page_obj]
        }

        return JsonResponse(post_data, safe=False);

    except Cookbook.DoesNotExist:
        return JsonResponse({"error": "Post does not exist."}, status=404)
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=404)

def getrecipe(request, recipe_id):
    recipe = Recipe.objects.get(pk=recipe_id)
    jsonDec = json.decoder.JSONDecoder()
    instructions_list = jsonDec.decode(recipe.instructions)
    ingredients_list = jsonDec.decode(recipe.ingredients)

    try:
        picture = recipe.picture.url
        comments = Message.objects.filter(recipes=recipe)
        comments_ser = []
        for comment in comments:
            comment_ser = comment.serialize(request)
            comments_ser.append(comment_ser)

    except Message.DoesNotExist:
        comments = ['message not exist']

    if (recipe.user.username == request.user.username):
        owner = 'yes'
    else:
        owner = 'no'

    return render(request, "cookbook/recipe.html", {
        "owner": owner,
        "picture": picture,
        "recipe": recipe.serialize(request),
        "instructions_list": instructions_list,
        "ingredients_list": ingredients_list,
        "comments": comments_ser
    })

def likepost(request):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)

    data = json.loads(request.body)

    id= data.get("id")
    recipe = Recipe.objects.get(pk=id)
    try:
        like = Like.objects.get(user_origin=request.user, recipe=recipe)
        like.delete()
        recipe.number_of_likes -= 1;
        recipe.save()
        return HttpResponse(status=204)
    except Like.DoesNotExist:
        new_like = Like(user_origin=request.user, recipe=recipe)
        new_like.save()
        recipe.number_of_likes += 1;
        recipe.save()
        return HttpResponse(status=204)

def update(request):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)

    data = json.loads(request.body)
    if data.get("new_instructions"):
        id= data.get("id")
        recipe = Recipe.objects.get(id=id)
        recipe_ingredients = data["new_ingredients"].split(',')
        recipe_instructions = data["new_instructions"].split(',')
        recipe.instructions = json.dumps(recipe_instructions)
        recipe.ingredients = json.dumps(recipe_ingredients)
        recipe.save()
        return HttpResponse(status=204)

def createcomment(request):
    data = json.loads(request.body)
    recipe_id = data.get("recipe_id", "")
    cookbook_id = data.get("cookbook_id", "")
    if not (recipe_id ==''):
        body = data.get("body", "")
        recipe = Recipe.objects.get(pk=recipe_id)

        new_comment = Message(user=request.user, body=body, recipes=recipe, private=False)
    else:
        body = data.get("body", "")
        cookbook = Cookbook.objects.get(pk=cookbook_id)

        new_comment = Message(user=request.user, body=body, cookbook=cookbook, private=False)
    new_comment.save()
    print(new_comment)
    return JsonResponse({"message": "Comment submitted successfully"}, status=201)

#Enable users to follow/unfollow another user
def follow(request, username):
    user_end = User.objects.get(username=username)
    try:
        follow_ref = Follow.objects.get(user_origin=request.user, user_end=user_end)
        follow_ref.delete()
        return HttpResponseRedirect(reverse("profile", args=(username,)))
    except Follow.DoesNotExist:
        new_following = Follow(user_origin=request.user, user_end=user_end)
        new_following.save()
        return HttpResponseRedirect(reverse("profile", args=(username,)))

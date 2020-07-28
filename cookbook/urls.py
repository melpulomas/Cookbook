from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    #HTML
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("search", views.search, name="search"),
    path("newrecipe", views.newrecipe, name="newrecipe"),
    path("newcookbook", views.newcookbook, name="newcookbook"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("cookbook/<int:cookbook_id>", views.cookbook, name="cookbook"),

    #API
    path("getrecipe/<int:recipe_id>", views.getrecipe, name="getrecipe"),
    path("viewrecipes/<int:page>/<str:profile>", views.viewrecipes, name="viewrecipes"),
    path("viewcookbooks/<int:page>/<str:profile>", views.viewcookbooks, name="viewcookbooks"),
    path("likepost", views.likepost, name="likepost"),
    path("updaterecipe", views.update, name="update"),
    path("createcomment", views.createcomment, name="createcomment"),
    path("followuser/<str:username>", views.follow, name="followuser")

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.urls import path
from . import  views


urlpatterns = [
    path("home/", views.home_page, name="home page"),
    path("upload-server/", views.upload_server, name="upload server"),
    path("server-output/", views.get_std_out, name="stdout")
]


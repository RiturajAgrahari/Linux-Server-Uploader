
from django.shortcuts import HttpResponse
from rest_framework.generics import GenericAPIView
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework.mixins import ListModelMixin
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes, api_view


# Create your views here.
def home_page(request):
    return HttpResponse("HOME PAGE")


@api_view(["POST"])
@permission_classes([IsAdminUser])
@authentication_classes([JWTAuthentication, SessionAuthentication])
def upload_server(request, *args, **kwargs):
    if str(request.user) == "Rituraj":
        server_file = request.data.get("serverFile")
        print(server_file)
        for filename, file in request.FILES.items():
            server = request.FILES[filename].file
            print(server)

        return Response({"message": "we got your file !"}, status=200)
    return Response({"message": "Who are you? !"}, status=401)

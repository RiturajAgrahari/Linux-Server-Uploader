from django.shortcuts import HttpResponse
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from django.core.files.storage import FileSystemStorage, default_storage

import os
import logging
import subprocess

from .serializers import ServerPIDSerializer
from .models import ServerPID
from .forms import ServerPIDForm

logger = logging.getLogger("django")
info_logger = logging.getLogger("log_info")
error_logger = logging.getLogger("log_error")


online_server_pid = 0


# Create your views here.
def home_page(request):
    return HttpResponse("HOME PAGE")


@api_view(["POST"])
@permission_classes([IsAdminUser])
@authentication_classes([JWTAuthentication, SessionAuthentication])
def upload_server(request, *args, **kwargs):
    if str(request.user) == "Rituraj" or str(request.user) == "abbie":
        server_file_name = str(request.data.get("serverFile"))
        server_file = ""
        for filename, file in request.FILES.items():
            server_file = request.FILES[filename].file
        try:
            if server_file_name.endswith(".rar") or server_file_name.endswith(".zip"):
                # removing the old server file
                subprocess.run(f'rm -r ./server/*', shell=True)

                # saving the new file
                fs = FileSystemStorage()
                fs.save(f"./server/{server_file_name}", server_file)

                if server_file_name.endswith(".rar"):
                    # extracting the .rar file
                    subprocess.run(f'unrar x ./server/{server_file_name} ./server/', shell=True)

                elif server_file_name.endswith(".zip"):
                    # unzip the .zip file
                    subprocess.run(f'unzip ./server/{server_file_name} -d ./server/', shell=True)

                else:
                    info_logger.info("some process error in ./server can't find .rar/.zip even after verifying??")
                    return Response({"message": "Internal Server Error!"}, status=500)

                # finding the dir that we get after extraction
                server_dirs = subprocess.run(f'ls ./server/', shell=True, capture_output=True, text=True)
                list_dirs = str(server_dirs.stdout).split("\n")
                for directory in list_dirs:
                    if "." not in directory and directory:
                        correct_format = directory.replace(" ", "\\ ")

                        # opening the extracted dir
                        extracted_dirs = subprocess.run(f'ls ./server/{correct_format}', shell=True, capture_output=True, text=True)
                        list_files = str(extracted_dirs.stdout).split("\n")
                        for files in list_files:
                            if files.endswith(".x86_64"):
                                subprocess.run(f'chmod +x ./server/{correct_format}/{files}', shell=True)
                                info_logger.info(correct_format)

                                subprocess.run("rm -r nohup.out", shell=True)
                                subprocess.run("rm -r logfile.log", shell=True)

                                if online_server_pid:
                                    subprocess.run(f"kill {online_server_pid}")

                                with open('nohup.out', 'w') as f:
                                    cmd = f'./server/{correct_format}/{files}'
                                    process = subprocess.Popen(cmd, shell=True, stdout=f, start_new_session=True)
                                    global online_server_pid
                                    online_server_pid = process.pid + 1
                                    info_logger.info(process.pid)

                                return Response({"message": "server is started!"}, status=200)

                        else:
                            info_logger.info("no file ends with .x86_64 in extracted directory")
                            return Response({"message": "Internal Server Error!"}, status=500)

                else:
                    info_logger.info("no extracted directory in ./server")
                    return Response({"message": "Internal Server Error!"}, status=500)

            info_logger.info("unable to find .zip / .rar in ./server")
            return Response({"message": "Internal Server Error!"}, status=500)

        except Exception as e:
            error_logger.error(e)
            return Response({"message": "Internal Server Error!"}, status=500)

    return Response({"message": "You are Unauthorized!"}, status=401)

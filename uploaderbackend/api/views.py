from django.shortcuts import HttpResponse
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from django.core.files.storage import FileSystemStorage, default_storage

import logging
import subprocess

from .models import ServerHistory

logger = logging.getLogger("django")
info_logger = logging.getLogger("log_info")
error_logger = logging.getLogger("log_error")


# Create your views here.
def home_page(request):
    return HttpResponse("HOME PAGE")


@api_view(["POST"])
@permission_classes([IsAdminUser])
@authentication_classes([JWTAuthentication, SessionAuthentication])
def upload_server(request, *args, **kwargs):
    if str(request.user) == "Rituraj" or str(request.user) == "abbie":
        online_server = ServerHistory.objects.filter(status="active").values()
        server_file_name = str(request.data.get("serverFile"))
        server_file = request.FILES[list(request.FILES.keys())[0]].file
        try:
            if server_file_name.endswith(".rar") or server_file_name.endswith(".zip"):
                # removing the old server file
                subprocess.run(f'rm -r ./server/*', shell=True)

                # saving the new file
                fs = FileSystemStorage()
                fs.save(f"./server/{server_file_name}", server_file)

                if server_file_name.endswith(".rar"):
                    # extracting the .rar file
                    subprocess.run(f"unrar x ./server/'{server_file_name}' ./server/", shell=True)

                elif server_file_name.endswith(".zip"):
                    # unzip the .zip file
                    subprocess.run(f"unzip ./server/'{server_file_name}' -d ./server/", shell=True)

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
                                subprocess.run("rm -r nohup.out", shell=True)

                                if online_server:
                                    online_server_pid = online_server[0].get("pid")
                                    info_logger.info(f"old process PID :{online_server_pid}")
                                    ServerHistory.objects.filter(pid=online_server_pid).update(status="stopped")
                                    try:
                                        subprocess.run(f"kill {online_server_pid}", shell=True)
                                        info_logger.info(f"old process PID :{online_server_pid} killed!")
                                    except Exception as e:
                                        error_logger.error(e)
                                        info_logger.info(f"Unable to stop PID (PID may not exist):{online_server_pid}!")
                                        pass

                                with open('nohup.out', 'w') as f:
                                    cmd = f'./server/{correct_format}/{files}'
                                    process = subprocess.Popen(cmd, shell=True, stdout=f, start_new_session=True)
                                    online_server_pid = process.pid + 1
                                    info_logger.info(f"server PID: {online_server_pid} is online now!")
                                    new_process = ServerHistory(pid=online_server_pid,
                                                                server_name=server_file_name,
                                                                status="active")
                                    new_process.save()

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


@api_view(["GET"])
@permission_classes([IsAdminUser])
@authentication_classes([JWTAuthentication])
def get_std_out(request, *args, **kwargs):
    if str(request.user) in ["Rituraj", "abbie"]:
        try:

            with open("nohup.out", "r") as nohup:
                nohup_output = nohup.read()
            data = {
                "output": nohup_output,
                "file_name": ""
            }
            server = ServerHistory.objects.filter(status="active").values()
            if server:
                data["file_name"] = server[0].get("server_name")
            return Response(data)
        except Exception as e:
            error_logger.error(e)
            return Response({"message": "Internal Server Error!"}, status=500)

    return Response({"message": "You are Unauthorized!"}, status=401)

from django.contrib import admin
from .models import ServerHistory

# Register your models here.


class ServerHistoryAdmin(admin.ModelAdmin):
    list_display = ("id", "pid", "server_name", "status", "upload_time", "stop_time")


admin.site.register(ServerHistory, ServerHistoryAdmin)
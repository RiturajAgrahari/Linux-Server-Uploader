from rest_framework import serializers
from .models import ServerPID


class ServerPIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServerPID
        fields = "__all__"
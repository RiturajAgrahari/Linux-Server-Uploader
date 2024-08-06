from rest_framework import serializers
from .models import ServerHistory


class ServerHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServerHistory
        fields = "__all__"
from django.forms import ModelForm
from .models import ServerHistory


class ServerPIDForm(ModelForm):
    class Meta:
        model = ServerHistory
        fields = "__all__"

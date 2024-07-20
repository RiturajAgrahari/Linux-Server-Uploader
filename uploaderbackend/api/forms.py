from django.forms import ModelForm
from .models import ServerPID


class ServerPIDForm(ModelForm):
    class Meta:
        model = ServerPID
        fields = "__all__"

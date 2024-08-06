from django.db import models

# Create your models here.


class ServerHistory(models.Model):
    id = models.BigIntegerField(verbose_name="id", primary_key=True)
    pid = models.IntegerField(verbose_name="PID", null=False)
    server_name = models.CharField(verbose_name="server name", null=False, max_length=50)
    extension = models.CharField(verbose_name="extension", null=False, max_length=10)
    status = models.CharField(verbose_name="status", null=False, max_length=10)
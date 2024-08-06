from django.db import models

# Create your models here.


class ServerHistory(models.Model):
    id = models.BigIntegerField(verbose_name="id", primary_key=True)
    pid = models.IntegerField(verbose_name="PID", null=False)
    server_name = models.CharField(verbose_name="server name", null=False, max_length=50)
    status = models.CharField(verbose_name="status", null=False, max_length=10)
    upload_time = models.DateTimeField(verbose_name="uploaded on", auto_now_add=True)
    stop_time = models.DateTimeField(verbose_name="stopped on", auto_now=True)

    class Meta:
        verbose_name_plural = "Server History"
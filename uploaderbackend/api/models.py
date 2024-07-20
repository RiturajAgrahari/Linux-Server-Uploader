from django.db import models

# Create your models here.


class ServerPID(models.Model):
    id = models.BigIntegerField(verbose_name="id", primary_key=True)
    pid = models.IntegerField(verbose_name="PID", null=False)
from django.contrib import admin
from .models import Patient, Procedure, Room

# Register your models here.
admin.site.register(Patient)
admin.site.register(Procedure)
admin.site.register(Room)
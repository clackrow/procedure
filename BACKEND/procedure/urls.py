from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render
from rest_framework.authtoken import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api-auth/', views.obtain_auth_token),
]

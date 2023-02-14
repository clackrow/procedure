from django.contrib import admin
from django.urls import path, include
import rest_framework
from .views import ProcedureList, RoomProcedureList, RoomList, procedure_post, get_csrf, finish_procedure

urlpatterns = [
    path('procedures/<str:day>/', ProcedureList.as_view()), 
    path('rooms/<str:day>/', RoomProcedureList.as_view()),
    path('room_list/', RoomList.as_view()),
    path('procedure_post/', procedure_post),
    path('get_csrf_token/', get_csrf),
    path('finish_procedure/<int:id>', finish_procedure)
]

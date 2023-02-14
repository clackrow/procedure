from django import middleware
from rest_framework.response import Response
from rest_framework import generics
from .models import Procedure, Room
from .serializers import ProcedureSerializer, RoomSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view
import datetime





@api_view(['GET'])
def get_csrf(request):
    csrf_token = middleware.csrf.get_token(request)
    return Response({'csrf_token':csrf_token})





class ProcedureList(generics.ListAPIView):
    serializer_class = ProcedureSerializer
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        day = self.kwargs['day']
        return Procedure.objects.filter(day=day)


class RoomList(generics.ListAPIView):
    serializer_class = RoomSerializer
    authentication_classes = [TokenAuthentication]
    queryset = Room.objects.all()

    



class RoomProcedureList(generics.ListAPIView):
    serializer_class = ProcedureSerializer
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        room = self.kwargs['room']
        day = self.kwargs['day']
        return Procedure.objects.filter(surgery_room=room)

    def get(self, request, *args, **kwargs):
        response = []
        for room in Room.objects.all():
            rooms_procedures = []
            procedures = Procedure.objects.filter(surgery_room=room, day=kwargs['day'])
            room_status = 'livre'
            for procedure in procedures:
                time_expired, percentage = self.calculate_percentage(procedure)
                if percentage < 100 and percentage >= 0: room_status = 'em_uso'
                if procedure.is_finished == False and percentage == 100: room_status = 'pendente'
                
                rooms_procedures.append({
                    'name': procedure.name,
                    'start': procedure.start_time,
                    'end': procedure.end_time,
                    'time_expired': time_expired,
                    'is_finished': procedure.is_finished,
                    'percentage': percentage
                    }
                )
            response.append({f'room': {
                'room_name': f'Sala {room.name}',
                'status': room_status,
                'procedures': rooms_procedures,
                
            }
            })
        response = {'data': response}

        return Response(response)


    def calculate_percentage(self, procedure):
        time_expired = 'false'
        start = datetime.datetime(year=procedure.day.year, month=procedure.day.month, day=procedure.day.day, hour=procedure.start_time.hour, minute=procedure.start_time.minute)
        finish = datetime.datetime(year=procedure.day.year, month=procedure.day.month, day=procedure.day.day, hour=procedure.end_time.hour, minute=procedure.end_time.minute)
        how_long_to_finish = finish - datetime.datetime.now()
        if '-1 day' in str(how_long_to_finish): time_expired = 'true'
        total_expected_time = finish - start
        now = datetime.datetime.now()
        completion = now - start
        percentage = int(100*completion/total_expected_time)
        if percentage >= 100: percentage=100
        

        return time_expired, percentage






@api_view(['POST'])
def procedure_post(request):
    p = request.POST.dict()
    room = Room.objects.filter(name=p['room_name']).get()
    procedure = Procedure(name=p['name'], day=p['date'], start_time=p['init_time'], end_time=p['end_time'], surgery_room=room)
    year, month, day = [int(item) for item in procedure.day.split('-')]
    start_hour, start_minute = [int(item) for item in procedure.start_time.split(':')]
    end_hour, end_minute = [int(item) for item in procedure.end_time.split(':')]
    init = datetime.datetime(year, month, day, start_hour, start_minute)
    end = datetime.datetime(year, month, day, end_hour, end_minute)

    if end <= init:
        return Response({'erro': 'o horário final deve ser maior que o inicial!'})
    events = Procedure.objects.filter(day=init, surgery_room=procedure.surgery_room)
    if events.exists():
        for event in events:
            event_start = datetime.datetime(year, month, day, event.start_time.hour, event.start_time.minute)
            event_end = datetime.datetime(year, month, day, event.end_time.hour, event.end_time.minute)
            if procedure.check_overlap(event_start, event_end, init, end):
                return Response({'erro': 'já existe um procedimento marcado nesta sala, neste horário'})
    
    for other in events:
        other.is_finished = True
        other.save()

    procedure.save()
    return Response({'success':'procedimento salvo com sucesso'})


@api_view(['GET'])
def finish_procedure(request, **kwargs):
    id = kwargs['id']
    object = Procedure.objects.get(id=id)
    if not object.is_finished:
        object.is_finished = True
        object.end_time = f'{datetime.datetime.now().hour}:{datetime.datetime.now().minute}'
        object.save()
    return Response({})
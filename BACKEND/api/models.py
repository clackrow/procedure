from django.db import models
import uuid
import datetime
from django.core.exceptions import ValidationError



def datetime_dict():
        return {f'{datetime.datetime.now().day}/{datetime.datetime.now().month}/{datetime.datetime.now().year}': []}




# Create your models here.
class Patient(models.Model):
    full_name = models.CharField(max_length=50, blank=False)
    birth = models.DateField(blank=False)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)

    def __str__(self):
        return self.full_name


class Room(models.Model):
    name = models.IntegerField()

    def __str__(self):
        return f'Sala {self.name}'




class Procedure(models.Model):
    day = models.DateField('Data da cirurgia', default=datetime.datetime.now)
    start_time = models.TimeField('Horário de início', default='07:00')
    end_time = models.TimeField('Horário de final (esperado)', default='07:00')
    name = models.CharField('Nome do procedimento', blank=False, default='', max_length=200)
    surgery_room = models.ForeignKey(Room, on_delete=models.CASCADE, default='')
    is_finished = models.BooleanField('Terminado', default=False)


    class Meta:
        ordering = ['surgery_room']
 
    def __str__(self) -> str:
        return self.name
 
    def check_overlap(self, fixed_start, fixed_end, new_start, new_end):
        overlap = False
        if new_start == fixed_end or new_end == fixed_start:    #edge case
            overlap = False
        elif (new_start >= fixed_start and new_start <= fixed_end) or (new_end >= fixed_start and new_end <= fixed_end): #innner limits
            overlap = True
        elif new_start <= fixed_start and new_end >= fixed_end: #outter limits
            overlap = True
 
        return overlap
 
 
    def clean(self):
        if self.end_time <= self.start_time:
            raise ValidationError('Ending times must after starting times')
 
        events = Procedure.objects.filter(day=self.day, surgery_room=self.surgery_room)
        if events.exists():
            for event in events:
                if self.check_overlap(event.start_time, event.end_time, self.start_time, self.end_time):
                    raise ValidationError(f'Já existe uma cirurgia marcada nesta sala: {str(event.name)} ({str(event.day)} {str(event.start_time)} {str(event.end_time)})')




    



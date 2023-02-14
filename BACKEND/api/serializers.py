from rest_framework import serializers
from .models import Patient, Procedure, Room
import datetime

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

    
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class ProcedureSerializer(serializers.ModelSerializer):
    completion_percentage = serializers.SerializerMethodField('calculate_percentage')
    surgery_room = RoomSerializer()

    def calculate_percentage(self, procedure):
        start = datetime.datetime(year=procedure.day.year, month=procedure.day.month, day=procedure.day.day, hour=procedure.start_time.hour, minute=procedure.start_time.minute)
        finish = datetime.datetime(year=procedure.day.year, month=procedure.day.month, day=procedure.day.day, hour=procedure.end_time.hour, minute=procedure.end_time.minute)

        total_expected_time = finish - start
        now = datetime.datetime.now()
        completion = now - start
        percentage = int(100*completion/total_expected_time)
        if percentage >= 100: percentage = 100
        return percentage
    
    def is_finished(self, procedure):
        return 'true'

    class Meta:
        model = Procedure
        fields = '__all__'





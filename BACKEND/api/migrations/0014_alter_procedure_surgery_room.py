# Generated by Django 4.1 on 2023-01-25 21:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_remove_procedure_surgery_room_procedure_surgery_room'),
    ]

    operations = [
        migrations.AlterField(
            model_name='procedure',
            name='surgery_room',
            field=models.OneToOneField(default='', on_delete=django.db.models.deletion.CASCADE, to='api.room'),
        ),
    ]
# Generated by Django 5.0 on 2024-03-16 08:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0007_customeruser_profile_pic'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customeruser',
            name='address',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='customeruser',
            name='password',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='customeruser',
            name='phonenumber',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='like',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.customeruser', unique=True),
        ),
        migrations.AlterField(
            model_name='otplog',
            name='email',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='otplog',
            name='otp',
            field=models.CharField(max_length=10),
        ),
    ]

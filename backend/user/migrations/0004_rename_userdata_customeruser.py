# Generated by Django 5.0 on 2024-03-03 12:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_otplog'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='UserData',
            new_name='CustomerUser',
        ),
    ]

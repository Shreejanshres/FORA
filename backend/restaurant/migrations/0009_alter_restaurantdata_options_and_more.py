# Generated by Django 5.0 on 2024-03-03 11:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('restaurant', '0008_alter_restaurantdata_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='restaurantdata',
            options={},
        ),
        migrations.AlterModelManagers(
            name='restaurantdata',
            managers=[
            ],
        ),
        migrations.RemoveField(
            model_name='restaurantdata',
            name='date_joined',
        ),
        migrations.RemoveField(
            model_name='restaurantdata',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='restaurantdata',
            name='groups',
        ),
        migrations.RemoveField(
            model_name='restaurantdata',
            name='is_active',
        ),
        migrations.RemoveField(
            model_name='restaurantdata',
            name='is_staff',
        ),
        migrations.RemoveField(
            model_name='restaurantdata',
            name='is_superuser',
        ),
        migrations.RemoveField(
            model_name='restaurantdata',
            name='last_login',
        ),
        migrations.RemoveField(
            model_name='restaurantdata',
            name='last_name',
        ),
        migrations.RemoveField(
            model_name='restaurantdata',
            name='user_permissions',
        ),
        migrations.RemoveField(
            model_name='restaurantdata',
            name='username',
        ),
    ]

# Generated by Django 5.0 on 2024-03-03 11:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurant', '0011_alter_restaurantdata_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurantdata',
            name='username',
            field=models.CharField(default=0, max_length=50),
            preserve_default=False,
        ),
    ]

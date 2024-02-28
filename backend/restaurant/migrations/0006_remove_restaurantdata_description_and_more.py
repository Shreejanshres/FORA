# Generated by Django 5.0 on 2024-02-28 15:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurant', '0005_alter_restaurantdata_open'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='restaurantdata',
            name='description',
        ),
        migrations.RemoveField(
            model_name='restaurantdata',
            name='open',
        ),
        migrations.RemoveField(
            model_name='tags',
            name='restaurant',
        ),
        migrations.CreateModel(
            name='Heading',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('heading_name', models.CharField(max_length=255)),
                ('restaurant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='restaurant.restaurantdata')),
            ],
        ),
        migrations.CreateModel(
            name='MenuItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_name', models.CharField(max_length=255)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('heading', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='restaurant.heading')),
                ('tags', models.ManyToManyField(to='restaurant.tags')),
            ],
        ),
        migrations.DeleteModel(
            name='Menu',
        ),
    ]

# Generated by Django 5.0 on 2024-04-30 15:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurant', '0026_remove_menuitem_tags_menuitem_tag_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='promotionimage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('images', models.ImageField(upload_to='promotionimages/')),
                ('restaurant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='restaurant.restaurantuser')),
            ],
        ),
    ]

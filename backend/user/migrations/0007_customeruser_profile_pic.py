# Generated by Django 5.0 on 2024-03-13 15:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_alter_post_image_alter_recipe_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='customeruser',
            name='profile_pic',
            field=models.ImageField(blank=True, null=True, upload_to='customerprofilepic/'),
        ),
    ]

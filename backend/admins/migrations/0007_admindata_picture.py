# Generated by Django 5.0 on 2024-03-03 03:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admins', '0006_alter_admindata_options_alter_admindata_managers_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='admindata',
            name='picture',
            field=models.ImageField(default=0, upload_to='admins/'),
            preserve_default=False,
        ),
    ]

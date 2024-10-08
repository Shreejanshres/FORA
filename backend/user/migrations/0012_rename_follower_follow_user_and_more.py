# Generated by Django 5.0 on 2024-04-21 08:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0011_follow_delete_userprofile'),
    ]

    operations = [
        migrations.RenameField(
            model_name='follow',
            old_name='follower',
            new_name='user',
        ),
        migrations.AlterUniqueTogether(
            name='follow',
            unique_together=set(),
        ),
        migrations.AlterField(
            model_name='follow',
            name='following',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user', to='user.customeruser'),
        ),
        migrations.AlterUniqueTogether(
            name='follow',
            unique_together={('user', 'following')},
        ),
    ]

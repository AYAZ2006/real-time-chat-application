from django.contrib.auth.models import AbstractUser, Group, Permission,User
from django.db import models
from django.conf import settings
class CustomUser(AbstractUser):
    friends=models.ManyToManyField("self",blank=True,symmetrical=True)
    groups=models.ManyToManyField(Group,related_name="customuser_set",blank=True)
    user_permissions = models.ManyToManyField(Permission,related_name="customuser_set",blank=True)

class FriendRequest(models.Model):
    sender=models.ForeignKey(User,on_delete=models.CASCADE,related_name="sent_requests")
    receiver=models.ForeignKey(User,on_delete=models.CASCADE,related_name="received_requests")
    accepted=models.BooleanField(default=False)
    timestamp=models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering=("timestamp",)

class Message(models.Model):
    sender_name = models.CharField(max_length=255, default="Unknown")  # Set default to "Unknown"
    receiver_name = models.CharField(max_length=255, default="Unknown")  # Set default to "Unknown"
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class UserProfile(models.Model):
    username = models.CharField(max_length=100, unique=True)
    github = models.URLField()
    linkedin = models.URLField()
    portfolio = models.URLField()

    def __str__(self):
        return self.username

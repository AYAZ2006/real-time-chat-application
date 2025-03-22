from django.contrib.auth import authenticate
from django.contrib.auth.models import User,AnonymousUser
from django.db.models import Q
import os
import json
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import FriendRequest,User
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.db import models
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"message": "CSRF cookie set"})

class RegisterView(generics.CreateAPIView):
    queryset=User.objects.all()
    serializer_class=UserSerializer

class LoginView(APIView):
    permission_classes=[permissions.AllowAny]

    def post(self,request):
        username=request.data.get("username")
        password=request.data.get("password")
        user=authenticate(username=username,password=password)
        if user:
            return Response({"message":"Login successful!"})
        return Response({"error":"Invalid Credentials"},status=status.HTTP_400_BAD_REQUEST)

class Send(APIView):
    permission_classes=[AllowAny]

    def post(self,request,username):
        sender_username=request.data.get("sender")
        if not sender_username:
            return Response({"error": "Sender username is required"}, status=400)
        sender=get_object_or_404(User,username=sender_username)
        receiver=get_object_or_404(User,username=username)
        if FriendRequest.objects.filter(sender=sender,receiver=receiver).exists():
            return Response({"error":"Friend request already sent"},status=400)
        FriendRequest.objects.create(sender=sender,receiver=receiver,accepted=False)
        return Response({"message":f"Friend request sent from {sender_username} to {username}!"},status=201)

class View(APIView):
    permission_classes=[AllowAny]

    def get(self,request,username):
        user=get_object_or_404(User,username=username)
        received_requests=FriendRequest.objects.filter(receiver=user,accepted=False)
        requests_data=[
            {"id":fr.id,"sender":fr.sender.username,"accepted":fr.accepted}
            for fr in received_requests
        ]
        return Response({"received_requests": requests_data})
    
class SearchUsersView(generics.ListAPIView):
    queryset=User.objects.all()
    permission_classes=[permissions.AllowAny]
    serializer_class=UserSerializer

    def get_queryset(self):
        query=self.request.GET.get("q","")
        return User.objects.filter(username__icontains=query)

class AcceptRejectFriendRequestView(APIView):
    permission_classes=[permissions.AllowAny]

    def post(self,request,username,action):
        sender=get_object_or_404(User,username=username)
        receiver_username=request.data.get("receiver_username")
        if not receiver_username:
            return Response({"error":"Receiver username is required"},status=status.HTTP_400_BAD_REQUEST)
        receiver=get_object_or_404(User,username=receiver_username)
        friend_request=get_object_or_404(FriendRequest,sender=sender,receiver=receiver)
        if action=="accept":
            friend_request.accepted=True
            friend_request.save()
            return Response({"message":f"Friend request from {sender.username} accepted!"},status=status.HTTP_200_OK)
        elif action=="reject":
            friend_request.delete()
            return Response({"message":f"Friend request from {sender.username} rejected!"},status=status.HTTP_200_OK)
        return Response({"error":"Invalid action"},status=status.HTTP_400_BAD_REQUEST)

class ListFriends(APIView):
    permission_classes=[permissions.AllowAny]
    def get(self,request,username):
        user=get_object_or_404(User,username=username)
        friends_requests=FriendRequest.objects.filter(accepted=True).filter(models.Q(sender=user) | models.Q(receiver=user))
        friends_list=[
            fr.receiver.username if fr.sender == user else fr.sender.username
            for fr in friends_requests
        ]
        return JsonResponse({'friends':friends_list})
        
class LoggedInUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email
        })
class Store(APIView):
    def post(self, request, *args, **kwargs):
        username=request.data.get('username')
        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)
        cache.set('username',username,timeout=3600)
        return Response({"message": "Username stored successfully"}, status=status.HTTP_201_CREATED)
class Bring(APIView):
    def get(self,request,*args,**kwargs):
        username=cache.get('username')
        if not username:
            return Response({"error": "Username not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"username": username}, status=status.HTTP_200_OK)

class ChatMessageView(APIView):
    MESSAGE_FILE_PATH = 'messages.json'

    def _load_messages(self):
        if os.path.exists(self.MESSAGE_FILE_PATH):
            with open(self.MESSAGE_FILE_PATH, 'r') as file:
                return json.load(file)
        return {}

    def _save_messages(self, messages):
        with open(self.MESSAGE_FILE_PATH, 'w') as file:
            json.dump(messages, file)

    def get(self, request, sendername, receivername):
        messages = self._load_messages()
        if sendername in messages:
            user_messages = [
                msg for msg in messages[sendername] if isinstance(msg, dict) and msg.get('receiver') == receivername
            ]
            if user_messages:
                return Response({"messages": user_messages}, status=status.HTTP_200_OK)
        return Response({"error": "No messages found for this user pair."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, sendername, receivername):
        try:
            message = request.data.get('message', '')
        except AttributeError:
            return Response({"error": "Invalid request format, data is not in the expected format."}, status=status.HTTP_400_BAD_REQUEST)
        if not message:
            return Response({"error": "Message content is required."}, status=status.HTTP_400_BAD_REQUEST)
        messages = self._load_messages()
        if sendername not in messages:
            messages[sendername] = []
        messages[sendername].append({"receiver": receivername, "message": message})
        self._save_messages(messages)
        return Response({"message": "Message posted successfully."}, status=status.HTTP_201_CREATED)

@method_decorator(csrf_exempt, name='dispatch')
class UpdateProfileView(APIView):
    PROFILE_FILE_PATH = 'profiles.json'
    def _load_profiles(self):
        if os.path.exists(self.PROFILE_FILE_PATH):
            with open(self.PROFILE_FILE_PATH, 'r') as file:
                return json.load(file)
        return {}

    def _save_profiles(self, profiles):
        with open(self.PROFILE_FILE_PATH, 'w') as file:
            json.dump(profiles, file, indent=4)

    def get(self, request, username):
        profiles = self._load_profiles()
        if username in profiles:
            return Response(profiles[username], status=status.HTTP_200_OK)
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, username):
        github = request.data.get("github", "")
        linkedin = request.data.get("linkedin", "")
        portfolio = request.data.get("portfolio", "")
        profiles = self._load_profiles()
        profiles[username] = {"github": github, "linkedin": linkedin, "portfolio": portfolio}
        self._save_profiles(profiles)
        return Response({"message": "Profile saved!", "username": username}, status=status.HTTP_201_CREATED)

class DeleteAccountView(APIView):
    def delete(self, request, username):
        try:
            user = User.objects.get(username=username)
            user.delete()
            return Response({"message": "Account deleted successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

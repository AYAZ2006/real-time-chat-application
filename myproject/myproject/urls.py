from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include
urlpatterns=[
    path('admin/',admin.site.urls),
    path('api/accounts/',include('accounts.urls')),
    path('accounts/',include('allauth.urls')),
    path('reset-password/',auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('reset-password-sent/',auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset-password-confirm/<uidb64>/<token>/',auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset-password-complete/',auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]

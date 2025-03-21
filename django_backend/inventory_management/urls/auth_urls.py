
from django.urls import path
from inventory_management.views import current_user

urlpatterns = [
    path('', current_user, name='current-user'),
]

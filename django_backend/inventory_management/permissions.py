
from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    """
    
    def has_permission(self, request, view):
        # Allow GET, HEAD or OPTIONS requests (read-only)
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write permissions are only allowed to admin users
        user = request.user
        return user.is_staff or user.is_superuser or user.groups.filter(name='Admin').exists()

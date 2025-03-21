
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User, Group
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import (
    Department, Location, Category, Item,
    Procurement, Inventory, StockRequest, Notification
)
from .serializers import (
    UserSerializer, DepartmentSerializer, LocationSerializer,
    CategorySerializer, ItemSerializer, ProcurementSerializer,
    InventorySerializer, StockRequestSerializer, NotificationSerializer
)
from .permissions import IsAdminOrReadOnly


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Get current user information
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminOrReadOnly]


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = Item.objects.all()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        
        if category:
            queryset = queryset.filter(category__id=category)
        
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(description__icontains=search))
            
        return queryset


class ProcurementViewSet(viewsets.ModelViewSet):
    queryset = Procurement.objects.all().order_by('-procurement_date')
    serializer_class = ProcurementSerializer
    permission_classes = [IsAdminUser]
    
    def perform_create(self, serializer):
        # Create or update inventory when a procurement is added
        procurement = serializer.save()
        item = procurement.item
        quantity = procurement.quantity
        
        # Check if inventory entry exists for this item
        inventory, created = Inventory.objects.get_or_create(
            item=item,
            defaults={'quantity': quantity, 'procurement': procurement}
        )
        
        # If inventory entry already exists, update the quantity
        if not created:
            inventory.quantity += quantity
            inventory.procurement = procurement
            inventory.save()


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class StockRequestViewSet(viewsets.ModelViewSet):
    queryset = StockRequest.objects.all().order_by('-created_at')
    serializer_class = StockRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # If admin, show all requests, otherwise only show the user's requests
        if user.is_staff or user.is_superuser or user.groups.filter(name='Admin').exists():
            return StockRequest.objects.all().order_by('-created_at')
        return StockRequest.objects.filter(user=user).order_by('-created_at')
    
    def perform_create(self, serializer):
        # Create a notification for admins when a stock request is created
        stock_request = serializer.save()
        
        # Get all admin users
        admin_users = User.objects.filter(
            Q(is_staff=True) | Q(is_superuser=True) | Q(groups__name='Admin')
        ).distinct()
        
        # Create notifications for all admins
        for admin in admin_users:
            Notification.objects.create(
                user=admin,
                message=f"New stock request from {stock_request.user.username} for {stock_request.quantity} {stock_request.item.name}",
                type="stockRequest",
                details={
                    "request_id": stock_request.id,
                    "user_id": stock_request.user.id,
                    "item_id": stock_request.item.id,
                    "quantity": stock_request.quantity
                }
            )
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        stock_request = self.get_object()
        status = request.data.get('status')
        
        if status not in ['pending', 'approved', 'rejected']:
            return Response(
                {"error": "Invalid status. Must be 'pending', 'approved', or 'rejected'"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        stock_request.status = status
        stock_request.save()
        
        # Notify the user about status change
        Notification.objects.create(
            user=stock_request.user,
            message=f"Your stock request for {stock_request.quantity} {stock_request.item.name} has been {status}",
            type="stockRequest",
            details={
                "request_id": stock_request.id,
                "status": status
            }
        )
        
        # If approved, update inventory
        if status == 'approved':
            try:
                inventory = Inventory.objects.get(item=stock_request.item)
                if inventory.quantity >= stock_request.quantity:
                    inventory.quantity -= stock_request.quantity
                    inventory.save()
                else:
                    return Response(
                        {"error": "Insufficient inventory"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Inventory.DoesNotExist:
                return Response(
                    {"error": "Item not in inventory"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = self.get_serializer(stock_request)
        return Response(serializer.data)


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only show notifications for the current user
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        notification = self.get_object()
        notification.read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, read=False).update(read=True)
        return Response({"status": "all notifications marked as read"})

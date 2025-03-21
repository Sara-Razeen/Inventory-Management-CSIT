
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from inventory_management.views import (
    DepartmentViewSet, LocationViewSet, CategoryViewSet,
    ItemViewSet, ProcurementViewSet, InventoryViewSet,
    StockRequestViewSet, NotificationViewSet
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'items', ItemViewSet)
router.register(r'procurements', ProcurementViewSet)
router.register(r'inventory', InventoryViewSet)
router.register(r'stock-requests', StockRequestViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]


from django.contrib import admin
from .models import (
    Department, Location, Category, Item,
    Procurement, Inventory, StockRequest, Notification
)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'description')
    list_filter = ('category',)
    search_fields = ('name', 'description')

@admin.register(Procurement)
class ProcurementAdmin(admin.ModelAdmin):
    list_display = ('item', 'procurement_type', 'supplier', 'quantity', 'procurement_date', 'unit_price', 'get_total_price', 'added_by')
    list_filter = ('procurement_type', 'procurement_date', 'supplier')
    search_fields = ('item__name', 'supplier')
    date_hierarchy = 'procurement_date'
    
    def get_total_price(self, obj):
        return obj.total_price
    get_total_price.short_description = 'Total Price'

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('item', 'quantity', 'last_updated')
    list_filter = ('last_updated',)
    search_fields = ('item__name',)

@admin.register(StockRequest)
class StockRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'quantity', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'item__name')
    date_hierarchy = 'created_at'

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'message', 'read', 'created_at')
    list_filter = ('type', 'read', 'created_at')
    search_fields = ('user__username', 'message')
    date_hierarchy = 'created_at'

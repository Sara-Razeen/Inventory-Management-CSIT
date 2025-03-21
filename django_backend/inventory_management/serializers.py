
from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import (
    Department, Location, Category, Item, 
    Procurement, Inventory, StockRequest, 
    Notification
)


class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_admin']
        
    def get_is_admin(self, obj):
        return obj.is_staff or obj.is_superuser or obj.groups.filter(name='Admin').exists()


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'category', 'category_name']


class ProcurementSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')
    total_price = serializers.ReadOnlyField()
    added_by_name = serializers.ReadOnlyField(source='added_by.username')
    
    class Meta:
        model = Procurement
        fields = [
            'id', 'item', 'item_name', 'procurement_type', 
            'supplier', 'quantity', 'procurement_date', 
            'unit_price', 'total_price', 'added_by', 
            'added_by_name', 'document_type', 'created_at'
        ]
        read_only_fields = ['added_by', 'added_by_name', 'created_at']
        
    def create(self, validated_data):
        # Set the current user as the added_by user
        validated_data['added_by'] = self.context['request'].user
        return super().create(validated_data)


class InventorySerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')
    procurement_id = serializers.ReadOnlyField(source='procurement.id')
    
    class Meta:
        model = Inventory
        fields = [
            'id', 'item', 'item_name', 'quantity', 
            'last_updated', 'procurement', 'procurement_id'
        ]


class StockRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    item_name = serializers.ReadOnlyField(source='item.name')
    
    class Meta:
        model = StockRequest
        fields = [
            'id', 'user', 'user_name', 'item', 'item_name',
            'quantity', 'reason', 'status', 'created_at', 
            'updated_at'
        ]
        read_only_fields = ['user', 'user_name', 'created_at', 'updated_at']
        
    def create(self, validated_data):
        # Set the current user as the requester
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'message', 'type', 
            'read', 'details', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']
        
    def create(self, validated_data):
        # Set the current user as the notification recipient
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

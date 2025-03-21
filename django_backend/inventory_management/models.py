
from django.db import models
from django.contrib.auth.models import User


class Department(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name


class Location(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name


class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='items')
    
    def __str__(self):
        return self.name


class Procurement(models.Model):
    PROCUREMENT_TYPES = (
        ('purchase', 'Purchase'),
        ('donation', 'Donation'),
        ('transfer', 'Transfer'),
    )
    
    DOCUMENT_TYPES = (
        ('Purchase Order', 'Purchase Order'),
        ('MOU', 'MOU'),
        ('Internal Memo', 'Internal Memo'),
    )
    
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='procurements')
    procurement_type = models.CharField(max_length=20, choices=PROCUREMENT_TYPES)
    supplier = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    procurement_date = models.DateField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def total_price(self):
        return self.quantity * self.unit_price
    
    def __str__(self):
        return f"{self.item.name} - {self.procurement_date}"


class Inventory(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='inventories')
    quantity = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    procurement = models.ForeignKey(Procurement, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        verbose_name_plural = "Inventories"
    
    def __str__(self):
        return f"{self.item.name} - {self.quantity}"


class StockRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stock_requests')
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.item.name} - {self.status}"


class Notification(models.Model):
    TYPE_CHOICES = (
        ('stockRequest', 'Stock Request'),
        ('system', 'System'),
        ('inventory', 'Inventory'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    read = models.BooleanField(default=False)
    details = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.type} - {self.created_at}"

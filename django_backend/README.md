
# Inventory Management System - Django Backend

This is the Django REST API backend for the Inventory Management System.

## Setup Instructions

### Prerequisites
- Python 3.8+
- PostgreSQL

### Installation

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Copy `.env.example` to `.env` and update settings:
   ```
   cp .env.example .env
   ```
6. Create PostgreSQL database:
   ```
   createdb inventory_db
   ```
7. Run migrations:
   ```
   python manage.py migrate
   ```
8. Create a superuser:
   ```
   python manage.py createsuperuser
   ```
9. Run the development server:
   ```
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- POST `/api/auth/login/` - Login (get JWT token)
- POST `/api/auth/refresh/` - Refresh JWT token
- GET `/api/auth/user/` - Get current user info

### Resources
- `/api/departments/` - Department management
- `/api/locations/` - Location management
- `/api/categories/` - Category management
- `/api/items/` - Item management
- `/api/procurements/` - Procurement management
- `/api/inventory/` - Inventory management
- `/api/stock-requests/` - Stock request management
- `/api/notifications/` - User notifications

## Role-Based Access
- **Admin Users:** Full access to all resources
- **Regular Users:** Read-only access to most resources with ability to create stock requests

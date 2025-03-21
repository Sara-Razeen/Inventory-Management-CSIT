
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserRole = 'admin' | 'user';

interface InventoryType {
  inventory_id: number;
  item_id: number;
  item_name: string;
  quantity: number;
  procurement_id: number;
}

interface NotificationType {
  id: number;
  message: string;
  type: 'stockRequest' | 'system' | 'inventory';
  createdAt: string;
  read: boolean;
  details?: any;
}

interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdmin: boolean;
  inventoryData: InventoryType[];
  setInventoryData: (data: InventoryType[]) => void;
  notifications: NotificationType[];
  addNotification: (notification: Omit<NotificationType, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  // Store user role in state without localStorage
  const [userRole, setUserRole] = useState<UserRole>('user');
  
  // Initialize inventory data as empty array
  const [inventoryData, setInventoryData] = useState<InventoryType[]>([]);
  
  // Initialize notifications as empty array
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const isAdmin = userRole === 'admin';

  // Add a new notification
  const addNotification = (notification: Omit<NotificationType, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: NotificationType = {
      ...notification,
      id: Date.now(), // This will be replaced with API-generated ID
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    // Here you would also send the notification to the backend API
    // Example: postNotification(newNotification);
  };

  // Mark a notification as read
  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    
    // Here you would also update the notification status in the backend API
    // Example: updateNotificationStatus(id, true);
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    // Here you would also update all notifications status in the backend API
    // Example: markAllNotificationsAsRead();
  };

  // Count of unread notifications
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Effects to fetch data from API can be added here
  // Example:
  // useEffect(() => {
  //   // When component mounts, fetch inventory data
  //   const fetchInventory = async () => {
  //     try {
  //       const response = await fetch('your-django-api/inventory');
  //       const data = await response.json();
  //       setInventoryData(data);
  //     } catch (error) {
  //       console.error("Failed to fetch inventory data:", error);
  //     }
  //   };
  //   
  //   fetchInventory();
  // }, []);

  return (
    <UserRoleContext.Provider value={{ 
      userRole, 
      setUserRole, 
      isAdmin, 
      inventoryData, 
      setInventoryData,
      notifications,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      unreadNotificationsCount
    }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};

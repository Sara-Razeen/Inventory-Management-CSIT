
import { useState } from "react";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Bell, Check, Search, Trash2 } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    unreadNotificationsCount,
    isAdmin
  } = useUserRole();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  // Filter notifications based on search and tab
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "unread" && !notification.read) ||
      (activeTab === "stock-requests" && notification.type === "stockRequest") ||
      (activeTab === "system" && notification.type === "system") ||
      (activeTab === "inventory" && notification.type === "inventory");
    
    return matchesSearch && matchesTab;
  });

  const handleNotificationClick = (id: number, type: string, details?: any) => {
    markNotificationAsRead(id);
    
    // Navigate based on notification type
    if (type === 'stockRequest' && details?.requestId) {
      navigate("/stock-requests");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'stockRequest':
        return <Bell className="h-4 w-4" />;
      case 'system':
        return <Bell className="h-4 w-4" />;
      case 'inventory':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'stockRequest':
        return "bg-blue-100 text-blue-600";
      case 'system':
        return "bg-purple-100 text-purple-600";
      case 'inventory':
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Notifications"
        subtitle="View and manage your notifications"
        icon={<Bell className="h-6 w-6" />}
        actionLabel={unreadNotificationsCount > 0 ? "Mark All as Read" : undefined}
        onAction={() => unreadNotificationsCount > 0 && markAllNotificationsAsRead()}
      />

      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Tabs 
              defaultValue="all" 
              className="w-full sm:w-auto"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread
                  {unreadNotificationsCount > 0 && (
                    <span className="ml-1.5 rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px] text-white">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="stock-requests">Stock Requests</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filteredNotifications.length > 0 ? (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                    !notification.read && "bg-muted/20"
                  )}
                  onClick={() => handleNotificationClick(notification.id, notification.type, notification.details)}
                >
                  <div className={cn(
                    "mt-0.5 rounded-full p-2",
                    getNotificationColor(notification.type)
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "text-sm",
                        !notification.read && "font-medium"
                      )}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(notification.createdAt), 'PPpp')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-medium">No notifications found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm 
                  ? "Try adjusting your search or filter criteria."
                  : "When you receive notifications, they will appear here."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Notifications;

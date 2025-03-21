
import { useState } from "react";
import { Bell, Search, User, LogOut, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/contexts/UserRoleContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, formatDistanceToNow } from "date-fns";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { 
    setUserRole, 
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    isAdmin
  } = useUserRole();

  const handleLogout = () => {
    // Clear user role and navigate to login page
    setUserRole("user");
    navigate("/");
  };

  const handleNotificationClick = (id: number, type: string, details?: any) => {
    markNotificationAsRead(id);
    
    // Navigate based on notification type
    if (type === 'stockRequest' && details?.requestId) {
      navigate("/stock-requests");
    }
  };

  const handleSeeAllNotifications = () => {
    // Navigate to notifications page (we'll create this later)
    navigate("/notifications");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          {/* NED Logo removed from here */}
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="relative w-full max-w-sm lg:max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search inventory, users..."
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Notification Bell with Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-medium text-white">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between border-b p-3">
                <h4 className="font-medium">Notifications</h4>
                {unreadNotificationsCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto px-2 py-1 text-xs"
                    onClick={() => markAllNotificationsAsRead()}
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Mark all as read
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[300px] p-0">
                {notifications.length > 0 ? (
                  <div className="flex flex-col">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        className={cn(
                          "flex items-start gap-3 border-b p-3 text-left hover:bg-muted/50 transition-colors",
                          !notification.read && "bg-muted/20"
                        )}
                        onClick={() => handleNotificationClick(notification.id, notification.type, notification.details)}
                      >
                        <div className={cn(
                          "mt-0.5 rounded-full p-1",
                          notification.type === 'stockRequest' ? "bg-blue-100 text-blue-600" : 
                          notification.type === 'system' ? "bg-purple-100 text-purple-600" : 
                          "bg-green-100 text-green-600"
                        )}>
                          {notification.type === 'stockRequest' ? (
                            <Bell className="h-3 w-3" />
                          ) : notification.type === 'system' ? (
                            <Bell className="h-3 w-3" />
                          ) : (
                            <Bell className="h-3 w-3" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className={cn(
                            "text-sm line-clamp-2",
                            !notification.read && "font-medium"
                          )}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                    <Bell className="h-8 w-8 text-muted-foreground/50" />
                    <h3 className="mt-4 text-sm font-medium">No notifications</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      When you have notifications, they will appear here.
                    </p>
                  </div>
                )}
              </ScrollArea>
              <div className="border-t p-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-center text-sm h-auto py-1.5"
                  onClick={handleSeeAllNotifications}
                >
                  See all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="p-0.5 bg-white">
                    <img 
                      src="/lovable-uploads/f4210512-c171-4ac1-aba7-91d1777e6989.png" 
                      alt="NED Logo" 
                      className="h-full w-full object-contain"
                    />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;

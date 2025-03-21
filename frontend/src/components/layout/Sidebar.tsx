
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  Building, 
  MapPin, 
  Package, 
  Tags, 
  ShoppingCart, 
  TrendingUp, 
  Trash2, 
  ClipboardList, 
  Menu, 
  X,
  Database,
  SendHorizontal,
  UserCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/contexts/UserRoleContext";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  userOnly?: boolean;
};

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: BarChart3, adminOnly: true },
  { title: "User Dashboard", href: "/user-dashboard", icon: UserCircle, userOnly: true },
  { title: "Users", href: "/users", icon: Users, adminOnly: true },
  { title: "Departments", href: "/departments", icon: Building, adminOnly: true },
  { title: "Locations", href: "/locations", icon: MapPin, adminOnly: true },
  { title: "Items", href: "/items", icon: Package, adminOnly: true },
  { title: "Inventory", href: "/inventory", icon: Database, adminOnly: false },
  { title: "Categories", href: "/categories", icon: Tags, adminOnly: true },
  { title: "Procurements", href: "/procurements", icon: ShoppingCart, adminOnly: true },
  { title: "Stock Movements", href: "/stock-movements", icon: TrendingUp, adminOnly: true },
  { title: "Stock Requests", href: "/stock-requests", icon: SendHorizontal, userOnly: true },
  { title: "Discarded Items", href: "/discarded-items", icon: Trash2, adminOnly: false },
  { title: "Audit Logs", href: "/audit-logs", icon: ClipboardList, adminOnly: true },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { isAdmin } = useUserRole();
  
  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    (isAdmin && !item.userOnly) || (!isAdmin && !item.adminOnly)
  );
  
  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-600 border-r border-gray-700 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-700">
        {!isCollapsed && (
          <div className="text-white font-bold text-xl">
            ManageVerse
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === item.href
                  ? "bg-gray-700 text-white"
                  : "text-gray-100 hover:bg-gray-700/50"
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5", isCollapsed ? "mr-0 mx-auto" : "")} />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="h-16 flex items-center px-4 border-t border-gray-700">
        {!isCollapsed && (
          <div className="text-gray-200 text-xs flex flex-col">
            <span>ManageVerse Inventory v1.0</span>
            <span className="mt-1">{isAdmin ? 'Admin' : 'User'} Access</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

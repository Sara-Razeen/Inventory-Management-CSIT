
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { UserRoleProvider, useUserRole } from "./contexts/UserRoleContext";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import Users from "./pages/Users";
import Departments from "./pages/Departments";
import Locations from "./pages/Locations";
import Items from "./pages/Items";
import Categories from "./pages/Categories";
import Procurements from "./pages/Procurements";
import StockMovements from "./pages/StockMovements";
import DiscardedItems from "./pages/DiscardedItems";
import AuditLogs from "./pages/AuditLogs";
import Inventory from "./pages/Inventory";
import StockRequests from "./pages/StockRequests";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
// import { authService } from "./services/api"; // Uncomment when API is ready

// Protected route component to handle role-based access
const ProtectedRoute = ({ 
  children, 
  adminOnly,
  userOnly
}: { 
  children: JSX.Element;
  adminOnly?: boolean;
  userOnly?: boolean;
}) => {
  const { isAdmin } = useUserRole();
  
  // If this is an admin-only route and user is not admin, redirect to user dashboard
  if (adminOnly && !isAdmin) {
    return <Navigate to="/user-dashboard" replace />;
  }
  
  // If this is a user-only route and user is admin, redirect to admin dashboard
  if (userOnly && isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { isAdmin } = useUserRole();
  
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute adminOnly>{<Dashboard />}</ProtectedRoute>
      } />
      <Route path="/user-dashboard" element={
        <ProtectedRoute userOnly>{<UserDashboard />}</ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute adminOnly>{<Users />}</ProtectedRoute>
      } />
      <Route path="/departments" element={
        <ProtectedRoute adminOnly>{<Departments />}</ProtectedRoute>
      } />
      <Route path="/locations" element={
        <ProtectedRoute adminOnly>{<Locations />}</ProtectedRoute>
      } />
      <Route path="/items" element={
        <ProtectedRoute adminOnly>{<Items />}</ProtectedRoute>
      } />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/categories" element={
        <ProtectedRoute adminOnly>{<Categories />}</ProtectedRoute>
      } />
      <Route path="/procurements" element={
        <ProtectedRoute adminOnly>{<Procurements />}</ProtectedRoute>
      } />
      <Route path="/stock-movements" element={
        <ProtectedRoute adminOnly>{<StockMovements />}</ProtectedRoute>
      } />
      <Route path="/stock-requests" element={
        <ProtectedRoute userOnly>{<StockRequests />}</ProtectedRoute>
      } />
      <Route path="/discarded-items" element={<DiscardedItems />} />
      <Route path="/audit-logs" element={
        <ProtectedRoute adminOnly>{<AuditLogs />}</ProtectedRoute>
      } />
      <Route path="/notifications" element={<Notifications />} />
      {/* Redirect to appropriate dashboard if path is / and already logged in */}
      <Route path="/" element={
        isAdmin ? <Navigate to="/dashboard" replace /> : <Navigate to="/user-dashboard" replace />
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <UserRoleProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </UserRoleProvider>
    </QueryClientProvider>
  );
};

export default App;


import { Package, TrendingUp, SendHorizontal, AlertCircle, UserCircle, Trash2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import PageLayout from "@/components/layout/PageLayout";
import StatsCard from "@/components/shared/StatsCard";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/custom-badge";
import { useNavigate } from "react-router-dom";

const inventoryStats = [
  { name: "Assigned Items", value: 42, trend: { value: 5, isUpward: true }, icon: <Package size={20} /> },
  { name: "My Stock Requests", value: 7, trend: { value: 2, isUpward: true }, icon: <SendHorizontal size={20} /> },
  { name: "Pending Approvals", value: 3, trend: { value: 0, isUpward: true }, icon: <AlertCircle size={20} /> },
];

const stockMovementData = [
  { name: "Jan", value: 15 },
  { name: "Feb", value: 19 },
  { name: "Mar", value: 22 },
  { name: "Apr", value: 18 },
  { name: "May", value: 26 },
  { name: "Jun", value: 25 },
  { name: "Jul", value: 20 },
  { name: "Aug", value: 28 },
];

const recentActivities = [
  { id: 1, action: "Requested Stock", details: "10 laptops for IT Department", status: "Pending", timestamp: "2 hours ago" },
  { id: 2, action: "Received Items", details: "5 office chairs from Warehouse", status: "Completed", timestamp: "Yesterday" },
  { id: 3, action: "Requested Transfer", details: "3 monitors to Marketing", status: "Approved", timestamp: "2 days ago" },
  { id: 4, action: "Viewed Inventory", details: "Checked stock of office supplies", status: "N/A", timestamp: "3 days ago" },
];

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <PageHeader 
        title="User Dashboard" 
        subtitle="View your inventory and requests"
        icon={<UserCircle className="h-6 w-6" />}
      />
      
      <div className="grid gap-6 md:grid-cols-3">
        {inventoryStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.name}
            value={stat.value}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>My Stock Movement</CardTitle>
            <CardDescription>
              Your stock activity over the last 8 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stockMovementData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0ea5e9" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Your latest actions and requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="mr-4 rounded-full p-2 bg-muted">
                    <TrendingUp size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{activity.action}</p>
                      {activity.status !== "N/A" && (
                        <Badge variant={
                          activity.status === "Completed" ? "success" : 
                          activity.status === "Approved" ? "success" : 
                          activity.status === "Pending" ? "warning" : "default"
                        }>
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.details}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default UserDashboard;

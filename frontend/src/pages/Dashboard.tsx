
import { Package, Users, TrendingUp, AlertTriangle, Building, MapPin, ShoppingCart } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import PageLayout from "@/components/layout/PageLayout";
import StatsCard from "@/components/shared/StatsCard";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data
const inventoryStats = [
  { name: "Total Items", value: 1247, trend: { value: 12, isUpward: true }, icon: <Package size={20} /> },
  { name: "Users", value: 64, trend: { value: 5, isUpward: true }, icon: <Users size={20} /> },
  { name: "Stock Movement", value: 128, trend: { value: 18, isUpward: true }, icon: <TrendingUp size={20} /> },
  { name: "Low Stock Items", value: 23, trend: { value: 4, isUpward: false }, icon: <AlertTriangle size={20} /> },
];

const inventoryByCategory = [
  { name: "Electronics", value: 350 },
  { name: "Furniture", value: 275 },
  { name: "Office Supplies", value: 420 },
  { name: "Kitchen", value: 150 },
  { name: "Miscellaneous", value: 52 },
];

const stockMovementData = [
  { name: "Jan", value: 65 },
  { name: "Feb", value: 59 },
  { name: "Mar", value: 80 },
  { name: "Apr", value: 81 },
  { name: "May", value: 56 },
  { name: "Jun", value: 55 },
  { name: "Jul", value: 40 },
  { name: "Aug", value: 70 },
  { name: "Sep", value: 90 },
  { name: "Oct", value: 110 },
  { name: "Nov", value: 80 },
  { name: "Dec", value: 95 },
];

const procurementData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 2000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
  { name: "Aug", value: 2950 },
  { name: "Sep", value: 3200 },
  { name: "Oct", value: 4200 },
  { name: "Nov", value: 3800 },
  { name: "Dec", value: 4100 },
];

const COLORS = ['#0891b2', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'];

const recentActivities = [
  { id: 1, action: "Stock Transfer", details: "50 laptops moved from Warehouse A to Showroom B", timestamp: "2 hours ago", icon: <TrendingUp size={16} /> },
  { id: 2, action: "New Procurement", details: "Received 100 office chairs from Supplier XYZ", timestamp: "4 hours ago", icon: <ShoppingCart size={16} /> },
  { id: 3, action: "New User", details: "Sara Johnson added to IT Department", timestamp: "Yesterday", icon: <Users size={16} /> },
  { id: 4, action: "Low Stock Alert", details: "Printer paper (ID: 1245) below threshold", timestamp: "Yesterday", icon: <AlertTriangle size={16} /> },
  { id: 5, action: "New Location", details: "Added 'Northeast Warehouse' to locations", timestamp: "2 days ago", icon: <MapPin size={16} /> },
];

const Dashboard = () => {
  return (
    <PageLayout>
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your inventory management system"
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-6 mt-6 md:grid-cols-6">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
            <CardDescription>
              Inventory activity over the last year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="movement">
              <TabsList className="mb-4">
                <TabsTrigger value="movement">Stock Movement</TabsTrigger>
                <TabsTrigger value="procurement">Procurement</TabsTrigger>
              </TabsList>
              <TabsContent value="movement" className="h-[300px]">
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
              </TabsContent>
              <TabsContent value="procurement" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={procurementData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>
              Distribution across categories
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {inventoryByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest updates in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="mr-4 rounded-full p-2 bg-muted">
                    {activity.icon}
                  </div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
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

export default Dashboard;

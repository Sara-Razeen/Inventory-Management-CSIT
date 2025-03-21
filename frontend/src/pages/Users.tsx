
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Pencil, Trash2, Plus, User } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface UserType {
  user_id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  department_id: number;
  department_name: string;
}

// Sample departments data
const departments = [
  { department_id: 1, department_name: "IT" },
  { department_id: 2, department_name: "HR" },
  { department_id: 3, department_name: "Finance" },
  { department_id: 4, department_name: "Operations" },
  { department_id: 5, department_name: "Sales" },
];

// Sample users data
const initialUsers: UserType[] = [
  { user_id: 1, name: "John Doe", email: "john@example.com", role: "Admin", created_at: "2023-01-15T08:30:00Z", department_id: 1, department_name: "IT" },
  { user_id: 2, name: "Jane Smith", email: "jane@example.com", role: "Manager", created_at: "2023-02-20T10:15:00Z", department_id: 2, department_name: "HR" },
  { user_id: 3, name: "Alice Johnson", email: "alice@example.com", role: "User", created_at: "2023-03-10T14:45:00Z", department_id: 3, department_name: "Finance" },
  { user_id: 4, name: "Bob Wilson", email: "bob@example.com", role: "User", created_at: "2023-04-05T09:20:00Z", department_id: 4, department_name: "Operations" },
  { user_id: 5, name: "Charlie Brown", email: "charlie@example.com", role: "Manager", created_at: "2023-05-12T11:30:00Z", department_id: 5, department_name: "Sales" },
  { user_id: 6, name: "Diana Prince", email: "diana@example.com", role: "Admin", created_at: "2023-06-18T13:10:00Z", department_id: 1, department_name: "IT" },
  { user_id: 7, name: "Ethan Hunt", email: "ethan@example.com", role: "User", created_at: "2023-07-22T15:40:00Z", department_id: 2, department_name: "HR" },
];

const roleColors: Record<string, string> = {
  Admin: "bg-blue-100 text-blue-800",
  Manager: "bg-green-100 text-green-800",
  User: "bg-orange-100 text-orange-800"
};

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<Partial<UserType>>({
    name: "",
    email: "",
    role: "",
    department_id: 0
  });

  const columns = [
    { header: "ID", accessor: "user_id" as keyof UserType },
    { header: "Name", accessor: "name" as keyof UserType },
    { header: "Email", accessor: "email" as keyof UserType },
    { 
      header: "Role", 
      accessor: "role" as keyof UserType,
      cell: (user: UserType) => (
        <Badge className={roleColors[user.role] || ""}>
          {user.role}
        </Badge>
      )
    },
    { header: "Department", accessor: "department_name" as keyof UserType },
    { 
      header: "Created At", 
      accessor: "created_at" as keyof UserType,
      cell: (user: UserType) => format(new Date(user.created_at), "MMM d, yyyy")
    },
  ];

  const handleAddUser = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      department_id: 0
    });
    setIsAddDialogOpen(true);
  };

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department_id: user.department_id
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: name === "department_id" ? Number(value) : value }));
  };

  const saveUser = () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.role || !formData.department_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "All fields are required!",
      });
      return;
    }

    if (isAddDialogOpen) {
      // Add new user
      const department = departments.find(d => d.department_id === formData.department_id);
      
      const newUser: UserType = {
        user_id: Math.max(...users.map(u => u.user_id), 0) + 1,
        name: formData.name || "",
        email: formData.email || "",
        role: formData.role || "",
        department_id: formData.department_id || 0,
        department_name: department?.department_name || "",
        created_at: new Date().toISOString()
      };
      
      setUsers([...users, newUser]);
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "User added successfully!",
      });
    } else if (isEditDialogOpen && selectedUser) {
      // Update existing user
      const department = departments.find(d => d.department_id === formData.department_id);
      
      const updatedUsers = users.map(user => 
        user.user_id === selectedUser.user_id 
          ? { 
              ...user, 
              name: formData.name || user.name,
              email: formData.email || user.email,
              role: formData.role || user.role,
              department_id: formData.department_id || user.department_id,
              department_name: department?.department_name || user.department_name
            } 
          : user
      );
      
      setUsers(updatedUsers);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Success",
        description: "User updated successfully!",
      });
    }
  };

  const confirmDelete = () => {
    if (selectedUser) {
      const updatedUsers = users.filter(user => user.user_id !== selectedUser.user_id);
      setUsers(updatedUsers);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Success",
        description: "User deleted successfully!",
      });
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="User Management" 
        subtitle="Manage system users and their department assignments"
        actionLabel="Add New User"
        onAction={handleAddUser}
      />

      <DataTable
        columns={columns}
        data={users}
        idField="user_id"
        searchField="name"
        actions={(user) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEditUser(user);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUser(user);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                value={formData.name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department_id ? formData.department_id.toString() : ""}
                onValueChange={(value) => handleSelectChange("department_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
                      {dept.department_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveUser}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="Enter full name"
                value={formData.name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department</Label>
              <Select
                value={formData.department_id ? formData.department_id.toString() : ""}
                onValueChange={(value) => handleSelectChange("department_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
                      {dept.department_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveUser}>
              <User className="mr-2 h-4 w-4" />
              Update User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </PageLayout>
  );
};

export default Users;

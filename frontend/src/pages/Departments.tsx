
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Building } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DepartmentType {
  department_id: number;
  department_name: string;
  email: string;
  user_count: number;
}

// Sample departments data
const initialDepartments: DepartmentType[] = [
  { department_id: 1, department_name: "IT", email: "it@example.com", user_count: 12 },
  { department_id: 2, department_name: "HR", email: "hr@example.com", user_count: 8 },
  { department_id: 3, department_name: "Finance", email: "finance@example.com", user_count: 15 },
  { department_id: 4, department_name: "Operations", email: "operations@example.com", user_count: 20 },
  { department_id: 5, department_name: "Sales", email: "sales@example.com", user_count: 17 },
  { department_id: 6, department_name: "Marketing", email: "marketing@example.com", user_count: 9 },
  { department_id: 7, department_name: "Legal", email: "legal@example.com", user_count: 4 },
];

const Departments = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<DepartmentType[]>(initialDepartments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType | null>(null);
  const [formData, setFormData] = useState<Partial<DepartmentType>>({
    department_name: "",
    email: ""
  });

  const columns = [
    { header: "ID", accessor: "department_id" as keyof DepartmentType },
    { header: "Department Name", accessor: "department_name" as keyof DepartmentType },
    { header: "Email", accessor: "email" as keyof DepartmentType },
    { header: "User Count", accessor: "user_count" as keyof DepartmentType },
  ];

  const handleAddDepartment = () => {
    setFormData({
      department_name: "",
      email: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEditDepartment = (department: DepartmentType) => {
    setSelectedDepartment(department);
    setFormData({
      department_name: department.department_name,
      email: department.email
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteDepartment = (department: DepartmentType) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveDepartment = () => {
    // Validate form
    if (!formData.department_name || !formData.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "All fields are required!",
      });
      return;
    }

    if (isAddDialogOpen) {
      // Add new department
      const newDepartment: DepartmentType = {
        department_id: Math.max(...departments.map(d => d.department_id), 0) + 1,
        department_name: formData.department_name || "",
        email: formData.email || "",
        user_count: 0 // New departments start with 0 users
      };
      
      setDepartments([...departments, newDepartment]);
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Department added successfully!",
      });
    } else if (isEditDialogOpen && selectedDepartment) {
      // Update existing department
      const updatedDepartments = departments.map(dept => 
        dept.department_id === selectedDepartment.department_id 
          ? { 
              ...dept, 
              department_name: formData.department_name || dept.department_name,
              email: formData.email || dept.email
            } 
          : dept
      );
      
      setDepartments(updatedDepartments);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Department updated successfully!",
      });
    }
  };

  const confirmDelete = () => {
    if (selectedDepartment) {
      // Check if department has users
      if (selectedDepartment.user_count > 0) {
        toast({
          variant: "destructive",
          title: "Cannot Delete",
          description: `This department has ${selectedDepartment.user_count} users assigned. Please reassign users first.`,
        });
        setIsDeleteDialogOpen(false);
        return;
      }
      
      const updatedDepartments = departments.filter(dept => dept.department_id !== selectedDepartment.department_id);
      setDepartments(updatedDepartments);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Department deleted successfully!",
      });
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Department Management" 
        subtitle="Manage system departments and contact information"
        actionLabel="Add New Department"
        onAction={handleAddDepartment}
      />

      <DataTable
        columns={columns}
        data={departments}
        idField="department_id"
        searchField="department_name"
        actions={(department) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEditDepartment(department);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`text-destructive hover:text-destructive ${department.user_count > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (department.user_count === 0) {
                  handleDeleteDepartment(department);
                } else {
                  toast({
                    variant: "destructive",
                    title: "Cannot Delete",
                    description: `This department has ${department.user_count} users assigned. Please reassign users first.`,
                  });
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Add a new department to the system. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="department_name">Department Name</Label>
              <Input
                id="department_name"
                name="department_name"
                placeholder="Enter department name"
                value={formData.department_name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter department email"
                value={formData.email || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveDepartment}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department information. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-department_name">Department Name</Label>
              <Input
                id="edit-department_name"
                name="department_name"
                placeholder="Enter department name"
                value={formData.department_name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                placeholder="Enter department email"
                value={formData.email || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveDepartment}>
              <Building className="mr-2 h-4 w-4" />
              Update Department
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Department"
        description={`Are you sure you want to delete ${selectedDepartment?.department_name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </PageLayout>
  );
};

export default Departments;


import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, MapPin, Building } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocationType {
  location_id: number;
  location_name: string;
  department_id: number;
  department_name: string;
  inventory_count: number;
}

interface DepartmentType {
  department_id: number;
  department_name: string;
}

// Sample departments data
const departments: DepartmentType[] = [
  { department_id: 1, department_name: "IT" },
  { department_id: 2, department_name: "HR" },
  { department_id: 3, department_name: "Finance" },
  { department_id: 4, department_name: "Operations" },
  { department_id: 5, department_name: "Sales" },
];

// Sample locations data
const initialLocations: LocationType[] = [
  { location_id: 1, location_name: "Main Warehouse", department_id: 4, department_name: "Operations", inventory_count: 523 },
  { location_id: 2, location_name: "IT Storage Room", department_id: 1, department_name: "IT", inventory_count: 157 },
  { location_id: 3, location_name: "Sales Showroom", department_id: 5, department_name: "Sales", inventory_count: 78 },
  { location_id: 4, location_name: "HR Office Supplies", department_id: 2, department_name: "HR", inventory_count: 32 },
  { location_id: 5, location_name: "Finance Archive", department_id: 3, department_name: "Finance", inventory_count: 41 },
  { location_id: 6, location_name: "Backup Storage", department_id: 1, department_name: "IT", inventory_count: 95 },
  { location_id: 7, location_name: "East Wing Warehouse", department_id: 4, department_name: "Operations", inventory_count: 312 },
];

const Locations = () => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<LocationType[]>(initialLocations);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  const [formData, setFormData] = useState<Partial<LocationType>>({
    location_name: "",
    department_id: undefined
  });

  const columns = [
    { header: "ID", accessor: "location_id" as keyof LocationType },
    { header: "Location Name", accessor: "location_name" as keyof LocationType },
    { header: "Department", accessor: "department_name" as keyof LocationType },
    { 
      header: "Inventory Count", 
      accessor: "inventory_count" as keyof LocationType,
      cell: (item: LocationType) => (
        <span className="font-mono">{item.inventory_count.toLocaleString()}</span>
      )
    },
  ];

  const handleAddLocation = () => {
    setFormData({
      location_name: "",
      department_id: undefined
    });
    setIsAddDialogOpen(true);
  };

  const handleEditLocation = (location: LocationType) => {
    setSelectedLocation(location);
    setFormData({
      location_name: location.location_name,
      department_id: location.department_id
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteLocation = (location: LocationType) => {
    setSelectedLocation(location);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department_id: Number(value) }));
  };

  const saveLocation = () => {
    // Validate form
    if (!formData.location_name || !formData.department_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "All fields are required!",
      });
      return;
    }

    // Find department name from selected department_id
    const departmentName = departments.find(d => d.department_id === formData.department_id)?.department_name || "";

    if (isAddDialogOpen) {
      // Add new location
      const newLocation: LocationType = {
        location_id: Math.max(...locations.map(l => l.location_id), 0) + 1,
        location_name: formData.location_name || "",
        department_id: formData.department_id || 0,
        department_name: departmentName,
        inventory_count: 0 // New locations start with 0 inventory
      };
      
      setLocations([...locations, newLocation]);
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Location added successfully!",
      });
    } else if (isEditDialogOpen && selectedLocation) {
      // Update existing location
      const updatedLocations = locations.map(loc => 
        loc.location_id === selectedLocation.location_id 
          ? { 
              ...loc, 
              location_name: formData.location_name || loc.location_name,
              department_id: formData.department_id || loc.department_id,
              department_name: departmentName || loc.department_name
            } 
          : loc
      );
      
      setLocations(updatedLocations);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Location updated successfully!",
      });
    }
  };

  const confirmDelete = () => {
    if (selectedLocation) {
      // Check if location has inventory
      if (selectedLocation.inventory_count > 0) {
        toast({
          variant: "destructive",
          title: "Cannot Delete",
          description: `This location has ${selectedLocation.inventory_count} items in inventory. Please move or remove all items first.`,
        });
        setIsDeleteDialogOpen(false);
        return;
      }
      
      const updatedLocations = locations.filter(loc => loc.location_id !== selectedLocation.location_id);
      setLocations(updatedLocations);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Location deleted successfully!",
      });
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Location Management" 
        subtitle="Manage inventory storage locations"
        actionLabel="Add New Location"
        onAction={handleAddLocation}
      />

      <DataTable
        columns={columns}
        data={locations}
        idField="location_id"
        searchField="location_name"
        actions={(location) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEditLocation(location);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`text-destructive hover:text-destructive ${location.inventory_count > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (location.inventory_count === 0) {
                  handleDeleteLocation(location);
                } else {
                  toast({
                    variant: "destructive",
                    title: "Cannot Delete",
                    description: `This location has ${location.inventory_count} items in inventory. Please move or remove all items first.`,
                  });
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      {/* Add Location Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>
              Add a new inventory storage location. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="location_name">Location Name</Label>
              <Input
                id="location_name"
                name="location_name"
                placeholder="Enter location name"
                value={formData.location_name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department_id">Department</Label>
              <Select 
                value={formData.department_id?.toString()} 
                onValueChange={handleDepartmentChange}
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
            <Button onClick={saveLocation}>
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>
              Update location information. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-location_name">Location Name</Label>
              <Input
                id="edit-location_name"
                name="location_name"
                placeholder="Enter location name"
                value={formData.location_name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department_id">Department</Label>
              <Select 
                value={formData.department_id?.toString()} 
                onValueChange={handleDepartmentChange}
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
            <Button onClick={saveLocation}>
              <MapPin className="mr-2 h-4 w-4" />
              Update Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Location"
        description={`Are you sure you want to delete ${selectedLocation?.location_name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </PageLayout>
  );
};

export default Locations;

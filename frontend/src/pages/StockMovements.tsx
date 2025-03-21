
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, Plus, TrendingUp, Package, ArrowRight } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface MovementType {
  movement_id: number;
  item_id: number;
  item_name: string;
  from_location_id: number;
  from_location_name: string;
  to_location_id: number;
  to_location_name: string;
  quantity: number;
  movement_date: string;
  received_by: string;
  notes?: string;
}

interface ItemType {
  item_id: number;
  item_name: string;
}

interface LocationType {
  location_id: number;
  location_name: string;
}

interface UserType {
  user_id: number;
  name: string;
}

// Sample items data
const items: ItemType[] = [
  { item_id: 1, item_name: "Laptop" },
  { item_id: 2, item_name: "Office Chair" },
  { item_id: 3, item_name: "Notebook" },
  { item_id: 4, item_name: "Monitor" },
  { item_id: 5, item_name: "Desk" },
  { item_id: 6, item_name: "Keyboard" },
  { item_id: 7, item_name: "Mouse" },
  { item_id: 8, item_name: "Printer" },
  { item_id: 9, item_name: "Coffee Maker" },
];

// Sample locations data
const locations: LocationType[] = [
  { location_id: 1, location_name: "Main Warehouse" },
  { location_id: 2, location_name: "IT Storage Room" },
  { location_id: 3, location_name: "Sales Showroom" },
  { location_id: 4, location_name: "HR Office Supplies" },
  { location_id: 5, location_name: "Finance Archive" },
  { location_id: 6, location_name: "Backup Storage" },
  { location_id: 7, location_name: "East Wing Warehouse" },
];

// Sample users data
const users: UserType[] = [
  { user_id: 1, name: "John Smith" },
  { user_id: 2, name: "Sarah Johnson" },
  { user_id: 3, name: "Michael Brown" },
  { user_id: 4, name: "Emily Davis" },
  { user_id: 5, name: "Robert Wilson" },
];

// Sample stock movements data
const initialMovements: MovementType[] = [
  { movement_id: 1, item_id: 1, item_name: "Laptop", from_location_id: 1, from_location_name: "Main Warehouse", to_location_id: 2, to_location_name: "IT Storage Room", quantity: 5, movement_date: "2023-07-15", received_by: "Emily Davis", notes: "Laptops for new IT staff" },
  { movement_id: 2, item_id: 2, item_name: "Office Chair", from_location_id: 1, from_location_name: "Main Warehouse", to_location_id: 4, to_location_name: "HR Office Supplies", quantity: 10, movement_date: "2023-07-18", received_by: "Sarah Johnson", notes: "New office chairs for HR department" },
  { movement_id: 3, item_id: 4, item_name: "Monitor", from_location_id: 1, from_location_name: "Main Warehouse", to_location_id: 2, to_location_name: "IT Storage Room", quantity: 8, movement_date: "2023-07-20", received_by: "Emily Davis", notes: "Monitors for IT department upgrades" },
  { movement_id: 4, item_id: 7, item_name: "Mouse", from_location_id: 2, from_location_name: "IT Storage Room", to_location_id: 3, to_location_name: "Sales Showroom", quantity: 12, movement_date: "2023-07-25", received_by: "Michael Brown", notes: "Mice for sales team workstations" },
  { movement_id: 5, item_id: 3, item_name: "Notebook", from_location_id: 1, from_location_name: "Main Warehouse", to_location_id: 4, to_location_name: "HR Office Supplies", quantity: 50, movement_date: "2023-07-30", received_by: "Sarah Johnson", notes: "Notebooks for new employee orientation" },
  { movement_id: 6, item_id: 6, item_name: "Keyboard", from_location_id: 2, from_location_name: "IT Storage Room", to_location_id: 3, to_location_name: "Sales Showroom", quantity: 12, movement_date: "2023-08-02", received_by: "Michael Brown", notes: "Keyboards for sales team workstations" },
  { movement_id: 7, item_id: 9, item_name: "Coffee Maker", from_location_id: 1, from_location_name: "Main Warehouse", to_location_id: 5, to_location_name: "Finance Archive", quantity: 1, movement_date: "2023-08-05", received_by: "Robert Wilson", notes: "Coffee maker for finance department break room" },
];

const StockMovements = () => {
  const { toast } = useToast();
  const [movements, setMovements] = useState<MovementType[]>(initialMovements);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<MovementType | null>(null);
  const [formData, setFormData] = useState<Partial<MovementType>>({
    item_id: undefined,
    from_location_id: undefined,
    to_location_id: undefined,
    quantity: undefined,
    movement_date: new Date().toISOString().split('T')[0],
    received_by: "",
    notes: ""
  });

  const columns = [
    { header: "ID", accessor: "movement_id" as keyof MovementType },
    { header: "Item", accessor: "item_name" as keyof MovementType },
    { 
      header: "From", 
      accessor: "from_location_name" as keyof MovementType 
    },
    { 
      header: "To", 
      accessor: "to_location_name" as keyof MovementType 
    },
    { 
      header: "Quantity", 
      accessor: "quantity" as keyof MovementType,
      cell: (item: MovementType) => (
        <span className="font-mono">{item.quantity.toLocaleString()}</span>
      )
    },
    { 
      header: "Date", 
      accessor: "movement_date" as keyof MovementType,
      cell: (item: MovementType) => format(new Date(item.movement_date), "MMM d, yyyy")
    },
    { header: "Received By", accessor: "received_by" as keyof MovementType },
  ];

  const handleAddMovement = () => {
    setFormData({
      item_id: undefined,
      from_location_id: undefined,
      to_location_id: undefined,
      quantity: undefined,
      movement_date: new Date().toISOString().split('T')[0],
      received_by: "",
      notes: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleViewMovement = (movement: MovementType) => {
    setSelectedMovement(movement);
    setIsViewDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "quantity") {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value ? Number(value) : undefined 
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (value: string) => {
    setFormData((prev) => ({ ...prev, item_id: Number(value) }));
  };

  const handleFromLocationChange = (value: string) => {
    setFormData((prev) => ({ ...prev, from_location_id: Number(value) }));
  };

  const handleToLocationChange = (value: string) => {
    setFormData((prev) => ({ ...prev, to_location_id: Number(value) }));
  };

  const handleReceiverChange = (value: string) => {
    setFormData((prev) => ({ ...prev, received_by: value }));
  };

  const saveMovement = () => {
    // Validate form
    if (!formData.item_id || !formData.from_location_id || !formData.to_location_id || 
        !formData.quantity || !formData.movement_date || formData.received_by === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "All fields are required except Notes!",
      });
      return;
    }
    
    // Check if from and to locations are the same
    if (formData.from_location_id === formData.to_location_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Source and destination locations cannot be the same!",
      });
      return;
    }
    
    // Find item name from selected item_id
    const itemName = items.find(i => i.item_id === formData.item_id)?.item_name || "";
    
    // Find location names
    const fromLocationName = locations.find(l => l.location_id === formData.from_location_id)?.location_name || "";
    const toLocationName = locations.find(l => l.location_id === formData.to_location_id)?.location_name || "";

    // Add new movement
    const newMovement: MovementType = {
      movement_id: Math.max(...movements.map(m => m.movement_id), 0) + 1,
      item_id: formData.item_id || 0,
      item_name: itemName,
      from_location_id: formData.from_location_id || 0,
      from_location_name: fromLocationName,
      to_location_id: formData.to_location_id || 0,
      to_location_name: toLocationName,
      quantity: formData.quantity || 0,
      movement_date: formData.movement_date || new Date().toISOString().split('T')[0],
      received_by: formData.received_by || "",
      notes: formData.notes
    };
    
    setMovements([...movements, newMovement]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Stock movement recorded successfully!",
    });
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Stock Movement" 
        subtitle="Track and manage inventory movements between locations"
        actionLabel="Record New Movement"
        onAction={handleAddMovement}
      />

      <DataTable
        columns={columns}
        data={movements}
        idField="movement_id"
        searchField="item_name"
        onRowClick={handleViewMovement}
        actions={(movement) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleViewMovement(movement);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      {/* Add Movement Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Stock Movement</DialogTitle>
            <DialogDescription>
              Record the movement of items between locations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="item_id">Item</Label>
              <Select 
                value={formData.item_id?.toString()} 
                onValueChange={handleItemChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.item_id} value={item.item_id.toString()}>
                      {item.item_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="from_location_id">From Location</Label>
              <Select 
                value={formData.from_location_id?.toString()} 
                onValueChange={handleFromLocationChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.location_id} value={location.location_id.toString()}>
                      {location.location_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to_location_id">To Location</Label>
              <Select 
                value={formData.to_location_id?.toString()} 
                onValueChange={handleToLocationChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.location_id} value={location.location_id.toString()}>
                      {location.location_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={formData.quantity?.toString() || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="movement_date">Movement Date</Label>
              <Input
                id="movement_date"
                name="movement_date"
                type="date"
                value={formData.movement_date || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="received_by">Received By</Label>
              <Select 
                value={formData.received_by} 
                onValueChange={handleReceiverChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select receiver" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.user_id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                name="notes"
                placeholder="Enter any additional notes"
                value={formData.notes || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveMovement}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Record Movement
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Movement Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Movement Details</DialogTitle>
            <DialogDescription>
              View stock movement information
            </DialogDescription>
          </DialogHeader>
          {selectedMovement && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center gap-2 text-center mb-4">
                <div className="text-muted-foreground">{selectedMovement.from_location_name}</div>
                <ArrowRight className="h-5 w-5 text-primary mx-2" />
                <div className="text-muted-foreground">{selectedMovement.to_location_name}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Movement ID</h4>
                  <p>{selectedMovement.movement_id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Item</h4>
                  <p>{selectedMovement.item_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Quantity</h4>
                  <p>{selectedMovement.quantity.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p>{format(new Date(selectedMovement.movement_date), "MMM d, yyyy")}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Received By</h4>
                  <p>{selectedMovement.received_by}</p>
                </div>
                {selectedMovement.notes && (
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                    <p>{selectedMovement.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default StockMovements;

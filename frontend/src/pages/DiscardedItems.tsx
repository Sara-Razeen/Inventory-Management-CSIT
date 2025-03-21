
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, Plus, Trash2, Package } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface DiscardedItemType {
  discard_id: number;
  item_id: number;
  item_name: string;
  quantity: number;
  procurement_id?: number;
  discard_date: string;
  discard_reason: "damaged" | "expired" | "obsolete" | "other";
  notes?: string;
  discarded_by: string;
}

interface ItemType {
  item_id: number;
  item_name: string;
}

interface ProcurementType {
  procurement_id: number;
  item_id: number;
  date: string;
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

// Sample procurements data (simplified)
const procurements: ProcurementType[] = [
  { procurement_id: 1, item_id: 1, date: "2023-05-15" },
  { procurement_id: 2, item_id: 2, date: "2023-06-02" },
  { procurement_id: 3, item_id: 3, date: "2023-06-10" },
  { procurement_id: 4, item_id: 4, date: "2023-06-15" },
  { procurement_id: 5, item_id: 7, date: "2023-07-01" },
];

// Sample users data
const users: UserType[] = [
  { user_id: 1, name: "John Smith" },
  { user_id: 2, name: "Sarah Johnson" },
  { user_id: 3, name: "Michael Brown" },
  { user_id: 4, name: "Emily Davis" },
  { user_id: 5, name: "Robert Wilson" },
];

// Sample discarded items data
const initialDiscardedItems: DiscardedItemType[] = [
  { discard_id: 1, item_id: 1, item_name: "Laptop", quantity: 2, procurement_id: 1, discard_date: "2023-08-10", discard_reason: "damaged", notes: "Water damage from roof leak", discarded_by: "John Smith" },
  { discard_id: 2, item_id: 7, item_name: "Mouse", quantity: 5, procurement_id: 5, discard_date: "2023-08-15", discard_reason: "obsolete", notes: "Older models replaced with wireless versions", discarded_by: "Emily Davis" },
  { discard_id: 3, item_id: 3, item_name: "Notebook", quantity: 20, procurement_id: 3, discard_date: "2023-08-20", discard_reason: "expired", notes: "Old company branding", discarded_by: "Sarah Johnson" },
  { discard_id: 4, item_id: 4, item_name: "Monitor", quantity: 3, procurement_id: 4, discard_date: "2023-08-25", discard_reason: "damaged", notes: "Screen damage during office relocation", discarded_by: "Michael Brown" },
  { discard_id: 5, item_id: 6, item_name: "Keyboard", quantity: 8, discard_date: "2023-09-01", discard_reason: "other", notes: "Missing keys and worn out", discarded_by: "Robert Wilson" },
];

const DiscardedItems = () => {
  const { toast } = useToast();
  const [discardedItems, setDiscardedItems] = useState<DiscardedItemType[]>(initialDiscardedItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDiscard, setSelectedDiscard] = useState<DiscardedItemType | null>(null);
  const [formData, setFormData] = useState<Partial<DiscardedItemType>>({
    item_id: undefined,
    quantity: undefined,
    procurement_id: undefined,
    discard_date: new Date().toISOString().split('T')[0],
    discard_reason: undefined,
    notes: "",
    discarded_by: ""
  });
  const [availableProcurements, setAvailableProcurements] = useState<ProcurementType[]>([]);

  const columns = [
    { header: "ID", accessor: "discard_id" as keyof DiscardedItemType },
    { header: "Item", accessor: "item_name" as keyof DiscardedItemType },
    { 
      header: "Quantity", 
      accessor: "quantity" as keyof DiscardedItemType,
      cell: (item: DiscardedItemType) => (
        <span className="font-mono">{item.quantity.toLocaleString()}</span>
      )
    },
    { 
      header: "Date", 
      accessor: "discard_date" as keyof DiscardedItemType,
      cell: (item: DiscardedItemType) => format(new Date(item.discard_date), "MMM d, yyyy")
    },
    { 
      header: "Reason", 
      accessor: "discard_reason" as keyof DiscardedItemType,
      cell: (item: DiscardedItemType) => {
        const reasonColors = {
          damaged: "bg-red-100 text-red-800",
          expired: "bg-amber-100 text-amber-800",
          obsolete: "bg-purple-100 text-purple-800",
          other: "bg-gray-100 text-gray-800"
        };
        
        return (
          <Badge className={reasonColors[item.discard_reason]}>
            {item.discard_reason.charAt(0).toUpperCase() + item.discard_reason.slice(1)}
          </Badge>
        );
      }
    },
    { header: "Discarded By", accessor: "discarded_by" as keyof DiscardedItemType },
  ];

  const handleAddDiscard = () => {
    setFormData({
      item_id: undefined,
      quantity: undefined,
      procurement_id: undefined,
      discard_date: new Date().toISOString().split('T')[0],
      discard_reason: undefined,
      notes: "",
      discarded_by: ""
    });
    setAvailableProcurements([]);
    setIsAddDialogOpen(true);
  };

  const handleViewDiscard = (discard: DiscardedItemType) => {
    setSelectedDiscard(discard);
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
    const itemId = Number(value);
    setFormData((prev) => ({ ...prev, item_id: itemId, procurement_id: undefined }));
    
    // Filter procurements for this item
    const itemProcurements = procurements.filter(p => p.item_id === itemId);
    setAvailableProcurements(itemProcurements);
  };

  const handleProcurementChange = (value: string) => {
    setFormData((prev) => ({ ...prev, procurement_id: Number(value) }));
  };

  const handleReasonChange = (value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      discard_reason: value as DiscardedItemType["discard_reason"] 
    }));
  };

  const handleDiscarderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, discarded_by: value }));
  };

  const saveDiscard = () => {
    // Validate form
    if (!formData.item_id || !formData.quantity || !formData.discard_date || 
        !formData.discard_reason || formData.discarded_by === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "All fields are required except Procurement ID and Notes!",
      });
      return;
    }
    
    // Find item name from selected item_id
    const itemName = items.find(i => i.item_id === formData.item_id)?.item_name || "";

    // Add new discard record
    const newDiscard: DiscardedItemType = {
      discard_id: Math.max(...discardedItems.map(d => d.discard_id), 0) + 1,
      item_id: formData.item_id || 0,
      item_name: itemName,
      quantity: formData.quantity || 0,
      procurement_id: formData.procurement_id,
      discard_date: formData.discard_date || new Date().toISOString().split('T')[0],
      discard_reason: formData.discard_reason || "other",
      notes: formData.notes,
      discarded_by: formData.discarded_by || ""
    };
    
    setDiscardedItems([...discardedItems, newDiscard]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Discarded items recorded successfully!",
    });
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Discarded Items" 
        subtitle="Manage and track discarded inventory"
        actionLabel="Record New Discard"
        onAction={handleAddDiscard}
      />

      <DataTable
        columns={columns}
        data={discardedItems}
        idField="discard_id"
        searchField="item_name"
        onRowClick={handleViewDiscard}
        actions={(discard) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDiscard(discard);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      {/* Add Discard Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Discarded Items</DialogTitle>
            <DialogDescription>
              Record items that have been discarded from inventory.
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
            {availableProcurements.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="procurement_id">Procurement (Optional)</Label>
                <Select 
                  value={formData.procurement_id?.toString()} 
                  onValueChange={handleProcurementChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a procurement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (General Inventory)</SelectItem>
                    {availableProcurements.map((proc) => (
                      <SelectItem key={proc.procurement_id} value={proc.procurement_id.toString()}>
                        ID: {proc.procurement_id} (Date: {format(new Date(proc.date), "MMM d, yyyy")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
              <Label htmlFor="discard_date">Discard Date</Label>
              <Input
                id="discard_date"
                name="discard_date"
                type="date"
                value={formData.discard_date || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discard_reason">Reason</Label>
              <Select 
                value={formData.discard_reason} 
                onValueChange={handleReasonChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="obsolete">Obsolete</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Enter any additional notes"
                value={formData.notes || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discarded_by">Discarded By</Label>
              <Select 
                value={formData.discarded_by} 
                onValueChange={handleDiscarderChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
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
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveDiscard}>
              <Trash2 className="mr-2 h-4 w-4" />
              Record Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Discard Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Discard Details</DialogTitle>
            <DialogDescription>
              View discarded item information
            </DialogDescription>
          </DialogHeader>
          {selectedDiscard && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Discard ID</h4>
                  <p>{selectedDiscard.discard_id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Item</h4>
                  <p>{selectedDiscard.item_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Quantity</h4>
                  <p>{selectedDiscard.quantity.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p>{format(new Date(selectedDiscard.discard_date), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Reason</h4>
                  <Badge className={
                    selectedDiscard.discard_reason === "damaged" ? "bg-red-100 text-red-800" :
                    selectedDiscard.discard_reason === "expired" ? "bg-amber-100 text-amber-800" :
                    selectedDiscard.discard_reason === "obsolete" ? "bg-purple-100 text-purple-800" :
                    "bg-gray-100 text-gray-800"
                  }>
                    {selectedDiscard.discard_reason.charAt(0).toUpperCase() + selectedDiscard.discard_reason.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Procurement ID</h4>
                  <p>{selectedDiscard.procurement_id || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Discarded By</h4>
                  <p>{selectedDiscard.discarded_by}</p>
                </div>
                {selectedDiscard.notes && (
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                    <p>{selectedDiscard.notes}</p>
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

export default DiscardedItems;

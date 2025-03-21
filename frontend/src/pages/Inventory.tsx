
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, Package, Database, Pencil, Plus, Trash } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useUserRole } from "@/contexts/UserRoleContext";

interface InventoryType {
  inventory_id: number;
  item_id: number;
  item_name: string;
  quantity: number;
  procurement_id: number;
}

interface ProcurementType {
  procurement_id: number;
  item_name: string;
  supplier: string;
  procurement_date: string;
  added_by: string;
}

const initialInventory: InventoryType[] = [
  { inventory_id: 1, item_id: 1, item_name: "Laptop", quantity: 25, procurement_id: 1 },
  { inventory_id: 2, item_id: 2, item_name: "Office Chair", quantity: 15, procurement_id: 2 },
  { inventory_id: 3, item_id: 3, item_name: "Notebook", quantity: 100, procurement_id: 3 },
  { inventory_id: 4, item_id: 4, item_name: "Monitor", quantity: 20, procurement_id: 4 },
  { inventory_id: 5, item_id: 6, item_name: "Keyboard", quantity: 30, procurement_id: 7 },
  { inventory_id: 6, item_id: 7, item_name: "Mouse", quantity: 35, procurement_id: 5 },
  { inventory_id: 7, item_id: 8, item_name: "Printer", quantity: 5, procurement_id: 1 },
  { inventory_id: 8, item_id: 10, item_name: "Whiteboard", quantity: 8, procurement_id: 2 },
];

const procurements: ProcurementType[] = [
  { procurement_id: 1, item_name: "Laptop", supplier: "Tech Solutions Inc.", procurement_date: "2023-05-15", added_by: "John Smith" },
  { procurement_id: 2, item_name: "Office Chair", supplier: "Office Furniture Co.", procurement_date: "2023-06-02", added_by: "Sarah Johnson" },
  { procurement_id: 3, item_name: "Notebook", supplier: "Office Depot", procurement_date: "2023-06-10", added_by: "Emily Davis" },
  { procurement_id: 4, item_name: "Monitor", supplier: "Tech Solutions Inc.", procurement_date: "2023-06-15", added_by: "John Smith" },
  { procurement_id: 5, item_name: "Mouse", supplier: "Tech Solutions Inc.", procurement_date: "2023-07-01", added_by: "Robert Wilson" },
  { procurement_id: 7, item_name: "Keyboard", supplier: "Internal Transfer", procurement_date: "2023-07-20", added_by: "Emily Davis" },
];

const inventoryFormSchema = z.object({
  item_name: z.string().min(1, "Item name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  procurement_id: z.coerce.number().optional(),
});

type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

const Inventory = () => {
  const { toast } = useToast();
  const { isAdmin, inventoryData, setInventoryData } = useUserRole();
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<InventoryType | null>(null);
  const [selectedProcurement, setSelectedProcurement] = useState<ProcurementType | null>(null);

  // Initialize from context if available, otherwise use initialInventory
  useEffect(() => {
    if (inventoryData.length === 0 && isAdmin) {
      setInventoryData(initialInventory);
    }
  }, [isAdmin, inventoryData.length, setInventoryData]);

  const addForm = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      item_name: "",
      quantity: 1,
      procurement_id: 1,
    },
  });

  const editForm = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      item_name: "",
      quantity: 1,
      procurement_id: 1,
    },
  });

  const columns = [
    { header: "ID", accessor: "inventory_id" as keyof InventoryType },
    { header: "Item Name", accessor: "item_name" as keyof InventoryType },
    { 
      header: "Quantity", 
      accessor: "quantity" as keyof InventoryType,
      cell: (item: InventoryType) => (
        <span className="font-mono">{item.quantity.toLocaleString()}</span>
      )
    },
    { 
      header: "Procurement ID", 
      accessor: "procurement_id" as keyof InventoryType,
      cell: (item: InventoryType) => (
        <Badge variant="outline" className="bg-primary/10 text-primary">
          #{item.procurement_id}
        </Badge>
      )
    },
  ];

  const handleViewDetails = (item: InventoryType) => {
    setSelectedInventory(item);
    const procurement = procurements.find(p => p.procurement_id === item.procurement_id);
    setSelectedProcurement(procurement || null);
    setIsDetailsDialogOpen(true);
  };

  const handleAddInventory = () => {
    setIsAddDialogOpen(true);
    addForm.reset({
      item_name: "",
      quantity: 1,
      procurement_id: 1,
    });
  };

  const handleEditInventory = (item: InventoryType) => {
    setSelectedInventory(item);
    editForm.reset({
      item_name: item.item_name,
      quantity: item.quantity,
      procurement_id: item.procurement_id,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteInventory = (item: InventoryType) => {
    setSelectedInventory(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedInventory) return;
    
    const updatedInventory = inventoryData.filter(
      item => item.inventory_id !== selectedInventory.inventory_id
    );
    
    setInventoryData(updatedInventory);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Inventory item deleted successfully!",
    });
  };

  const onAddSubmit = (data: InventoryFormValues) => {
    const newInventory: InventoryType = {
      inventory_id: Math.max(...inventoryData.map(i => i.inventory_id), 0) + 1,
      item_id: Math.max(...inventoryData.map(i => i.item_id), 0) + 1,
      item_name: data.item_name,
      quantity: data.quantity,
      procurement_id: data.procurement_id || 1,
    };

    setInventoryData([...inventoryData, newInventory]);
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Inventory item added successfully!",
    });
  };

  const onEditSubmit = (data: InventoryFormValues) => {
    if (!selectedInventory) return;

    const updatedInventory = inventoryData.map(item => 
      item.inventory_id === selectedInventory.inventory_id 
        ? {
            ...item,
            item_name: data.item_name,
            quantity: data.quantity,
            procurement_id: data.procurement_id || item.procurement_id,
          }
        : item
    );

    setInventoryData(updatedInventory);
    setIsEditDialogOpen(false);
    toast({
      title: "Success",
      description: "Inventory item updated successfully!",
    });
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Inventory Management" 
        subtitle="View and manage total inventory"
        icon={<Database className="h-6 w-6 mr-2" />}
        actionLabel={isAdmin ? "Add New Inventory" : undefined}
        onAction={isAdmin ? handleAddInventory : undefined}
      />

      <DataTable
        columns={columns}
        data={inventoryData}
        idField="inventory_id"
        searchField="item_name"
        onRowClick={handleViewDetails}
        actions={(item) => (
          <div className="flex items-center justify-end gap-2">
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditInventory(item);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteInventory(item);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(item);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inventory Details</DialogTitle>
            <DialogDescription>
              View detailed information for this inventory item
            </DialogDescription>
          </DialogHeader>
          {selectedInventory && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Inventory ID</h4>
                  <p>{selectedInventory.inventory_id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Item Name</h4>
                  <p>{selectedInventory.item_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Quantity</h4>
                  <p>{selectedInventory.quantity.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Procurement ID</h4>
                  <p>#{selectedInventory.procurement_id}</p>
                </div>
              </div>
              
              {selectedProcurement && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold mb-2">Procurement Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Supplier</h4>
                        <p>{selectedProcurement.supplier}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                        <p>{new Date(selectedProcurement.procurement_date).toLocaleDateString()}</p>
                      </div>
                      <div className="col-span-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Added By</h4>
                        <p>{selectedProcurement.added_by}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Dialog - Only visible for admin */}
      {isAdmin && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Inventory</DialogTitle>
              <DialogDescription>
                Enter details to add a new inventory item
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                <FormField
                  control={addForm.control}
                  name="item_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="procurement_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Procurement</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a procurement" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {procurements.map((procurement) => (
                            <SelectItem 
                              key={procurement.procurement_id} 
                              value={procurement.procurement_id.toString()}
                            >
                              #{procurement.procurement_id} - {procurement.item_name} ({procurement.supplier})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Inventory
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog - Only visible for admin */}
      {isAdmin && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Inventory</DialogTitle>
              <DialogDescription>
                Update inventory item details
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="item_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="procurement_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Procurement</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a procurement" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {procurements.map((procurement) => (
                            <SelectItem 
                              key={procurement.procurement_id} 
                              value={procurement.procurement_id.toString()}
                            >
                              #{procurement.procurement_id} - {procurement.item_name} ({procurement.supplier})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Pencil className="mr-2 h-4 w-4" />
                    Update Inventory
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog - Only visible for admin */}
      {isAdmin && (
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Inventory Item"
          description={`Are you sure you want to delete "${selectedInventory?.item_name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
        />
      )}
    </PageLayout>
  );
};

export default Inventory;

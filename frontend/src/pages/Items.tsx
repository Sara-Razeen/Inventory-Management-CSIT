import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Package, Tag, FileText, Mail, File, DollarSign } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { addProcurement } from "@/utils/procurementUtils";

interface ItemType {
  item_id: number;
  item_name: string;
  category_id: number;
  category_name: string;
  total_quantity: number;
  low_stock_threshold?: number;
  document_type?: string;
}

interface ProcurementDetails {
  procurement_type: string;
  supplier: string;
  quantity: number;
  unit_price: number;
  procurement_date: string;
  added_by: string;
}

interface CategoryType {
  category_id: number;
  category_name: string;
}

const categories: CategoryType[] = [
  { category_id: 1, category_name: "Electronics" },
  { category_id: 2, category_name: "Office Supplies" },
  { category_id: 3, category_name: "Furniture" },
  { category_id: 4, category_name: "IT Equipment" },
  { category_id: 5, category_name: "Kitchen" },
  { category_id: 6, category_name: "Security" },
  { category_id: 7, category_name: "Cleaning Supplies" },
];

const documentTypes = [
  { value: "purchase_order", label: "Purchase Order", icon: <Package className="h-4 w-4 mr-2" /> },
  { value: "mou", label: "MOU (Email)", icon: <Mail className="h-4 w-4 mr-2" /> },
  { value: "internal_memo", label: "Internal Memo", icon: <File className="h-4 w-4 mr-2" /> },
];

const procurementTypes = [
  { value: "purchase", label: "Purchase" },
  { value: "donation", label: "Donation" },
  { value: "transfer", label: "Transfer" },
];

const initialItems: ItemType[] = [
  { item_id: 1, item_name: "Laptop", category_id: 1, category_name: "Electronics", total_quantity: 35, low_stock_threshold: 10, document_type: "purchase_order" },
  { item_id: 2, item_name: "Office Chair", category_id: 3, category_name: "Furniture", total_quantity: 22, low_stock_threshold: 5, document_type: "mou" },
  { item_id: 3, item_name: "Notebook", category_id: 2, category_name: "Office Supplies", total_quantity: 150, low_stock_threshold: 30, document_type: "internal_memo" },
  { item_id: 4, item_name: "Monitor", category_id: 1, category_name: "Electronics", total_quantity: 27, low_stock_threshold: 8, document_type: "purchase_order" },
  { item_id: 5, item_name: "Desk", category_id: 3, category_name: "Furniture", total_quantity: 15, low_stock_threshold: 3, document_type: "purchase_order" },
  { item_id: 6, item_name: "Keyboard", category_id: 4, category_name: "IT Equipment", total_quantity: 42, low_stock_threshold: 12, document_type: "mou" },
  { item_id: 7, item_name: "Mouse", category_id: 4, category_name: "IT Equipment", total_quantity: 48, low_stock_threshold: 15, document_type: "internal_memo" },
  { item_id: 8, item_name: "Printer", category_id: 1, category_name: "Electronics", total_quantity: 8, low_stock_threshold: 3, document_type: "purchase_order" },
  { item_id: 9, item_name: "Coffee Maker", category_id: 5, category_name: "Kitchen", total_quantity: 4, low_stock_threshold: 1, document_type: "mou" },
  { item_id: 10, item_name: "Whiteboard", category_id: 2, category_name: "Office Supplies", total_quantity: 12, low_stock_threshold: 3, document_type: "internal_memo" },
];

const Items = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<ItemType[]>(initialItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [formData, setFormData] = useState<Partial<ItemType>>({
    item_name: "",
    category_id: undefined,
    low_stock_threshold: undefined,
    document_type: undefined
  });
  const [procurementData, setProcurementData] = useState<Partial<ProcurementDetails>>({
    procurement_type: "purchase",
    supplier: "",
    quantity: 0,
    unit_price: 0,
    procurement_date: new Date().toISOString().split('T')[0],
    added_by: "System"
  });

  const columns = [
    { header: "ID", accessor: "item_id" as keyof ItemType },
    { header: "Item Name", accessor: "item_name" as keyof ItemType },
    { 
      header: "Category", 
      accessor: "category_name" as keyof ItemType,
      cell: (item: ItemType) => (
        <Badge variant="outline" className="bg-primary/10 text-primary">
          {item.category_name}
        </Badge>
      )
    },
    { 
      header: "Quantity", 
      accessor: "total_quantity" as keyof ItemType,
      cell: (item: ItemType) => {
        const isLowStock = item.low_stock_threshold !== undefined && item.total_quantity <= item.low_stock_threshold;
        return (
          <span className={`font-mono ${isLowStock ? 'text-destructive font-bold' : ''}`}>
            {item.total_quantity.toLocaleString()}
            {isLowStock && ' (Low Stock)'}
          </span>
        );
      }
    },
    { 
      header: "Low Stock Threshold", 
      accessor: "low_stock_threshold" as keyof ItemType,
      cell: (item: ItemType) => (
        <span className="font-mono">{item.low_stock_threshold?.toLocaleString() || 'N/A'}</span>
      )
    },
    {
      header: "Document Type",
      accessor: "document_type" as keyof ItemType,
      cell: (item: ItemType) => {
        const docType = documentTypes.find(dt => dt.value === item.document_type);
        return (
          <div className="flex items-center">
            {docType ? (
              <>
                {docType.icon}
                <span>{docType.label}</span>
              </>
            ) : (
              <span>Not specified</span>
            )}
          </div>
        );
      }
    },
  ];

  const handleAddItem = () => {
    setFormData({
      item_name: "",
      category_id: undefined,
      low_stock_threshold: undefined,
      document_type: undefined
    });
    setProcurementData({
      procurement_type: "purchase",
      supplier: "",
      quantity: 0,
      unit_price: 0,
      procurement_date: new Date().toISOString().split('T')[0],
      added_by: "System"
    });
    setIsAddDialogOpen(true);
  };

  const handleEditItem = (item: ItemType) => {
    setSelectedItem(item);
    setFormData({
      item_name: item.item_name,
      category_id: item.category_id,
      low_stock_threshold: item.low_stock_threshold,
      document_type: item.document_type
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteItem = (item: ItemType) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "low_stock_threshold") {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value ? Number(value) : undefined 
      }));
    } else if (name === "procurement_supplier") {
      setProcurementData((prev) => ({
        ...prev,
        supplier: value
      }));
    } else if (name === "procurement_quantity") {
      setProcurementData((prev) => ({
        ...prev,
        quantity: value ? Number(value) : 0
      }));
    } else if (name === "procurement_unit_price") {
      setProcurementData((prev) => ({
        ...prev,
        unit_price: value ? Number(value) : 0
      }));
    } else if (name === "procurement_date") {
      setProcurementData((prev) => ({
        ...prev,
        procurement_date: value
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category_id: Number(value) }));
  };

  const handleDocumentTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, document_type: value }));
  };

  const handleProcurementTypeChange = (value: string) => {
    setProcurementData((prev) => ({ ...prev, procurement_type: value }));
  };

  const saveItem = () => {
    if (!formData.item_name || !formData.category_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Item name and category are required!",
      });
      return;
    }

    if (isAddDialogOpen && (!procurementData.supplier || !procurementData.quantity)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Supplier and quantity are required for procurement!",
      });
      return;
    }

    const categoryName = categories.find(c => c.category_id === formData.category_id)?.category_name || "";

    if (isAddDialogOpen) {
      const newItem: ItemType = {
        item_id: Math.max(...items.map(i => i.item_id), 0) + 1,
        item_name: formData.item_name || "",
        category_id: formData.category_id || 0,
        category_name: categoryName,
        total_quantity: procurementData.quantity || 0,
        low_stock_threshold: formData.low_stock_threshold,
        document_type: formData.document_type
      };
      
      setItems([...items, newItem]);
      
      // Add to procurement table
      const itemData = {
        item_id: newItem.item_id,
        item_name: newItem.item_name,
        procurement_type: procurementData.procurement_type,
        supplier: procurementData.supplier,
        quantity: procurementData.quantity,
        procurement_date: procurementData.procurement_date,
        unit_price: procurementData.unit_price,
        added_by: procurementData.added_by
      };
      
      addProcurement(itemData, formData.document_type || "");
      
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Item added successfully and procurement recorded!",
      });
    } else if (isEditDialogOpen && selectedItem) {
      const updatedItems = items.map(item => 
        item.item_id === selectedItem.item_id 
          ? { 
              ...item, 
              item_name: formData.item_name || item.item_name,
              category_id: formData.category_id || item.category_id,
              category_name: categoryName || item.category_name,
              low_stock_threshold: formData.low_stock_threshold,
              document_type: formData.document_type
            } 
          : item
      );
      
      setItems(updatedItems);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Item updated successfully!",
      });
    }
  };

  const confirmDelete = () => {
    if (selectedItem) {
      if (selectedItem.total_quantity > 0) {
        toast({
          variant: "destructive",
          title: "Cannot Delete",
          description: `This item has ${selectedItem.total_quantity} units in inventory. Please remove all inventory first.`,
        });
        setIsDeleteDialogOpen(false);
        return;
      }
      
      const updatedItems = items.filter(item => item.item_id !== selectedItem.item_id);
      setItems(updatedItems);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Item deleted successfully!",
      });
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Item Management" 
        subtitle="Manage inventory items"
        actionLabel="Add New Item"
        onAction={handleAddItem}
      />

      <DataTable
        columns={columns}
        data={items}
        idField="item_id"
        searchField="item_name"
        actions={(item) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEditItem(item);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`text-destructive hover:text-destructive ${item.total_quantity > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (item.total_quantity === 0) {
                  handleDeleteItem(item);
                } else {
                  toast({
                    variant: "destructive",
                    title: "Cannot Delete",
                    description: `This item has ${item.total_quantity} units in inventory. Please remove all inventory first.`,
                  });
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add a new inventory item with procurement details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Item Details</h3>
              <div className="space-y-2">
                <Label htmlFor="item_name">Item Name</Label>
                <Input
                  id="item_name"
                  name="item_name"
                  placeholder="Enter item name"
                  value={formData.item_name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <Select 
                  value={formData.category_id?.toString()} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                        {cat.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="document_type">Document Type</Label>
                <Select 
                  value={formData.document_type} 
                  onValueChange={handleDocumentTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          {type.icon}
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="low_stock_threshold">Low Stock Threshold (Optional)</Label>
                <Input
                  id="low_stock_threshold"
                  name="low_stock_threshold"
                  type="number"
                  placeholder="Enter threshold value"
                  value={formData.low_stock_threshold?.toString() || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Procurement Details</h3>
              <div className="space-y-2">
                <Label htmlFor="procurement_type">Procurement Type</Label>
                <Select 
                  value={procurementData.procurement_type} 
                  onValueChange={handleProcurementTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select procurement type" />
                  </SelectTrigger>
                  <SelectContent>
                    {procurementTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="procurement_supplier">Supplier</Label>
                <Input
                  id="procurement_supplier"
                  name="procurement_supplier"
                  placeholder="Enter supplier name"
                  value={procurementData.supplier || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="procurement_quantity">Quantity</Label>
                <Input
                  id="procurement_quantity"
                  name="procurement_quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={procurementData.quantity?.toString() || "0"}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="procurement_unit_price">Unit Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <Input
                    id="procurement_unit_price"
                    name="procurement_unit_price"
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                    value={procurementData.unit_price?.toString() || "0"}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="procurement_date">Procurement Date</Label>
                <Input
                  id="procurement_date"
                  name="procurement_date"
                  type="date"
                  value={procurementData.procurement_date || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update item information. Name and category are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-item_name">Item Name</Label>
              <Input
                id="edit-item_name"
                name="item_name"
                placeholder="Enter item name"
                value={formData.item_name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category_id">Category</Label>
              <Select 
                value={formData.category_id?.toString()} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                      {cat.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-document_type">Document Type</Label>
              <Select 
                value={formData.document_type} 
                onValueChange={handleDocumentTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        {type.icon}
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-low_stock_threshold">Low Stock Threshold (Optional)</Label>
              <Input
                id="edit-low_stock_threshold"
                name="low_stock_threshold"
                type="number"
                placeholder="Enter threshold value"
                value={formData.low_stock_threshold?.toString() || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveItem}>
              <Package className="mr-2 h-4 w-4" />
              Update Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Item"
        description={`Are you sure you want to delete ${selectedItem?.item_name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </PageLayout>
  );
};

export default Items;


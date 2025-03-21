
import { useState } from "react";
import { Eye, Edit, User } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { updateProcurement, getProcurements } from "@/utils/procurementUtils";
import { useToast } from "@/hooks/use-toast";

interface ProcurementType {
  procurement_id: number;
  item_id: number;
  item_name: string;
  procurement_type: "purchase" | "donation" | "transfer";
  supplier: string;
  quantity: number;
  procurement_date: string;
  unit_price: number;
  added_by: string;
  total_price: number;
  document_type?: string;
}

const Procurements = () => {
  const [procurements, setProcurements] = useState<ProcurementType[]>(getProcurements());
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProcurement, setSelectedProcurement] = useState<ProcurementType | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProcurementType>>({});
  const { toast } = useToast();

  const columns = [
    { header: "ID", accessor: "procurement_id" as keyof ProcurementType },
    { header: "Item", accessor: "item_name" as keyof ProcurementType },
    { 
      header: "Type", 
      accessor: "procurement_type" as keyof ProcurementType,
      cell: (item: ProcurementType) => {
        const typeColors = {
          purchase: "bg-blue-100 text-blue-800",
          donation: "bg-green-100 text-green-800",
          transfer: "bg-amber-100 text-amber-800"
        };
        
        return (
          <Badge className={typeColors[item.procurement_type]}>
            {item.procurement_type.charAt(0).toUpperCase() + item.procurement_type.slice(1)}
          </Badge>
        );
      }
    },
    { header: "Supplier", accessor: "supplier" as keyof ProcurementType },
    { 
      header: "Quantity", 
      accessor: "quantity" as keyof ProcurementType,
      cell: (item: ProcurementType) => (
        <span className="font-mono">{item.quantity.toLocaleString()}</span>
      )
    },
    { 
      header: "Date", 
      accessor: "procurement_date" as keyof ProcurementType,
      cell: (item: ProcurementType) => format(new Date(item.procurement_date), "MMM d, yyyy")
    },
    { 
      header: "Unit Price", 
      accessor: "unit_price" as keyof ProcurementType,
      cell: (item: ProcurementType) => (
        item.unit_price > 0 
          ? <span className="font-mono">${item.unit_price.toLocaleString()}</span>
          : <span className="text-muted-foreground">N/A</span>
      )
    },
    { 
      header: "Total", 
      accessor: "total_price" as keyof ProcurementType,
      cell: (item: ProcurementType) => (
        item.total_price > 0 
          ? <span className="font-mono">${item.total_price.toLocaleString()}</span>
          : <span className="text-muted-foreground">N/A</span>
      )
    },
    {
      header: "Document Type",
      accessor: "document_type" as keyof ProcurementType,
      cell: (item: ProcurementType) => (
        <span>{item.document_type || "N/A"}</span>
      )
    },
    { 
      header: "Added By", 
      accessor: "added_by" as keyof ProcurementType,
      cell: (item: ProcurementType) => (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{item.added_by}</span>
        </div>
      )
    },
  ];

  const handleViewProcurement = (procurement: ProcurementType) => {
    setSelectedProcurement(procurement);
    setIsViewDialogOpen(true);
  };

  const handleEditProcurement = (procurement: ProcurementType) => {
    setSelectedProcurement(procurement);
    setEditForm({
      item_name: procurement.item_name,
      supplier: procurement.supplier,
      quantity: procurement.quantity,
      unit_price: procurement.unit_price,
      procurement_date: procurement.procurement_date,
      document_type: procurement.document_type,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unit_price' ? Number(value) : value,
    }));
  };

  const handleSaveEdit = () => {
    if (!selectedProcurement) return;
    
    const updated = updateProcurement(selectedProcurement.procurement_id, editForm);
    if (updated) {
      setProcurements(getProcurements());
      setIsEditDialogOpen(false);
      toast({
        title: "Procurement Updated",
        description: `${selectedProcurement.item_name} procurement has been updated.`,
      });
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Procurement Records" 
        subtitle="View inventory procurement history"
      />

      <DataTable
        columns={columns}
        data={procurements}
        idField="procurement_id"
        searchField="item_name"
        onRowClick={handleViewProcurement}
        actions={(procurement) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleViewProcurement(procurement);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEditProcurement(procurement);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      {/* View Procurement Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Procurement Details</DialogTitle>
            <DialogDescription>
              View procurement information
            </DialogDescription>
          </DialogHeader>
          {selectedProcurement && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">ID</h4>
                  <p>{selectedProcurement.procurement_id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Item</h4>
                  <p>{selectedProcurement.item_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                  <Badge className={selectedProcurement.procurement_type === "purchase" 
                    ? "bg-blue-100 text-blue-800" 
                    : selectedProcurement.procurement_type === "donation" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-amber-100 text-amber-800"}>
                    {selectedProcurement.procurement_type.charAt(0).toUpperCase() + selectedProcurement.procurement_type.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Supplier</h4>
                  <p>{selectedProcurement.supplier}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Quantity</h4>
                  <p>{selectedProcurement.quantity.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p>{format(new Date(selectedProcurement.procurement_date), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Unit Price</h4>
                  <p>{selectedProcurement.unit_price > 0 
                    ? `$${selectedProcurement.unit_price.toLocaleString()}`
                    : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Total Price</h4>
                  <p>{selectedProcurement.total_price > 0 
                    ? `$${selectedProcurement.total_price.toLocaleString()}`
                    : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Document Type</h4>
                  <p>{selectedProcurement.document_type || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Added By</h4>
                  <p>{selectedProcurement.added_by}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              if (selectedProcurement) handleEditProcurement(selectedProcurement);
            }}>
              Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Procurement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Procurement</DialogTitle>
            <DialogDescription>
              Update procurement information
            </DialogDescription>
          </DialogHeader>
          {selectedProcurement && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="item_name">Item Name</Label>
                  <Input 
                    id="item_name" 
                    name="item_name" 
                    value={editForm.item_name || ''} 
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input 
                    id="supplier" 
                    name="supplier" 
                    value={editForm.supplier || ''} 
                    onChange={handleEditFormChange}
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    name="quantity" 
                    type="number" 
                    value={editForm.quantity || 0} 
                    onChange={handleEditFormChange}
                  />
                </div>
                <div>
                  <Label htmlFor="unit_price">Unit Price ($)</Label>
                  <Input 
                    id="unit_price" 
                    name="unit_price" 
                    type="number" 
                    value={editForm.unit_price || 0} 
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="procurement_date">Procurement Date</Label>
                  <Input 
                    id="procurement_date" 
                    name="procurement_date" 
                    type="date" 
                    value={editForm.procurement_date || ''} 
                    onChange={handleEditFormChange}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="document_type">Document Type</Label>
                  <Input 
                    id="document_type" 
                    name="document_type" 
                    value={editForm.document_type || ''} 
                    onChange={handleEditFormChange}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Procurements;

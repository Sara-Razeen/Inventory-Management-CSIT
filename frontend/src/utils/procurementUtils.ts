
// This file contains utility functions for procurement management

// Function to export the current procurements data
// This would typically be a database call in a real application
let procurements: any[] = [];

export const setProcurements = (newProcurements: any[]) => {
  procurements = [...newProcurements];
};

export const getProcurements = () => {
  return [...procurements];
};

// Function to add a new procurement when an item is added
export const addProcurement = (itemData: any, documentType: string) => {
  const newProcurement = {
    procurement_id: Math.max(...procurements.map(p => p.procurement_id || 0), 0) + 1,
    item_id: itemData.item_id,
    item_name: itemData.item_name,
    procurement_type: itemData.procurement_type || "purchase",
    supplier: itemData.supplier || "Not specified",
    quantity: itemData.quantity || 0,
    procurement_date: itemData.procurement_date || new Date().toISOString().split('T')[0],
    unit_price: itemData.unit_price || 0,
    added_by: itemData.added_by || "System",
    total_price: (itemData.quantity || 0) * (itemData.unit_price || 0),
    document_type: documentType,
    status: "completed"
  };
  
  procurements.push(newProcurement);
  return newProcurement;
};

// Update an existing procurement
export const updateProcurement = (procurementId: number, updatedData: any) => {
  const index = procurements.findIndex(p => p.procurement_id === procurementId);
  if (index !== -1) {
    const updated = {
      ...procurements[index],
      ...updatedData,
      total_price: (updatedData.quantity || procurements[index].quantity) * 
                  (updatedData.unit_price || procurements[index].unit_price)
    };
    procurements[index] = updated;
    return updated;
  }
  return null;
};

// Initial procurements data if needed
if (procurements.length === 0) {
  procurements = [
    { procurement_id: 1, item_id: 1, item_name: "Laptop", procurement_type: "purchase", supplier: "Tech Solutions Inc.", quantity: 10, procurement_date: "2023-05-15", unit_price: 1200, added_by: "John Smith", total_price: 12000, document_type: "purchase_order", status: "completed" },
    { procurement_id: 2, item_id: 2, item_name: "Office Chair", procurement_type: "purchase", supplier: "Office Furniture Co.", quantity: 15, procurement_date: "2023-06-02", unit_price: 150, added_by: "Sarah Johnson", total_price: 2250, document_type: "mou", status: "completed" },
    { procurement_id: 3, item_id: 3, item_name: "Notebook", procurement_type: "purchase", supplier: "Office Depot", quantity: 100, procurement_date: "2023-06-10", unit_price: 5, added_by: "Emily Davis", total_price: 500, document_type: "internal_memo", status: "completed" },
  ];
}

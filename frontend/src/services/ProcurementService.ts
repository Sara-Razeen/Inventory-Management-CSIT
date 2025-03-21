
import { create } from 'zustand';

export interface ProcurementType {
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
  document_type?: "Purchase Order" | "MOU" | "Internal Memo";
}

// Initial procurements data
const initialProcurements: ProcurementType[] = [
  { procurement_id: 1, item_id: 1, item_name: "Laptop", procurement_type: "purchase", supplier: "Tech Solutions Inc.", quantity: 10, procurement_date: "2023-05-15", unit_price: 1200, added_by: "John Smith", total_price: 12000, document_type: "Purchase Order" },
  { procurement_id: 2, item_id: 2, item_name: "Office Chair", procurement_type: "purchase", supplier: "Office Furniture Co.", quantity: 15, procurement_date: "2023-06-02", unit_price: 150, added_by: "Sarah Johnson", total_price: 2250, document_type: "MOU" },
  { procurement_id: 3, item_id: 3, item_name: "Notebook", procurement_type: "purchase", supplier: "Office Depot", quantity: 100, procurement_date: "2023-06-10", unit_price: 5, added_by: "Emily Davis", total_price: 500, document_type: "Internal Memo" },
  { procurement_id: 4, item_id: 4, item_name: "Monitor", procurement_type: "purchase", supplier: "Tech Solutions Inc.", quantity: 12, procurement_date: "2023-06-15", unit_price: 250, added_by: "John Smith", total_price: 3000, document_type: "Purchase Order" },
  { procurement_id: 5, item_id: 7, item_name: "Mouse", procurement_type: "purchase", supplier: "Tech Solutions Inc.", quantity: 20, procurement_date: "2023-07-01", unit_price: 25, added_by: "Robert Wilson", total_price: 500, document_type: "Purchase Order" },
  { procurement_id: 6, item_id: 9, item_name: "Coffee Maker", procurement_type: "donation", supplier: "Community Donation", quantity: 2, procurement_date: "2023-07-12", unit_price: 0, added_by: "Michael Brown", total_price: 0, document_type: "MOU" },
  { procurement_id: 7, item_id: 6, item_name: "Keyboard", procurement_type: "transfer", supplier: "Internal Transfer", quantity: 15, procurement_date: "2023-07-20", unit_price: 0, added_by: "Emily Davis", total_price: 0, document_type: "Internal Memo" },
];

// Create a store for procurements
interface ProcurementStore {
  procurements: ProcurementType[];
  addProcurement: (procurement: Omit<ProcurementType, 'procurement_id'>) => ProcurementType;
}

export const useProcurementStore = create<ProcurementStore>((set, get) => ({
  procurements: initialProcurements,
  addProcurement: (procurementData) => {
    const newId = Math.max(...get().procurements.map(p => p.procurement_id), 0) + 1;
    const newProcurement = {
      ...procurementData,
      procurement_id: newId,
      total_price: (procurementData.quantity || 0) * (procurementData.unit_price || 0)
    };
    
    set(state => ({
      procurements: [...state.procurements, newProcurement]
    }));
    
    return newProcurement;
  }
}));

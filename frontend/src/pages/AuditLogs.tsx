
import { useState } from "react";
import { AlertCircle, User, UserPlus, Package, ShoppingCart, Trash2, TrendingUp, FileText } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface AuditLogType {
  log_id: number;
  action: string;
  action_type: "create" | "update" | "delete" | "info" | "warning" | "error";
  entity_type: "user" | "department" | "location" | "item" | "procurement" | "movement" | "discard" | "system";
  entity_id?: number;
  performed_by: string;
  action_timestamp: string;
  details?: string;
}

// Sample audit logs data
const initialAuditLogs: AuditLogType[] = [
  { log_id: 1, action: "User Created", action_type: "create", entity_type: "user", entity_id: 5, performed_by: "John Smith", action_timestamp: "2023-09-01T09:15:22", details: "Created new user 'Robert Wilson'" },
  { log_id: 2, action: "Item Updated", action_type: "update", entity_type: "item", entity_id: 4, performed_by: "Sarah Johnson", action_timestamp: "2023-09-01T10:30:45", details: "Updated details for item 'Monitor'" },
  { log_id: 3, action: "Procurement Added", action_type: "create", entity_type: "procurement", entity_id: 7, performed_by: "Emily Davis", action_timestamp: "2023-09-01T11:45:12", details: "Added new procurement for Coffee Maker" },
  { log_id: 4, action: "Stock Movement", action_type: "create", entity_type: "movement", entity_id: 7, performed_by: "Michael Brown", action_timestamp: "2023-09-01T13:20:38", details: "Moved Coffee Maker from Main Warehouse to Finance Archive" },
  { log_id: 5, action: "Item Discarded", action_type: "create", entity_type: "discard", entity_id: 5, performed_by: "Robert Wilson", action_timestamp: "2023-09-01T15:10:55", details: "Recorded 8 discarded keyboards" },
  { log_id: 6, action: "User Updated", action_type: "update", entity_type: "user", entity_id: 3, performed_by: "John Smith", action_timestamp: "2023-09-02T09:45:30", details: "Updated user 'Michael Brown' department assignment" },
  { log_id: 7, action: "Department Created", action_type: "create", entity_type: "department", entity_id: 8, performed_by: "Sarah Johnson", action_timestamp: "2023-09-02T10:15:22", details: "Created new department 'Research & Development'" },
  { log_id: 8, action: "Location Added", action_type: "create", entity_type: "location", entity_id: 8, performed_by: "Sarah Johnson", action_timestamp: "2023-09-02T11:05:48", details: "Added new location 'R&D Lab'" },
  { log_id: 9, action: "Failed Login Attempt", action_type: "warning", entity_type: "system", performed_by: "System", action_timestamp: "2023-09-02T14:22:10", details: "Multiple failed login attempts for user 'emily.davis'" },
  { log_id: 10, action: "System Update", action_type: "info", entity_type: "system", performed_by: "System", action_timestamp: "2023-09-02T16:30:00", details: "Scheduled system maintenance completed" },
  { log_id: 11, action: "Database Backup", action_type: "info", entity_type: "system", performed_by: "System", action_timestamp: "2023-09-02T23:00:00", details: "Automated database backup completed successfully" },
  { log_id: 12, action: "Item Added", action_type: "create", entity_type: "item", entity_id: 11, performed_by: "Michael Brown", action_timestamp: "2023-09-03T10:45:12", details: "Added new item 'Projector'" },
  { log_id: 13, action: "Stock Movement Error", action_type: "error", entity_type: "movement", performed_by: "Emily Davis", action_timestamp: "2023-09-03T13:12:45", details: "Failed to record stock movement: insufficient quantity at source location" },
  { log_id: 14, action: "User Deleted", action_type: "delete", entity_type: "user", entity_id: 8, performed_by: "John Smith", action_timestamp: "2023-09-03T15:30:22", details: "Deleted user 'Temporary Intern'" },
  { log_id: 15, action: "Procurement Updated", action_type: "update", entity_type: "procurement", entity_id: 4, performed_by: "Sarah Johnson", action_timestamp: "2023-09-03T16:20:18", details: "Updated procurement details for monitors" },
];

const AuditLogs = () => {
  const [auditLogs] = useState<AuditLogType[]>(initialAuditLogs);

  const columns = [
    { header: "ID", accessor: "log_id" as keyof AuditLogType },
    { 
      header: "Action", 
      accessor: "action" as keyof AuditLogType,
      cell: (log: AuditLogType) => {
        const actionTypeColors = {
          create: "bg-green-100 text-green-800",
          update: "bg-blue-100 text-blue-800",
          delete: "bg-red-100 text-red-800",
          info: "bg-sky-100 text-sky-800",
          warning: "bg-amber-100 text-amber-800",
          error: "bg-rose-100 text-rose-800"
        };
        
        return (
          <div className="flex items-center">
            <Badge className={actionTypeColors[log.action_type]}>
              {log.action}
            </Badge>
          </div>
        );
      }
    },
    { 
      header: "Entity Type", 
      accessor: "entity_type" as keyof AuditLogType,
      cell: (log: AuditLogType) => {
        const entityIcons = {
          user: <User className="h-4 w-4 mr-1.5" />,
          department: <UserPlus className="h-4 w-4 mr-1.5" />,
          location: <MapPin className="h-4 w-4 mr-1.5" />,
          item: <Package className="h-4 w-4 mr-1.5" />,
          procurement: <ShoppingCart className="h-4 w-4 mr-1.5" />,
          movement: <TrendingUp className="h-4 w-4 mr-1.5" />,
          discard: <Trash2 className="h-4 w-4 mr-1.5" />,
          system: <FileText className="h-4 w-4 mr-1.5" />
        };
        
        return (
          <div className="flex items-center">
            {entityIcons[log.entity_type]}
            <span className="capitalize">{log.entity_type}</span>
            {log.entity_id && <span className="ml-1 text-muted-foreground">#{log.entity_id}</span>}
          </div>
        );
      }
    },
    { header: "Performed By", accessor: "performed_by" as keyof AuditLogType },
    { 
      header: "Timestamp", 
      accessor: "action_timestamp" as keyof AuditLogType,
      cell: (log: AuditLogType) => {
        const date = new Date(log.action_timestamp);
        return (
          <div>
            <div>{format(date, "MMM d, yyyy")}</div>
            <div className="text-xs text-muted-foreground">{format(date, "h:mm a")}</div>
          </div>
        );
      }
    },
    { header: "Details", accessor: "details" as keyof AuditLogType },
  ];

  return (
    <PageLayout>
      <PageHeader 
        title="Audit Logs" 
        subtitle="System activity and change history"
      />

      <DataTable
        columns={columns}
        data={auditLogs}
        idField="log_id"
        searchField="action"
      />
    </PageLayout>
  );
};

// Needed to avoid TypeScript error for missing MapPin component
function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default AuditLogs;

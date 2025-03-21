
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/contexts/UserRoleContext";
import { SendHorizontal, CheckCircle, XCircle, Clock } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/custom-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

// Define the stock request schema
const stockRequestSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Quantity must be a positive number",
  }),
  fromLocation: z.string().min(1, "Source location is required"),
  toLocation: z.string().min(1, "Destination location is required"),
  reason: z.string().min(1, "Reason is required"),
});

type StockRequestFormValues = z.infer<typeof stockRequestSchema>;

// Stock request status type
type RequestStatus = "pending" | "approved" | "rejected";

// Stock request type
interface StockRequest {
  id: number;
  itemName: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  reason: string;
  requestedBy: string;
  requestDate: string;
  status: RequestStatus;
}

// Sample locations
const locations = [
  "Main Warehouse",
  "IT Department",
  "Marketing Department",
  "Admin Office",
  "North Building",
  "South Building",
];

// Sample user
const currentUser = "John Doe";

// Sample stock requests
const initialStockRequests: StockRequest[] = [
  {
    id: 1,
    itemName: "Laptop",
    quantity: 5,
    fromLocation: "Main Warehouse",
    toLocation: "IT Department",
    reason: "New employees onboarding",
    requestedBy: "John Doe",
    requestDate: "2023-08-15",
    status: "approved",
  },
  {
    id: 2,
    itemName: "Office Chair",
    quantity: 10,
    fromLocation: "Main Warehouse",
    toLocation: "Marketing Department",
    reason: "Department expansion",
    requestedBy: "John Doe",
    requestDate: "2023-08-20",
    status: "pending",
  },
  {
    id: 3,
    itemName: "Whiteboard",
    quantity: 2,
    fromLocation: "Admin Office",
    toLocation: "IT Department",
    reason: "Team planning sessions",
    requestedBy: "Jane Smith",
    requestDate: "2023-08-22",
    status: "rejected",
  },
];

const StockRequests = () => {
  const { toast } = useToast();
  const { isAdmin, addNotification } = useUserRole();
  const [stockRequests, setStockRequests] = useState<StockRequest[]>(initialStockRequests);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<StockRequest | null>(null);

  // Set up form
  const form = useForm<StockRequestFormValues>({
    resolver: zodResolver(stockRequestSchema),
    defaultValues: {
      itemName: "",
      quantity: "",
      fromLocation: "",
      toLocation: "",
      reason: "",
    },
  });

  const onSubmit = (values: StockRequestFormValues) => {
    // Create new stock request
    const newRequest: StockRequest = {
      id: stockRequests.length + 1,
      itemName: values.itemName,
      quantity: Number(values.quantity),
      fromLocation: values.fromLocation,
      toLocation: values.toLocation,
      reason: values.reason,
      requestedBy: currentUser,
      requestDate: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    setStockRequests([...stockRequests, newRequest]);
    setIsCreateDialogOpen(false);
    form.reset();
    
    toast({
      title: "Stock Request Created",
      description: "Your request has been submitted and is pending approval.",
    });

    // Add notification for admins
    addNotification({
      message: `New stock request: ${values.quantity} ${values.itemName} from ${values.fromLocation} to ${values.toLocation}`,
      type: "stockRequest",
      details: { requestId: newRequest.id }
    });
  };

  const handleViewRequest = (request: StockRequest) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const handleApproveRequest = (id: number) => {
    setStockRequests(
      stockRequests.map((request) =>
        request.id === id ? { ...request, status: "approved" } : request
      )
    );
    setIsViewDialogOpen(false);
    
    toast({
      title: "Request Approved",
      description: "The stock request has been approved.",
    });
  };

  const handleRejectRequest = (id: number) => {
    setStockRequests(
      stockRequests.map((request) =>
        request.id === id ? { ...request, status: "rejected" } : request
      )
    );
    setIsViewDialogOpen(false);
    
    toast({
      title: "Request Rejected",
      description: "The stock request has been rejected.",
    });
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="error">Rejected</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Stock Requests"
        subtitle="Request and track stock movements"
        icon={<SendHorizontal className="h-6 w-6" />}
        actionLabel="New Request"
        onAction={() => setIsCreateDialogOpen(true)}
      />

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.itemName}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>{request.fromLocation}</TableCell>
                  <TableCell>{request.toLocation}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRequest(request)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Request Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Stock Request</DialogTitle>
            <DialogDescription>
              Submit a request to move stock between locations
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="itemName"
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
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="Enter quantity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fromLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="toLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Request</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explain why you need this stock movement" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stock Request Details</DialogTitle>
            <DialogDescription>
              View details for request #{selectedRequest?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Item</h4>
                  <p>{selectedRequest.itemName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Quantity</h4>
                  <p>{selectedRequest.quantity}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">From</h4>
                  <p>{selectedRequest.fromLocation}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">To</h4>
                  <p>{selectedRequest.toLocation}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Requested By</h4>
                  <p>{selectedRequest.requestedBy}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p>{selectedRequest.requestDate}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Reason</h4>
                  <p>{selectedRequest.reason}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2">
                {isAdmin && selectedRequest.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleRejectRequest(selectedRequest.id)}
                      className="gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApproveRequest(selectedRequest.id)}
                      className="gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                  </>
                )}
                {!isAdmin && selectedRequest.status === "pending" && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    Waiting for admin approval
                  </div>
                )}
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default StockRequests;

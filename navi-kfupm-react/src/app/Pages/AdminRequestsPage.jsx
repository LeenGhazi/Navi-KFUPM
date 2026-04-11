import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Badge } from '../Components/ui/badge';
import { ScrollArea } from '../Components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '../Components/ui/dialog';
import { Label } from '../Components/ui/label';
import { Textarea } from '../Components/ui/textarea';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
const mockRequests = [
    {
        id: 'req1',
        title: 'Update Library Operating Hours',
        description: 'The Central Library now operates 24/7 during exam season. Please update the operating hours.',
        requestType: 'Building Update',
        submittedBy: 'Dr. Ahmed Al-Mansour',
        submittedDate: '2026-02-25',
        status: 'Pending',
    },
    {
        id: 'req2',
        title: 'Add New Cafeteria Location',
        description: 'A new cafeteria has opened in Building 23. Please add it to the map with services and operating hours.',
        requestType: 'Map Data',
        submittedBy: 'Facilities Management',
        submittedDate: '2026-02-24',
        status: 'In Progress',
        notes: 'Gathering cafeteria details',
    },
    {
        id: 'req3',
        title: 'Update Prayer Room Locations',
        description: 'Two new prayer rooms have been added in the Engineering Complex. Update the map accordingly.',
        requestType: 'Building Update',
        submittedBy: 'Student Affairs Office',
        submittedDate: '2026-02-23',
        status: 'Completed',
        notes: 'Successfully added both prayer rooms',
    },
    {
        id: 'req4',
        title: 'Announcement: Campus Maintenance',
        description: 'Post announcement about scheduled maintenance work on the main water line affecting Buildings 10-15.',
        requestType: 'Announcement',
        submittedBy: 'Maintenance Department',
        submittedDate: '2026-02-20',
        status: 'Completed',
    },
];

{/* AdminRequestsPage component allows maintenance staff to view and manage update requests submitted by KFUPM administrators. */  }
export function AdminRequestsPage() {
    const { user } = useAuth();
    const [requests, setRequests] = useState(mockRequests);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [notes, setNotes] = useState('');
    if (!user || user.role !== 'maintenance_staff') {
        return <Navigate to="/" replace/>;
    }
    {/* Function to handle viewing the details of a specific request.  */  }
    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setNotes(request.notes || '');
        setShowDetailsDialog(true);
    };
    {/* Function to handle changing the status of a request. It updates the status in the local state and shows a success toast notification. */  }
    const handleStatusChange = (requestId, newStatus) => {
        setRequests(prev => prev.map(req => req.id === requestId
            ? { ...req, status: newStatus, notes: newStatus !== 'Pending' ? notes : req.notes }
            : req));
        toast.success(`Request status updated to ${newStatus}`);
        setShowDetailsDialog(false);
    };
    {/* Function to get the badge variant based on the request status. */  }
    const getStatusBadge =(status) => {
        const variants = {
            'Pending': { variant: 'outline', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
            'In Progress': { variant: 'outline', className: 'bg-blue-50 text-blue-700 border-blue-200' },
            'Completed': { variant: 'outline', className: 'bg-green-50 text-green-700 border-green-200' },
            'Rejected': { variant: 'outline', className: 'bg-red-50 text-red-700 border-red-200' },
        };
        return variants[status];
    };
    {/* Function to get the icon based on the request status. */  }
    const getStatusIcon =(status) => {
        const icons = {
            'Pending': Clock,
            'In Progress': Clock,
            'Completed': CheckCircle,
            'Rejected': XCircle,
        };
        const Icon = icons[status];
        return <Icon className="w-4 h-4"/>;
    };
    {/* Function to filter requests by status. */  }
    const filterRequestsByStatus = (status) => {
        if (!status)
            return requests;
        return requests.filter(req => req.status === status);
    };
    {/* RequestCard component represents a single request card in the list. It displays the request title, type, status, description, and submission details. Clicking on the card opens the details dialog. */  }
    const RequestCard = ({ request }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(request)}>
      <CardHeader>{/* Header section of the request card. It includes the request title, type, and a badge indicating the current status of the request. */  }
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{request.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4"/>
              <span>{request.requestType}</span>
            </div>
          </div>
          <Badge {...getStatusBadge(request.status)} className="flex items-center gap-1">
            {getStatusIcon(request.status)}
            {request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>{/* Content section of the request card. It includes a brief description of the request and details about who submitted it and when. */  }
        <p className="text-sm mb-3 line-clamp-2">{request.description}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Submitted by: {request.submittedBy}</span>
          <span>{new Date(request.submittedDate).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>);
    return (
    <div className="container mx-auto px-4 py-8">{/* Main container for the admin requests page with responsive padding. */  }
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Administrator Requests</h1>
        <p className="text-muted-foreground">
          Review and process update requests from KFUPM Administrators
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">{/* Tabs component to filter requests by their status. It includes triggers for "All Requests", "Pending", "In Progress", and "Completed". */  }
        <TabsList>
          <TabsTrigger value="all">
            All Requests ({requests.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({filterRequestsByStatus('Pending').length})
          </TabsTrigger>
          <TabsTrigger value="inProgress">
            In Progress ({filterRequestsByStatus('In Progress').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filterRequestsByStatus('Completed').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">{/* Content for the "All Requests" tab. It maps over all requests and renders a RequestCard for each one. */  }
          {requests.map(request => (<RequestCard key={request.id} request={request}/>))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterRequestsByStatus('Pending').map(request => (<RequestCard key={request.id} request={request}/>))}
        </TabsContent>

        <TabsContent value="inProgress" className="space-y-4">
          {filterRequestsByStatus('In Progress').map(request => (<RequestCard key={request.id} request={request}/>))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filterRequestsByStatus('Completed').map(request => (<RequestCard key={request.id} request={request}/>))}
        </TabsContent>
      </Tabs>

      {/* Dialog component to show the details of a selected request. It includes the request title, description, submission details, current status, and a section for admin notes and status updates. */  }
      {selectedRequest && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5"/>
                {selectedRequest.title}
              </DialogTitle>
              <DialogDescription>
                Request Details and Status Management
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh]">{/* Scrollable area for the request details. It includes sections for the request description, submission information, current status, 
            admin notes, and buttons to update the status of the request. */  }
              <div className="space-y-4">
                <div>
                  <Label>Request Type</Label>
                  <p className="text-sm mt-1">{selectedRequest.requestType}</p>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-sm mt-1">{selectedRequest.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Submitted By</Label>
                    <p className="text-sm mt-1">{selectedRequest.submittedBy}</p>
                  </div>
                  <div>
                    <Label>Submitted Date</Label>
                    <p className="text-sm mt-1">
                      {new Date(selectedRequest.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <Label>Current Status</Label>
                  <div className="mt-2">
                    <Badge {...getStatusBadge(selectedRequest.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(selectedRequest.status)}
                      {selectedRequest.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Admin Notes</Label>
                  <Textarea id="notes" placeholder="Add notes about this request..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-2"/>
                </div>

                <div className="space-y-2 pt-4">
                  <Label>Update Status</Label>
                  <div className="grid grid-cols-2 gap-2">{/* Buttons to update the status of the request. */  }
                    {selectedRequest.status === 'Pending' && (<Button onClick={() => handleStatusChange(selectedRequest.id, 'In Progress')} className="w-full">
                        Start Processing
                      </Button>)}
                    {(selectedRequest.status === 'Pending' || selectedRequest.status === 'In Progress') && (<>
                        <Button onClick={() => handleStatusChange(selectedRequest.id, 'Completed')} className="w-full bg-green-600 hover:bg-green-700">
                          Mark as Completed
                        </Button>
                        <Button onClick={() => handleStatusChange(selectedRequest.id, 'Rejected')} variant="destructive" className="w-full">
                          Reject Request
                        </Button>
                      </>)}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>)}
    </div>);
}

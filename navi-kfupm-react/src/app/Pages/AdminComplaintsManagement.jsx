import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import { Textarea } from '../Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../Components/ui/select';
import { Badge } from '../Components/ui/badge';
import { toast } from 'sonner';
import { MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';
const mockComplaints = [
    {
        id: '1',
        userId: 'user1',
        userName: 'Ahmed Ali',
        userEmail: 's202012345@kfupm.edu.sa',
        type: 'Technical Issue',
        title: 'Map not loading on mobile',
        description: 'The campus map fails to load on my iPhone. I tried multiple times but it shows a blank screen.',
        status: 'Submitted',
        createdAt: '2024-03-01T10:30:00',
    },
    {
        id: '2',
        userId: 'user2',
        userName: 'Mohammed Salem',
        userEmail: 's202098765@kfupm.edu.sa',
        type: 'Service Feedback',
        title: 'Incorrect building hours',
        description: 'The library hours shown on the map are outdated. It now closes at 10 PM, not 8 PM.',
        status: 'In Progress',
        createdAt: '2024-02-28T14:20:00',
        adminResponse: 'Thank you for reporting this. We are verifying the new hours with the library management.',
    },
    {
        id: '3',
        userId: 'user3',
        userName: 'Sara Hassan',
        userEmail: 's202011111@kfupm.edu.sa',
        type: 'Feature Request',
        title: 'Add parking availability status',
        description: 'It would be helpful to see real-time parking availability for each parking lot.',
        status: 'Resolved',
        createdAt: '2024-02-25T09:15:00',
        adminResponse: 'Great suggestion! We have forwarded this to the technical team for consideration in the next update.',
    },
];

export function AdminComplaintsManagement() {{/* AdminComplaintsManagement component allows administrators to view, filter, search, 
  and respond to user complaints. It uses mock data for complaints . */}
    const { user } = useAuth();
    const [complaints, setComplaints] = useState(mockComplaints);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [responseText, setResponseText] = useState('');
{/* Filter the complaints based on the selected status and search query. The filter checks if the complaint's status matches 
  the selected filter (or if 'all' is selected) and if the complaint's title, user name, or description includes the search query. */  }
    const filteredComplaints = complaints.filter((complaint) =>  {
        const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
        const matchesSearch = searchQuery === '' ||
            complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            complaint.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            complaint.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

{/* Handle updating the status of a complaint. This function updates the status of the specified complaint in the state and shows a success toast message. */  }
    const handleUpdateStatus = (complaintId, newStatus) => {
        setComplaints(complaints.map((c) => c.id === complaintId ? { ...c, status: newStatus } : c));
        toast.success(`Complaint status updated to ${newStatus}`);
    };

{/* Handle submitting a response to a complaint. This function updates the adminResponse and status of the specified complaint in the state, clears the response text, and shows a success toast message. */  }
    const handleSubmitResponse = (complaintId) => {
        
        setComplaints(complaints.map((c) => c.id === complaintId
            ? { ...c, adminResponse: responseText, status: 'In Progress' }
            : c));
        setResponseText('');
        toast.success('Response sent to user successfully');
    };
{/* Get the icon for a given status. */  }
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Submitted':
                return <Clock className="w-4 h-4"/>;
            case 'In Progress':
                return <MessageSquare className="w-4 h-4"/>;
            case 'Resolved':
                return <CheckCircle className="w-4 h-4"/>;
        }
    };
{/* Get the color classes for a given status. */  }
    const getStatusColor = (status) => {
        switch (status) {
            case 'Submitted':
                return 'bg-yellow-100 text-yellow-800';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            case 'Resolved':
                return 'bg-green-100 text-green-800';
        }
    };

    return (
    <div className="container mx-auto px-4 py-8 h-full overflow-auto">{/* Header section with title and description for the complaints management page. */  }
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Complaints Management</h1>
        <p className="text-muted-foreground">
          Review, respond to, and manage user feedback and complaints
        </p>
      </div>

      
      <Card className="mb-6">{/* Card component for the filters section. It contains a header with the title "Filters" and content with a status filter dropdown and a search input. */  }
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status-filter">Filter by Status</Label>

              <Select value={filterStatus} onValueChange={setFilterStatus}>{/* Dropdown select component for filtering complaints by status.
               It allows the admin to select from "All Complaints", "Submitted", "In Progress", and "Resolved". The selected value updates the filterStatus state. */  }
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Complaints</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">{/* Search input to filter complaints by title, user name, or description. It updates the searchQuery state on change. */  }
              <Label htmlFor="search">Search Complaints</Label>
              <Input id="search" placeholder="Search by title, user, or description..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            </div>
          </div>
        </CardContent>
      </Card>

      
      <div className="space-y-4">{/* Conditional rendering to display either a message when no complaints are found based on the filters, 
      or a list of cards for each filtered complaint. Each card displays the complaint details, admin response if available, and actions to update status and respond to the user. */  }
        {filteredComplaints.length === 0 ? (
          <Card>{/* Card component to display a message when no complaints are found based on the current filters. It shows an icon and the text "No complaints found". */  }
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4"/>
              <p className="text-muted-foreground">No complaints found</p>
            </CardContent>
          

          </Card>) : (filteredComplaints.map((complaint) => (<Card key={complaint.id}>{/* Card component for each complaint in the filtered list. */  }
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{complaint.title}</CardTitle>

                    <CardDescription className="mt-1">
                      {complaint.type} • By {complaint.userName} ({complaint.userEmail})
                    </CardDescription>

                    <CardDescription className="text-xs">
                      Submitted on {new Date(complaint.createdAt).toLocaleString()}
                    </CardDescription>
                  </div>

                  <Badge className={`gap-1 ${getStatusColor(complaint.status)}`}> 
                    {getStatusIcon(complaint.status)}
                    {complaint.status}
                  </Badge>

                </div>
              </CardHeader>
              <CardContent className="space-y-4">{/* Content section of the complaint card. It displays the description of the complaint.*/  }

                <div>
                  <Label className="text-sm font-semibold">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {complaint.description}
                  </p>
                </div>

                {/* If the admin has already responded to the complaint, display the response in a separate section with a muted background. */  }
                {complaint.adminResponse && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <Label className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4"/>
                      Your Response
                    </Label>
                    <p className="text-sm">{complaint.adminResponse}</p>
                  </div>)}

                {/* Section for the admin to write a response to the user and update the status of the complaint. */  }
                <div className="space-y-3 pt-2 border-t">
                  <div className="space-y-2">
                    <Label>Respond to User</Label>
                    <Textarea placeholder="Write your response to the user..." value={selectedComplaint?.id === complaint.id ? responseText : ''} onChange={(e) => {
                setSelectedComplaint(complaint);
                setResponseText(e.target.value);
            }} rows={3}/>
                  </div>

                  <div className="flex items-center justify-between gap-2">{/* Dropdown select component for updating the status of the complaint. It allows the admin to select from "Submitted", "In Progress", and "Resolved". */  }
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Update Status:</Label>
                      
                      <Select value={complaint.status} onValueChange={(value) => handleUpdateStatus(complaint.id, value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Submitted">Submitted</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Button to submit the response to the user. It is disabled if there is no response text or if the selected complaint does not match the current complaint. */  }
                    <Button onClick={() => handleSubmitResponse(complaint.id)} disabled={!responseText.trim() || selectedComplaint?.id !== complaint.id}>
                      <Send className="w-4 h-4 mr-2"/>
                      Send Response
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>)))}
      </div>
    </div>);
}

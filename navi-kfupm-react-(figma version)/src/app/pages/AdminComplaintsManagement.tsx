import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';
import { MessageSquare, Send, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: string;
  title: string;
  description: string;
  status: 'Submitted' | 'In Progress' | 'Resolved';
  createdAt: string;
  adminResponse?: string;
}

const mockComplaints: Complaint[] = [
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

export function AdminComplaintsManagement() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [responseText, setResponseText] = useState('');

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (complaintId: string, newStatus: Complaint['status']) => {
    setComplaints(
      complaints.map((c) =>
        c.id === complaintId ? { ...c, status: newStatus } : c
      )
    );
    toast.success(`Complaint status updated to ${newStatus}`);
  };

  const handleSubmitResponse = (complaintId: string) => {
    if (!responseText.trim()) {
      toast.error('Please write a response');
      return;
    }

    setComplaints(
      complaints.map((c) =>
        c.id === complaintId
          ? { ...c, adminResponse: responseText, status: 'In Progress' }
          : c
      )
    );

    setResponseText('');
    toast.success('Response sent to user successfully');
  };

  const getStatusIcon = (status: Complaint['status']) => {
    switch (status) {
      case 'Submitted':
        return <Clock className="w-4 h-4" />;
      case 'In Progress':
        return <MessageSquare className="w-4 h-4" />;
      case 'Resolved':
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Complaint['status']) => {
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
    <div className="container mx-auto px-4 py-8 h-full overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Complaints Management</h1>
        <p className="text-muted-foreground">
          Review, respond to, and manage user feedback and complaints
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
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

            <div className="space-y-2">
              <Label htmlFor="search">Search Complaints</Label>
              <Input
                id="search"
                placeholder="Search by title, user, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No complaints found</p>
            </CardContent>
          </Card>
        ) : (
          filteredComplaints.map((complaint) => (
            <Card key={complaint.id}>
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
              <CardContent className="space-y-4">
                {/* Complaint Description */}
                <div>
                  <Label className="text-sm font-semibold">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {complaint.description}
                  </p>
                </div>

                {/* Admin Response (if exists) */}
                {complaint.adminResponse && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <Label className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4" />
                      Your Response
                    </Label>
                    <p className="text-sm">{complaint.adminResponse}</p>
                  </div>
                )}

                {/* Response Form */}
                <div className="space-y-3 pt-2 border-t">
                  <div className="space-y-2">
                    <Label>Respond to User</Label>
                    <Textarea
                      placeholder="Write your response to the user..."
                      value={selectedComplaint?.id === complaint.id ? responseText : ''}
                      onChange={(e) => {
                        setSelectedComplaint(complaint);
                        setResponseText(e.target.value);
                      }}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Update Status:</Label>
                      <Select
                        value={complaint.status}
                        onValueChange={(value) =>
                          handleUpdateStatus(complaint.id, value as Complaint['status'])
                        }
                      >
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

                    <Button
                      onClick={() => handleSubmitResponse(complaint.id)}
                      disabled={!responseText.trim() || selectedComplaint?.id !== complaint.id}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Response
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

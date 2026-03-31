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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { toast } from 'sonner';
import { FileText, Send, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

interface Request {
  id: string;
  type: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected';
  createdAt: string;
  adminResponse?: string;
  adminName: string;
}

const mockRequests: Request[] = [
  {
    id: '1',
    type: 'Building Service Update',
    title: 'Update Library Operating Hours',
    description: 'Please update the library hours to 24/7 during exam week',
    status: 'In Progress',
    createdAt: '2024-02-28',
    adminResponse: 'Technical team is reviewing the request. Expected completion by March 5th.',
    adminName: 'Admin User',
  },
  {
    id: '2',
    type: 'Announcement Add',
    title: 'Add Spring Registration Announcement',
    description: 'New announcement for spring semester registration dates',
    status: 'Completed',
    createdAt: '2024-02-25',
    adminResponse: 'Announcement has been added to the system successfully.',
    adminName: 'Admin User',
  },
];

export function AdminRequestsToTechPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [activeTab, setActiveTab] = useState('submit');
  
  // Form state
  const [requestType, setRequestType] = useState('');
  const [customRequestType, setCustomRequestType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [affectedServices, setAffectedServices] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [contacts, setContacts] = useState('');
  const [attachments, setAttachments] = useState('');

  const requestTypes = [
    'Campus Route Add/Update/Delete',
    'Campus Building Service Add/Update/Delete',
    'Bus Routes/Schedule Update',
    'Announcement Add/Edit/Delete',
    'Community Path Approval/Removal',
    'Hide/Delete a Comment/Rating',
    'Discuss/Resolve a Complaint',
    'Others (Please Specify)',
  ];

  const handleSubmitRequest = () => {
    if (!requestType || !title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate custom request type when "Others" is selected
    if (requestType === 'Others (Please Specify)' && !customRequestType.trim()) {
      toast.error('Please specify your custom request type');
      return;
    }

    const newRequest: Request = {
      id: `req${Date.now()}`,
      type: requestType === 'Others (Please Specify)' ? customRequestType : requestType,
      title,
      description,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
      adminName: user?.name || 'Admin',
    };

    setRequests([newRequest, ...requests]);
    
    // Reset form
    setRequestType('');
    setCustomRequestType('');
    setTitle('');
    setDescription('');
    setAffectedServices('');
    setCategory('');
    setLocation('');
    setWorkingHours('');
    setContacts('');
    setAttachments('');

    toast.success('Request submitted successfully! Technical team will review it soon.');
    setActiveTab('my-requests');
  };

  const handleAddComment = (requestId: string) => {
    toast.success('Follow-up comment added. Technical team has been notified.');
  };

  const getStatusIcon = (status: Request['status']) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'In Progress':
        return <MessageSquare className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-full overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Requests to Technical Team</h1>
        <p className="text-muted-foreground">
          Submit and track requests for campus updates and changes
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="submit">Submit Request</TabsTrigger>
          <TabsTrigger value="my-requests">My Requests ({requests.length})</TabsTrigger>
        </TabsList>

        {/* Submit Request Tab */}
        <TabsContent value="submit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Submit New Request
              </CardTitle>
              <CardDescription>
                Request updates about campus data, routes, buildings, announcements, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="request-type">Request Type *</Label>
                <Select value={requestType} onValueChange={setRequestType}>
                  <SelectTrigger id="request-type">
                    <SelectValue placeholder="Select request type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {requestTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {requestType === 'Others (Please Specify)' && (
                <div className="space-y-2">
                  <Label htmlFor="custom-request-type">Specify Request Type *</Label>
                  <Input
                    id="custom-request-type"
                    placeholder="Enter your custom request type..."
                    value={customRequestType}
                    onChange={(e) => setCustomRequestType(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Request Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief title for your request..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of your request..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="affected-services">Affected Services</Label>
                  <Input
                    id="affected-services"
                    placeholder="e.g., Library, Cafeteria"
                    value={affectedServices}
                    onChange={(e) => setAffectedServices(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Academic, Dining"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Building or area name"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="working-hours">Working Hours</Label>
                  <Input
                    id="working-hours"
                    placeholder="e.g., 8:00 AM - 5:00 PM"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contacts">Contact Information</Label>
                  <Input
                    id="contacts"
                    placeholder="Phone or email"
                    value={contacts}
                    onChange={(e) => setContacts(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments/Links</Label>
                  <Input
                    id="attachments"
                    placeholder="URLs or file references"
                    value={attachments}
                    onChange={(e) => setAttachments(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  onClick={handleSubmitRequest}
                  disabled={!requestType || !title.trim() || !description.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Requests Tab */}
        <TabsContent value="my-requests">
          <div className="space-y-4">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No requests submitted yet</p>
                </CardContent>
              </Card>
            ) : (
              requests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {request.type} • Submitted on {new Date(request.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={`gap-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">Description</Label>
                      <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
                    </div>

                    {request.adminResponse && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <Label className="text-sm font-semibold flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4" />
                          Technical Team Response
                        </Label>
                        <p className="text-sm">{request.adminResponse}</p>
                      </div>
                    )}

                    {request.status !== 'Completed' && request.status !== 'Rejected' && (
                      <div className="flex items-center gap-2 pt-2">
                        <Input placeholder="Add a follow-up comment or clarification..." />
                        <Button
                          size="sm"
                          onClick={() => handleAddComment(request.id)}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
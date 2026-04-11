import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Badge } from '../Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Components/ui/tabs';
import { ScrollArea } from '../Components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '../Components/ui/dialog';
import { Label } from '../Components/ui/label';
import { Textarea } from '../Components/ui/textarea';
import { MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
const mockFeedback = [
    {
        id: 'fb1',
        title: 'Map Loading Performance Issue',
        description: 'The campus map takes too long to load on mobile devices, especially with bus routes enabled. This affects usability during peak hours.',
        category: 'Performance',
        priority: 'High',
        submittedBy: 'Ahmed Al-Zahrani (student@kfupm.edu.sa)',
        submittedDate: '2026-02-26',
        status: 'Pending',
    },
    {
        id: 'fb2',
        title: 'Incorrect Building Hours',
        description: 'The Central Library shows old operating hours. It now operates 24/7 during exam season but the app still shows 8 AM - 10 PM.',
        category: 'Data Accuracy',
        priority: 'Medium',
        submittedBy: 'Sara Mohammed (sara.m@kfupm.edu.sa)',
        submittedDate: '2026-02-25',
        status: 'In Progress',
        adminNotes: 'Coordinating with library administration for updated schedule',
    },
    {
        id: 'fb3',
        title: 'Route Planner Not Working',
        description: 'When trying to plan a route from Dorms to Engineering Complex, the app crashes. This happens consistently.',
        category: 'Technical Issue',
        priority: 'Critical',
        submittedBy: 'Omar Al-Rasheed (omar.r@kfupm.edu.sa)',
        submittedDate: '2026-02-24',
        status: 'Resolved',
        adminNotes: 'Fixed routing algorithm bug in version 1.2.1',
    },
    {
        id: 'fb4',
        title: 'Add Prayer Time Notifications',
        description: 'It would be helpful if the app could send prayer time notifications based on the nearest prayer room location.',
        category: 'Feature Request',
        priority: 'Low',
        submittedBy: 'Mohammed Al-Otaibi (m.otaibi@kfupm.edu.sa)',
        submittedDate: '2026-02-23',
        status: 'Pending',
    },
    {
        id: 'fb5',
        title: 'Dark Mode Text Visibility',
        description: 'Some text in dark mode is hard to read, especially on the announcements page. Consider improving contrast.',
        category: 'Technical Issue',
        priority: 'Medium',
        submittedBy: 'Fatima Al-Ghamdi (f.ghamdi@kfupm.edu.sa)',
        submittedDate: '2026-02-22',
        status: 'Resolved',
        adminNotes: 'Updated color scheme for better accessibility',
    },
];
{/* FeedbackManagementPage component allows maintenance staff to view and manage user feedback.  */  }
export function FeedbackManagementPage() {
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState(mockFeedback);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    if (!user || user.role !== 'maintenance_staff') {
        return <Navigate to="/" replace/>;
    }
    {/* Handler function to view feedback details. It sets the selected feedback, populates admin notes if available, and opens the details dialog. */  }
    const handleViewDetails = (feedback) => {
        setSelectedFeedback(feedback);
        setAdminNotes(feedback.adminNotes || '');
        setShowDetailsDialog(true);
    };
    {/* Handler function to update the status of a feedback item. It updates the feedbacks state with the new status and admin notes, shows a success toast, and closes the details dialog. */  }
    const handleUpdateStatus = (feedbackId, newStatus) => {
        setFeedbacks(prev => prev.map(fb => fb.id === feedbackId
            ? { ...fb, status: newStatus, adminNotes: adminNotes || fb.adminNotes }
            : fb));
        toast.success(`Feedback status updated to ${newStatus}`);
        setShowDetailsDialog(false);
    };
    {/* function to get the appropriate badge styling based on feedback priority. It returns different background and text colors for Low, Medium, High, and Critical priorities. */  }
    const getPriorityBadge = (priority) => {
        const variants = {
            'Low': { className: 'bg-gray-100 text-gray-700' },
            'Medium': { className: 'bg-blue-100 text-blue-700' },
            'High': { className: 'bg-orange-100 text-orange-700' },
            'Critical': { className: 'bg-red-100 text-red-700' },
        };
        return variants[priority];
    };
    {/* function to get the appropriate badge styling based on feedback status. */  }
    const getStatusBadge = (status) => {
        const variants = {
            'Pending': { variant: 'outline', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
            'In Progress': { variant: 'outline', className: 'bg-blue-50 text-blue-700 border-blue-200' },
            'Resolved': { variant: 'outline', className: 'bg-green-50 text-green-700 border-green-200' },
        };
        return variants[status];
    };
    {/* function to get the appropriate icon based on feedback status. */  }
    const getStatusIcon = (status) => {
        const icons = {
            'Pending': Clock,
            'In Progress': AlertCircle,
            'Resolved': CheckCircle,
        };
        const Icon = icons[status];
        return <Icon className="w-4 h-4"/>;
    };
    {/* function to filter feedback by status. */  }
    const filterFeedbackByStatus = (status) => {
        if (!status)
            return feedbacks;
        return feedbacks.filter(fb => fb.status === status);
    };
    {/* FeedbackCard component represents a single feedback item. It displays the feedback title, category, priority, status, description, and submission details. */  }
    const FeedbackCard = ({ feedback }) => (<Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(feedback)}>
      <CardHeader>{/* Header section of the feedback card, showing the title, category, priority, and status. The status is displayed as a badge with an icon. */  }
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{feedback.title}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{feedback.category}</Badge>
              <Badge {...getPriorityBadge(feedback.priority)}>
                {feedback.priority} Priority
              </Badge>
            </div>
          </div>
          <Badge {...getStatusBadge(feedback.status)} className="flex items-center gap-1">
            {getStatusIcon(feedback.status)}
            {feedback.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>{/* Content section of the feedback card, showing the description and submission details. The description is truncated to 2 lines for better readability. */  }
        <Label>Description</Label>
        <p className="text-sm mb-3 line-clamp-2">{feedback.description}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{feedback.submittedBy}</span>
          <span>{new Date(feedback.submittedDate).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>);
    return (
    <div className="container mx-auto px-4 py-8">{/* Main container for the feedback management page with padding.
     It includes a header section with a title and description. */  }
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feedback Management</h1>
        <p className="text-muted-foreground">
          Review and respond to user feedback about application performance and issues
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">{/* Tabs component to switch between different feedback status categories (All, Pending, In Progress, Resolved).  */  }
        <TabsList>
          <TabsTrigger value="all">
            All Feedback ({feedbacks.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({filterFeedbackByStatus('Pending').length})
          </TabsTrigger>
          <TabsTrigger value="inProgress">
            In Progress ({filterFeedbackByStatus('In Progress').length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({filterFeedbackByStatus('Resolved').length})
          </TabsTrigger>
        </TabsList>
        {/* TabsContent for each feedback status category. It maps over the filtered feedbacks and renders a FeedbackCard for each item. If there are no feedbacks in a category, it will simply show an empty state. */  }

        <TabsContent value="all" className="space-y-4">
          {feedbacks.map(feedback => (<FeedbackCard key={feedback.id} feedback={feedback}/>))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterFeedbackByStatus('Pending').map(feedback => (<FeedbackCard key={feedback.id} feedback={feedback}/>))}
        </TabsContent>

        <TabsContent value="inProgress" className="space-y-4">
          {filterFeedbackByStatus('In Progress').map(feedback => (<FeedbackCard key={feedback.id} feedback={feedback}/>))}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {filterFeedbackByStatus('Resolved').map(feedback => (<FeedbackCard key={feedback.id} feedback={feedback}/>))}
        </TabsContent>
      </Tabs>

      
      {selectedFeedback && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>{/* Dialog component to show the details of a selected feedback item. 
        It includes the feedback title, category, priority, status, description, submission details, and admin notes. It also provides buttons to update the feedback status. */  }
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5"/>
                {selectedFeedback.title}
              </DialogTitle>
              <DialogDescription>
                Feedback Details and Status Management
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh]">{/* ScrollArea to allow scrolling through feedback details if the content exceeds the maximum height. */  }
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="outline">{selectedFeedback.category}</Badge>
                  <Badge {...getPriorityBadge(selectedFeedback.priority)}>
                    {selectedFeedback.priority} Priority
                  </Badge>
                  <Badge {...getStatusBadge(selectedFeedback.status)} className="flex items-center gap-1">
                    {getStatusIcon(selectedFeedback.status)}
                    {selectedFeedback.status}
                  </Badge>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-sm mt-1">{selectedFeedback.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Submitted By</Label>
                    <p className="text-sm mt-1">{selectedFeedback.submittedBy}</p>
                  </div>
                  <div>
                    <Label>Submitted Date</Label>
                    <p className="text-sm mt-1">
                      {new Date(selectedFeedback.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>{/* Admin notes section where maintenance staff can add or update notes related to the feedback. It includes a textarea for inputting notes. */  }
                  <Label htmlFor="admin-notes">Admin Notes</Label>
                  <Textarea id="admin-notes" placeholder="Add notes about this feedback..." value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={3} className="mt-2"/>
                </div>

                <div className="space-y-2 pt-4">
                  <Label>Update Status</Label>
                  <div className="grid grid-cols-3 gap-2">{/* Buttons to update the feedback status. Depending on the current status, it shows options to change to "In Progress" or "Resolved". Clicking a button will call the handleUpdateStatus function with the respective status. */  }
                    {selectedFeedback.status !== 'In Progress' && (<Button onClick={() => handleUpdateStatus(selectedFeedback.id, 'In Progress')} variant="outline" className="w-full">
                        In Progress
                      </Button>)}{/* Show "In Progress" button if the current status is not already "In Progress". */  }
                    {selectedFeedback.status !== 'Resolved' && (<Button onClick={() => handleUpdateStatus(selectedFeedback.id, 'Resolved')} className="w-full bg-green-600 hover:bg-green-700">
                        Mark Resolved
                      </Button>)}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>)}
    </div>);
}

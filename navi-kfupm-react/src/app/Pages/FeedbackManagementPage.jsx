import React, { useEffect, useState } from 'react';
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
{/* FeedbackManagementPage component allows maintenance staff to view and manage user feedback.  */  }
export function FeedbackManagementPage() {
    const { user } = useAuth();
    const [feedback, setFeedback] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    useEffect(() => {
      const fetchFeedback = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/feedback`);
          const data = await res.json();
          setFeedback(data);
        } catch (error) {
          console.error(error);
          toast.error("Failed to load feedback");
        }
      };

      fetchFeedback();
    }, []);
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
    const handleUpdateStatus = async (feedbackId, newStatus) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/feedback/${feedbackId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus.toLowerCase(),
          }),
        });

        const updated = await res.json();

        setFeedback(prev =>
          prev.map(fb => fb._id === feedbackId ? updated : fb)
        );

        toast.success(`Feedback updated to ${newStatus}`);
        setShowDetailsDialog(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to update feedback");
      }
    };
    {/* function to get the appropriate badge styling based on feedback status. */  }
    const getStatusBadge = (status) => {
        const variants = {
            'pending': { variant: 'outline', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
            'resolved': { variant: 'outline', className: 'bg-green-50 text-green-700 border-green-200' },
        };
        return variants[status];
    };
    {/* function to get the appropriate icon based on feedback status. */  }
    const getStatusIcon = (status) => {
        const icons = {
            'pending': Clock,
            'resolved': CheckCircle,
        };
        const Icon = icons[status];
        return <Icon className="w-4 h-4"/>;
    };
    {/* function to filter feedback by status. */  }
    const filterFeedbackByStatus = (status) => {
        if (!status)
            return feedback;
        return feedback.filter(fb => fb.status === status);
    };
    {/* FeedbackCard component represents a single feedback item. It displays the feedback title, category, priority, status, description, and submission details. */  }
    const FeedbackCard = ({ feedback }) => (<Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(feedback)}>
      <CardHeader>{/* Header section of the feedback card, showing the title, category, priority, and status. The status is displayed as a badge with an icon. */  }
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{feedback.category}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{feedback.category}</Badge>
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
        <p className="text-sm mb-3 line-clamp-2">{feedback.message}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{feedback.userName}</span>
          <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
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

      <Tabs defaultValue="all" className="space-y-6">{/* Tabs component to switch between different feedback status categories (All, Pending, In Resolved).  */  }
        <TabsList>
          <TabsTrigger value="all">
            All Feedback ({feedback.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({filterFeedbackByStatus('pending').length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({filterFeedbackByStatus('resolved').length})
          </TabsTrigger>
        </TabsList>
        {/* TabsContent for each feedback status category. It maps over the filtered feedbacks and renders a FeedbackCard for each item. If there are no feedbacks in a category, it will simply show an empty state. */  }

        <TabsContent value="all" className="space-y-4">
          {feedback.map(feedback => (<FeedbackCard key={feedback._id} feedback={feedback}/>))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterFeedbackByStatus('pending').map(feedback => (<FeedbackCard key={feedback._id} feedback={feedback}/>))}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {filterFeedbackByStatus('resolved').map(feedback => (<FeedbackCard key={feedback._id} feedback={feedback}/>))}
        </TabsContent>
      </Tabs>

      
      {selectedFeedback && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>{/* Dialog component to show the details of a selected feedback item. 
        It includes the feedback title, category, status, description, submission details, and admin notes. It also provides buttons to update the feedback status. */  }
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5"/>
                {selectedFeedback.category}
              </DialogTitle>
              <DialogDescription>
                Feedback Details and Status Management
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh]">{/* ScrollArea to allow scrolling through feedback details if the content exceeds the maximum height. */  }
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="outline">{selectedFeedback.category}</Badge>
                  <Badge {...getStatusBadge(selectedFeedback.status)} className="flex items-center gap-1">
                    {getStatusIcon(selectedFeedback.status)}
                    {selectedFeedback.status}
                  </Badge>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-sm mt-1">{selectedFeedback.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Submitted By</Label>
                    <p className="text-sm mt-1">{selectedFeedback.userName}</p>
                  </div>
                  <div>
                    <Label>Submitted Date</Label>
                    <p className="text-sm mt-1">
                      {new Date(selectedFeedback.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>{/* Admin notes section where maintenance staff can add or update notes related to the feedback. It includes a textarea for inputting notes. */  }
                  <Label htmlFor="admin-notes">Admin Notes</Label>
                  <Textarea id="admin-notes" placeholder="Add notes about this feedback..." value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={3} className="mt-2"/>
                </div>

                <div className="space-y-2 pt-4">
                  <Label>Update Status</Label>
                  <div className="grid grid-cols-3 gap-2">{/* Buttons to update the feedback status. Depending on the current status, or "Resolved". Clicking a button will call the handleUpdateStatus function with the respective status. */  }
                    {selectedFeedback.status !== 'resolved' && (<Button onClick={() => handleUpdateStatus(selectedFeedback._id, 'resolved')} className="w-full bg-green-600 hover:bg-green-700">
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

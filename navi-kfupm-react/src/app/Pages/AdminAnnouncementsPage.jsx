import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import { Textarea } from '../Components/ui/textarea';
import { Badge } from '../Components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '../Components/ui/dialog';
import { Bell, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
const mockAnnouncements = [
    {
        id: 'ann1',
        title: 'Campus Maintenance Schedule',
        content: 'Scheduled maintenance work on the main water line will affect Buildings 10-15 from February 28 to March 2. Please plan accordingly.',
        date: '2026-02-25',
        author: 'Admin',
        priority: 'High',
    },
    {
        id: 'ann2',
        title: 'New Cafeteria Opening',
        content: 'A new cafeteria has opened in Building 23, offering a variety of meals and snacks. Operating hours: 7:00 AM - 9:00 PM.',
        date: '2026-02-24',
        author: 'Admin',
        priority: 'Medium',
    },
    {
        id: 'ann3',
        title: 'Extended Library Hours During Exams',
        content: 'The Central Library will operate 24/7 starting March 1 throughout the exam period to support students.',
        date: '2026-02-23',
        author: 'Admin',
        priority: 'High',
    },
    {
        id: 'ann4',
        title: 'Bus Route Schedule Update',
        content: 'New bus route schedules are now available. Check the Bus Routes page for updated timings and stops.',
        date: '2026-02-20',
        author: 'Admin',
        priority: 'Low',
    },
];
export function AdminAnnouncementsPage() { {/* This page allows maintenance staff to manage campus announcements. */  }
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState(mockAnnouncements);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        priority: 'Medium',
    });
    {/* Only maintenance staff can access this page. Redirect others to home. */  }
    if (!user || user.role !== 'maintenance_staff') {
        return <Navigate to="/" replace/>;
    }
    {/* Handlers for adding, editing, and deleting announcements. These update the local state and show success/error toasts. */  }
    const handleAddAnnouncement = () => {
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('Please fill in all fields');
            return;
        }
        {/* Create a new announcement object with a unique ID and current date. */  }
        const newAnnouncement = {
            id: `ann${Date.now()}`,
            title: formData.title,
            content: formData.content,
            date: new Date().toISOString().split('T')[0],
            author: user.name,
            priority: formData.priority,
        };
        {/* Add the new announcement to the top of the list and show a success message. */  }
        setAnnouncements([newAnnouncement, ...announcements]);
        toast.success('Announcement published successfully!');
        resetForm();
        setShowAddDialog(false);
    };
    {/* When editing, we check if an announcement is selected and if the form fields are filled. We then update the announcement in the list and show a success message. */  }
    const handleEditAnnouncement = () => {
        if (!selectedAnnouncement || !formData.title.trim() || !formData.content.trim()) {
            toast.error('Please fill in all fields');
            return;
        }
        {/* Update the selected announcement with the new form data. */  }
        setAnnouncements(prev => prev.map(ann => ann.id === selectedAnnouncement.id
            ? { ...ann, title: formData.title, content: formData.content, priority: formData.priority }
            : ann));
        toast.success('Announcement updated successfully!');
        resetForm();
        setShowEditDialog(false);
        setSelectedAnnouncement(null);
    };
    {/* For deletion, we confirm that an announcement is selected, then remove it from the list and show a success message. */  }
    const handleDeleteAnnouncement = () => {
        if (!selectedAnnouncement)
            return;
        setAnnouncements(prev => prev.filter(ann => ann.id !== selectedAnnouncement.id));
        toast.success('Announcement deleted successfully!');
        setShowDeleteDialog(false);
        setSelectedAnnouncement(null);
    };
    
    const openEditDialog = (announcement) => {
        setSelectedAnnouncement(announcement);
        setFormData({
            title: announcement.title,
            content: announcement.content,
            priority: announcement.priority,
        });
        setShowEditDialog(true);
    };
    {/* When the delete button is clicked, we set the selected announcement and open the delete confirmation dialog. */  }
    const openDeleteDialog = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowDeleteDialog(true);
    };
    {/* This function resets the form data to its initial state. It's called after adding or editing an announcement to clear the form fields. */  }
    const resetForm = () => {
        setFormData({ title: '', content: '', priority: '' });
    };
    {/* This function returns the appropriate badge styles based on the announcement's priority level.  */  }
    const getPriorityBadge = (priority) => {
        const variants = {
            'Low': { className: 'bg-gray-100 text-gray-700' },
            'Medium': { className: 'bg-blue-100 text-blue-700' },
            'High': { className: 'bg-red-100 text-red-700' },
        };
        return variants[priority];
    };
    return (
    <div className="container mx-auto px-4 py-8">{/* Header section with title, description, and add announcement button. */  }
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Announcements Management</h1>
          <p className="text-muted-foreground">
            Add, edit, and delete campus announcements
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2"/>
          Add New Announcement
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">{/* List of announcements displayed as cards. Each card shows the title, content, author, date, and priority. */  }
        {announcements.map((announcement) => (<Card key={announcement.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">{/* Left side of the card header with announcement title and priority. */  }
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-5 h-5 text-primary"/>
                    <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge {...getPriorityBadge(announcement.priority)}>
                      {announcement.priority} Priority
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4"/>
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">{}
                  <Button size="icon" variant="ghost" onClick={() => openEditDialog(announcement)}>
                    <Edit className="w-4 h-4"/>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => openDeleteDialog(announcement)}>
                    <Trash2 className="w-4 h-4 text-red-600"/>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>{/* Announcement content and author information. */  }
              <p className="text-sm">{announcement.content}</p>
              <p className="text-xs text-muted-foreground mt-3">
                Posted by: {announcement.author}
              </p>
            </CardContent>
          </Card>))}
      </div>

      {/* Add Announcement Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>{/* This dialog contains a form for adding a new announcement.  */  }
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>{/* Dialog header with title and description. */  }
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5"/>
              Add New Announcement
            </DialogTitle>
            <DialogDescription>
              Create a new campus announcement for all users
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">{/* Form fields for announcement title, content, and priority. */  }
            <div className="space-y-2">
              <Label htmlFor="title">Announcement Title *</Label>
              {/* Input field for the announcement title. The value is linked to formData.title and updates on change. */  }
              <Input id="title" placeholder="e.g., Campus Maintenance Schedule" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Announcement Content *</Label>
              {/* Textarea for the announcement content. The value is linked to formData.content and updates on change. */  }
              <Textarea id="content" placeholder="Enter the announcement details..." value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={5}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <div className="flex gap-2">
                {/* Priority buttons for selecting the announcement priority. */  }
                {['Low', 'Medium', 'High'].map((priority) => (<Button key={priority} type="button" variant={formData.priority === priority ? 'default' : 'outline'} onClick={() => setFormData({ ...formData, priority })} className="flex-1">
                    {priority}
                  </Button>))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">{/* Action buttons for publishing the announcement or canceling. */  }
              <Button onClick={handleAddAnnouncement} className="flex-1">
                Publish Announcement
              </Button>
              <Button variant="outline" onClick={() => {
            resetForm();
            setShowAddDialog(false);
        }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>{/* This dialog is similar to the add dialog but is pre-filled with the selected announcement's data for editing. */  }
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5"/>
              Edit Announcement
            </DialogTitle>
            <DialogDescription>
              Update the announcement details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Announcement Title *</Label>
              <Input id="edit-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-content">Announcement Content *</Label>
              <Textarea id="edit-content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={5}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map((priority) => (<Button key={priority} type="button" variant={formData.priority === priority ? 'default' : 'outline'} onClick={() => setFormData({ ...formData, priority })} className="flex-1">
                    {priority}
                  </Button>))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">{/* Action buttons for saving changes or canceling the edit. */  }
              <Button onClick={handleEditAnnouncement} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => {
            resetForm();{/* Reset the form data to clear the fields. */  }
            setShowEditDialog(false);{/* Close the edit dialog. */  }
            setSelectedAnnouncement(null);{/* Clear the selected announcement because if we did not it would still be selected. */  }
        }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>{/* This dialog confirms if the user really wants to delete the selected announcement.it is similar to the edit dialog but with a delete action. */  }
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600"/>
              Delete Announcement
            </DialogTitle>
            <DialogDescription>{/* Warning message about deletion. */ }
              Are you sure you want to delete this announcement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {/* Display the selected announcement's title and content for confirmation before deletion. */ }
          {selectedAnnouncement && (
            <div className="space-y-4">
              <Card className="p-4 bg-muted">
                <h4 className="font-semibold mb-2">{selectedAnnouncement.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {selectedAnnouncement.content}
                </p>
              </Card>

              <div className="flex gap-2">
                <Button onClick={handleDeleteAnnouncement} variant="destructive" className="flex-1">
                  Delete
                </Button>
                <Button variant="outline" onClick={() => {
                setShowDeleteDialog(false);
                setSelectedAnnouncement(null);
            }} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>)}
        </DialogContent>
      </Dialog>
    </div>);
}

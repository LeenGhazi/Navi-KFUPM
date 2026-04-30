import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Components/ui/card';
import { Badge } from '../Components/ui/badge';
import { ScrollArea } from '../Components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Components/ui/tabs';
import { Button } from '../Components/ui/button';
import { Textarea } from '../Components/ui/textarea';
import { Label } from '../Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../Components/ui/select';
import { AlertCircle, Clock, CheckCircle, User, Plus } from 'lucide-react';
import { toast } from 'sonner';
// complaints panel for all users to view and manage their complaints. 
// Admins can view all complaints and assign them to maintenance staff. 
// Maintenance staff can update the status of assigned complaints.
export function ComplaintsPanel() {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState('');
    const [notes, setNotes] = useState('');
    const [showAddComplaint, setShowAddComplaint] = useState(false);
    const [newComplaint, setNewComplaint] = useState({
        locationId: '',
        category: '',
        description: '',
    });
    useEffect(() => {
      const fetchData = async () => {
        try {
          const complaintsRes = await fetch("http://localhost:5000/api/complaints");
          const locationsRes = await fetch("http://localhost:5000/api/buildings");

          const complaintsData = await complaintsRes.json();
          const locationsData = await locationsRes.json();

          setComplaints(complaintsData);
          setLocations(locationsData);
        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Failed to load complaints data");
        }
      };

      fetchData();
      }, []);
    // filter complaints from the users
    const userComplaints = user
        ? complaints.filter((c) => c.userId === user.id)
        : [];
    const assignedComplaints = user && user.role === 'maintenance_staff'
        ? complaints.filter((c) => c.assignedTo === user.id)
        : [];
    const allComplaintsForAdmin = user && user.role === 'admin'
        ? complaints
        : [];
    // return icon based on the complaint status
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500"/>;
            case 'in_progress':
                return <AlertCircle className="w-4 h-4 text-blue-500"/>;
            case 'resolved':
                return <CheckCircle className="w-4 h-4 text-green-500"/>;
            default:
                return <Clock className="w-4 h-4"/>;
        }
    };
    // based on teh complaint status return badge variant
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'pending':
                return 'secondary';
            case 'in_progress':
                return 'default';
            case 'resolved':
                return 'outline';
            default:
                return 'secondary';
        }
    };
    // this is for maintenance staff to update the status of a complaint and add notes. 
    // It updates the complaints state with the new status and notes, and shows a success toast message. 
    // After updating, it clears the selected complaint and notes.
    const handleUpdateStatus = async (complaintId, newStatus) => {
      try {
        const response = await fetch(`http://localhost:5000/api/complaints/${complaintId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            notes,
          }),
        });

        const updatedComplaint = await response.json();

        setComplaints((prev) =>
          prev.map((c) => (c.id === complaintId ? updatedComplaint : c))
        );

        toast.success("Complaint status updated");
        setSelectedComplaint(null);
        setNotes("");
      } catch (error) {
        console.error(error);
        toast.error("Failed to update complaint status");
      }
    };
    // assigning complaints to a staff member.
    const handleAssignComplaint = async (complaintId, staffId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/complaints/${complaintId}/assign`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignedTo: staffId,
          }),
        });

        const updatedComplaint = await response.json();

        setComplaints((prev) =>
          prev.map((c) => (c.id === complaintId ? updatedComplaint : c))
        );

        toast.success("Complaint assigned successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to assign complaint");
      }
    };
    // handle complaint submission by students. 
    // It validates the input fields, creates a new complaint object, 
    // and updates the complaints state.
    const handleSubmitComplaint = async (e) => {
        e.preventDefault();
        if (!user || !newComplaint.locationId || !newComplaint.category || !newComplaint.description) {
            toast.error('Please fill in all fields');
            return;
        }
        const location = locations.find(l => l.id === newComplaint.locationId);
        if (!location) {
            toast.error('Invalid location selected');
            return;
        }
        const complaint = {
            id: `complaint${Date.now()}`,
            userId: user.id,
            userName: user.name,
            locationId: newComplaint.locationId,
            locationName: location.name,
            category: newComplaint.category,
            description: newComplaint.description,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const response = await fetch("http://localhost:5000/api/complaints", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(complaint),
        });

        const savedComplaint = await response.json();
        setComplaints([savedComplaint, ...complaints]);
        setNewComplaint({ locationId: '', category: '', description: '' });
        setShowAddComplaint(false);
        toast.success('Complaint submitted successfully!');
    };
    // UI component to display individual complaint details in a card format. 
    // It shows the location, category, description, user who submitted it, 
    // and the status with an icon.
    const ComplaintCard = ({ complaint }) => (<Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base">{complaint.locationName}</CardTitle>
            <CardDescription className="mt-1">{complaint.category}</CardDescription>
          </div>
          <Badge variant={getStatusBadgeVariant(complaint.status || "pending")} className="flex items-center gap-1">
            {getStatusIcon(complaint.status || "pending")}
            {(complaint.status || "pending").replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{complaint.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="w-3 h-3"/>
          <span>{complaint.userName}</span>
          <span>•</span>
          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
        </div>
        {complaint.notes && (<div className="bg-muted p-2 rounded-md text-sm">
            <strong>Notes:</strong> {complaint.notes}
          </div>)}
        {user?.role === 'maintenance_staff' && complaint.status !== 'resolved' && (<Button size="sm" className="w-full mt-2" onClick={() => {
                setSelectedComplaint(complaint);
                setStatusUpdate(complaint.status);
            }}>
            Update Status
          </Button>)}
      </CardContent>
    </Card>);
    // only logged in usrs can submit and view complaints. 
    // If the user is not logged in, show a message prompting them to log in.
    if (!user || user.role === 'guest') {
        return (<Card className="h-full">
        <CardHeader>
          <CardTitle>Complaints</CardTitle>
          <CardDescription>Please login to view complaints</CardDescription>
        </CardHeader>
      </Card>);
    }
    return (<>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Maintenance Complaints</CardTitle>
              <CardDescription>Track and manage maintenance issues</CardDescription>
            </div>
            {user.role === 'student' && (<Button onClick={() => setShowAddComplaint(true)} className="gap-2">
                <Plus className="w-4 h-4"/>
                Submit Complaint
              </Button>)}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="my-complaints">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-complaints">
                My Complaints ({userComplaints.length})
              </TabsTrigger>
              {user.role === 'maintenance_staff' && (<TabsTrigger value="assigned">
                  Assigned ({assignedComplaints.length})
                </TabsTrigger>)}
              {user.role === 'admin' && (<TabsTrigger value="all">
                  All Complaints ({allComplaintsForAdmin.length})
                </TabsTrigger>)}
            </TabsList>

            <TabsContent value="my-complaints">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {userComplaints.length === 0 ? (<p className="text-sm text-muted-foreground text-center py-8">
                      No complaints submitted yet
                    </p>) : (userComplaints.map((complaint) => (<ComplaintCard key={complaint._id || complaint.id} complaint={complaint}/>)))}
                </div>
              </ScrollArea>
            </TabsContent>

            {user.role === 'maintenance_staff' && (<TabsContent value="assigned">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {assignedComplaints.length === 0 ? (<p className="text-sm text-muted-foreground text-center py-8">
                        No complaints assigned to you
                      </p>) : (assignedComplaints.map((complaint) => (<ComplaintCard key={complaint._id || complaint.id} complaint={complaint}/>)))}
                  </div>
                </ScrollArea>
              </TabsContent>)}

            {user.role === 'admin' && (<TabsContent value="all">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {allComplaintsForAdmin.map((complaint) => (<ComplaintCard key={complaint._id || complaint.id} complaint={complaint}/>))}
                  </div>
                </ScrollArea>
              </TabsContent>)}
          </Tabs>
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      {selectedComplaint && user.role === 'maintenance_staff' && (<Card className="fixed bottom-4 right-4 w-96 z-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base">Update Status</CardTitle>
            <CardDescription>{selectedComplaint.locationName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={statusUpdate} onValueChange={setStatusUpdate}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Add notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}/>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => handleUpdateStatus(selectedComplaint.id, statusUpdate)}>
                Update
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => {
                setSelectedComplaint(null);
                setNotes('');
            }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>)}

      {/* Add Complaint Dialog */}
      {showAddComplaint && user.role === 'student' && (<Card className="fixed inset-0 m-auto w-[500px] h-fit z-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base">Submit Maintenance Complaint</CardTitle>
            <CardDescription>Report a maintenance issue on campus</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitComplaint} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={newComplaint.locationId} onValueChange={(value) => setNewComplaint({ ...newComplaint, locationId: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a building"/>
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (<SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Issue Category</Label>
                <Select value={newComplaint.category} onValueChange={(value) => setNewComplaint({ ...newComplaint, category: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Facility">Facility</SelectItem>
                    <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the issue in detail..." value={newComplaint.description} onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })} rows={4} required/>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Submit Complaint
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => {
                setShowAddComplaint(false);
                setNewComplaint({ locationId: '', category: '', description: '' });
            }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>)}
    </>);
}
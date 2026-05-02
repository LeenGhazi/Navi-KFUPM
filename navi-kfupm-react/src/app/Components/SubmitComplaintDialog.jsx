import React, { useEffect, useState } from 'react';
import { useAuth } from "../../AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from './ui/select';
import { toast } from 'sonner';
// This component allows users to submit complaints about specific locations on campus. 
// It includes a form with fields for selecting the issue category and providing a detailed 
// description. The form validates that the user is logged in and that all required fields 
// are filled before allowing submission. Upon successful submission, a confirmation message 
// is shown, and the form is reset.
export function SubmitComplaintDialog({ open, onOpenChange, locationId, }) {
    const { user } = useAuth();
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState(null);
    useEffect(() => {
      if (!open || !locationId) return;

      const fetchLocation = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/buildings/${locationId}`);

          if (!res.ok) {
            throw new Error("Failed to fetch location");
          }

          const data = await res.json();
          setLocation(data);
        } catch (error) {
          console.error(error);
          toast.error("Failed to load location data");
        }
      };

      fetchLocation();
    }, [open, locationId]);
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!user || user.role === 'guest') {
        toast.error('Please login to submit complaints');
        return;
      }

      if (!category || !description.trim()) {
        toast.error("Please fill in all fields");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/complaints`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: `comp-${Date.now()}`,
            userId: user.id || user._id,
            userName: user.name,
            userEmail: user.email,
            locationId: location.id,
            locationName: location.name,
            category,
            type: category,
            title: `${category} issue at ${location.name}`,
            description,
            status: "Pending",
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to submit complaint");
        }

        toast.success('Complaint submitted successfully! You can track its status in the Complaints tab.');
        setCategory('');
        setDescription('');
        onOpenChange(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to submit complaint");
      }
    };
    if (!location)
        return null;
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report Maintenance Issue</DialogTitle>
          <DialogDescription>
            Report a maintenance issue at {location.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={location.name} disabled/>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Issue Category</Label>
            <Select value={category} onValueChange={setCategory} required>
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
            <Textarea id="description" placeholder="Describe the issue in detail..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required/>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Submit Complaint
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>);
}

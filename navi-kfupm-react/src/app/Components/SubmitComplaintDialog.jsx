import React, { useState } from 'react';
import { useAuth } from "../../AuthContext";
import { mockLocations } from '../../mockData';
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
    const location = mockLocations.find((l) => l.id === locationId);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user || user.role === 'guest') {
            toast.error('Please login to submit complaints');
            return;
        }
        // Mock submission until the backend is implemented
        toast.success('Complaint submitted successfully! You can track its status in the Complaints tab.');
        setCategory('');
        setDescription('');
        onOpenChange(false);
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

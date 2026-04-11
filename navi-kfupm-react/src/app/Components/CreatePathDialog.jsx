import React, { useState } from 'react';
import { useAuth } from "../../AuthContext";
import { mockLocations } from '../../mockData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from './ui/select';
import { MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner';
// create path dialog allows users to submit a new path between two locations, 
// which admins can review and approve for publication in the app's community paths section.
// until the backend is implemented, this will just show a success message and reset the form without actually send the data to the backend.
export function CreatePathDialog({ open, onOpenChange }) {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [description, setDescription] = useState('');
    // handle the creat path submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('You must be logged in to create a path');
            return;
        }
        if (!title.trim() || !fromLocation || !toLocation || !description.trim()) {
            toast.error('Please fill in all fields');
            return;
        }
        if (fromLocation === toLocation) {
            toast.error('Start and destination must be different locations');
            return;
        }
        // mock the path submission.
        toast.success('Path submitted for admin approval!');
        // Reset form
        setTitle('');
        setFromLocation('');
        setToLocation('');
        setDescription('');
        onOpenChange(false);
    };
    if (!user)
        return null;
    // Get unique building names for the select options, more about the data will be 
    // implemented in the backend, for now we will just use the mock data and extract 
    // the building names from the locations.
    const buildings = mockLocations.map(loc => loc.name).sort();
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5"/>
            Create Community Path
          </DialogTitle>
          <DialogDescription>
            Share your favorite route between campus locations. Your path will be reviewed before publication.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Path Title *</Label>
            <Input id="title" placeholder="e.g., Quick Route to Library" value={title} onChange={(e) => setTitle(e.target.value)} required/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">From Location *</Label>
              <Select value={fromLocation} onValueChange={setFromLocation}>
                <SelectTrigger id="from">
                  <SelectValue placeholder="Start point"/>
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (<SelectItem key={building} value={building}>
                      {building}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To Location *</Label>
              <Select value={toLocation} onValueChange={setToLocation}>
                <SelectTrigger id="to">
                  <SelectValue placeholder="Destination"/>
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (<SelectItem key={building} value={building}>
                      {building}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {fromLocation && toLocation && fromLocation !== toLocation && (<div className="p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary"/>
                <span className="font-medium">{fromLocation}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium">{toLocation}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Route will be auto-generated between these locations
              </p>
            </div>)}

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" placeholder="Describe what makes this path special (e.g., fastest, safest, most scenic)..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required/>
            <p className="text-xs text-muted-foreground">
              Share tips about this route: Is it covered? Well-lit? Has shade?
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={!title.trim() || !fromLocation || !toLocation || !description.trim()}>
              Submit for Approval
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Your path will be reviewed by administrators before being published
          </p>
        </form>
      </DialogContent>
    </Dialog>);
}

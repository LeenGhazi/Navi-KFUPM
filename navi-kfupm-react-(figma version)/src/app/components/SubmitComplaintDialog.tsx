import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Location } from '@/types';
import { mockLocations } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { toast } from 'sonner';

interface SubmitComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationId: string | null;
}

export function SubmitComplaintDialog({
  open,
  onOpenChange,
  locationId,
}: SubmitComplaintDialogProps) {
  const { user } = useAuth();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const location = mockLocations.find((l) => l.id === locationId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || user.role === 'guest') {
      toast.error('Please login to submit complaints');
      return;
    }

    // Mock submit - in real app would save to database
    toast.success('Complaint submitted successfully! You can track its status in the Complaints tab.');
    setCategory('');
    setDescription('');
    onOpenChange(false);
  };

  if (!location) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Input value={location.name} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Issue Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Submit Complaint
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

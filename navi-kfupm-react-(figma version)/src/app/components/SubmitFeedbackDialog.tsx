import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
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
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface SubmitFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmitFeedbackDialog({ open, onOpenChange }: SubmitFeedbackDialogProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [priority, setPriority] = useState<string>('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to submit feedback');
      return;
    }

    if (!title.trim() || !description.trim() || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In a real app, this would submit to the backend
    toast.success('Feedback submitted successfully! Thank you for your input.');

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setPriority('Medium');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Submit Feedback
          </DialogTitle>
          <DialogDescription>
            Help us improve Navi-KFUPM by sharing your feedback
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Brief description of the issue or suggestion"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Performance">Performance</SelectItem>
                <SelectItem value="Data Accuracy">Data Accuracy</SelectItem>
                <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                <SelectItem value="Feature Request">Feature Request</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Please provide detailed information about your feedback..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!title.trim() || !description.trim() || !category}
            >
              Submit Feedback
            </Button>
            <Button
              type="button"
              variant="outline"
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

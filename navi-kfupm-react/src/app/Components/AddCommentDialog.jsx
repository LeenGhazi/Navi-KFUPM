import React, { useState } from 'react';
import { useAuth } from "../../AuthContext";
import { mockLocations } from '../../mockData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '../Components/ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
export function AddCommentDialog({ open, onOpenChange, locationId }) {
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const location = mockLocations.find((l) => l.id === locationId);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user || user.role === 'guest') {
            toast.error('Please login to submit comments');
            return;
        }
        // Mock submit - in real app would save to database
        toast.success('Comment submitted successfully!');
        setComment('');
        setRating(5);
        onOpenChange(false);
    };
    if (!location)
        return null;
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogDescription>
            Share your feedback about {location.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (<button key={i} type="button" onClick={() => setRating(i + 1)} onMouseEnter={() => setHoveredRating(i + 1)} onMouseLeave={() => setHoveredRating(0)} className="focus:outline-none">
                  <Star className={`w-8 h-8 transition-colors ${i < (hoveredRating || rating)
                ? 'fill-yellow-500 text-yellow-500'
                : 'text-gray-300'}`}/>
                </button>))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Comment</Label>
            <Textarea id="comment" placeholder="Share your thoughts about this location..." value={comment} onChange={(e) => setComment(e.target.value)} rows={4} required/>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Submit Comment
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>);
}

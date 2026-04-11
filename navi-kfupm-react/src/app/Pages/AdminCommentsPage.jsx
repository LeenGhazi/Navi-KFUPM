import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router';
import { mockLocations } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '@/app/components/ui/dialog';
import { MessageCircle, Search, Trash2, MapPin, Calendar, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
const mockComments = [
    {
        id: 'c1',
        locationId: 'loc1',
        locationName: 'Central Library',
        userId: 'u1',
        userName: 'Ahmed Al-Salem',
        userEmail: 'student@kfupm.edu.sa',
        comment: 'Great study environment, especially the quiet zones on the third floor!',
        date: '2026-02-26',
    },
    {
        id: 'c2',
        locationId: 'loc1',
        locationName: 'Central Library',
        userId: 'u2',
        userName: 'Sara Mohammed',
        userEmail: 'sara.m@kfupm.edu.sa',
        comment: 'The 24/7 hours during exams are incredibly helpful for late-night studying.',
        date: '2026-02-25',
    },
    {
        id: 'c3',
        locationId: 'loc2',
        locationName: 'Engineering Complex',
        userId: 'u3',
        userName: 'Omar Al-Rasheed',
        userEmail: 'omar.r@kfupm.edu.sa',
        comment: 'The labs are well-equipped but could use better air conditioning.',
        date: '2026-02-24',
    },
    {
        id: 'c4',
        locationId: 'loc3',
        locationName: 'Student Center',
        userId: 'u4',
        userName: 'Fatima Al-Ghamdi',
        userEmail: 'f.ghamdi@kfupm.edu.sa',
        comment: 'Love the new food court! Lots of variety and good prices.',
        date: '2026-02-23',
    },
    {
        id: 'c5',
        locationId: 'loc3',
        locationName: 'Student Center',
        userId: 'u5',
        userName: 'Mohammed Al-Otaibi',
        userEmail: 'm.otaibi@kfupm.edu.sa',
        comment: 'Great place to hang out between classes!',
        date: '2026-02-22',
    },
];
export function AdminCommentsPage() {
    const { user } = useAuth();
    const [comments, setComments] = useState(mockComments);
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showHiddenFilter, setShowHiddenFilter] = useState('all');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    if (!user || user.role !== 'maintenance_staff') {
        return <Navigate to="/" replace/>;
    }
    const handleToggleHidden = (commentId) => {
        setComments(prev => prev.map(c => c.id === commentId
            ? { ...c, hidden: !c.hidden }
            : c));
        const comment = comments.find(c => c.id === commentId);
        toast.success(comment?.hidden ? 'Comment is now visible to users' : 'Comment hidden from users');
    };
    const handleDeleteComment = () => {
        if (!selectedComment)
            return;
        setComments(prev => prev.filter(c => c.id !== selectedComment.id));
        toast.success('Comment deleted successfully!');
        setShowDeleteDialog(false);
        setSelectedComment(null);
    };
    const openDeleteDialog = (comment) => {
        setSelectedComment(comment);
        setShowDeleteDialog(true);
    };
    const filterComments = () => {
        let filtered = comments;
        // Filter by location
        if (selectedLocation !== 'all') {
            filtered = filtered.filter(c => c.locationId === selectedLocation);
        }
        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(c => c.comment.toLowerCase().includes(query) ||
                c.userName.toLowerCase().includes(query) ||
                c.locationName.toLowerCase().includes(query));
        }
        // Filter by hidden status
        if (showHiddenFilter !== 'all') {
            filtered = filtered.filter(c => c.hidden === (showHiddenFilter === 'hidden'));
        }
        return filtered;
    };
    const CommentCard = ({ comment }) => (<Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-muted-foreground"/>
              <span className="font-semibold">{comment.locationName}</span>
              {comment.hidden && (<Badge variant="secondary" className="text-xs">
                  Hidden
                </Badge>)}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-3 h-3"/>
              {new Date(comment.date).toLocaleDateString()}
            </div>
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => handleToggleHidden(comment.id)} title={comment.hidden ? "Show comment" : "Hide comment"}>
              {comment.hidden ? (<Eye className="w-4 h-4 text-green-600"/>) : (<EyeOff className="w-4 h-4 text-orange-600"/>)}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => openDeleteDialog(comment)} title="Delete comment">
              <Trash2 className="w-4 h-4 text-red-600"/>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">{comment.comment}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{comment.userName}</span>
          <span>{comment.userEmail}</span>
        </div>
      </CardContent>
    </Card>);
    return (<div className="container mx-auto px-4 py-8 h-full overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Comments Moderation</h1>
        <p className="text-muted-foreground">
          View, review, and moderate user comments on buildings
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location-filter">Filter by Building</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger id="location-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buildings</SelectItem>
                  {mockLocations.map((location) => (<SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search Comments</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                <Input id="search" placeholder="Search by user, building, or content..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9"/>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hidden-filter">Filter by Visibility</Label>
              <Select value={showHiddenFilter} onValueChange={setShowHiddenFilter}>
                <SelectTrigger id="hidden-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Comments</SelectItem>
                  <SelectItem value="visible">Visible Comments</SelectItem>
                  <SelectItem value="hidden">Hidden Comments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filterComments().length > 0 ? (filterComments().map(comment => (<CommentCard key={comment.id} comment={comment}/>))) : (<Card className="p-8">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50"/>
              <p>No comments found matching your filters</p>
            </div>
          </Card>)}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600"/>
              Delete Comment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedComment && (<div className="space-y-4">
              <Card className="p-4 bg-muted">
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4"/>
                    <span className="font-semibold">{selectedComment.locationName}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    By {selectedComment.userName} ({selectedComment.userEmail})
                  </p>
                </div>
                <p className="text-sm">{selectedComment.comment}</p>
              </Card>

              <div className="flex gap-2">
                <Button onClick={handleDeleteComment} variant="destructive" className="flex-1">
                  Delete
                </Button>
                <Button variant="outline" onClick={() => {
                setShowDeleteDialog(false);
                setSelectedComment(null);
            }} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>)}
        </DialogContent>
      </Dialog>
    </div>);
}

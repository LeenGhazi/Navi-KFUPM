import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Badge } from '../Components/ui/badge';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../Components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '../Components/ui/dialog';
import { MessageCircle, Search, Trash2, MapPin, Calendar, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
export function AdminCommentsPage() {{/* this function is the main component for the admin comments page. it allows maintenance staff to view, search, filter, hide/show, and delete user comments on buildings. */  }
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('all');{/* State to track the selected location filter. Default is 'all' to show comments from all locations. */  }
    const [searchQuery, setSearchQuery] = useState('');
    const [showHiddenFilter, setShowHiddenFilter] = useState('all');{/* State to track the hidden status filter. Default is 'all' to show both hidden and visible comments. */  }
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);{/* State to control the visibility of the delete confirmation dialog. */  }
    const [selectedComment, setSelectedComment] = useState(null);{/* State to store the comment that is currently selected for deletion. */  }
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [commentsRes, locationsRes] = await Promise.all([
            fetch(`${import.meta.env.VITE_API_URL}/api/building-reviews`),
            fetch(`${import.meta.env.VITE_API_URL}/api/buildings`),
          ]);

          const commentsData = await commentsRes.json();
          const locationsData = await locationsRes.json();

          setComments(commentsData);
          setLocations(locationsData);
        } catch (error) {
          console.error(error);
          toast.error("Failed to load comments");
        }
      };

      fetchData();
    }, []);
    if (!user || user.role !== 'maintenance_staff') {
        return <Navigate to="/" replace/>;
    }
    {/* Function to toggle the hidden status of a comment. It updates the comments state and shows a toast notification indicating whether the comment is now hidden or visible. */  }
    const handleToggleHidden = async (commentId) => {
      const comment = comments.find(c => c._id === commentId);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/building-reviews/${commentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hidden: !comment.hidden }),
        });

        const updated = await res.json();

        setComments(prev =>
          prev.map(c => c._id === commentId ? updated : c)
        );

        toast.success(updated.hidden ? "Comment hidden from users" : "Comment is now visible to users");
      } catch (error) {
        console.error(error);
        toast.error("Failed to update comment");
      }
    };
    {/* Function to handle the deletion of a comment. It removes the selected comment from the comments state, shows a success toast notification. */  }
    const handleDeleteComment = async () => {
      if (!selectedComment) return;

      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/building-reviews/${selectedComment._id}`, {
          method: "DELETE",
        });

        setComments(prev => prev.filter(c => c._id !== selectedComment._id));
        toast.success("Comment deleted successfully!");
        setShowDeleteDialog(false);
        setSelectedComment(null);
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete comment");
      }
    };
    {/* Function to open the delete confirmation dialog. It sets the selected comment that the user intends to delete and shows the dialog. */  }
    const openDeleteDialog = (comment) => {
        setSelectedComment(comment);
        setShowDeleteDialog(true);
    };
    {/* Function to filter comments based on the selected location, search query, and hidden status filter. It returns the filtered list of comments to be displayed. */  }
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
    {/* Component to render each comment card. It displays the comment details and provides buttons to toggle visibility and delete the comment. */  }
    const CommentCard = ({ comment }) => (<Card className="hover:shadow-md transition-shadow">
      <CardHeader>{/* Header section of the comment card, showing the location name, date, and action buttons. */  }
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
              {new Date(comment.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => handleToggleHidden(comment._id)} title={comment.hidden ? "Show comment" : "Hide comment"}>
              {comment.hidden ? (<Eye className="w-4 h-4 text-green-600"/>) : (<EyeOff className="w-4 h-4 text-orange-600"/>)}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => openDeleteDialog(comment)} title="Delete comment">
              <Trash2 className="w-4 h-4 text-red-600"/>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>{/* Content section of the comment card, showing the comment text and user information. */  }
        <p className="text-sm mb-3">{comment.text}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{comment.userName}</span>{/* Display the user's name and email using span so they are in the same line */  }
          <span>{comment.userEmail}</span>
        </div>
      </CardContent>
    </Card>);
    return (
    <div className="container mx-auto px-4 py-8 h-full overflow-auto">{/* Main container for the admin comments page. It includes the header, filters, comment list, and delete confirmation dialog. */  }
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
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>{/* Select component to filter comments by building location.*/  }
                <SelectTrigger id="location-filter">{/* Trigger for the location filter select dropdown. It displays the currently selected location or "All Buildings" if no specific location is selected. */  }
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>{}
                  <SelectItem value="all">All Buildings</SelectItem>
                  {locations.map((location) => (<SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">{/* Search input to filter comments by user name, building name, or comment content. It updates the searchQuery state on change. */  }
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
        {filterComments().length > 0 ? (filterComments().map(comment => (<CommentCard key={comment._id} comment={comment}/>))) : (<Card className="p-8">
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

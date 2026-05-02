import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../Components/ui/select';
import { Badge } from '../Components/ui/badge';
import { toast } from 'sonner';
import { MessageSquare, CheckCircle, Star, MapPin, Search, Shield } from 'lucide-react';
import { mockLocations } from '../../mockData';

{/* AdminVerifyComments component allows administrators to review and verify public comments on campus buildings. . */  }
export function AdminVerifyComments() {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [filterVerified, setFilterVerified] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    /// useEffect hook fetches the building reviews from the backend API when the component mounts and updates the comments state with the retrieved data. It also handles any errors that may occur during the fetch operation.
    useEffect(() => {
      fetch(`${import.meta.env.VITE_API_URL}/api/building-reviews`)
        .then(res => res.json())
        .then(data => setComments(data))
        .catch(err => console.error(err));
    }, []);

    {/*filterComments function filters the comments based on verification status, selected building location, and search query. */  }
    const filteredComments = comments.filter((comment) => {
        const matchesVerification = filterVerified === 'all' ||
            (filterVerified === 'verified' && comment.verified) ||
            (filterVerified === 'unverified' && !comment.verified);
        const matchesLocation = selectedLocation === 'all' || comment.locationId === selectedLocation;
        const matchesSearch = searchQuery === '' ||
            comment.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.locationName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesVerification && matchesLocation && matchesSearch;
    });

    {/*handleVerifyComment function updates the state to mark a comment as verified, while handleUnverifyComment removes the verification.  */  }
    const handleVerifyComment = async (commentId) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/building-reviews/${commentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified: true }),
        });

        const updated = await res.json();

        setComments(prev =>
          prev.map(c => c._id === commentId ? updated : c)
        );

        toast.success("Review verified!");
      } catch (err) {
        console.error(err);
      }
    };

    const handleUnverifyComment = async (commentId) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/building-reviews/${commentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified: false }),
        });

        const updated = await res.json();

        setComments(prev =>
          prev.map(c => c._id === commentId ? updated : c)
        );

        toast.success("Verification removed");
      } catch (err) {
        console.error(err);
      }
    };
    {/*stats object calculates the total number of comments, verified comments, and unverified comments . */  }
    const stats = {
        total: comments.length,
        verified: comments.filter((c) => c.verified).length,
        unverified: comments.filter((c) => !c.verified).length,
    };
    return (
    <div className="container mx-auto px-4 py-8 h-full overflow-auto">{/* Main container for the admin verify comments page. It includes a header section with a title and description,
     followed by statistics cards, filter options, and a list of comments to review. */  }
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Verify Building Comments</h1>
        <p className="text-muted-foreground">
          Review and approve public comments on campus buildings
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Comments
            </CardTitle>
          </CardHeader>
          <CardContent>{/* Displays the total number of comments. */  }
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">{/* Displays the number of verified comments. */  }
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">{/* Displays the number of unverified comments. */  }
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unverified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.unverified}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{/* Filter options for verification status, building location, and search query. */  }
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="verified-filter">Filter by Verification</Label>
              <Select value={filterVerified} onValueChange={setFilterVerified}>{/* Select component to filter comments by their verification status (all, verified, unverified). */  }
                <SelectTrigger id="verified-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Comments</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">{/* Select component to filter comments by building location. It uses mockLocations to populate the options. */  }
              <Label htmlFor="location-filter">Filter by Building</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>{}
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

            <div className="space-y-2">{/* Input field to search comments by user name, building name, or comment content. It updates the searchQuery state on change. */  }
              <Label htmlFor="search">Search Comments</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                <Input id="search" placeholder="Search by user, building, or content..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9"/>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">{/* Displays the list of comments to verify. Each comment is shown in a card with its details and verification options. */  }
        {filteredComments.length === 0 ? (
          <Card>{/* If no comments match the filters, display a message indicating that no comments were found. */  }
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4"/>
              <p className="text-muted-foreground">No comments found</p>
            </CardContent>
          </Card>) : 
          (filteredComments.map((comment) => (<Card key={comment._id}>{/* Card for each comment, displaying the commenter's name, email, building location, comment text, rating, and verification status. */  }
              <CardHeader>{/* Header section of the comment card, showing the location name, commenter details, and rating. If the comment is verified, it also shows a "Verified" badge. */  }
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-muted-foreground"/>
                      <CardTitle className="text-lg">{comment.locationName}</CardTitle>
                      {comment.verified && (<Badge variant="default" className="gap-1 bg-green-100 text-green-800">
                          <Shield className="w-3 h-3"/>
                          Verified
                        </Badge>)}
                    </div>
                    <CardDescription className="mt-1">
                      By {comment.userName} ({comment.userEmail})
                    </CardDescription>
                    <CardDescription className="text-xs">
                      {new Date(comment.createdAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500"/>
                    <span className="text-sm font-medium">{comment.rating}/5</span>
                  </div>
                </div>
              </CardHeader>{/* Content section of the comment card, showing the comment text and action buttons to verify or unverify the comment. */  }
              <CardContent className="space-y-4">
                {/* Comment Text */}
                <div>
                  <Label className="text-sm font-semibold">Comment</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {comment.text}
                  </p>
                </div>

                {/* Verification Info */}
                {comment.verified && (<div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-900">
                    <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                      <Shield className="w-4 h-4"/>
                      <span className="font-medium">
                        This comment displays "Approved by administrators" badge to users
                      </span>
                    </div>
                  </div>)}

                {/* Action Buttons */}
                <div className="flex justify-end pt-2 border-t">
                  {comment.verified ? (<Button variant="outline" onClick={() => handleUnverifyComment(comment._id)}>
                      Remove Verification
                    </Button>) : (<Button variant="default" onClick={() => handleVerifyComment(comment._id)}>
                      <CheckCircle className="w-4 h-4 mr-2"/>
                      Approve & Verify
                    </Button>)}
                </div>
              </CardContent>
            </Card>)))}
      </div>
    </div>);
}

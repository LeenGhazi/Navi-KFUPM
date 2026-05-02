import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import { Textarea } from '../Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../Components/ui/select';
import { Badge } from '../Components/ui/badge';
import { toast } from 'sonner';
import { Route, CheckCircle, XCircle, Clock, MapPin, User } from 'lucide-react';
export function AdminCommunityPathsReview() { {/* Main component for the admin community paths review page. It allows admins to view, filter, search, and review student-submitted community paths. */  }
    const { user } = useAuth();
    const [paths, setPaths] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPath, setSelectedPath] = useState(null);
    const [reviewNotes, setReviewNotes] = useState('');
    useEffect(() => {
      const fetchPaths = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/path-requests`);

          if (!res.ok) {
            throw new Error("Failed response");
          }

          const data = await res.json();
          setPaths(data);
        } catch (error) {
          console.error("Fetch error:", error);
          setTimeout(fetchPaths, 2000);
        }
      };

      fetchPaths();
    }, []);
    const filteredPaths = paths.filter((path) => {

        const matchesStatus = filterStatus === 'all' || path.status === filterStatus;
        const matchesSearch =
          searchQuery === '' ||
          (path.pathName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (path.creatorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (path.startLocation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (path.endLocation || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });
    {/* Handler function to approve a community path. It updates the path's status to "Approved" and adds review notes if provided. It also shows a success toast notification. */  }
    const handleApprove = async (pathId) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/path-requests/${pathId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "approved",
            reviewNotes: reviewNotes || "Approved and forwarded to technical team.",
            reviewedByAdminId: user.id || user._id,
          }),
        });

        const updated = await res.json();

        setPaths(paths.map((p) => p._id === pathId ? updated : p));
        setReviewNotes('');
        setSelectedPath(null);
        toast.success("Community path approved!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to approve path");
      }
    };

    const handleReject = async (pathId) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/path-requests/${pathId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "rejected",
            rejectionReason: reviewNotes || "Rejected - does not meet criteria.",
            reviewedByAdminId: user.id || user._id,
          }),
        });

        const updated = await res.json();

        setPaths(paths.map((p) => p._id === pathId ? updated : p));
        setReviewNotes('');
        setSelectedPath(null);
        toast.success("Community path rejected.");
      } catch (error) {
        console.error(error);
        toast.error("Failed to reject path");
      }
    };
    {/* function to get the appropriate icon based on the path's status. It returns a clock icon for pending paths, a check circle for approved paths, and an X circle for rejected paths. */  }
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4"/>;
            case 'approved':
                return <CheckCircle className="w-4 h-4"/>;
            case 'rejected':
                return <XCircle className="w-4 h-4"/>;
        }
    };
    {/* function to get the appropriate badge color based on the path's status. It returns yellow for pending paths, green for approved paths, and red for rejected paths. */  }
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
        }
    };
    {/* Calculate statistics for the dashboard cards, counting the number of paths in each status category. */  }
    const stats = {
        pending: paths.filter((p) => p.status === 'pending').length,
        approved: paths.filter((p) => p.status === 'approved').length,
        rejected: paths.filter((p) => p.status === 'rejected').length,
    };


    return (
    <div className="container mx-auto px-4 py-8 h-full overflow-auto">{/* Main container for the admin community paths review page. It includes the header, statistics cards, filters, and the list of community paths for review. */  }
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Paths Review</h1>
        <p className="text-muted-foreground">
          Review and approve student-submitted community paths
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <Card>{/* Card component to display the number of pending reviews. It shows the title "Pending Review" and the count of pending paths. */  }
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>{/* Card component to display the number of approved paths. It shows the title "Approved" and the count of approved paths in green color. */  }
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>


        <Card>{/* Card component to display the number of rejected paths. It shows the title "Rejected" and the count of rejected paths in red color. */  }
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      
      <Card className="mb-6">{/* Card component for the filters section. It allows admins to filter community paths by status and search by title, user, or location. */  }
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status-filter">Filter by Status</Label>

              <Select value={filterStatus} onValueChange={setFilterStatus}>{/* Select component to filter community paths by their review status. It includes options for "All Paths", "Pending", "Approved", and "Rejected". */  }
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Paths</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">{/* Search input to filter community paths by title, user name, start location, or end location. It updates the searchQuery state on change. */  }
              <Label htmlFor="search">Search Paths</Label>
              <Input id="search" placeholder="Search by title, user, or location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            </div>
          </div>
        </CardContent>
      </Card>

      
      <div className="space-y-4">{/* Conditional rendering to display either a message when no community paths are found based on the filters, or a list of cards for each filtered community path. Each card displays the path details and review actions if the path is pending. */  }
        {filteredPaths.length === 0 ? (
          <Card>{/* Card component to display a message when no community paths are found based on the current filters. It shows an icon and the text "No community paths found". */  }
            <CardContent className="py-12 text-center">
              <Route className="w-12 h-12 text-muted-foreground mx-auto mb-4"/>
              <p className="text-muted-foreground">No community paths found</p>
            </CardContent>
            {/* This card is shown when there are no community paths that match the current filter and search criteria. It provides feedback to the admin that there are no paths to review. */  }
          </Card>) : (filteredPaths.map((path) => (<Card key={path._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{path.pathName}</CardTitle>
                    <CardDescription className="mt-1 space-y-1">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3"/>
                        Submitted by {path.creatorName || path.userId} ({path.userEmail})
                      </div>
                      <div className="text-xs">
                        {new Date(path.createdAt).toLocaleString()}
                      </div>
                    </CardDescription>
                  </div>

                  <Badge className={`gap-1 ${getStatusColor(path.status)}`}>
                    {getStatusIcon(path.status)}
                    {path.status}
                  </Badge>

                </div>
              </CardHeader>

              <CardContent className="space-y-4">{/* Content section of the community path card. It displays the start and end locations with icons, the description of the path, any review notes if available, and action buttons for pending paths. */  }
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Start Location</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600"/>
                      <span className="text-sm font-medium">{path.startLocation}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Destination</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600"/>
                      <span className="text-sm font-medium">{path.endLocation}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {path.description}
                  </p>
                </div>

                {/* If there are review notes available for the path, display them in a separate section with a muted background. This is shown for both approved and rejected paths to provide feedback to the user. */  }
                {path.reviewNotes && (<div className="bg-muted/50 p-4 rounded-lg">
                    <Label className="text-sm font-semibold mb-2 block">
                      Review Notes
                    </Label>
                    <p className="text-sm">{path.reviewNotes}</p>
                  </div>)}

                {/* If the path is still pending review, display a section with a textarea for the admin to add review notes and buttons to approve or reject the path. The textarea is pre-filled with any existing review notes if the admin has already started writing them. */  }
                {path.status === 'pending' && (<div className="space-y-3 pt-2 border-t">
                    <div className="space-y-2">
                      <Label>Review Notes (Optional)</Label>
                      <Textarea placeholder="Add notes about your decision..." value={selectedPath?._id === path._id ? reviewNotes : ''} onChange={(e) => {
                    setSelectedPath(path);
                    setReviewNotes(e.target.value);
                }} rows={2}/>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button onClick={() => handleApprove(path._id)} className="flex-1" variant="default">
                        <CheckCircle className="w-4 h-4 mr-2"/>
                        Approve & Forward to Tech Team
                      </Button>
                      <Button onClick={() => handleReject(path._id)} className="flex-1" variant="destructive">
                        <XCircle className="w-4 h-4 mr-2"/>
                        Reject
                      </Button>
                    </div>
                  </div>)}
              </CardContent>
            </Card>)))}
      </div>
    </div>);
}

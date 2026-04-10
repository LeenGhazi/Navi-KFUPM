import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';
import { Route, CheckCircle, XCircle, Clock, MapPin, User } from 'lucide-react';
const mockPaths = [
    {
        id: '1',
        userId: 'student1',
        userName: 'Ali Mohammed',
        userEmail: 's202012345@kfupm.edu.sa',
        title: 'Quick Route to Library from Dorm 5',
        description: 'A faster walking path through the gardens that saves 5 minutes',
        startLocation: 'Dormitory 5',
        endLocation: 'Central Library',
        status: 'Pending',
        createdAt: '2024-03-01T09:30:00',
    },
    {
        id: '2',
        userId: 'student2',
        userName: 'Omar Hassan',
        userEmail: 's202098765@kfupm.edu.sa',
        title: 'Shaded Path to Engineering Building',
        description: 'Alternative route with shade for hot days',
        startLocation: 'Student Center',
        endLocation: 'Engineering Building 2',
        status: 'Approved',
        createdAt: '2024-02-28T14:20:00',
        reviewNotes: 'Great suggestion! Forwarded to technical team for implementation.',
    },
    {
        id: '3',
        userId: 'student3',
        userName: 'Khalid Salem',
        userEmail: 's202011111@kfupm.edu.sa',
        title: 'Shortcut through Parking Lot',
        description: 'Walking through the parking lot to reach cafeteria faster',
        startLocation: 'Academic Building 4',
        endLocation: 'Main Cafeteria',
        status: 'Rejected',
        createdAt: '2024-02-25T11:15:00',
        reviewNotes: 'Safety concerns with pedestrian traffic through active parking area.',
    },
];
export function AdminCommunityPathsReview() {
    const { user } = useAuth();
    const [paths, setPaths] = useState(mockPaths);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPath, setSelectedPath] = useState(null);
    const [reviewNotes, setReviewNotes] = useState('');
    const filteredPaths = paths.filter((path) => {

        const matchesStatus = filterStatus === 'all' || path.status === filterStatus;
        const matchesSearch = searchQuery === '' ||
            path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            path.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            path.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            path.endLocation.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleApprove = (pathId) => {
        
        setPaths(paths.map((p) => p.id === pathId
            ? {
                ...p,
                status: 'Approved',
                reviewNotes: reviewNotes || 'Approved and forwarded to technical team.'
            }
            : p));
        setReviewNotes('');
        setSelectedPath(null);
        toast.success('Community path approved! Request sent to technical team.');
    };


    const handleReject = (pathId) => {
        
        setPaths(paths.map((p) => p.id === pathId
            ? {
                ...p,
                status: 'Rejected',
                reviewNotes: reviewNotes || 'Rejected - does not meet criteria.'
            }
            : p));
        setReviewNotes('');
        setSelectedPath(null);
        toast.success('Community path rejected. User has been notified.');
    };


    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return <Clock className="w-4 h-4"/>;
            case 'Approved':
                return <CheckCircle className="w-4 h-4"/>;
            case 'Rejected':
                return <XCircle className="w-4 h-4"/>;
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
        }
    };


    const stats = {
        pending: paths.filter((p) => p.status === 'Pending').length,
        approved: paths.filter((p) => p.status === 'Approved').length,
        rejected: paths.filter((p) => p.status === 'Rejected').length,
    };


    return (<div className="container mx-auto px-4 py-8 h-full overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Paths Review</h1>
        <p className="text-muted-foreground">
          Review and approve student-submitted community paths
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>


        <Card>
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

      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status-filter">Filter by Status</Label>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Paths</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search Paths</Label>
              <Input id="search" placeholder="Search by title, user, or location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            </div>
          </div>
        </CardContent>
      </Card>

      
      <div className="space-y-4">
        {filteredPaths.length === 0 ? (<Card>
            <CardContent className="py-12 text-center">
              <Route className="w-12 h-12 text-muted-foreground mx-auto mb-4"/>
              <p className="text-muted-foreground">No community paths found</p>
            </CardContent>
          </Card>) : (filteredPaths.map((path) => (<Card key={path.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{path.title}</CardTitle>
                    <CardDescription className="mt-1 space-y-1">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3"/>
                        Submitted by {path.userName} ({path.userEmail})
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

              <CardContent className="space-y-4">
                
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

                
                {path.reviewNotes && (<div className="bg-muted/50 p-4 rounded-lg">
                    <Label className="text-sm font-semibold mb-2 block">
                      Review Notes
                    </Label>
                    <p className="text-sm">{path.reviewNotes}</p>
                  </div>)}

                
                {path.status === 'Pending' && (<div className="space-y-3 pt-2 border-t">
                    <div className="space-y-2">
                      <Label>Review Notes (Optional)</Label>
                      <Textarea placeholder="Add notes about your decision..." value={selectedPath?.id === path.id ? reviewNotes : ''} onChange={(e) => {
                    setSelectedPath(path);
                    setReviewNotes(e.target.value);
                }} rows={2}/>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button onClick={() => handleApprove(path.id)} className="flex-1" variant="default">
                        <CheckCircle className="w-4 h-4 mr-2"/>
                        Approve & Forward to Tech Team
                      </Button>
                      <Button onClick={() => handleReject(path.id)} className="flex-1" variant="destructive">
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

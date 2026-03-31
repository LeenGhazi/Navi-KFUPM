import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';
import { MessageSquare, CheckCircle, Star, MapPin, Search, Shield } from 'lucide-react';
import { Comment } from '@/types';
import { mockLocations } from '@/data/mockData';

// Extended comment type with verification status
interface VerifiableComment extends Comment {
  verified: boolean;
  locationName: string;
}

const mockCommentsForVerification: VerifiableComment[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Ahmed Ali',
    userEmail: 's202012345@kfupm.edu.sa',
    locationId: '1',
    locationName: 'Central Library',
    text: 'Great study environment! The quiet zones are perfect for concentration.',
    rating: 5,
    createdAt: '2024-03-01T10:30:00',
    verified: false,
    hidden: false,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Mohammed Salem',
    userEmail: 's202098765@kfupm.edu.sa',
    locationId: '2',
    locationName: 'Engineering Building 2',
    text: 'Modern facilities and well-equipped labs. Highly recommend!',
    rating: 5,
    createdAt: '2024-02-28T14:20:00',
    verified: true,
    hidden: false,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Sara Hassan',
    userEmail: 's202011111@kfupm.edu.sa',
    locationId: '3',
    locationName: 'Main Cafeteria',
    text: 'Good food variety but can get crowded during lunch hours.',
    rating: 4,
    createdAt: '2024-02-27T12:15:00',
    verified: false,
    hidden: false,
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Khalid Omar',
    userEmail: 's202054321@kfupm.edu.sa',
    locationId: '1',
    locationName: 'Central Library',
    text: 'The new study rooms are fantastic! Very comfortable.',
    rating: 5,
    createdAt: '2024-02-26T16:45:00',
    verified: true,
    hidden: false,
  },
];

export function AdminVerifyComments() {
  const { user } = useAuth();
  const [comments, setComments] = useState<VerifiableComment[]>(mockCommentsForVerification);
  const [filterVerified, setFilterVerified] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComments = comments.filter((comment) => {
    const matchesVerification =
      filterVerified === 'all' ||
      (filterVerified === 'verified' && comment.verified) ||
      (filterVerified === 'unverified' && !comment.verified);
    const matchesLocation =
      selectedLocation === 'all' || comment.locationId === selectedLocation;
    const matchesSearch =
      searchQuery === '' ||
      comment.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVerification && matchesLocation && matchesSearch;
  });

  const handleVerifyComment = (commentId: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, verified: true } : c
      )
    );
    toast.success('Comment verified! It now shows "Approved by administrators"');
  };

  const handleUnverifyComment = (commentId: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, verified: false } : c
      )
    );
    toast.success('Verification removed from comment');
  };

  const stats = {
    total: comments.length,
    verified: comments.filter((c) => c.verified).length,
    unverified: comments.filter((c) => !c.verified).length,
  };

  return (
    <div className="container mx-auto px-4 py-8 h-full overflow-auto">
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
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
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
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="verified-filter">Filter by Verification</Label>
              <Select value={filterVerified} onValueChange={setFilterVerified}>
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

            <div className="space-y-2">
              <Label htmlFor="location-filter">Filter by Building</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger id="location-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buildings</SelectItem>
                  {mockLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search Comments</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by user, building, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No comments found</p>
            </CardContent>
          </Card>
        ) : (
          filteredComments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <CardTitle className="text-lg">{comment.locationName}</CardTitle>
                      {comment.verified && (
                        <Badge variant="default" className="gap-1 bg-green-100 text-green-800">
                          <Shield className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-1">
                      By {comment.userName} ({comment.userEmail})
                    </CardDescription>
                    <CardDescription className="text-xs">
                      {new Date(comment.createdAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-medium">{comment.rating}/5</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Comment Text */}
                <div>
                  <Label className="text-sm font-semibold">Comment</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {comment.text}
                  </p>
                </div>

                {/* Verification Info */}
                {comment.verified && (
                  <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-900">
                    <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">
                        This comment displays "Approved by administrators" badge to users
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end pt-2 border-t">
                  {comment.verified ? (
                    <Button
                      variant="outline"
                      onClick={() => handleUnverifyComment(comment.id)}
                    >
                      Remove Verification
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      onClick={() => handleVerifyComment(comment.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve & Verify
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

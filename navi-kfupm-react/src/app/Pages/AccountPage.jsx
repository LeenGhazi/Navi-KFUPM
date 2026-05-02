import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext.jsx';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import { Badge } from '../Components/ui/badge';
import { Separator } from '../Components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../Components/ui/select';
import { UserCircle, Mail, Phone, MapPin, Shield, Edit, Save, X, Key, Award, Route, MessageSquare, Trash2, Star, } from 'lucide-react';
import { toast } from 'sonner';

export function AccountPage() {   {/* this page allows users to view and edit their account information*/ }
    const { user, logout } = useAuth(); {/* Get current user data and logout function */ }
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false); {/* Track edit mode */}
    const [editedUser, setEditedUser] = useState(user);{/* Store edited user data */}
    {/* Password form state */}
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    {/* User paths */}
    const [userPaths, setUserPaths] = useState([]);
    const [userStories, setUserStories] = useState([]);
    const [userComments, setUserComments] = useState([]);
    const [userReviews, setUserReviews] = useState([]);

    // Fetch user-specific stories and reviews on component mount
    useEffect(() => {
      if (!user) return;

      const userId = user.id || user._id;

      const fetchUserData = async () => {
        try {
          const [pathsRes, reviewsRes] = await Promise.all([
            fetch(`${import.meta.env.VITE_API_URL}/api/path-requests`),
            fetch(`${import.meta.env.VITE_API_URL}/api/building-reviews/user/${userId}`),
          ]);

          const pathsData = await pathsRes.json();
          const reviewsData = await reviewsRes.json();

          setUserPaths(pathsData.filter(path => path.userId === userId));
          setUserReviews(reviewsData);

        } catch (error) {
          console.error(error);
          toast.error("Failed to load account data");
        }
      };

      fetchUserData();
    }, [user]);
    {/* Check authentication on load */}
    useEffect(() => {
        console.log('AccountPage - User:', user);
        if (!user) {
            console.log('No user found, redirecting to home');
            navigate('/');
        }
    }, [user, navigate]);
    {/* If no user, don't render */}
    if (!user) {
        return null;
    }

    console.log('AccountPage rendering for user:', user.name);
    {/* Save profile changes */}
    const handleSaveProfile = () => {
        // In a real app, this would make an API call
        toast.success('Profile updated successfully!');
        setIsEditing(false);
    };
    {/* Cancel editing */}
    const handleCancelEdit = () => {
        setEditedUser(user);
        setIsEditing(false);
    };
    {/* Handle password change if new passwords match and meet criteria */}
    const handlePasswordChange = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match!');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters!');
            return;
        }
        
        toast.success('Password changed successfully!');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    };
    {/* Get badge color based on role */}
    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-500 hover:bg-red-600';
            case 'maintenance_staff':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'student':
                return 'bg-green-500 hover:bg-green-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    };
    {/* Render status badge */}
    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };
    {/* Delete path  if confirmed */}
    const handleDeletePath = async (pathId) => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/path-requests/${pathId}`, {
          method: "DELETE",
        });

        setUserPaths(prev => prev.filter(p => p._id !== pathId));
        toast.success("Path deleted successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete path");
      }
    };
      {/* Delete comment if confirmed */}
    const handleDeleteComment = async (commentId) => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/building-reviews/${commentId}`, {
          method: "DELETE",
        });

        setUserComments(prev => prev.filter(c => c._id !== commentId));
        toast.success("Comment deleted successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete comment");
      }
    };
      
    const renderStars = (rating) => {
        return (<div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (<Star key={star} className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}/>))}
      </div>);
    };
    return (
      
    <div className="container mx-auto py-6 px-4 h-full overflow-auto">{/* Main container */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account information and preferences
            </p>
          </div>
          {/* Logout button */}
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Profile Overview Card */}
        <Card>
          <CardHeader className="pb-4">
            {/* User avatar + info */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="w-12 h-12 text-primary"/>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  {/* User name */}
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  {/* Role badge */}
                  <Badge className={`${getRoleBadgeColor(user.role)} text-white capitalize`}>
                    {user.role.replace('_', ' ')}
                  </Badge>
                </div>
                 {/* Email */}
                <CardDescription className="text-base mt-1">
                  {user.email}
                </CardDescription>
                 {/* Student ID (only for students) */}
                {user.role === 'student' && user.studentId && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Student ID: {user.studentId}
                  </p>)}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue={user.role === 'student' ? 'paths' : 'profile'} className="space-y-4">
          {/* Tabs Navigation */}
          <TabsList className={`grid w-full ${user.role === 'student' ? 'grid-cols-2' : 'grid-cols-4'}`}>
             {/* Non-student tabs */}
            {user.role !== 'student' && (
              <>
                <TabsTrigger value="profile" className="gap-2">
                  <UserCircle className="w-4 h-4"/>
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <Key className="w-4 h-4"/>
                  Security
                </TabsTrigger>
              </>
            )}
            {/* Student tabs */}
            {user.role === 'student' && (
              <>
                <TabsTrigger value="paths" className="gap-2">
                  <Route className="w-4 h-4"/>
                  My Paths
                </TabsTrigger>
                <TabsTrigger value="comments" className="gap-2">
                  <MessageSquare className="w-4 h-4"/>
                  My Comments
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Profile Tab */}
          {user.role !== 'student' && (
            <TabsContent value="profile" className="space-y-4">
              <Card> {/* Card for editing personal info */}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </div>
                    {/* Edit / Save / Cancel buttons */}
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                        <Edit className="w-4 h-4"/>
                        Edit Profile
                      </Button>) : (
                        <div className="flex gap-2">
                        <Button onClick={handleSaveProfile} className="gap-2">
                          <Save className="w-4 h-4"/>
                          Save
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline" className="gap-2">
                          <X className="w-4 h-4"/>
                          Cancel
                        </Button>
                      </div>)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4"> {/* Form fields for user info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <UserCircle className="w-4 h-4"/>
                        Full Name
                      </Label>{/* Name input field, disabled when not editing */}
                      <Input id="name" value={editedUser?.name || ''} onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })} disabled={!isEditing}/>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4"/>
                        Email Address
                      </Label>{/* Email input field, disabled when not editing */}
                      <Input id="email" type="email" value={editedUser?.email || ''} onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })} disabled={!isEditing}/>
                    </div>

                    {/* Student ID (if applicable) */}
                    {user.role === 'student' && (<div className="space-y-2">
                        <Label htmlFor="studentId" className="flex items-center gap-2">
                          <Award className="w-4 h-4"/>
                          Student ID
                        </Label>{/* Student ID field, always disabled since it's not editable */}
                        <Input id="studentId" value={user.studentId || ''} disabled/>
                      </div>)}

                    {/* Role */}
                    <div className="space-y-2">
                      <Label htmlFor="role" className="flex items-center gap-2">
                        <Shield className="w-4 h-4"/>
                        Role
                      </Label>{/* Role field, always disabled since it's not editable */}
                      <Input id="role" value={user.role.replace('_', ' ').toUpperCase()} disabled/>
                    </div>

                    {/* Phone (optional - new field) */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4"/>
                        Phone Number
                      </Label>{/* Phone input field, disabled when not editing */}
                      <Input id="phone" placeholder="+966 XXX XXX XXXX" disabled={!isEditing}/>
                    </div>

                    {/* Department (for students) */}
                    {user.role === 'student' && (<div className="space-y-2">
                        <Label htmlFor="department" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4"/>
                          Department
                        </Label>{/* Department field, disabled when not editing */}
                        <Select disabled={!isEditing}>{/*select dropdown for department, disabled when not editing */}
                          <SelectTrigger id="department">
                            <SelectValue placeholder="Select department"/>
                          </SelectTrigger>
                          <SelectContent>{/* Department options */}
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="computing">Computing & IT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>)}
                  </div>

                  <Separator />{/* Separator between form and stats */}

                  {/* Account Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        {/* Number of comments */}
                        <div className="text-2xl font-bold text-primary">12</div>
                        <div className="text-xs text-muted-foreground mt-1">Comments</div>
                      </CardContent>
                    </Card>
                    <Card>{/* Number of stories */}
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">5</div>
                        <div className="text-xs text-muted-foreground mt-1">Stories</div>
                      </CardContent>
                    </Card>
                    <Card>{/* Role-specific stat (complaints for students, resolved for staff, total users for admins) */}
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {user.role === 'student' ? '3' : user.role === 'maintenance_staff' ? '8' : '45'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {user.role === 'student' ? 'Complaints' : user.role === 'maintenance_staff' ? 'Resolved' : 'Total Users'}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>{/* Likes Given */}
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">24</div>
                        <div className="text-xs text-muted-foreground mt-1">Likes Given</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>)}

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>{/* Card for changing password */}
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">{/* Current password field */}
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}/>
                </div>
                <div className="space-y-2">{/* New password field */}
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}/>
                </div>
                <div className="space-y-2">{/* Confirm new password field */}
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}/>
                </div>{/* Button to trigger password change */}
                <Button onClick={handlePasswordChange} className="gap-2">
                  <Key className="w-4 h-4"/>
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card>{/* Card for account information */}
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>View your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Account Created</span>
                  <span className="text-sm font-medium">January 15, 2025</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Login</span>
                  <span className="text-sm font-medium">February 9, 2026</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Account Status</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paths Tab */}
          <TabsContent value="paths" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Paths</CardTitle>
                <CardDescription>View and manage your community paths</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userPaths.map((path) => (<div key={path._id} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Route className="w-5 h-5 text-primary"/>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{path.pathName}</h4>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(path.status)}
                            {path.rating > 0 && renderStars(path.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {path.description} ({path.startLocation} to {path.endLocation})
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created on {new Date(path.createdAt).toLocaleDateString('en-US')}
                        </p>
                        {path.rejectionReason && (<p className="text-xs text-red-500 mt-1">Reason: {path.rejectionReason}</p>)}
                        <Button variant="outline" className="mt-2" onClick={() => handleDeletePath(path._id)}>
                          <Trash2 className="w-4 h-4"/>
                          Delete
                        </Button>
                      </div>
                    </div>))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contributions Tab */}
          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Contributions</CardTitle>
                <CardDescription>View your stories and reviews</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {/* My Stories */}
                  <div>
                    <h3 className="font-semibold mb-3">My Stories</h3>

                    {userStories.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No stories yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {userStories.map((story) => (
                          <div key={story._id} className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <MessageSquare className="w-5 h-5 text-primary" />
                            </div>

                            <div className="flex-1">
                              <h4 className="font-medium">{story.title}</h4>

                              <p className="text-sm text-muted-foreground mt-1">
                                {story.text}
                              </p>

                              <p className="text-xs text-muted-foreground mt-1">
                                Posted on {new Date(story.createdAt).toLocaleDateString('en-US')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* My Reviews */}
                  <div>
                    <h3 className="font-semibold mb-3">My Reviews</h3>

                    {userReviews.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No reviews yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {userReviews.map((review) => (
                          <div key={review._id} className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Star className="w-5 h-5 text-primary" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">Review</h4>
                                <Badge variant="outline">{review.rating}/5</Badge>

                                {review.verified && (
                                  <Badge className="bg-green-100 text-green-700 border-green-200">
                                    Verified
                                  </Badge>
                                )}

                                {review.hidden && (
                                  <Badge variant="secondary">
                                    Hidden
                                  </Badge>
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground mt-1">
                                {review.text}
                              </p>

                              <p className="text-xs text-muted-foreground mt-1">
                                Posted on {new Date(review.createdAt).toLocaleDateString('en-US')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>);
}

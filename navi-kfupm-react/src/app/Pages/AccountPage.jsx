import React, { useState, useEffect } from 'react';
import { useAuth } from 'src/AuthContext.jsx';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import { Badge } from '../Components/ui/badge';
import { Separator } from '../Components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../Components/ui/select';
import { UserCircle, Mail, Phone, MapPin, Shield, Edit, Save, X, Key, Activity, Award, Route, MessageSquare, Trash2, Star, } from 'lucide-react';
import { toast } from 'sonner';
// Mock data for community paths
const mockUserPaths = [
    {
        id: 1,
        title: 'Quick Route to Library',
        from: 'Engineering Complex',
        to: 'Central Library',
        description: 'Fastest path avoiding construction area',
        status: 'Approved',
        rating: 4.5,
        createdDate: '2026-02-20',
    },
    {
        id: 2,
        title: 'Scenic Campus Tour',
        from: 'Main Gate',
        to: 'Student Center',
        description: 'Beautiful route through the gardens',
        status: 'Pending',
        rating: 0,
        createdDate: '2026-02-24',
    },
    {
        id: 3,
        title: 'Early Morning Jog Route',
        from: 'Sports Complex',
        to: 'Medical Center',
        description: 'Best morning exercise path',
        status: 'Rejected',
        rating: 0,
        createdDate: '2026-02-18',
        rejectionReason: 'Path crosses restricted area',
    },
];
// Mock data for user comments
const mockUserComments = [
    {
        id: 1,
        building: 'Engineering Complex',
        comment: 'Great study spaces on the 3rd floor! Very quiet and well-lit.',
        submittedDate: '2026-02-23',
    },
    {
        id: 2,
        building: 'Central Library',
        comment: 'The new coffee machine on the second floor is amazing!',
        submittedDate: '2026-02-25',
    },
    {
        id: 3,
        building: 'Student Center',
        comment: 'Love the renovated cafeteria! Much better seating now.',
        submittedDate: '2026-02-22',
    },
];
export function AccountPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(user);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [userPaths, setUserPaths] = useState(mockUserPaths);
    const [userComments, setUserComments] = useState(mockUserComments);
    // Redirect if not logged in
    useEffect(() => {
        console.log('AccountPage - User:', user);
        if (!user) {
            console.log('No user found, redirecting to home');
            navigate('/');
        }
    }, [user, navigate]);
    if (!user) {
        return null;
    }
    console.log('AccountPage rendering for user:', user.name);
    const handleSaveProfile = () => {
        // In a real app, this would make an API call
        toast.success('Profile updated successfully!');
        setIsEditing(false);
    };
    const handleCancelEdit = () => {
        setEditedUser(user);
        setIsEditing(false);
    };
    const handlePasswordChange = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match!');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters!');
            return;
        }
        // In a real app, this would make an API call
        toast.success('Password changed successfully!');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    };
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
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved':
                return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>;
            case 'Pending':
                return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>;
            case 'Rejected':
                return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };
    const handleDeletePath = (pathId) => {
        toast.success('Path deleted successfully!');
        // In real app, would delete from database
        setUserPaths(userPaths.filter((path) => path.id !== pathId));
    };
    const handleDeleteComment = (commentId) => {
        toast.success('Comment deleted successfully!');
        // In real app, would delete from database
        setUserComments(userComments.filter((comment) => comment.id !== commentId));
    };
    const renderStars = (rating) => {
        return (<div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (<Star key={star} className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}/>))}
      </div>);
    };
    // Mock activity data
    const recentActivity = [
        { date: '2026-02-08', action: 'Submitted complaint', details: 'AC not working in Building 5' },
        { date: '2026-02-07', action: 'Posted comment', details: 'Engineering Complex' },
        { date: '2026-02-06', action: 'Liked story', details: 'Library memories' },
        { date: '2026-02-05', action: 'Viewed map', details: 'Searched for Study Rooms' },
    ];
    return (<div className="container mx-auto py-6 px-4 h-full overflow-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account information and preferences
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Profile Overview Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="w-12 h-12 text-primary"/>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <Badge className={`${getRoleBadgeColor(user.role)} text-white capitalize`}>
                    {user.role.replace('_', ' ')}
                  </Badge>
                </div>
                <CardDescription className="text-base mt-1">{user.email}</CardDescription>
                {user.role === 'student' && user.studentId && (<p className="text-sm text-muted-foreground mt-1">
                    Student ID: {user.studentId}
                  </p>)}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue={user.role === 'student' ? 'paths' : 'profile'} className="space-y-4">
          <TabsList className={`grid w-full ${user.role === 'student' ? 'grid-cols-2' : 'grid-cols-5'}`}>
            {user.role !== 'student' && (<>
                <TabsTrigger value="profile" className="gap-2">
                  <UserCircle className="w-4 h-4"/>
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <Key className="w-4 h-4"/>
                  Security
                </TabsTrigger>
                <TabsTrigger value="activity" className="gap-2">
                  <Activity className="w-4 h-4"/>
                  Activity
                </TabsTrigger>
              </>)}
            {user.role === 'student' && (<>
                <TabsTrigger value="paths" className="gap-2">
                  <Route className="w-4 h-4"/>
                  My Paths
                </TabsTrigger>
                <TabsTrigger value="comments" className="gap-2">
                  <MessageSquare className="w-4 h-4"/>
                  My Comments
                </TabsTrigger>
              </>)}
          </TabsList>

          {/* Profile Tab - Only for non-students */}
          {user.role !== 'student' && (<TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </div>
                    {!isEditing ? (<Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                        <Edit className="w-4 h-4"/>
                        Edit Profile
                      </Button>) : (<div className="flex gap-2">
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
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <UserCircle className="w-4 h-4"/>
                        Full Name
                      </Label>
                      <Input id="name" value={editedUser?.name || ''} onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })} disabled={!isEditing}/>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4"/>
                        Email Address
                      </Label>
                      <Input id="email" type="email" value={editedUser?.email || ''} onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })} disabled={!isEditing}/>
                    </div>

                    {/* Student ID (if applicable) */}
                    {user.role === 'student' && (<div className="space-y-2">
                        <Label htmlFor="studentId" className="flex items-center gap-2">
                          <Award className="w-4 h-4"/>
                          Student ID
                        </Label>
                        <Input id="studentId" value={user.studentId || ''} disabled/>
                      </div>)}

                    {/* Role */}
                    <div className="space-y-2">
                      <Label htmlFor="role" className="flex items-center gap-2">
                        <Shield className="w-4 h-4"/>
                        Role
                      </Label>
                      <Input id="role" value={user.role.replace('_', ' ').toUpperCase()} disabled/>
                    </div>

                    {/* Phone (optional - new field) */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4"/>
                        Phone Number
                      </Label>
                      <Input id="phone" placeholder="+966 XXX XXX XXXX" disabled={!isEditing}/>
                    </div>

                    {/* Department (for students) */}
                    {user.role === 'student' && (<div className="space-y-2">
                        <Label htmlFor="department" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4"/>
                          Department
                        </Label>
                        <Select disabled={!isEditing}>
                          <SelectTrigger id="department">
                            <SelectValue placeholder="Select department"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="computing">Computing & IT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>)}
                  </div>

                  <Separator />

                  {/* Account Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">12</div>
                        <div className="text-xs text-muted-foreground mt-1">Comments</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">5</div>
                        <div className="text-xs text-muted-foreground mt-1">Stories</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {user.role === 'student' ? '3' : user.role === 'maintenance_staff' ? '8' : '45'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {user.role === 'student' ? 'Complaints' : user.role === 'maintenance_staff' ? 'Resolved' : 'Total Users'}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
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
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}/>
                </div>
                <Button onClick={handlePasswordChange} className="gap-2">
                  <Key className="w-4 h-4"/>
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card>
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

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent actions on Navi-KFUPM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (<div key={index}>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Activity className="w-5 h-5 text-primary"/>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{activity.action}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                        </div>
                      </div>
                      {index < recentActivity.length - 1 && <Separator className="mt-4"/>}
                    </div>))}
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
                  {userPaths.map((path) => (<div key={path.id} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Route className="w-5 h-5 text-primary"/>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{path.title}</h4>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(path.status)}
                            {path.rating > 0 && renderStars(path.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {path.description} ({path.from} to {path.to})
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created on {new Date(path.createdDate).toLocaleDateString('en-US')}
                        </p>
                        {path.rejectionReason && (<p className="text-xs text-red-500 mt-1">Reason: {path.rejectionReason}</p>)}
                        <Button variant="outline" className="mt-2" onClick={() => handleDeletePath(path.id)}>
                          <Trash2 className="w-4 h-4"/>
                          Delete
                        </Button>
                      </div>
                    </div>))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Comments</CardTitle>
                <CardDescription>View and manage your comments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userComments.map((comment) => (<div key={comment.id} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5 text-primary"/>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{comment.building}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{comment.comment}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted on {new Date(comment.submittedDate).toLocaleDateString('en-US')}
                        </p>
                        <Button variant="outline" className="mt-2" onClick={() => handleDeleteComment(comment.id)}>
                          <Trash2 className="w-4 h-4"/>
                          Delete
                        </Button>
                      </div>
                    </div>))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>);
}

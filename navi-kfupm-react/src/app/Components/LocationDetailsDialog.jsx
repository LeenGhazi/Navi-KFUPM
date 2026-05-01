import React, { useState, useEffect } from 'react';
import { mockComments } from '../../mockData';
import { useAuth } from '../../AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from './ui/select';
import { toast } from 'sonner';
import { MapPin, Clock, Users, Star, MessageSquare, Heart, Printer, FlaskConical, DoorOpen, BookOpen, Users2, Trash2, Edit, Save, X, Plus, Move, Eye, EyeOff, Shield, } from 'lucide-react';
// The purpose of this component is to display detailed information about a location,
//  including its description, facilities, user comments, and stories. 
// It also allows users to add comments and stories 
// For maintenance staff: to edit building details and manage comments.
export function LocationDetailsDialog({ location, open, onOpenChange, onSubmitComment, onSubmitComplaint, onStartMoveBuilding, setLocations,onLocationUpdated,}) {
    const { user } = useAuth();

    const currentUserId = user?.id || user?._id || user?.userId || "1";
    const currentUserName = user?.name || user?.userName || "Student User";
    
    const [stories, setStories] = useState([]);
    const [comments, setComments] = useState(mockComments);
    const [newStoryTitle, setNewStoryTitle] = useState('');
    const [newStoryText, setNewStoryText] = useState('');
    const [showAddStory, setShowAddStory] = useState(false);
    const [isEditingBuilding, setIsEditingBuilding] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [editCommentRating, setEditCommentRating] = useState(5);

    // Fetch comments for the location when the component mounts or when the location changes.
    useEffect(() => {
      if (!location) return;

      fetch(`http://localhost:5000/api/building-comments/${location.id}`)
        .then(res => res.json())
        .then(data => setStories(data))
        .catch(err => console.error(err));
    }, [location]);

    // the edit form is activated when the location changes to load the new location data into the form
    useEffect(() => {
        if (location) {
            setEditForm({ ...location });
            setIsEditingBuilding(false);
        }
    }, [location]);
    if (!location)
        return null;
    // Filter comments based on user role
    const locationComments = comments
        .filter((c) => c.locationId === location.id)
        .filter((c) => {
        // only maintainence staff can see all comments, others only see non-hidden ones
        if (user?.role === 'maintenance_staff')
            return true;
        return !c.hidden;
    });
    // storaies relaetd to a certain location are filtered based on location id
    const locationStories = stories;
    const avgRating = locationComments.length > 0
        ? locationComments.reduce((sum, c) => sum + c.rating, 0) / locationComments.length
        : 0;
    // this is a helper function to map location categories to badge labels 
    const getCategoryBadge = (category) => {
        const categoryMap = {
            academic: { label: 'Academic', variant: 'default' },
            restaurant: { label: 'Restaurant', variant: 'secondary' },
            cafe: { label: 'Cafe', variant: 'secondary' },
            dorm: { label: 'Dormitory', variant: 'outline' },
            parking: { label: 'Parking', variant: 'outline' },
            study_room: { label: 'Study Room', variant: 'default' },
            prayer_room: { label: 'Prayer Room', variant: 'default' },
            library: { label: 'Library', variant: 'default' },
            sports: { label: 'Sports', variant: 'secondary' },
        };
        return categoryMap[category] || { label: category, variant: 'outline' };
    };
    // delete a comment (only maintainence staff can do this)
    const handleDeleteComment = (commentId) => {
        if (!user || user.role !== 'maintenance_staff')
            return;
        setComments(prevComments => prevComments.filter(c => c.id !== commentId));
        toast.success('Comment deleted successfully');
    };
    // hide/unhide a comment (only maintainence staff can do this)
    const handleToggleHideComment = (commentId) => {
        if (!user || user.role !== 'maintenance_staff')
            return;
        setComments(prevComments => prevComments.map(c => c.id === commentId
            ? { ...c, hidden: !c.hidden }
            : c));
        const comment = comments.find(c => c.id === commentId);
        toast.success(comment?.hidden ? 'Comment is now visible to users' : 'Comment hidden from public view');
    };
    // edit a comment (only maintainence staff can do this, 
    // ethically this should be used to correct misinformation or 
    // remove inappropriate content, not to alter user opinions)
    const handleStartEditComment = (comment) => {
        if (!user || user.role !== 'maintenance_staff')
            return;
        setEditingCommentId(comment.id);
        setEditCommentText(comment.text);
        setEditCommentRating(comment.rating);
    };
    const handleSaveCommentEdit = () => {
        if (!editingCommentId)
            return;
        setComments(prevComments => prevComments.map(c => c.id === editingCommentId
            ? { ...c, text: editCommentText, rating: editCommentRating }
            : c));
        setEditingCommentId(null);
        toast.success('Comment updated successfully');
    };
    const handleCancelCommentEdit = () => {
        setEditingCommentId(null);
        setEditCommentText('');
        setEditCommentRating(5);
    };
    // like or unlike a comment (only students can do this))
    const handleDeleteStory = (storyId) => {
        if (!user || user.role !== 'maintenance_staff')
            return;
        setStories(prevStories => prevStories.filter(s => s.id !== storyId));
        toast.success('Story deleted successfully');
    };
    // edit building info
    const handleStartEditBuilding = () => {
        setIsEditingBuilding(true);
        setEditForm({ ...location });
    };
    // cancel editing building info and reset form to original location data
    const handleCancelEditBuilding = () => {
        setIsEditingBuilding(false);
        setEditForm({ ...location });
    };
    // save building info changes
    const handleSaveBuildingChanges = async () => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/buildings/${editForm.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editForm),
                }
            );

            const updatedBuilding = await res.json();

            console.log("Updated from backend:", updatedBuilding);
            
            if (setLocations) {
                setLocations(prev =>
                    prev.map(loc =>
                        loc.id === updatedBuilding.id ? updatedBuilding : loc
                    )
                );

                onLocationUpdated(updatedBuilding);
                setEditForm(updatedBuilding);
            }
            toast.success("Building updated successfully!");
            setIsEditingBuilding(false);

        } catch (error) {
            console.error(error);
            toast.error("Failed to update building");
        }
    };
    // update building info
    const handleUpdateBuildingField = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };
    // update services info
    const handleUpdateService = (index, field, value) => {
        const newServices = [...(editForm.services || [])];
        newServices[index] = { ...newServices[index], [field]: value };
        setEditForm(prev => ({ ...prev, services: newServices }));
    };
    // add a new service to the services list
    const handleAddService = () => {
        const newServices = [...(editForm.services || []), { name: '', hours: '' }];
        setEditForm(prev => ({ ...prev, services: newServices }));
    };
    // remove a service from the services list
    const handleRemoveService = (index) => {
        const newServices = (editForm.services || []).filter((_, i) => i !== index);
        setEditForm(prev => ({ ...prev, services: newServices }));
    };
    // update facility numbers (printers, prayer rooms, etc.)
    const handleUpdateFacilityNumber = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            facilities: {
                ...(prev.facilities || {}),
                [field]: value || 0
            }
        }));
    };
    // add a new lab to the labs list
    const handleAddLab = () => {
        const newLabs = [...(editForm.facilities?.labs || []), ''];
        setEditForm(prev => ({
            ...prev,
            facilities: {
                ...(prev.facilities || {}),
                labs: newLabs
            }
        }));
    };
    // update lab name in the labs list
    const handleUpdateLab = (index, value) => {
        const newLabs = [...(editForm.facilities?.labs || [])];
        newLabs[index] = value;
        setEditForm(prev => ({
            ...prev,
            facilities: {
                ...(prev.facilities || {}),
                labs: newLabs
            }
        }));
    };
    // remove a lab from the labs list
    const handleRemoveLab = (index) => {
        const newLabs = (editForm.facilities?.labs || []).filter((_, i) => i !== index);
        setEditForm(prev => ({
            ...prev,
            facilities: {
                ...(prev.facilities || {}),
                labs: newLabs
            }
        }));
    };
    // like or unlike a story (only students can do this)
    const handleLikeStory = async (storyId) => {
      if (!user || user.role !== 'student') {
        toast.error("Only students can like stories");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/building-comments/${storyId}/like`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: currentUserId,
            }),
          }
        );

        const updatedStory = await res.json();

        setStories(prev =>
          prev.map(s => (s._id === storyId ? updatedStory : s))
        );

      } catch (err) {
        console.error(err);
        toast.error("Failed to like story");
      }
    };
    // add a new story related to the location
    const handleAddStory = async () => {
      if (!user || !newStoryTitle.trim() || !newStoryText.trim()) return;

      const newStory = {
        userId: currentUserId,
        userName: currentUserName,
        locationId: location.id,
        title: newStoryTitle,
        text: newStoryText,
        likes: [],
      };

      try {
        const res = await fetch("http://localhost:5000/api/building-comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStory),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Backend error:", errorData);
          toast.error("Backend rejected the story");
          return;
        }

        const savedStory = await res.json();

        setStories(prev => [savedStory, ...prev]);
        setNewStoryTitle('');
        setNewStoryText('');
        setShowAddStory(false);

        toast.success("Story posted successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to post story");
      }
    };
    const displayLocation = (isEditingBuilding ? editForm : location);
    const categoryBadge = getCategoryBadge(displayLocation.category);
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5"/>
                {isEditingBuilding ? (<Input value={editForm.name || ''} onChange={(e) => handleUpdateBuildingField('name', e.target.value)} className="font-semibold h-auto px-2 py-1"/>) : (<span>{displayLocation.name}</span>)}
              </div>
              {isEditingBuilding ? (<Select value={editForm.category} onValueChange={(value) => handleUpdateBuildingField('category', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="cafe">Cafe</SelectItem>
                    <SelectItem value="dorm">Dormitory</SelectItem>
                    <SelectItem value="parking">Parking</SelectItem>
                    <SelectItem value="study_room">Study Room</SelectItem>
                    <SelectItem value="prayer_room">Prayer Room</SelectItem>
                    <SelectItem value="library">Library</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>) : (<Badge variant={categoryBadge.variant}>{categoryBadge.label}</Badge>)}
            </div>
            {user?.role === 'maintenance_staff' && (<div className="flex gap-2">
                {!isEditingBuilding ? (<Button onClick={handleStartEditBuilding} size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-2"/>
                    Edit Building
                  </Button>) : (<>
                    <Button onClick={handleSaveBuildingChanges} size="sm">
                      <Save className="w-4 h-4 mr-2"/>
                      Save
                    </Button>
                    <Button onClick={handleCancelEditBuilding} size="sm" variant="outline">
                      <X className="w-4 h-4 mr-2"/>
                      Cancel
                    </Button>
                  </>)}
              </div>)}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEditingBuilding ? (<Textarea value={editForm.description || ''} onChange={(e) => handleUpdateBuildingField('description', e.target.value)} rows={2} className="text-sm mt-2"/>) : (displayLocation.description)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4 pr-4">
            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(displayLocation.openHours || isEditingBuilding) && (<div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground"/>
                  <div className="text-sm flex-1">
                    <div className="text-xs text-muted-foreground">Hours</div>
                    {isEditingBuilding ? (<Input value={editForm.openHours || ''} onChange={(e) => handleUpdateBuildingField('openHours', e.target.value)} className="h-7 text-sm mt-1" placeholder="e.g., 8:00 AM - 5:00 PM"/>) : (<div>{displayLocation.openHours}</div>)}
                  </div>
                </div>)}
              {(displayLocation.capacity || isEditingBuilding) && (<div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground"/>
                  <div className="text-sm flex-1">
                    <div className="text-xs text-muted-foreground">Capacity</div>
                    {isEditingBuilding ? (<Input type="number" value={editForm.capacity || ''} onChange={(e) => handleUpdateBuildingField('capacity', parseInt(e.target.value))} className="h-7 text-sm mt-1" placeholder="Number of people"/>) : (<div>{displayLocation.capacity} people</div>)}
                  </div>
                </div>)}
              {!isEditingBuilding && avgRating > 0 && (<div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground">Rating</div>
                    <div>{avgRating.toFixed(1)} / 5</div>
                  </div>
                </div>)}
            </div>

            {/* Facilities Section */}
            {(location.facilities || isEditingBuilding) && (<>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <DoorOpen className="w-4 h-4"/>
                      Facilities Available
                    </h3>
                    {isEditingBuilding && (<Button size="sm" variant="outline" onClick={handleAddLab}>
                        <Plus className="w-3 h-3 mr-1"/>
                        Add Lab
                      </Button>)}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Labs */}
                    {((editForm.facilities?.labs && editForm.facilities.labs.length > 0) || isEditingBuilding) && (<Card className="p-3 col-span-2">
                        <div className="flex items-start gap-2">
                          <FlaskConical className="w-4 h-4 text-blue-500 mt-0.5"/>
                          <div className="text-sm flex-1">
                            <div className="font-medium mb-2">Labs ({(editForm.facilities?.labs || []).length})</div>
                            {isEditingBuilding ? (<div className="space-y-2">
                                {(editForm.facilities?.labs || []).map((lab, idx) => (<div key={idx} className="flex items-center gap-2">
                                    <Input value={lab} onChange={(e) => handleUpdateLab(idx, e.target.value)} placeholder="Lab name" className="h-7 text-xs flex-1"/>
                                    <Button size="icon" variant="ghost" onClick={() => handleRemoveLab(idx)} className="h-7 w-7">
                                      <Trash2 className="w-3 h-3 text-red-600"/>
                                    </Button>
                                  </div>))}
                                {(editForm.facilities?.labs || []).length === 0 && (<p className="text-xs text-muted-foreground">No labs added. Click "Add Lab" to add one.</p>)}
                              </div>) : (<div className="text-xs text-muted-foreground space-y-0.5">
                                {(displayLocation.facilities?.labs || []).map((lab, idx) => (<div key={idx}>• {lab}</div>))}
                              </div>)}
                          </div>
                        </div>
                      </Card>)}
                    {/* Printers */}
                    {((editForm.facilities?.printers && editForm.facilities.printers > 0) || isEditingBuilding) && (<Card className="p-3">
                        <div className="flex items-center gap-2">
                          <Printer className="w-4 h-4 text-purple-500"/>
                          <div className="text-sm flex-1">
                            <div className="font-medium">Printers</div>
                            {isEditingBuilding ? (<Input type="number" value={editForm.facilities?.printers || 0} onChange={(e) => handleUpdateFacilityNumber('printers', parseInt(e.target.value) || 0)} className="h-7 text-xs mt-1" min="0"/>) : (<div className="text-xs text-muted-foreground">
                                {displayLocation.facilities?.printers} available
                              </div>)}
                          </div>
                        </div>
                      </Card>)}
                    {/* Prayer Rooms */}
                    {((editForm.facilities?.prayerRooms && editForm.facilities.prayerRooms > 0) || isEditingBuilding) && (<Card className="p-3">
                        <div className="flex items-center gap-2">
                          <Users2 className="w-4 h-4 text-teal-500"/>
                          <div className="text-sm flex-1">
                            <div className="font-medium">Prayer Rooms</div>
                            {isEditingBuilding ? (<Input type="number" value={editForm.facilities?.prayerRooms || 0} onChange={(e) => handleUpdateFacilityNumber('prayerRooms', parseInt(e.target.value) || 0)} className="h-7 text-xs mt-1" min="0"/>) : (<div className="text-xs text-muted-foreground">
                                {displayLocation.facilities?.prayerRooms} rooms
                              </div>)}
                          </div>
                        </div>
                      </Card>)}
                    {/* Bathrooms */}
                    {((editForm.facilities?.bathrooms && editForm.facilities.bathrooms > 0) || isEditingBuilding) && (<Card className="p-3">
                        <div className="flex items-center gap-2">
                          <DoorOpen className="w-4 h-4 text-gray-500"/>
                          <div className="text-sm flex-1">
                            <div className="font-medium">Bathrooms</div>
                            {isEditingBuilding ? (<Input type="number" value={editForm.facilities?.bathrooms || 0} onChange={(e) => handleUpdateFacilityNumber('bathrooms', parseInt(e.target.value) || 0)} className="h-7 text-xs mt-1" min="0"/>) : (<div className="text-xs text-muted-foreground">
                                {displayLocation.facilities?.bathrooms} available
                              </div>)}
                          </div>
                        </div>
                      </Card>)}
                    {/* Study Rooms */}
                    {((editForm.facilities?.studyRooms && editForm.facilities.studyRooms > 0) || isEditingBuilding) && (<Card className="p-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-green-500"/>
                          <div className="text-sm flex-1">
                            <div className="font-medium">Study Rooms</div>
                            {isEditingBuilding ? (<Input type="number" value={editForm.facilities?.studyRooms || 0} onChange={(e) => handleUpdateFacilityNumber('studyRooms', parseInt(e.target.value) || 0)} className="h-7 text-xs mt-1" min="0"/>) : (<div className="text-xs text-muted-foreground">
                                {displayLocation.facilities?.studyRooms} rooms
                              </div>)}
                          </div>
                        </div>
                      </Card>)}
                  </div>
                </div>
              </>)}

            {/* Amenities */}
            {location.amenities && location.amenities.length > 0 && (<>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {location.amenities.map((amenity, index) => (<Badge key={index} variant="outline">{amenity}</Badge>))}
                  </div>
                </div>
              </>)}

            {/* Services Section */}
            {(displayLocation.services && displayLocation.services.length > 0) || isEditingBuilding ? (<>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Services & Operating Hours</h3>
                    {isEditingBuilding && (<Button size="sm" variant="outline" onClick={handleAddService}>
                        <Plus className="w-3 h-3 mr-1"/>
                        Add Service
                      </Button>)}
                  </div>
                  <div className="space-y-2">
                    {(editForm.services || []).length > 0 ? ((editForm.services || []).map((service, index) => (<Card key={index} className="p-3">
                          {isEditingBuilding ? (<div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Input value={service.name} onChange={(e) => handleUpdateService(index, 'name', e.target.value)} placeholder="Service name" className="flex-1 h-8 text-sm"/>
                                <Button size="icon" variant="ghost" onClick={() => handleRemoveService(index)} className="h-8 w-8">
                                  <Trash2 className="w-3.5 h-3.5 text-red-600"/>
                                </Button>
                              </div>
                              <Input value={service.hours} onChange={(e) => handleUpdateService(index, 'hours', e.target.value)} placeholder="Operating hours" className="h-8 text-sm"/>
                            </div>) : (<div className="flex justify-between">
                              <span className="font-medium text-sm">{service.name}</span>
                              <span className="text-sm text-muted-foreground">{service.hours}</span>
                            </div>)}
                        </Card>))) : isEditingBuilding ? (<p className="text-sm text-muted-foreground text-center py-4">
                        No services added yet. Click "Add Service" to add one.
                      </p>) : null}
                  </div>
                </div>
              </>) : null}

            {/* Stories & Memories Section */}
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4"/>
                  Stories & Memories ({locationStories.length})
                </h3>
                {user && user.role === 'student' && (<Button size="sm" variant="outline" onClick={() => setShowAddStory(!showAddStory)}>
                    {showAddStory ? 'Cancel' : 'Share Your Story'}
                  </Button>)}
              </div>

              {/* Add Story Form */}
              {showAddStory && user && (<Card className="p-4 mb-4 bg-muted/50">
                  <div className="space-y-3">
                    <Input placeholder="Story title..." value={newStoryTitle} onChange={(e) => setNewStoryTitle(e.target.value)}/>
                    <Textarea placeholder="Share your memory or story about this building..." value={newStoryText} onChange={(e) => setNewStoryText(e.target.value)} rows={3}/>
                    <Button onClick={handleAddStory} disabled={!newStoryTitle.trim() || !newStoryText.trim()} size="sm">
                      Post Story
                    </Button>
                  </div>
                </Card>)}

              {/* Stories List */}
              <div className="space-y-3">
                {locationStories.length === 0 ? (<p className="text-sm text-muted-foreground text-center py-4">
                    No stories yet. Be the first to share your memory!
                  </p>) : (locationStories.map((story) => (<Card key={story._id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{story.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              by {story.userName} • {new Date(story.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {user?.role === 'maintenance_staff' && (<Button size="icon" variant="ghost" onClick={() => handleDeleteStory(story._id)} className="h-7 w-7">
                              <Trash2 className="w-3.5 h-3.5 text-red-600"/>
                            </Button>)}
                        </div>
                        <p className="text-sm">{story.text}</p>
                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" variant={user?.role === 'student' && story.likes?.includes(currentUserId) ? 'default' : 'ghost'} onClick={() => handleLikeStory(story._id)} disabled={!user || user.role !== 'student'} className="gap-1">
                            <Heart className={`w-4 h-4 ${user?.role === 'student' && story.likes?.includes(currentUserId) ? 'fill-current' : ''}`}/>
                            {story.likes?.length || 0}
                          </Button>
                        </div>
                      </div>
                    </Card>)))}
              </div>
            </div>

            {/* Reviews Section */}
            {locationComments.length > 0 && (<>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-2">Reviews</h3>
                  <div className="space-y-3">
                    {locationComments.map((comment) => (<Card key={comment.id} className="p-3">
                        {editingCommentId === comment.id ? (
                // Edit Mode
                <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Rating:</span>
                              <Select value={editCommentRating.toString()} onValueChange={(value) => setEditCommentRating(parseInt(value))}>
                                <SelectTrigger className="w-20 h-7">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                  <SelectItem value="5">5</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Textarea value={editCommentText} onChange={(e) => setEditCommentText(e.target.value)} rows={3} className="text-sm"/>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveCommentEdit}>
                                <Save className="w-3 h-3 mr-1"/>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelCommentEdit}>
                                <X className="w-3 h-3 mr-1"/>
                                Cancel
                              </Button>
                            </div>
                          </div>) : (
                // View Mode
                <>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium text-sm">{comment.userName}</div>
                                  {comment.verified && (<Badge variant="default" className="text-xs gap-1 bg-green-100 text-green-800">
                                      <Shield className="w-3 h-3"/>
                                      Approved by administrators
                                    </Badge>)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500"/>
                                  <span className="text-sm font-medium">{comment.rating}</span>
                                </div>
                                {user?.role === 'maintenance_staff' && (<>
                                    <Button size="icon" variant="ghost" onClick={() => handleStartEditComment(comment)} className="h-7 w-7" title="Edit comment">
                                      <Edit className="w-3.5 h-3.5 text-blue-600"/>
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleToggleHideComment(comment.id)} className="h-7 w-7" title={comment.hidden ? "Show comment to public" : "Hide comment from public"}>
                                      {comment.hidden ? (<Eye className="w-3.5 h-3.5 text-green-600"/>) : (<EyeOff className="w-3.5 h-3.5 text-orange-600"/>)}
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleDeleteComment(comment.id)} className="h-7 w-7" title="Delete comment permanently">
                                      <Trash2 className="w-3.5 h-3.5 text-red-600"/>
                                    </Button>
                                  </>)}
                              </div>
                            </div>
                            <p className="text-sm">{comment.text}</p>
                          </>)}
                      </Card>))}
                  </div>
                </div>
              </>)}

            {/* Action Buttons */}
            <Separator />
            <div className="flex gap-2">
              {user && user.role === 'maintenance_staff' && onStartMoveBuilding && !isEditingBuilding && (<Button variant="outline" className="flex-1" onClick={() => {
                onStartMoveBuilding();
                onOpenChange(false);
            }}>
                  <Move className="w-4 h-4 mr-2"/>
                  Move Building on Map
                </Button>)}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>);
}

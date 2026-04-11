import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate } from 'react-router';
import { mockLocations } from '../../mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Textarea } from '../Components/ui/textarea';
import { Badge } from '../Components/ui/badge';
import { Separator } from '../Components/ui/separator';
import { ScrollArea } from '../Components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../Components/ui/select';
import { MapPin, Clock, Users, Search, Edit, Save, X, Plus, Trash2, } from 'lucide-react';
import { toast } from 'sonner';
export function EditMapPage() {
    const { user } = useAuth();
    const [locations, setLocations] = useState(mockLocations);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    if (!user || user.role !== 'maintenance_staff') {
        return <Navigate to="/" replace/>;
    }
    const filteredLocations = locations.filter(loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const handleSelectLocation = (location) => {
        setSelectedLocation(location);
        setEditForm({ ...location });
        setIsEditing(false);
    };
    const handleStartEdit = () => {
        setIsEditing(true);
    };
    const handleCancelEdit = () => {
        if (selectedLocation) {
            setEditForm({ ...selectedLocation });
        }
        setIsEditing(false);
    };
    const handleSaveChanges = () => {
        if (!selectedLocation || !editForm.id)
            return;
        setLocations(prev => prev.map(loc => (loc.id === editForm.id ? { ...loc, ...editForm } : loc)));
        setSelectedLocation(editForm);
        toast.success('Building information updated successfully!');
        setIsEditing(false);
    };
    const handleUpdateField = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };
    const handleUpdateService = (index, field, value) => {
        const newServices = [...(editForm.services || [])];
        newServices[index] = { ...newServices[index], [field]: value };
        setEditForm(prev => ({ ...prev, services: newServices }));
    };
    const handleAddService = () => {
        const newServices = [...(editForm.services || []), { name: '', hours: '' }];
        setEditForm(prev => ({ ...prev, services: newServices }));
    };
    const handleRemoveService = (index) => {
        const newServices = (editForm.services || []).filter((_, i) => i !== index);
        setEditForm(prev => ({ ...prev, services: newServices }));
    };
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
    const renderBuildingCard = () => {
        if (!selectedLocation && !editForm.id) {
            return (<div className="flex flex-col items-center justify-center h-full text-center p-8">
          <MapPin className="w-16 h-16 text-muted-foreground mb-4"/>
          <h3 className="text-xl font-semibold mb-2">Select a Building</h3>
          <p className="text-muted-foreground max-w-md">
            Choose a building from the list to view and edit its information in the same format
            as displayed on the map.
          </p>
        </div>);
        }
        const displayLocation = (isEditing ? editForm : selectedLocation);
        const categoryBadge = getCategoryBadge(displayLocation.category);
        return (<div className="space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5"/>
              {isEditing ? (<Input value={editForm.name || ''} onChange={(e) => handleUpdateField('name', e.target.value)} className="font-semibold text-lg h-auto px-2 py-1"/>) : (<span className="font-semibold text-lg">{displayLocation.name}</span>)}
            </div>
            {isEditing ? (<Select value={editForm.category} onValueChange={(value) => handleUpdateField('category', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic Building</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="cafe">Cafe</SelectItem>
                  <SelectItem value="dorm">Dormitory</SelectItem>
                  <SelectItem value="parking">Parking</SelectItem>
                  <SelectItem value="study_room">Study Room</SelectItem>
                  <SelectItem value="prayer_room">Prayer Room</SelectItem>
                  <SelectItem value="library">Library</SelectItem>
                  <SelectItem value="sports">Sports Facility</SelectItem>
                </SelectContent>
              </Select>) : (<Badge variant={categoryBadge.variant}>{categoryBadge.label}</Badge>)}
          </div>
          <div className="flex gap-2">
            {!isEditing ? (<Button onClick={handleStartEdit} size="sm">
                <Edit className="w-4 h-4 mr-2"/>
                Edit
              </Button>) : (<>
                <Button onClick={handleSaveChanges} size="sm">
                  <Save className="w-4 h-4 mr-2"/>
                  Save
                </Button>
                <Button onClick={handleCancelEdit} size="sm" variant="outline">
                  <X className="w-4 h-4 mr-2"/>
                  Cancel
                </Button>
              </>)}
          </div>
        </div>

        {/* Description */}
        <div>
          {isEditing ? (<Textarea value={editForm.description || ''} onChange={(e) => handleUpdateField('description', e.target.value)} rows={3} className="text-sm"/>) : (<p className="text-sm text-muted-foreground">{displayLocation.description}</p>)}
        </div>

        <Separator />

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(displayLocation.openHours || isEditing) && (<div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground"/>
              <div className="text-sm flex-1">
                <div className="text-xs text-muted-foreground">Hours</div>
                {isEditing ? (<Input value={editForm.openHours || ''} onChange={(e) => handleUpdateField('openHours', e.target.value)} className="h-7 text-sm" placeholder="e.g., 8:00 AM - 5:00 PM"/>) : (<div>{displayLocation.openHours}</div>)}
              </div>
            </div>)}
          {(displayLocation.capacity || isEditing) && (<div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground"/>
              <div className="text-sm flex-1">
                <div className="text-xs text-muted-foreground">Capacity</div>
                {isEditing ? (<Input type="number" value={editForm.capacity || ''} onChange={(e) => handleUpdateField('capacity', parseInt(e.target.value))} className="h-7 text-sm" placeholder="Number of people"/>) : (<div>{displayLocation.capacity} people</div>)}
              </div>
            </div>)}
        </div>

        <Separator />

        {/* Services Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Services & Operating Hours</h3>
            {isEditing && (<Button size="sm" variant="outline" onClick={handleAddService}>
                <Plus className="w-3 h-3 mr-1"/>
                Add Service
              </Button>)}
          </div>
          <div className="space-y-2">
            {(editForm.services || []).length > 0 ? ((editForm.services || []).map((service, index) => (<Card key={index} className="p-3">
                  {isEditing ? (<div className="space-y-2">
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
                </Card>))) : (<p className="text-sm text-muted-foreground text-center py-4">
                No services added yet
              </p>)}
          </div>
        </div>
      </div>);
    };
    return (<div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Map - Manage Buildings</h1>
        <p className="text-muted-foreground">
          Modify campus building information using the same template as displayed on the map
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Buildings List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Campus Buildings</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
              <Input placeholder="Search buildings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9"/>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {filteredLocations.map((location) => (<Card key={location.id} className={`p-3 hover:bg-accent cursor-pointer transition-colors ${selectedLocation?.id === location.id ? 'bg-accent' : ''}`} onClick={() => handleSelectLocation(location)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground"/>
                          <span className="font-medium text-sm">{location.name}</span>
                        </div>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {getCategoryBadge(location.category).label}
                        </Badge>
                      </div>
                      <Edit className="w-4 h-4 text-muted-foreground"/>
                    </div>
                  </Card>))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Building Card Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Building Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="pr-4">
                {renderBuildingCard()}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>);
}

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CampusMap } from '@/app/components/CampusMap';
import { LocationDetailsDialog } from '@/app/components/LocationDetailsDialog';
import { AddCommentDialog } from '@/app/components/AddCommentDialog';
import { SubmitComplaintDialog } from '@/app/components/SubmitComplaintDialog';
import { CommunityPathsDialog } from '@/app/components/CommunityPathsDialog';
import { CreatePathDialog } from '@/app/components/CreatePathDialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Separator } from '@/app/components/ui/separator';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Search, Route as RouteIcon, Move, } from 'lucide-react';
const categories = [
    { value: 'academic', label: 'Academic Buildings' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'cafe', label: 'Cafes' },
    { value: 'dorm', label: 'Dormitories' },
    { value: 'parking', label: 'Parking' },
    { value: 'study_room', label: 'Study Rooms' },
    { value: 'prayer_room', label: 'Prayer Rooms' },
    { value: 'library', label: 'Library' },
    { value: 'sports', label: 'Sports Facilities' },
];
export function HomePage() {
    const { user } = useAuth();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showLocationDetails, setShowLocationDetails] = useState(false);
    const [showCommentDialog, setShowCommentDialog] = useState(false);
    const [showComplaintDialog, setShowComplaintDialog] = useState(false);
    const [selectedLocationForAction, setSelectedLocationForAction] = useState(null);
    const [movingBuildingId, setMovingBuildingId] = useState(null);
    const [showCommunityPaths, setShowCommunityPaths] = useState(false);
    const [showCreatePath, setShowCreatePath] = useState(false);
    const handleCategoryToggle = (category) => {
        setSelectedCategories((prev) => prev.includes(category)
            ? prev.filter((c) => c !== category)
            : [...prev, category]);
    };
    const handleLocationClick = (location) => {
        setSelectedLocation(location);
        setShowLocationDetails(true);
    };
    const handleSubmitComment = (locationId) => {
        setSelectedLocationForAction(locationId);
        setShowCommentDialog(true);
    };
    const handleSubmitComplaint = (locationId) => {
        setSelectedLocationForAction(locationId);
        setShowComplaintDialog(true);
    };
    const handleStartMoveBuilding = () => {
        if (selectedLocation) {
            setMovingBuildingId(selectedLocation.id);
        }
    };
    const handleCancelMoveBuilding = () => {
        setMovingBuildingId(null);
    };
    return (<div className="flex h-[calc(100vh-4rem)]">
      {/* Left Sidebar */}
      <div className="w-80 border-r bg-background">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            {/* Search */}
            <div>
              <Label htmlFor="search">Search Locations</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                <Input id="search" placeholder="Search buildings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9"/>
              </div>
            </div>

            <Separator />

            {/* Categories Filter */}
            <div>
              <Label className="mb-3 block">Filter by Category</Label>
              <div className="space-y-2">
                {categories.map((category) => (<div key={category.value} className="flex items-center space-x-2">
                    <Checkbox id={category.value} checked={selectedCategories.includes(category.value)} onCheckedChange={() => handleCategoryToggle(category.value)}/>
                    <label htmlFor={category.value} className="text-sm cursor-pointer">
                      {category.label}
                    </label>
                  </div>))}
              </div>
            </div>

            <Separator />

            {/* Community Paths */}
            <div>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setShowCommunityPaths(true)}>
                <RouteIcon className="w-4 h-4"/>
                Community Paths
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Browse and rate student-created routes
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        <CampusMap selectedCategories={selectedCategories} showBusRoutes={false} showMainPaths={false} searchQuery={searchQuery} onLocationClick={handleLocationClick} routeFrom={null} routeTo={null} showMultipleRoutes={false} movingBuildingId={movingBuildingId} onBuildingMoved={handleCancelMoveBuilding}/>
        {movingBuildingId && (<div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
            <Move className="w-5 h-5"/>
            <div>
              <div className="font-semibold">Moving Building Mode</div>
              <div className="text-xs">Click on the map to place the building at a new location</div>
            </div>
            <Button size="sm" variant="secondary" onClick={handleCancelMoveBuilding} className="ml-2">
              Cancel
            </Button>
          </div>)}
      </div>

      {/* Dialogs */}
      <LocationDetailsDialog location={selectedLocation} onStartMoveBuilding={handleStartMoveBuilding} open={showLocationDetails} onOpenChange={setShowLocationDetails} onSubmitComment={handleSubmitComment} onSubmitComplaint={handleSubmitComplaint}/>

      {selectedLocationForAction && (<>
          <AddCommentDialog locationId={selectedLocationForAction} open={showCommentDialog} onOpenChange={setShowCommentDialog}/>
          <SubmitComplaintDialog locationId={selectedLocationForAction} open={showComplaintDialog} onOpenChange={setShowComplaintDialog}/>
        </>)}

      {/* Community Paths Dialogs */}
      <CommunityPathsDialog open={showCommunityPaths} onOpenChange={setShowCommunityPaths} onCreatePath={() => setShowCreatePath(true)}/>
      <CreatePathDialog open={showCreatePath} onOpenChange={setShowCreatePath}/>
    </div>);
}

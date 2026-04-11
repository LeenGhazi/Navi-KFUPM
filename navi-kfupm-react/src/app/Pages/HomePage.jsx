import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { CampusMap } from '../Components/CampusMap';
import { LocationDetailsDialog } from '../Components/LocationDetailsDialog';
import { AddCommentDialog } from '../Components/AddCommentDialog';
import { SubmitComplaintDialog } from '../Components/SubmitComplaintDialog';
import { CommunityPathsDialog } from '../Components/CommunityPathsDialog';
import { CreatePathDialog } from '../Components/CreatePathDialog';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import { ScrollArea } from '../Components/ui/scroll-area';
import { Separator } from '../Components/ui/separator';
import { Checkbox } from '../Components/ui/checkbox';
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
{/* HomePage component is the main landing page of the application.
   It includes a sidebar for filtering locations by category and a search bar, as well as a main map area that displays the campus map with various locations. The component also manages state for selected categories, search query, selected location, and dialogs for location details, comments, complaints, and community paths. */  }
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
    {/* Handler function for when a location on the map is clicked. It sets the selected location and opens the location details dialog. */  }
    const handleLocationClick = (location) => {
        setSelectedLocation(location);
        setShowLocationDetails(true);
    };
    {/* Handler function for when the user submits a comment for a location. It sets the selected location for action and opens the comment dialog. */  }
    const handleSubmitComment = (locationId) => {
        setSelectedLocationForAction(locationId);
        setShowCommentDialog(true);
    };
    const handleSubmitComplaint = (locationId) => {
        setSelectedLocationForAction(locationId);
        setShowComplaintDialog(true);
    };
    
    
    const [showSidebar, setShowSidebar] = useState(true);
    return (<div className="flex h-[calc(100vh-4rem)]">
      {/* Left Sidebar */}
      {showSidebar && (
      <div className="absolute z-40 w-[85%] max-w-xs h-full bg-background border-r shadow-lg lg:static lg:w-80">
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
      )}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      {/* Main Map Area */}
      <div className="flex-1 relative">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute top-3 left-50 z-50 bg-white shadow-md rounded-lg w-10 h-10 flex items-center justify-center lg:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          ☰
        </button>
        <CampusMap selectedCategories={selectedCategories} showBusRoutes={false} showMainPaths={false} searchQuery={searchQuery} onLocationClick={handleLocationClick} routeFrom={null} routeTo={null} showMultipleRoutes={false} />
        
      </div>

      {/* Dialogs */}

      {selectedLocationForAction && (<>
          <AddCommentDialog locationId={selectedLocationForAction} open={showCommentDialog} onOpenChange={setShowCommentDialog}/>
          <SubmitComplaintDialog locationId={selectedLocationForAction} open={showComplaintDialog} onOpenChange={setShowComplaintDialog}/>
        </>)}

      {/* Community Paths Dialogs */}
      <CommunityPathsDialog open={showCommunityPaths} onOpenChange={setShowCommunityPaths} onCreatePath={() => setShowCreatePath(true)}/>
      <CreatePathDialog open={showCreatePath} onOpenChange={setShowCreatePath}/>
    </div>);
}

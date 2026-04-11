import React, { useState } from 'react';
import { mockLocations } from '../../mockData';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from './ui/select';
import { MapPin, Navigation } from 'lucide-react';
import { Badge } from './ui/badge';
export function NearestLocationFinder({ onLocationSelect }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [nearestLocations, setNearestLocations] = useState([]);
    // Default user location (can be replaced with actual GPS later)
    const userLocation = { x: 400, y: 350 };
    const calculateDistance = (loc) => {
        const dx = loc.coordinates.x - userLocation.x;
        const dy = loc.coordinates.y - userLocation.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    const findNearest = () => {
        if (!selectedCategory)
            return;
        const filtered = mockLocations
            .filter((loc) => loc.category === selectedCategory)
            .map((loc) => ({
            ...loc,
            distance: calculateDistance(loc),
        }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);
        setNearestLocations(filtered);
    };
    return (<div className="space-y-3">
      <div className="flex gap-2">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Find nearest..."/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="cafe">Cafe</SelectItem>
            <SelectItem value="parking">Parking</SelectItem>
            <SelectItem value="study_room">Study Room</SelectItem>
            <SelectItem value="prayer_room">Prayer Room</SelectItem>
            <SelectItem value="library">Library</SelectItem>
            <SelectItem value="dorm">Dormitory</SelectItem>
            <SelectItem value="academic">Academic Building</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={findNearest} disabled={!selectedCategory} size="icon">
          <Navigation className="w-4 h-4"/>
        </Button>
      </div>

      {nearestLocations.length > 0 && (<Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Nearest Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {nearestLocations.map((loc, index) => (<div key={loc.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer transition-colors" onClick={() => onLocationSelect(loc)}>
                <div className="flex items-center gap-2 flex-1">
                  <Badge variant="outline" className="shrink-0">
                    #{index + 1}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{loc.name}</div>
                    <div className="text-xs text-muted-foreground">
                      ~{Math.round(loc.distance)} meters away
                    </div>
                  </div>
                </div>
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0"/>
              </div>))}
          </CardContent>
        </Card>)}
    </div>);
}

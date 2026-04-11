import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Badge } from '../Components/ui/badge';
import { Button } from '../Components/ui/button';
import { ScrollArea } from '../Components/ui/scroll-area';
import { Separator } from '../Components/ui/separator';
import { Checkbox } from '../Components/ui/checkbox';
import { Bus, Clock, MapPin } from 'lucide-react';
import mapImage from '../../assets/map.jpg';
import purpleRoute from '../../assets/1-Purple Route.png';
import pinkRoute from '../../assets/2-Pink Route.png';
import orangeRoute from '../../assets/3-Orange Route.png';
import redRoute from '../../assets/4-Red Route.png';
import brownRoute from '../../assets/5-Brown Route.png';
import { useTheme } from '../../ThemeContext';
const busRoutes = [
  {
    id: 'route-purple',
    name: 'Purple Route',
    color: '#7E3AF2',
    image: purpleRoute,
    description: 'Female student shuttle route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [1,2,3]
  },
  {
    id: 'route-pink',
    name: 'Pink Route',
    color: '#EC4899',
    image: pinkRoute,
    description: 'Female student shuttle route',
    frequency: 'Shuttle basis',
    operatingHours: '7:30 AM - 5:30 PM',
    stops: [1,2,3]
  },
  {
    id: 'route-orange',
    name: 'Orange Route',
    color: '#F59E0B',
    image: orangeRoute,
    description: 'Female student shuttle route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [1,2,3]
  },
  {
    id: 'route-red',
    name: 'Red Route',
    color: '#EF4444',
    image: redRoute,
    description: 'Female student shuttle route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [1,2,3]
  },
  {
    id: 'route-brown',
    name: 'Brown Route',
    color: '#A16207',
    image: brownRoute,
    description: 'Female student shuttle route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [1,2,3]
  }
];
export function BusRoutesPage() {
    
const [showRoutesPanel, setShowRoutesPanel] = useState(false);
const [showDetailsPanel, setShowDetailsPanel] = useState(false);

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [selectedRoutes, setSelectedRoutes] = useState(busRoutes.map(r => r.id));
    const [selectedRoute, setSelectedRoute] = useState(null);
    const toggleRoute = (routeId) => {
        setSelectedRoutes(prev => prev.includes(routeId)
            ? prev.filter(id => id !== routeId)
            : [...prev, routeId]);
    };
    const selectAllRoutes = () => {
        setSelectedRoutes(busRoutes.map(r => r.id));
    };
    const deselectAllRoutes = () => {
        setSelectedRoutes([]);
    };
    return (<div className="h-full flex lg:flex-row relative">
      {(showRoutesPanel || showDetailsPanel) && (
  <div
    className="fixed inset-0 bg-black/30 z-30 lg:hidden"
    onClick={() => {
      setShowRoutesPanel(false);
      setShowDetailsPanel(false);
    }}
  />
)}
      {/* Left Sidebar - Route List */}

      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-[85%] max-w-xs bg-background border-r shadow-lg
          transform transition-transform duration-300
          ${showRoutesPanel ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0 lg:shadow-none lg:w-80
        `}
        >
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Campus Bus Routes</h2>
              <p className="text-sm text-muted-foreground">
                Select routes to view on the map
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllRoutes} className="flex-1">
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAllRoutes} className="flex-1">
                Clear All
              </Button>
            </div>

            <Separator />

            {/* Route Checkboxes */}
            <div className="space-y-3">
              {busRoutes.map((route) => (<Card key={route.id} className={`cursor-pointer transition-all ${selectedRoute?.id === route.id ? 'ring-2 ring-primary' : ''}`} 
              onClick={() => {
                setSelectedRoute(route);
                setShowDetailsPanel(true);
                setShowRoutesPanel(false);
              }}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={selectedRoutes.includes(route.id)} onCheckedChange={() => toggleRoute(route.id)} onClick={(e) => e.stopPropagation()}/>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: route.color }}/>
                          <h3 className="font-semibold text-sm">{route.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">{route.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1"/>
                            {route.frequency}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="w-3 h-3 mr-1"/>
                            {route.stops.length} stops
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Middle - Map View */}
      <div className="flex-1 p-6 overflow-auto bg-muted/30">
      <div className="lg:hidden absolute top-10 left-80 z-50 flex gap-2">
  <button
    onClick={() => {
      setShowRoutesPanel(true);
      setShowDetailsPanel(false);
    }}
    className="bg-white shadow-md rounded-lg px-3 py-2 text-sm"
    
  >
    Routes
  </button>


</div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="w-5 h-5"/>
              Bus Routes Map
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-5rem)]">
          <div className="relative w-full h-full bg-background rounded-lg border overflow-hidden">
            <img
              src={mapImage}
              alt="KFUPM Map"
              className="w-full h-full object-contain"
                style={{
                  filter: isDark
                  ? "invert(1) hue-rotate(180deg) brightness(0.9) contrast(1.1)"
                  : "none"
                }}
              />

            {busRoutes
            .filter(route => selectedRoutes.includes(route.id))
            .map(route => (
              <img
                key={route.id}
                src={route.image}
                alt={route.name}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
              />
             ))}
          </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Route Details */}
      <div
        className={`
          fixed inset-y-0 right-0 z-40 w-[85%] max-w-xs bg-background border-l shadow-lg
          transform transition-transform duration-300
          ${showDetailsPanel ? 'translate-x-0' : 'translate-x-full'}
          lg:static lg:translate-x-0 lg:shadow-none lg:w-80
        `}
        >
        <ScrollArea className="h-full">
          <div className="lg:hidden flex gap-2 mb-4">
  <button
    onClick={() => {
      setShowDetailsPanel(false);
      setShowRoutesPanel(true);
    }}
    className="text-sm px-3 py-1 rounded-md border"
  >
    Back
  </button>

</div>
          <div className="p-4">
            {selectedRoute ? (<div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: selectedRoute.color }}/>
                    <h2 className="text-lg font-bold">{selectedRoute.name}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedRoute.description}
                  </p>
                </div>

                <Separator />

                {/* Route Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Route Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency:</span>
                      <span className="font-medium">{selectedRoute.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Operating Hours:</span>
                      <span className="font-medium">{selectedRoute.operatingHours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Stops:</span>
                      <span className="font-medium">{selectedRoute.stops.length}</span>
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                {/* Bus Stops List */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4"/>
                    Bus Stops & Schedule
                  </h3>
                  <div className="space-y-2">
                    {selectedRoute.stops.map((stop, index) => (<Card key={stop.id}>
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{stop.name}</div>
                              {stop.arrivalTime && (<div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3"/>
                                  Starts at {stop.arrivalTime}
                                </div>)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>))}
                  </div>
                </div>
              </div>) : (<Card>
                <CardContent className="p-6 text-center">
                  <Bus className="w-12 h-12 mx-auto mb-3 text-muted-foreground"/>
                  <p className="text-sm text-muted-foreground">
                    Select a route from the list to view details
                  </p>
                </CardContent>
              </Card>)}
          </div>
        </ScrollArea>
      </div>
    </div>);
}

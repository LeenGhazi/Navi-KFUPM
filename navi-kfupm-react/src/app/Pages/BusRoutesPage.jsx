import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Badge } from '../Components/ui/badge';
import { Button } from '../Components/ui/button';
import { ScrollArea } from '../Components/ui/scroll-area';
import { Separator } from '../Components/ui/separator';
import { Checkbox } from '../Components/ui/checkbox';
import { Bus, Clock, MapPin } from 'lucide-react';
import mapImage from '../../assets/map.jpg';
import purpleRoute from '../../assets/bus-routes/Purple Route.png';
import pinkRoute from '../../assets/bus-routes/Pink Route.png';
import orangeRoute from '../../assets/bus-routes/Orange Route.png';
import brownRoute from '../../assets/bus-routes/Brown Route.png';
import redRoute from '../../assets/bus-routes/Red Route.png';
import blueRoute from '../../assets/bus-routes/Blue Route.png';
import cyanRoute from '../../assets/bus-routes/Cyan Route.png';
import { useTheme } from '../../ThemeContext';

const busRoutes = [
  {
    id: 'route-purple',
    name: 'Purple Route',
    type: 'female',
    color: '#7E3AF2',
    image: purpleRoute,
    description: 'Female bus route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [
      { id: '900-a', name: 'Female Student Accommodation 900', coordinates: { x: 540, y: 730 } },
      { id: '27', name: 'Clinic Parking 27', coordinates: { x: 590, y: 635 } },
      { id: '312-a', name: 'Tower Station 312', coordinates: { x: 360, y: 460 } },
      { id: '22-a', name: 'Building 22', coordinates: { x: 480, y: 570 } },
      { id: '319', name: 'Northern District 319', coordinates: { x: 760, y: 312 } },
      { id: '58', name: 'Cabin 58', coordinates: { x: 520, y: 225 } },
      { id: '309', name: 'Orientation 309', coordinates: { x: 600, y: 280 } },
      { id: '310', name: 'Start 310', coordinates: { x: 540, y: 390 } },
      { id: '312-b', name: 'Tower Station 312', coordinates: { x: 360, y: 460 } },
      { id: '22-b', name: 'Building 22', coordinates: { x: 480, y: 570 } },
      { id: '314', name: 'Clinic 314', coordinates: { x: 580, y: 590 } },
      { id: '900-b', name: 'Female Student Accommodation 900', coordinates: { x: 540, y: 730 } },
    ],
  },
  {
    id: 'route-pink',
    name: 'Pink Route',
    type: 'female',
    color: '#EC4899',
    image: pinkRoute,
    description: 'Female bus route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [
      { id: '404-a', name: 'Physical Education 404', coordinates: { x: 640, y: 680 } },
      { id: '312-a', name: 'Tower Station 312', coordinates: { x: 360, y: 460 } },
      { id: '22-a', name: 'Building 22', coordinates: { x: 480, y: 570 } },
      { id: '319', name: 'Northern District 319', coordinates: { x: 760, y: 312 } },
      { id: '58', name: 'Cabin 58', coordinates: { x: 520, y: 225 } },
      { id: '309', name: 'Orientation 309', coordinates: { x: 600, y: 280 } },
      { id: '310', name: 'Start 310', coordinates: { x: 540, y: 390 } },
      { id: '312-b', name: 'Tower Station 312', coordinates: { x: 360, y: 460 } },
      { id: '22-b', name: 'Building 22', coordinates: { x: 480, y: 570 } },
      { id: '314', name: 'Clinic 314', coordinates: { x: 580, y: 590 } },
      { id: '404-b', name: 'Physical Education 404', coordinates: { x: 640, y: 680 } },
    ],
  },
  {
    id: 'route-orange',
    name: 'Orange Route',
    type: 'female',
    color: '#F59E0B',
    image: orangeRoute,
    description: 'Female bus route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [
      { id: '319-a', name: 'Northern District 319', coordinates: { x: 760, y: 312 } },
      { id: '58', name: 'Cabin 58', coordinates: { x: 520, y: 225 } },
      { id: '309', name: 'Orientation 309', coordinates: { x: 600, y: 280 } },
      { id: '310', name: 'Start 310', coordinates: { x: 540, y: 390 } },
      { id: '22-a', name: 'Building 22', coordinates: { x: 480, y: 570 } },
      { id: '312-a', name: 'Tower Station 312', coordinates: { x: 360, y: 460 } },
      { id: '314', name: 'Clinic 314', coordinates: { x: 580, y: 590 } },
      { id: '312-b', name: 'Tower Station 312', coordinates: { x: 360, y: 460 } },
      { id: '22-b', name: 'Building 22', coordinates: { x: 480, y: 570 } },
      { id: '319-b', name: 'Northern District 319', coordinates: { x: 760, y: 312 } },
    ],
  },
  {
    id: 'route-brown',
    name: 'Brown Route',
    type: 'female',
    color: '#A16207',
    image: brownRoute,
    description: 'Female bus route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [
      { id: '310-a', name: 'Start 310', coordinates: { x: 540, y: 390 } },
      { id: '58', name: 'Cabin 58', coordinates: { x: 520, y: 225 } },
      { id: '309', name: 'Orientation 309', coordinates: { x: 600, y: 280 } },
      { id: '310-b', name: 'Start 310', coordinates: { x: 540, y: 390 } },
    ],
  },
  {
    id: 'route-red',
    name: 'Red Route',
    type: 'female',
    color: '#EF4444',
    image: redRoute,
    description: 'Female bus route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [
      { id: '27', name: 'Clinic Parking 27', coordinates: { x: 590, y: 635 } },
      { id: '900', name: 'Female Student Accommodation 900', coordinates: { x: 540, y: 730 } },
      { id: '404', name: 'Physical Education 404', coordinates: { x: 640, y: 680 } },
    ],
  },
  {
    id: 'route-blue',
    name: 'Blue Route',
    type: 'male',
    color: '#2563EB',
    image: blueRoute,
    description: 'Male bus route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [
      { id: '301-a', name: 'Field Station 301', coordinates: { x: 240, y: 690 } },
      { id: '302-a', name: 'Cooling Stop 302', coordinates: { x: 300, y: 620 } },
      { id: '303-a', name: 'Heritage Station 303', coordinates: { x: 370, y: 555 } },
      { id: '304-a', name: 'North Station 304', coordinates: { x: 430, y: 500 } },
      { id: '305-a', name: 'Reservoir Station 305', coordinates: { x: 500, y: 450 } },
      { id: '306-a', name: 'Deanship Station 306', coordinates: { x: 570, y: 420 } },
      { id: '311-a', name: 'Sports Center 311', coordinates: { x: 650, y: 460 } },
      { id: '313', name: 'Petroleum Station 313', coordinates: { x: 720, y: 520 } },
      { id: '311-b', name: 'Sports Center 311', coordinates: { x: 650, y: 460 } },
      { id: '306-b', name: 'Deanship Station 306', coordinates: { x: 570, y: 420 } },
      { id: '305-b', name: 'Reservoir Station 305', coordinates: { x: 500, y: 450 } },
      { id: '304-b', name: 'North Station 304', coordinates: { x: 430, y: 500 } },
      { id: '303-b', name: 'Heritage Station 303', coordinates: { x: 370, y: 555 } },
      { id: '302-b', name: 'Cooling Stop 302', coordinates: { x: 300, y: 620 } },
      { id: '301-b', name: 'Field Station 301', coordinates: { x: 240, y: 690 } },
    ],
  },
  {
    id: 'route-cyan',
    name: 'Cyan Route',
    type: 'male',
    color: '#06B6D4',
    image: cyanRoute,
    description: 'Male bus route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [
      { id: '303-a', name: 'Heritage Station 303', coordinates: { x: 370, y: 555 } },
      { id: '304', name: 'North Station 304', coordinates: { x: 430, y: 500 } },
      { id: '308', name: 'Mall 308', coordinates: { x: 500, y: 540 } },
      { id: '303-b', name: 'Heritage Station 303', coordinates: { x: 370, y: 555 } },
    ],
  },
];

export function BusRoutesPage() {
  const [showRoutesPanel, setShowRoutesPanel] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedRoutes, setSelectedRoutes] = useState(busRoutes.map((route) => route.id));
  const [selectedRoute, setSelectedRoute] = useState(null);

  const toggleRoute = (routeId) => {
    setSelectedRoutes((prev) =>
      prev.includes(routeId)
        ? prev.filter((id) => id !== routeId)
        : [...prev, routeId]
    );
  };

  const selectAllRoutes = () => {
    setSelectedRoutes(busRoutes.map((route) => route.id));
  };

  const deselectAllRoutes = () => {
    setSelectedRoutes([]);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {(showRoutesPanel || showDetailsPanel) && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => {
            setShowRoutesPanel(false);
            setShowDetailsPanel(false);
          }}
        />
      )}

      {/* Left Sidebar - Route List */}
      <div
        className={`
          fixed lg:absolute left-0 top-0 h-full w-80 z-30
          bg-background border-r shadow-lg transition-transform duration-300
          ${showRoutesPanel ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Card className="h-full rounded-none border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="w-5 h-5" />
              Campus Bus Routes
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Select routes to view on the map
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={selectAllRoutes}>
                Select All
              </Button>
              <Button size="sm" variant="outline" onClick={deselectAllRoutes}>
                Clear All
              </Button>
            </div>

            <Separator />

            <ScrollArea className="h-[calc(100vh-180px)] pr-4">
              <div className="space-y-6">
                {/* Female Routes */}
                <div>
                  <h2 className="text-sm font-bold mb-3 text-muted-foreground">
                    Female Bus Routes
                  </h2>

                  <div className="space-y-3">
                    {busRoutes
                      .filter((route) => route.type === 'female')
                      .map((route) => (
                        <Card
                          key={route.id}
                          className={`cursor-pointer transition-all ${
                            selectedRoute?.id === route.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => {
                            setSelectedRoute(route);
                            setShowDetailsPanel(true);
                            setShowRoutesPanel(false);
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={selectedRoutes.includes(route.id)}
                                onCheckedChange={() => toggleRoute(route.id)}
                                onClick={(e) => e.stopPropagation()}
                              />

                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: route.color }}
                                  />
                                  <h3 className="font-semibold text-sm">
                                    {route.name}
                                  </h3>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                  {route.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {route.frequency}
                                  </Badge>

                                  <Badge variant="outline" className="text-xs">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {route.stops.length} stops
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Male Routes */}
                <div>
                  <h2 className="text-sm font-bold mb-3 text-muted-foreground">
                    Male Bus Routes
                  </h2>

                  <div className="space-y-3">
                    {busRoutes
                      .filter((route) => route.type === 'male')
                      .map((route) => (
                        <Card
                          key={route.id}
                          className={`cursor-pointer transition-all ${
                            selectedRoute?.id === route.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => {
                            setSelectedRoute(route);
                            setShowDetailsPanel(true);
                            setShowRoutesPanel(false);
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={selectedRoutes.includes(route.id)}
                                onCheckedChange={() => toggleRoute(route.id)}
                                onClick={(e) => e.stopPropagation()}
                              />

                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: route.color }}
                                  />
                                  <h3 className="font-semibold text-sm">
                                    {route.name}
                                  </h3>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                  {route.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {route.frequency}
                                  </Badge>

                                  <Badge variant="outline" className="text-xs">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {route.stops.length} stops
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Middle - Map View */}
      <div className="absolute inset-0 lg:left-80 lg:right-80">
        <Button
          onClick={() => {
            setShowRoutesPanel(true);
            setShowDetailsPanel(false);
          }}
          className="absolute top-4 left-4 z-20 lg:hidden bg-white shadow-md rounded-lg px-3 py-2 text-sm"
          variant="outline"
        >
          Routes
        </Button>

        <div className="relative w-full h-full overflow-hidden">
          <img
            src={mapImage}
            alt="KFUPM Campus Map"
            className={`w-full h-full object-cover ${isDark ? 'brightness-75' : ''}`}
          />

          {/* Route Images */}
          {busRoutes
            .filter((route) => selectedRoutes.includes(route.id))
            .map((route) => (
              <img
                key={route.id}
                src={route.image}
                alt={route.name}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ opacity: 0.85 }}
              />
            ))}
        </div>
      </div>

      {/* Right Sidebar - Route Details */}
      <div
        className={`
          fixed lg:absolute right-0 top-0 h-full w-80 z-30
          bg-background border-l shadow-lg transition-transform duration-300
          ${showDetailsPanel ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        <Card className="h-full rounded-none border-0">
          <CardHeader>
            <Button
              onClick={() => {
                setShowDetailsPanel(false);
                setShowRoutesPanel(true);
              }}
              className="text-sm px-3 py-1 rounded-md border lg:hidden"
              variant="outline"
            >
              Back
            </Button>
          </CardHeader>

          <CardContent>
            {selectedRoute ? (
              <ScrollArea className="h-[calc(100vh-100px)] pr-4">
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: selectedRoute.color }}
                      />
                      <h2 className="text-xl font-bold">{selectedRoute.name}</h2>
                    </div>

                    <Badge variant="secondary" className="mb-2">
                      {selectedRoute.type === 'female' ? 'Female Route' : 'Male Route'}
                    </Badge>

                    <p className="text-sm text-muted-foreground">
                      {selectedRoute.description}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Route Information</h3>

                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Frequency:</strong> {selectedRoute.frequency}
                      </p>
                      <p>
                        <strong>Operating Hours:</strong>{' '}
                        {selectedRoute.operatingHours}
                      </p>
                      <p>
                        <strong>Total Stops:</strong>{' '}
                        {selectedRoute.stops.length}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Bus Stops & Schedule
                    </h3>

                    <div className="space-y-3">
                      {selectedRoute.stops.map((stop, index) => (
                        <div
                          key={`${stop.id}-${index}`}
                          className="flex items-start gap-3"
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold"
                            style={{ backgroundColor: selectedRoute.color }}
                          >
                            {index + 1}
                          </div>

                          <div>
                            <p className="text-sm font-medium">{stop.name}</p>

                            {stop.arrivalTime && (
                              <p className="text-xs text-muted-foreground">
                                Starts at {stop.arrivalTime}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center text-muted-foreground mt-20">
                Select a route from the list to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
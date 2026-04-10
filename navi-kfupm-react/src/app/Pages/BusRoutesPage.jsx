import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Badge } from '../Components/ui/badge';
import { Button } from '../Components/ui/button';
import { ScrollArea } from '../Components/ui/scroll-area';
import { Separator } from '../Components/ui/separator';
import { Checkbox } from '../Components/ui/checkbox';
import { Bus, Clock, MapPin } from 'lucide-react';
const busRoutes = [
    {
        id: 'route-1',
        name: 'Main Campus Loop',
        color: '#3B82F6', // Blue
        description: 'Connects main academic buildings, library, and student center',
        frequency: 'Every 15 minutes',
        operatingHours: '7:00 AM - 10:00 PM',
        stops: [
            { id: 's1', name: 'Main Gate', coordinates: { x: 100, y: 100 }, arrivalTime: '7:00' },
            { id: 's2', name: 'Engineering Complex', coordinates: { x: 200, y: 150 }, arrivalTime: '7:05' },
            { id: 's3', name: 'Science Building', coordinates: { x: 300, y: 200 }, arrivalTime: '7:10' },
            { id: 's4', name: 'Library', coordinates: { x: 400, y: 250 }, arrivalTime: '7:15' },
            { id: 's5', name: 'Student Center', coordinates: { x: 500, y: 300 }, arrivalTime: '7:20' },
            { id: 's6', name: 'Administration', coordinates: { x: 400, y: 350 }, arrivalTime: '7:25' },
        ],
        path: [
            { x: 100, y: 100 }, { x: 200, y: 150 }, { x: 300, y: 200 },
            { x: 400, y: 250 }, { x: 500, y: 300 }, { x: 400, y: 350 },
            { x: 300, y: 380 }, { x: 200, y: 350 }, { x: 100, y: 300 }, { x: 100, y: 100 }
        ]
    },
    {
        id: 'route-2',
        name: 'Dormitory Express',
        color: '#EF4444', // Red
        description: 'Quick service between dormitories and academic areas',
        frequency: 'Every 10 minutes',
        operatingHours: '6:30 AM - 11:00 PM',
        stops: [
            { id: 'd1', name: 'Dorm A', coordinates: { x: 150, y: 450 }, arrivalTime: '6:30' },
            { id: 'd2', name: 'Dorm B', coordinates: { x: 250, y: 480 }, arrivalTime: '6:35' },
            { id: 'd3', name: 'Dorm C', coordinates: { x: 350, y: 500 }, arrivalTime: '6:40' },
            { id: 'd4', name: 'Cafeteria', coordinates: { x: 450, y: 400 }, arrivalTime: '6:45' },
            { id: 'd5', name: 'Engineering Complex', coordinates: { x: 200, y: 150 }, arrivalTime: '6:50' },
            { id: 'd6', name: 'Library', coordinates: { x: 400, y: 250 }, arrivalTime: '6:55' },
        ],
        path: [
            { x: 150, y: 450 }, { x: 250, y: 480 }, { x: 350, y: 500 },
            { x: 450, y: 400 }, { x: 400, y: 300 }, { x: 300, y: 200 },
            { x: 200, y: 150 }, { x: 300, y: 180 }, { x: 400, y: 250 },
            { x: 350, y: 350 }, { x: 250, y: 400 }, { x: 150, y: 450 }
        ]
    },
    {
        id: 'route-3',
        name: 'Sports & Recreation',
        color: '#10B981', // Green
        description: 'Connects sports facilities, gym, and recreation areas',
        frequency: 'Every 20 minutes',
        operatingHours: '8:00 AM - 9:00 PM',
        stops: [
            { id: 'r1', name: 'Main Gate', coordinates: { x: 100, y: 100 }, arrivalTime: '8:00' },
            { id: 'r2', name: 'Stadium', coordinates: { x: 600, y: 150 }, arrivalTime: '8:08' },
            { id: 'r3', name: 'Sports Complex', coordinates: { x: 650, y: 250 }, arrivalTime: '8:15' },
            { id: 'r4', name: 'Swimming Pool', coordinates: { x: 620, y: 350 }, arrivalTime: '8:22' },
            { id: 'r5', name: 'Gym', coordinates: { x: 550, y: 400 }, arrivalTime: '8:28' },
            { id: 'r6', name: 'Student Center', coordinates: { x: 500, y: 300 }, arrivalTime: '8:35' },
        ],
        path: [
            { x: 100, y: 100 }, { x: 200, y: 120 }, { x: 400, y: 130 },
            { x: 600, y: 150 }, { x: 650, y: 250 }, { x: 620, y: 350 },
            { x: 550, y: 400 }, { x: 500, y: 350 }, { x: 500, y: 300 },
            { x: 400, y: 250 }, { x: 200, y: 180 }, { x: 100, y: 100 }
        ]
    },
    {
        id: 'route-4',
        name: 'Shopping & Dining',
        color: '#F59E0B', // Amber
        description: 'Covers all cafeterias, restaurants, and shopping areas',
        frequency: 'Every 12 minutes',
        operatingHours: '10:00 AM - 10:00 PM',
        stops: [
            { id: 'f1', name: 'Main Cafeteria', coordinates: { x: 450, y: 400 }, arrivalTime: '10:00' },
            { id: 'f2', name: 'Coffee Shop', coordinates: { x: 350, y: 320 }, arrivalTime: '10:05' },
            { id: 'f3', name: 'Food Court', coordinates: { x: 280, y: 280 }, arrivalTime: '10:10' },
            { id: 'f4', name: 'Bookstore', coordinates: { x: 380, y: 200 }, arrivalTime: '10:15' },
            { id: 'f5', name: 'Campus Mall', coordinates: { x: 520, y: 180 }, arrivalTime: '10:20' },
            { id: 'f6', name: 'Student Center', coordinates: { x: 500, y: 300 }, arrivalTime: '10:25' },
        ],
        path: [
            { x: 450, y: 400 }, { x: 350, y: 320 }, { x: 280, y: 280 },
            { x: 380, y: 200 }, { x: 520, y: 180 }, { x: 550, y: 220 },
            { x: 500, y: 300 }, { x: 450, y: 400 }
        ]
    },
    {
        id: 'route-5',
        name: 'Night Service',
        color: '#8B5CF6', // Purple
        description: 'Limited night service for late-night activities',
        frequency: 'Every 30 minutes',
        operatingHours: '8:00 PM - 2:00 AM',
        stops: [
            { id: 'n1', name: 'Library', coordinates: { x: 400, y: 250 }, arrivalTime: '20:00' },
            { id: 'n2', name: 'Study Halls', coordinates: { x: 320, y: 300 }, arrivalTime: '20:10' },
            { id: 'n3', name: '24h Cafeteria', coordinates: { x: 280, y: 380 }, arrivalTime: '20:20' },
            { id: 'n4', name: 'Dorm Complex', coordinates: { x: 250, y: 480 }, arrivalTime: '20:30' },
            { id: 'n5', name: 'Security Office', coordinates: { x: 150, y: 200 }, arrivalTime: '20:40' },
        ],
        path: [
            { x: 400, y: 250 }, { x: 320, y: 300 }, { x: 280, y: 380 },
            { x: 250, y: 480 }, { x: 200, y: 400 }, { x: 150, y: 200 },
            { x: 300, y: 180 }, { x: 400, y: 250 }
        ]
    }
];
export function BusRoutesPage() {
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
    return (<div className="h-full flex">
      {/* Left Sidebar - Route List */}
      <div className="w-80 border-r bg-background">
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
              {busRoutes.map((route) => (<Card key={route.id} className={`cursor-pointer transition-all ${selectedRoute?.id === route.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedRoute(route)}>
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
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="w-5 h-5"/>
              Bus Routes Map
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-5rem)]">
            <div className="relative w-full h-full bg-background rounded-lg border overflow-hidden">
              <svg viewBox="0 0 700 600" className="w-full h-full" style={{ minHeight: '500px' }}>
                {/* Draw all selected route paths */}
                {busRoutes
            .filter(route => selectedRoutes.includes(route.id))
            .map((route) => (<g key={route.id}>
                      {/* Route path */}
                      <path d={`M ${route.path.map(p => `${p.x},${p.y}`).join(' L ')}`} stroke={route.color} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                      
                      {/* Bus stops */}
                      {route.stops.map((stop) => (<g key={stop.id}>
                          <circle cx={stop.coordinates.x} cy={stop.coordinates.y} r="8" fill="white" stroke={route.color} strokeWidth="3"/>
                          <circle cx={stop.coordinates.x} cy={stop.coordinates.y} r="4" fill={route.color}/>
                        </g>))}
                    </g>))}

                {/* Legend */}
                <g transform="translate(20, 20)">
                  <rect x="0" y="0" width="200" height={busRoutes.length * 25 + 40} fill="white" stroke="#e5e7eb" strokeWidth="1" rx="4" opacity="0.95"/>
                  <text x="10" y="20" fontSize="12" fontWeight="bold" fill="#374151">
                    Bus Routes Legend
                  </text>
                  {busRoutes.map((route, index) => (<g key={route.id} transform={`translate(10, ${35 + index * 25})`}>
                      <line x1="0" y1="0" x2="20" y2="0" stroke={route.color} strokeWidth="3" opacity={selectedRoutes.includes(route.id) ? 1 : 0.3}/>
                      <text x="25" y="4" fontSize="11" fill="#374151" opacity={selectedRoutes.includes(route.id) ? 1 : 0.5}>
                        {route.name}
                      </text>
                    </g>))}
                </g>
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Route Details */}
      <div className="w-80 border-l bg-background">
        <ScrollArea className="h-full">
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

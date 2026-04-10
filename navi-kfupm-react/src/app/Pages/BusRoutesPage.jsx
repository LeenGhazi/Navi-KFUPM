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
    id: 'route-purple',
    name: 'Purple Route',
    color: '#7E3AF2',
    description: 'Female student shuttle route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [
      { id: '900', name: 'Parking 900', coordinates: { x: 640, y: 1119 } },
      { id: '27', name: 'Clinic 27', coordinates: { x: 724, y: 921 } },
      { id: '312-a', name: 'Station 312', coordinates: { x: 325, y: 635 } },
      { id: '22-a', name: 'Station 22', coordinates: { x: 525, y: 817 } },
      { id: '319', name: 'Station 319', coordinates: { x: 760, y: 312 } },
      { id: '58', name: 'Station 58', coordinates: { x: 676, y: 186 } },
      { id: '309', name: 'Station 309', coordinates: { x: 744, y: 294 } },
      { id: '310', name: 'Station 310', coordinates: { x: 632, y: 490 } },
      { id: '312-b', name: 'Station 312', coordinates: { x: 325, y: 635 } },
      { id: '22-b', name: 'Station 22', coordinates: { x: 525, y: 817 } },
      { id: '314', name: 'Station 314', coordinates: { x: 702, y: 863 } },
      { id: '900-end', name: 'Parking 900', coordinates: { x: 640, y: 1119 } },
    ],
    path: [
      { x: 640, y: 1119 },
      { x: 662, y: 1060 },
      { x: 688, y: 995 },
      { x: 710, y: 955 },
      { x: 724, y: 921 },

      { x: 690, y: 900 },
      { x: 622, y: 860 },
      { x: 525, y: 817 },

      { x: 452, y: 760 },
      { x: 390, y: 700 },
      { x: 325, y: 635 },

      { x: 420, y: 720 },
      { x: 525, y: 817 },

      { x: 610, y: 740 },
      { x: 690, y: 650 },
      { x: 730, y: 560 },
      { x: 740, y: 470 },
      { x: 742, y: 380 },
      { x: 760, y: 312 },

      { x: 720, y: 250 },
      { x: 676, y: 186 },

      { x: 706, y: 235 },
      { x: 744, y: 294 },

      { x: 720, y: 355 },
      { x: 680, y: 430 },
      { x: 632, y: 490 },

      { x: 560, y: 540 },
      { x: 470, y: 590 },
      { x: 325, y: 635 },

      { x: 420, y: 720 },
      { x: 525, y: 817 },

      { x: 610, y: 838 },
      { x: 702, y: 863 },

      { x: 690, y: 940 },
      { x: 668, y: 1015 },
      { x: 640, y: 1119 },
    ]
  },

  {
    id: 'route-pink',
    name: 'Pink Route',
    color: '#EC4899',
    description: 'Female student shuttle route',
    frequency: 'Shuttle basis',
    operatingHours: '7:30 AM - 5:30 PM',
    stops: [
      { id: '312-a', name: 'Station 312', coordinates: { x: 325, y: 635 } },
      { id: '22-a', name: 'Station 22', coordinates: { x: 525, y: 817 } },
      { id: '319', name: 'Station 319', coordinates: { x: 760, y: 312 } },
      { id: '58', name: 'Station 58', coordinates: { x: 676, y: 186 } },
      { id: '309', name: 'Station 309', coordinates: { x: 744, y: 294 } },
      { id: '310', name: 'Station 310', coordinates: { x: 632, y: 490 } },
      { id: '312-b', name: 'Station 312', coordinates: { x: 325, y: 635 } },
      { id: '22-b', name: 'Station 22', coordinates: { x: 525, y: 817 } },
      { id: '314', name: 'Station 314', coordinates: { x: 702, y: 863 } },
    ],
    path: [
      { x: 325, y: 635 },
      { x: 420, y: 720 },
      { x: 525, y: 817 },

      { x: 610, y: 740 },
      { x: 690, y: 650 },
      { x: 730, y: 560 },
      { x: 740, y: 470 },
      { x: 742, y: 380 },
      { x: 760, y: 312 },

      { x: 720, y: 250 },
      { x: 676, y: 186 },

      { x: 706, y: 235 },
      { x: 744, y: 294 },

      { x: 720, y: 355 },
      { x: 680, y: 430 },
      { x: 632, y: 490 },

      { x: 560, y: 540 },
      { x: 470, y: 590 },
      { x: 325, y: 635 },

      { x: 420, y: 720 },
      { x: 525, y: 817 },

      { x: 610, y: 838 },
      { x: 702, y: 863 },
    ]
  },

  {
    id: 'route-orange',
    name: 'Orange Route',
    color: '#F59E0B',
    description: 'Female student shuttle route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [
      { id: '700', name: 'Station 700', coordinates: { x: 760, y: 312 } },
      { id: '58', name: 'Station 58', coordinates: { x: 676, y: 186 } },
      { id: '309', name: 'Station 309', coordinates: { x: 744, y: 294 } },
      { id: '310', name: 'Station 310', coordinates: { x: 632, y: 490 } },
      { id: '22', name: 'Station 22', coordinates: { x: 525, y: 817 } },
      { id: '312', name: 'Station 312', coordinates: { x: 325, y: 635 } },
      { id: '314', name: 'Station 314', coordinates: { x: 702, y: 863 } },
      { id: '700-end', name: 'Station 700', coordinates: { x: 760, y: 312 } },
    ],
    path: [
      { x: 760, y: 312 },
      { x: 720, y: 250 },
      { x: 676, y: 186 },

      { x: 706, y: 235 },
      { x: 744, y: 294 },

      { x: 720, y: 355 },
      { x: 680, y: 430 },
      { x: 632, y: 490 },

      { x: 600, y: 610 },
      { x: 560, y: 720 },
      { x: 525, y: 817 },

      { x: 452, y: 760 },
      { x: 390, y: 700 },
      { x: 325, y: 635 },

      { x: 470, y: 700 },
      { x: 610, y: 790 },
      { x: 702, y: 863 },

      { x: 720, y: 760 },
      { x: 740, y: 620 },
      { x: 748, y: 470 },
      { x: 760, y: 312 },
    ]
  },

  {
    id: 'route-red',
    name: 'Red Route',
    color: '#EF4444',
    description: 'Female student shuttle route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [
      { id: '900-a', name: 'Parking 900', coordinates: { x: 640, y: 1119 } },
      { id: '27', name: 'Clinic 27', coordinates: { x: 724, y: 921 } },
      { id: '900-b', name: 'Parking 900', coordinates: { x: 640, y: 1119 } },
    ],
    path: [
      { x: 640, y: 1119 },
      { x: 662, y: 1060 },
      { x: 688, y: 995 },
      { x: 710, y: 955 },
      { x: 724, y: 921 },

      { x: 700, y: 1005 },
      { x: 670, y: 1080 },
      { x: 640, y: 1119 },
    ]
  },

  {
    id: 'route-brown',
    name: 'Brown Route',
    color: '#A16207',
    description: 'Female student shuttle route',
    frequency: 'Shuttle basis',
    operatingHours: '6:30 AM - 5:30 PM',
    stops: [
      { id: '800', name: 'Station 800', coordinates: { x: 632, y: 490 } },
      { id: '58', name: 'Station 58', coordinates: { x: 676, y: 186 } },
      { id: '309', name: 'Station 309', coordinates: { x: 744, y: 294 } },
      { id: '800-end', name: 'Station 800', coordinates: { x: 632, y: 490 } },
    ],
    path: [
      { x: 632, y: 490 },
      { x: 650, y: 400 },
      { x: 662, y: 300 },
      { x: 676, y: 186 },

      { x: 706, y: 235 },
      { x: 744, y: 294 },

      { x: 700, y: 360 },
      { x: 660, y: 430 },
      { x: 632, y: 490 },
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
            <div className="relative w-full h-full">
              
  
              {/* Map image */}
              <img
                src="../../../../map.jpg"
                alt="KFUPM Map"
                className="w-full h-full object-contain"
              />

              {/* SVG overlay */}
              <svg
              viewBox="0 0 1061 1280"
              className="absolute inset-0 w-full h-full"
              >
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

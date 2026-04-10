import React, { useState, useRef } from 'react';
import { mockLocations, mockBusRoutes, mockMainPaths } from '../data/mockData';
import { Button } from '../Components/ui/button';
import { Badge } from '../Components/ui/badge';
import { Card } from '../Components/ui/card';
import { ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import { toast } from 'sonner';
export function CampusMap({ selectedCategories, showBusRoutes, showMainPaths, searchQuery, onLocationClick, routeFrom, routeTo, showMultipleRoutes, movingBuildingId, onBuildingMoved, }) {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hoveredLocation, setHoveredLocation] = useState(null);
    const [userLocation] = useState({ x: 400, y: 350 });
    const [locations, setLocations] = useState(mockLocations);
    const mapRef = useRef(null);
    const filteredLocations = locations.filter((location) => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(location.category);
        const matchesSearch = searchQuery === '' ||
            location.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.2, 3));
    };
    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.2, 0.5));
    };
    const handleMouseDown = (e) => {
        if (!movingBuildingId) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    };
    const handleMouseMove = (e) => {
        if (isDragging) {
            setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    const handleMapClick = (e) => {
        if (movingBuildingId && mapRef.current) {
            const svg = e.currentTarget;
            const point = svg.createSVGPoint();
            point.x = e.clientX;
            point.y = e.clientY;
            const svgP = point.matrixTransform(svg.getScreenCTM()?.inverse());
            // Adjust for pan and zoom
            const actualX = (svgP.x - pan.x) / zoom;
            const actualY = (svgP.y - pan.y) / zoom;
            // Update building location
            setLocations(prevLocations => prevLocations.map(loc => loc.id === movingBuildingId
                ? { ...loc, coordinates: { x: actualX, y: actualY } }
                : loc));
            // Show success message
            const movedBuilding = locations.find(loc => loc.id === movingBuildingId);
            toast.success(`Building "${movedBuilding?.name}" moved successfully!`);
            // Exit move mode
            if (onBuildingMoved) {
                onBuildingMoved();
            }
        }
    };
    const getCategoryColor = (category) => {
        const colors = {
            academic: '#3B82F6',
            restaurant: '#EF4444',
            cafe: '#F59E0B',
            dorm: '#8B5CF6',
            parking: '#6B7280',
            study_room: '#10B981',
            prayer_room: '#14B8A6',
            library: '#06B6D4',
            sports: '#F97316',
            restroom: '#84CC16',
        };
        return colors[category] || '#6B7280';
    };
    const generateRoutes = (from, to) => {
        if (!showMultipleRoutes) {
            return [
                {
                    id: 'direct',
                    name: 'Direct Route',
                    path: [from, to],
                    color: '#3B82F6',
                    distance: Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)),
                },
            ];
        }
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        return [
            {
                id: 'direct',
                name: 'Direct Route (Shortest)',
                path: [from, to],
                color: '#3B82F6',
                distance: Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)),
            },
            {
                id: 'scenic',
                name: 'Scenic Route (Via Library)',
                path: [
                    from,
                    { x: midX - 50, y: midY + 50 },
                    { x: midX, y: midY + 100 },
                    to,
                ],
                color: '#10B981',
                distance: Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)) * 1.3,
            },
            {
                id: 'accessible',
                name: 'Accessible Route (Elevator Access)',
                path: [
                    from,
                    { x: midX + 50, y: midY - 50 },
                    { x: midX, y: midY - 100 },
                    to,
                ],
                color: '#F59E0B',
                distance: Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)) * 1.25,
            },
        ];
    };
    const calculatedRoutes = routeFrom && routeTo
        ? (() => {
            const fromLoc = mockLocations.find((l) => l.id === routeFrom);
            const toLoc = mockLocations.find((l) => l.id === routeTo);
            if (fromLoc && toLoc) {
                return generateRoutes(fromLoc.coordinates, toLoc.coordinates);
            }
            return [];
        })()
        : [];
    return (<div className="relative w-full h-full bg-gray-100 dark:bg-gray-900 overflow-hidden rounded-lg border">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button size="icon" variant="secondary" onClick={handleZoomIn}>
          <ZoomIn className="w-4 h-4"/>
        </Button>
        <Button size="icon" variant="secondary" onClick={handleZoomOut}>
          <ZoomOut className="w-4 h-4"/>
        </Button>
      </div>

      {/* Legend */}
      <Card className="absolute bottom-4 left-4 z-10 p-3 max-w-xs shadow-lg">
        <div className="text-sm mb-2">Legend</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-500 border border-white"></div>
            <span>Academic</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-500 border border-white"></div>
            <span>Restaurant</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-amber-500 border border-white"></div>
            <span>Cafe</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-purple-500 border border-white"></div>
            <span>Dorm</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-500 border border-white"></div>
            <span>Parking</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-cyan-500 border border-white"></div>
            <span>Library</span>
          </div>
        </div>
      </Card>

      {/* Route Info */}
      {calculatedRoutes.length > 0 && (<Card className="absolute top-4 left-4 z-10 p-3 max-w-md shadow-lg">
          <div className="text-sm mb-2">Available Routes</div>
          <div className="space-y-2">
            {calculatedRoutes.map((route) => (<div key={route.id} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }}></div>
                <span className="flex-1">{route.name}</span>
                <span className="text-muted-foreground">
                  ~{Math.round(route.distance)} m
                </span>
              </div>))}
          </div>
        </Card>)}

      {/* Map Canvas */}
      <div ref={mapRef} className="w-full h-full cursor-grab active:cursor-grabbing relative" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <svg width="100%" height="100%" className="absolute inset-0 bg-[#E8EDE7]" style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center',
        }} onClick={handleMapClick}>
          {/* Campus Grid Pattern */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#D1D5DB" strokeWidth="0.5"/>
            </pattern>
            <filter id="shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {/* Background Grid */}
          <rect width="1000" height="1000" fill="url(#grid)"/>
          
          {/* Campus Roads */}
          <rect x="0" y="340" width="1000" height="20" fill="#9CA3AF" opacity="0.5"/>
          <rect x="390" y="0" width="20" height="1000" fill="#9CA3AF" opacity="0.5"/>
          <rect x="200" y="0" width="15" height="1000" fill="#9CA3AF" opacity="0.3"/>
          <rect x="600" y="0" width="15" height="1000" fill="#9CA3AF" opacity="0.3"/>
          <rect x="0" y="150" width="1000" height="15" fill="#9CA3AF" opacity="0.3"/>
          <rect x="0" y="550" width="1000" height="15" fill="#9CA3AF" opacity="0.3"/>
          
          {/* Green Spaces */}
          <circle cx="200" cy="200" r="40" fill="#86EFAC" opacity="0.4"/>
          <circle cx="700" cy="200" r="40" fill="#86EFAC" opacity="0.4"/>
          <circle cx="100" cy="400" r="40" fill="#86EFAC" opacity="0.4"/>
          <rect x="350" y="150" width="100" height="100" fill="#86EFAC" opacity="0.3" rx="10"/>

          {/* Main Paths */}
          {showMainPaths &&
            mockMainPaths.map((path) => (<g key={path.id}>
                <polyline points={path.path.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={path.color} strokeWidth="4" strokeDasharray="8,4" opacity="0.5"/>
              </g>))}

          {/* Bus Routes */}
          {showBusRoutes &&
            mockBusRoutes.map((route) => (<g key={route.id}>
                <polyline points={route.path.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={route.color} strokeWidth="5" opacity="0.7"/>
                {route.stops.map((stop) => (<g key={stop.id}>
                    <circle cx={stop.coordinates.x} cy={stop.coordinates.y} r="8" fill={route.color} stroke="white" strokeWidth="3"/>
                    <text x={stop.coordinates.x} y={stop.coordinates.y - 20} textAnchor="middle" className="text-xs fill-current font-semibold" style={{ fontSize: '11px', pointerEvents: 'none' }}>
                      🚌 {stop.name}
                    </text>
                  </g>))}
              </g>))}

          {/* Calculated Routes */}
          {calculatedRoutes.map((route) => (<g key={route.id}>
              <polyline points={route.path.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={route.color} strokeWidth="6" opacity="0.8" strokeDasharray={route.id === 'direct' ? '0' : '10,5'}/>
              {route.path.slice(1, -1).map((point, idx) => (<circle key={idx} cx={point.x} cy={point.y} r="5" fill={route.color} stroke="white" strokeWidth="2"/>))}
            </g>))}

          {/* Buildings as Rectangles */}
          {filteredLocations.map((location) => {
            const isHovered = hoveredLocation === location.id;
            const isRoutePoint = location.id === routeFrom || location.id === routeTo;
            const isMoving = location.id === movingBuildingId;
            const shape = location.buildingShape || { width: 50, height: 40 };
            const color = getCategoryColor(location.category);
            // Calculate building position (centered on coordinates)
            const buildingX = location.coordinates.x - shape.width / 2;
            const buildingY = location.coordinates.y - shape.height / 2;
            return (<g key={location.id} onClick={(e) => {
                    e.stopPropagation();
                    if (!movingBuildingId) {
                        onLocationClick(location);
                    }
                }} onMouseEnter={() => setHoveredLocation(location.id)} onMouseLeave={() => setHoveredLocation(null)} style={{ cursor: movingBuildingId ? 'not-allowed' : 'pointer' }}>
                {/* Building shadow */}
                <rect x={buildingX + 3} y={buildingY + 3} width={shape.width} height={shape.height} fill="rgba(0,0,0,0.2)" rx="4"/>
                
                {/* Building */}
                <rect x={buildingX} y={buildingY} width={shape.width} height={shape.height} fill={isMoving ? '#3B82F6' : color} stroke={isMoving ? '#FCD34D' : isRoutePoint ? '#FCD34D' : isHovered ? 'white' : '#E5E7EB'} strokeWidth={isMoving ? '5' : isRoutePoint ? '4' : isHovered ? '3' : '2'} opacity={isMoving ? '0.7' : '1'} opacity={isHovered ? '1' : '0.85'} rx="4" className="transition-all" filter={isHovered ? 'url(#shadow)' : undefined}/>
                
                {/* Building name */}
                <text x={location.coordinates.x} y={location.coordinates.y} textAnchor="middle" dominantBaseline="middle" className="fill-white font-bold text-shadow" style={{
                    fontSize: isHovered ? '11px' : '9px',
                    pointerEvents: 'none',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}>
                  {location.name}
                </text>

                {/* Route marker */}
                {isRoutePoint && (<>
                    <circle cx={location.coordinates.x} cy={buildingY - 15} r="10" fill={location.id === routeFrom ? '#3B82F6' : '#EF4444'} stroke="white" strokeWidth="2"/>
                    <text x={location.coordinates.x} y={buildingY - 15} textAnchor="middle" dominantBaseline="middle" className="fill-white font-bold" style={{ fontSize: '10px', pointerEvents: 'none' }}>
                      {location.id === routeFrom ? 'A' : 'B'}
                    </text>
                  </>)}
              </g>);
        })}

          {/* User Location */}
          <g>
            <circle cx={userLocation.x} cy={userLocation.y} r="30" fill="#22C55E" opacity="0.2" className="animate-pulse"/>
            <circle cx={userLocation.x} cy={userLocation.y} r="12" fill="#22C55E" stroke="white" strokeWidth="4"/>
            <circle cx={userLocation.x} cy={userLocation.y} r="5" fill="white"/>
          </g>
        </svg>
      </div>

      {/* Current Location Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <Badge variant="secondary" className="flex items-center gap-2 shadow-lg">
          <Navigation className="w-3 h-3 text-green-500"/>
          Your Current Location
        </Badge>
      </div>
    </div>);
}

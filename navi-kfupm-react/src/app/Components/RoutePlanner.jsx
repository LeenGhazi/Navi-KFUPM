import React from 'react';
import { mockLocations } from '../../mockData';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from './ui/select';
import { ArrowRight, X } from 'lucide-react';
export function RoutePlanner({ routeFrom, routeTo, onRouteFromChange, onRouteToChange, onClear }) {
    // Group locations by category
    const locationsByCategory = mockLocations.reduce((acc, loc) => {
        if (!acc[loc.category]) {
            acc[loc.category] = [];
        }
        acc[loc.category].push(loc);
        return acc;
    }, {});
    const hasRoute = routeFrom && routeTo;
    return (<div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="from-location" className="text-xs">From</Label>
        <Select value={routeFrom || ''} onValueChange={(value) => onRouteFromChange(value || null)}>
          <SelectTrigger id="from-location">
            <SelectValue placeholder="Select starting point"/>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(locationsByCategory).map(([category, locations]) => (<div key={category}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                  {category.replace('_', ' ')}
                </div>
                {locations.map((loc) => (<SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>))}
              </div>))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-center">
        <ArrowRight className="w-4 h-4 text-muted-foreground"/>
      </div>

      <div className="space-y-2">
        <Label htmlFor="to-location" className="text-xs">To</Label>
        <Select value={routeTo || ''} onValueChange={(value) => onRouteToChange(value || null)}>
          <SelectTrigger id="to-location">
            <SelectValue placeholder="Select destination"/>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(locationsByCategory).map(([category, locations]) => (<div key={category}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                  {category.replace('_', ' ')}
                </div>
                {locations.map((loc) => (<SelectItem key={loc.id} value={loc.id} disabled={loc.id === routeFrom}>
                    {loc.name}
                  </SelectItem>))}
              </div>))}
          </SelectContent>
        </Select>
      </div>

      {hasRoute && (<Button onClick={onClear} variant="outline" size="sm" className="w-full">
          <X className="w-3 h-3 mr-1"/>
          Clear Route
        </Button>)}

      {routeFrom === routeTo && routeFrom && (<p className="text-xs text-destructive">
          Start and destination cannot be the same
        </p>)}
    </div>);
}

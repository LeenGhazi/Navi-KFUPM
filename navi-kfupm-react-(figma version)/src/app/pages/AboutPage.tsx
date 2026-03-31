import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Map, Users, MessageSquare, Bus, Route, Search } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">About Navi-KFUPM</h1>
          <p className="text-muted-foreground text-lg">
            Your comprehensive campus navigation companion
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What is Navi-KFUPM?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Navi-KFUPM is a comprehensive campus navigation system designed specifically for 
              King Fahd University of Petroleum & Minerals. Our platform helps students, faculty, 
              and visitors navigate the campus with ease while building a community through shared 
              experiences.
            </p>
            <p>
              Whether you're looking for the nearest cafe, planning your route between classes, 
              or wanting to share your favorite campus memories, Navi-KFUPM has you covered.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="mt-1">
                  <Map className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Interactive Campus Map</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore the campus with color-coded buildings, real-time location tracking, 
                    and detailed building information.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1">
                  <Route className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Smart Route Planning</h3>
                  <p className="text-sm text-muted-foreground">
                    Get multiple route options between locations with distance calculations 
                    and accessibility features.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1">
                  <Search className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Advanced Search & Filter</h3>
                  <p className="text-sm text-muted-foreground">
                    Find locations by category, search by name, and discover nearest facilities 
                    based on your needs.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Stories & Memories</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your campus experiences, read stories from fellow students, 
                    and like your favorite memories.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1">
                  <Bus className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Campus Bus Routes</h3>
                  <p className="text-sm text-muted-foreground">
                    View bus routes, stops, and arrival times to plan your commute 
                    around campus.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1">
                  <Users className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Facility Information</h3>
                  <p className="text-sm text-muted-foreground">
                    See detailed facilities in each building including labs, printers, 
                    prayer rooms, bathrooms, and study rooms.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>Student</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Students can explore the map, share stories and memories about buildings, 
                  like stories from other students, submit maintenance complaints, and leave 
                  reviews for locations.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">System Admin</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  System administrators can manage users, moderate content, handle announcements, 
                  and oversee the platform's operation.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Maintenance Staff</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Maintenance staff can view and update complaint statuses, ensuring quick 
                  response to facility issues reported by students.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Guest</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Guests and visitors can access core map features to navigate the campus 
                  without needing to create an account.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Building Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Each building on our map provides detailed facility information to help you 
              find exactly what you need:
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>🧪 Computer & Research Labs</div>
              <div>🖨️ Printing Services</div>
              <div>🕌 Prayer Rooms</div>
              <div>🚻 Restroom Facilities</div>
              <div>📚 Study Rooms</div>
              <div>⏰ Operating Hours</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3">
              Navi-KFUPM is built with modern web technologies to provide a fast, 
              responsive, and reliable experience:
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">React</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="outline">Tailwind CSS</Badge>
              <Badge variant="outline">Vite</Badge>
              <Badge variant="outline">Radix UI</Badge>
              <Badge variant="outline">Lucide Icons</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              Ready to explore KFUPM campus? Here's how to get started:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Use the interactive map to explore different buildings</li>
              <li>Click on any building to see detailed information and facilities</li>
              <li>Read stories and memories shared by other students</li>
              <li>Sign up as a student to share your own experiences and like stories</li>
              <li>Use the route planner to find the best path between locations</li>
              <li>Filter locations by category to find exactly what you need</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
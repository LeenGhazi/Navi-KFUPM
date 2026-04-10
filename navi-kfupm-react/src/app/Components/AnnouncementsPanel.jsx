import React from 'react';
import { mockAnnouncements } from '../../mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { CalendarDays, Bell, AlertTriangle } from 'lucide-react';
export function AnnouncementsPanel() {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'academic':
                return <CalendarDays className="w-4 h-4"/>;
            case 'maintenance':
                return <AlertTriangle className="w-4 h-4"/>;
            default:
                return <Bell className="w-4 h-4"/>;
        }
    };
    const sortedAnnouncements = [...mockAnnouncements].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return (<Card className="h-full">
      <CardHeader>
        <CardTitle>University Announcements</CardTitle>
        <CardDescription>Important dates and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {sortedAnnouncements.map((announcement) => (<Card key={announcement.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      <div className="mt-1">{getCategoryIcon(announcement.category)}</div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{announcement.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {announcement.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(announcement.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(announcement.priority)}`} title={`${announcement.priority} priority`}/>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{announcement.content}</p>
                </CardContent>
              </Card>))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>);
}

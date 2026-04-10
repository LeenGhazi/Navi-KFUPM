import React from 'react';
import { AnnouncementsPanel } from '../Components/AnnouncementsPanel';
export function AnnouncementsPage() {
    return (<div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">University Announcements</h1>
        <AnnouncementsPanel />
      </div>
    </div>);
}

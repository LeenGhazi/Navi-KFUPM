import React from 'react';
import { ComplaintsPanel } from '@/app/components/ComplaintsPanel';
export function ComplaintsPage() {
    return (<div className="container mx-auto py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Maintenance Complaints</h1>
        <ComplaintsPanel />
      </div>
    </div>);
}

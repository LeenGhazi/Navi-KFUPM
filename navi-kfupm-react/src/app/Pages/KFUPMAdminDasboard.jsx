import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { FileText, MessageSquare, Route, CheckCircle, } from 'lucide-react';
{/* KFUPMAdminDashboard component is the main dashboard for KFUPM administrators. 
  It provides to submitting requests to the technical team, managing complaints,
   reviewing community paths, and verifying building comments. The dashboard displays these features as cards that the admin can click 
   on to navigate to the respective management pages. */  }
export function KFUPMAdminDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    // Redirect if not admin
    React.useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);
    {/* Array of features available to the KFUPM administrator. Each feature includes a title, description, icon, navigation path, 
      and styling classes for color and background. */  }
    const adminFeatures = [
        {
            title: 'Submit Request to Technical Team',
            description: 'Request updates about campus data, buildings, routes, and announcements',
            icon: FileText,
            path: '/kfupm-admin/requests-to-tech',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Complaints Management',
            description: 'Manage user complaints - approve, reject, or respond to feedback',
            icon: MessageSquare,
            path: '/kfupm-admin/complaints-management',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            title: 'Community Paths Review',
            description: 'Review and approve student-submitted community paths',
            icon: Route,
            path: '/kfupm-admin/community-paths-review',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Verify Building Comments',
            description: 'Review and approve public comments on campus buildings',
            icon: CheckCircle,
            path: '/kfupm-admin/verify-comments',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
    ];
    return (
    <div className="w-full px-8 py-8 h-full overflow-auto">{/* Main container for the admin dashboard with padding and full width.
     It includes a header section with a title and description, followed by a grid of feature cards. */  }
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">KFUPM Administrator Dashboard</h1>
        <p className="text-muted-foreground">
          Manage campus requests, feedback, community paths, and building reviews
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">

{/* Mapping over the adminFeatures array to render a card for each feature. Each card is clickable and navigates to the specified path when clicked.
 The card includes an icon, title, description, and a button to open the respective management page. */  }

        {adminFeatures.map((feature) => { 
            const Icon = feature.icon;
            return (<Card key={feature.path} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(feature.path)}>
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${feature.color}`}/>
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Open
                </Button>
              </CardContent>
            </Card>);
        })}
      </div>
    </div>);
}

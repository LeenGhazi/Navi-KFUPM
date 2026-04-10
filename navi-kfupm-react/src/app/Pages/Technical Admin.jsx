import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { FileText, Filter, MessageSquare, Bell, Users, } from 'lucide-react';
export function AdminDashboard() {
    const { user } = useAuth();
    if (!user || user.role !== 'maintenance_staff') {
        return <Navigate to="/" replace/>;
    }
    const adminFeatures = [
        {
            title: 'Administrator Requests',
            description: 'Review and process update requests from KFUPM Administrators',
            icon: FileText,
            path: '/admin/requests',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Filter Management',
            description: 'Add and manage service categories for map filters',
            icon: Filter,
            path: '/admin/filters',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Feedback Management',
            description: 'Review user feedback and technical issues',
            icon: MessageSquare,
            path: '/admin/feedback',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        
    ];
    return (<div className="container mx-auto px-4 py-8 h-full overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}. Manage all aspects of the Navi-KFUPM system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminFeatures.map((feature) => {
            const Icon = feature.icon;
            return (<Link key={feature.path} to={feature.path}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 ${feature.color}`}/>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Open
                  </Button>
                </CardContent>
              </Card>
            </Link>);
        })}
      </div>
    </div>);
}

import React from "react";
import { useAuth } from "../../AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { FileText, Filter, MessageSquare, Bell, Users, } from 'lucide-react';




const AdminDashboard = () => {// AdminDashboard component is the main dashboard for maintenance staff. */}
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user || user.role !== "maintenance_staff") {
    return <Navigate to="/" replace />;
  }

  {/* Array of options for the admin dashboard. Each option includes a title, description, icon, path for navigation, and styling classes for color and background. */  }


  const adminOptions = [
    {
      title: "Requests",
      description: "Send requests to technical team",
      icon: FileText,
      path: "/admin/requests",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Filter Management",
      description: "Manage filters",
      icon: Filter,
      path: "/admin/filters",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Complaints",
      description: "Manage complaints",
      icon: MessageSquare,
      path: "/admin/feedback",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Announcements",
      description: "Manage announcements",
      icon: Bell,
      path: "/admin/announcements",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];
  return (
    <div className="p-6">{/* Main container for the admin dashboard with padding. It includes a header section with a title and welcome message. */  }

      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="mb-6">Welcome, {user?.name}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mapping over the adminOptions array to render a card for each option. Each card is clickable and navigates to the specified path when clicked.
         The card includes an icon, title, description, and a button to open the respective section. */  }
        {adminOptions.map((item, index) => {
          const Icon = item.icon;

          return (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(item.path)}
            >
              <CardHeader>

                <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>

                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>

              </CardHeader>

              <CardContent>
                <Button className="w-full">Open</Button>
              </CardContent>

            </Card>
            );
        })}
        </div>
    </div>
    
  );
};

export { AdminDashboard }; //
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Badge } from "../Components/ui/badge";
import { Map, Users, MessageSquare, Bus, Route, Search } from "lucide-react";

const iconMap = {
  Map,
  Users,
  MessageSquare,
  Bus,
  Route,
  Search,
};

export function AboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/about-page");

        if (!response.ok) {
          throw new Error("Failed to fetch About page data");
        }

        const data = await response.json();
        setAboutData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPage();
  }, []);

  if (loading) {
    return <div className="p-6">Loading About page...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!aboutData) {
    return <div className="p-6">No About page data found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <section className="text-center space-y-2">
        <h1>{aboutData.hero.title}</h1>
        <p>{aboutData.hero.subtitle}</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{aboutData.introduction.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aboutData.introduction.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aboutData.keyFeatures.map((feature) => {
            const Icon = iconMap[feature.icon] || Map;

            return (
              <div key={feature.title} className="space-y-2">
                <Icon className="w-6 h-6" />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {aboutData.userRoles.map((role) => (
            <div key={role.title}>
              <Badge>{role.title}</Badge>
              <p className="mt-2">{role.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{aboutData.buildingFacilities.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{aboutData.buildingFacilities.description}</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {aboutData.buildingFacilities.facilities.map((facility) => (
              <Badge key={facility.title} variant="secondary">
                {facility.title}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{aboutData.technology.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{aboutData.technology.description}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {aboutData.technology.tools.map((tool) => (
              <Badge key={tool}>{tool}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{aboutData.gettingStarted.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{aboutData.gettingStarted.description}</p>

          <ol className="list-decimal list-inside mt-4 space-y-2">
            {aboutData.gettingStarted.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
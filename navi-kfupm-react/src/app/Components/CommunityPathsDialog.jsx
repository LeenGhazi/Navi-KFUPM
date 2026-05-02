import React, { useEffect, useState } from "react";
// UI Components adn icons
import { useAuth } from "../../AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Star, Navigation, MapPin, TrendingUp, } from "lucide-react";
import { toast } from "sonner";
// display the paths created by the community and allow users to rate them. 
// Only students can rate paths, and they can only rate each path once. 
// Admins can see the average rating but cannot rate paths themselves.
// Paths are sorted by average rating, and users can click a button to create a new path 
// (which will open the CreatePathDialog).
export function CommunityPathsDialog({ open, onOpenChange, onCreatePath, }) {
    const { user } = useAuth();
    const [paths, setPaths] = useState([]);
    useEffect(() => {
      if (!open) return;

      const fetchPaths = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/path-requests`);

          if (!res.ok) {
            throw new Error("Failed to fetch community paths");
          }

          const data = await res.json();

          const approvedPaths = data.filter((path) => path.status === "approved");

          setPaths(approvedPaths);
        } catch (error) {
          console.error(error);
          toast.error("Failed to load community paths");
        }
      };

      fetchPaths();
    }, [open]);
    const [sortBy, setSortBy] = useState("rating");
    const handleRatePath = (pathId, rating) => {
        if (!user || user.role !== "student") {
            toast.error("Only students can rate paths");
            return;
        }
        setPaths((prevPaths) => prevPaths.map((path) => {
            if (path.id === pathId) {
                const oldTotal = path.rating * path.ratingCount;
                const newRatingCount = path.userRating
                    ? path.ratingCount
                    : path.ratingCount + 1;
                const newTotal = path.userRating
                    ? oldTotal - path.userRating + rating
                    : oldTotal + rating;
                const newRating = newTotal / newRatingCount;
                return {
                    ...path,
                    rating: newRating,
                    ratingCount: newRatingCount,
                    userRating: rating,
                };
            }
            return path;
        }));
        toast.success("Rating submitted successfully!");
    };
    // render star ratings.
    const renderStars = (pathId, currentRating, userRating) => {
        const isStudent = user?.role === "student";
        return (<div className="flex items-center gap-1">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (<button key={star} onClick={() => handleRatePath(pathId, star)} disabled={!isStudent} className={`focus:outline-none ${isStudent ? "cursor-pointer" : "cursor-default"} disabled:cursor-default`}>
              <Star className={`w-4 h-4 transition-colors ${star <= (userRating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : star <= currentRating
                        ? "fill-yellow-200 text-yellow-200"
                        : "text-gray-300"}`}/>
            </button>))}
        </div>
        <span className="text-sm font-medium ml-1">
          {currentRating.toFixed(1)}
        </span>
        <span className="text-xs text-muted-foreground">
          (
          {paths.find((p) => p.id === pathId)?.ratingCount || 0}
          )
        </span>
      </div>);
    };
    // sorting paths base on the selected category.
    const sortedPaths = [...paths].sort((a, b) => {
        if (sortBy === "rating") {
            return b.rating - a.rating;
        }
        return 0;
    });
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5"/>
            Community Paths
          </DialogTitle>
          <DialogDescription>
            Browse and rate community-created navigation paths
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button size="sm" variant={sortBy === "rating" ? "default" : "outline"} onClick={() => setSortBy("rating")}>
              <TrendingUp className="w-4 h-4 mr-1"/>
              Top Rated
            </Button>
          </div>
          {user && user.role === "student" && (<Button size="sm" onClick={() => {
                onOpenChange(false);
                onCreatePath();
            }}>
              Create Path
            </Button>)}
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-3 pr-4">
            {sortedPaths.map((path) => (<Card key={path.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {path.pathName}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        by {path.creatorName || path.userId || "Community User"}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {path.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground"/>
                    <span className="font-medium">
                      {path.startLocation}
                    </span>
                    <span className="text-muted-foreground">
                      →
                    </span>
                    <span className="font-medium">
                      {path.endLocation}
                    </span>
                  </div>

                  <p className="text-sm">{path.description}</p>

                  <div className="flex items-center pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {user?.role === 'student'
                ? "Rate this path:"
                : "Average rating:"}
                      </span>
                      {renderStars(path.id, path.rating, path.userRating)}
                    </div>
                  </div>
                </div>
              </Card>))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>);
}

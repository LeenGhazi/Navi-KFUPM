import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  Star,
  Navigation,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

interface CommunityPath {
  id: string;
  title: string;
  from: string;
  to: string;
  description: string;
  creator: string;
  rating: number;
  ratingCount: number;
  userRating?: number;
  status: "Approved" | "Pending" | "Rejected";
}

interface CommunityPathsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePath: () => void;
}

// Mock community paths data
const mockPaths: CommunityPath[] = [
  {
    id: "path1",
    title: "Quick Route to Library",
    from: "Engineering Complex",
    to: "Central Library",
    description:
      "Leave the Engineering Complex through the main entrance and walk straight toward the central plaza. Turn right onto the covered walkway that runs between the academic buildings. Continue forward, passing Building 22, then turn slightly left toward the library courtyard. The Central Library entrance will be directly ahead.",
    creator: "Ahmed Al-Salem",
    rating: 4.8,
    ratingCount: 24,
    status: "Approved",
  },
  {
    id: "path2",
    title: "Scenic Campus Tour",
    from: "Main Gate",
    to: "Student Center",
    description:
      "Enter through the Main Gate and walk straight along the central garden pathway. Continue past the fountain area, then turn slightly right toward the landscaped courtyard. Follow the curved walkway through the garden section until you reach the Student Center building on your left.",
    creator: "Sara Al-Ghamdi",
    rating: 4.5,
    ratingCount: 18,
    status: "Approved",
  },
  {
    id: "path3",
    title: "Morning Jog Route",
    from: "Sports Complex",
    to: "Medical Center",
    description:
      "Start from the Sports Complex and follow the outer campus loop heading north. Keep right along the shaded pedestrian path beside the green field. Continue straight past the dormitory area, then turn left at the main intersection near the palm trees. Follow the curved path until you reach the Medical Center entrance.",
    creator: "Mohammed Al-Otaibi",
    rating: 4.7,
    ratingCount: 15,
    status: "Approved",
  },
  {
    id: "path4",
    title: "Study Break Walk",
    from: "Central Library",
    to: "Cafeteria Building",
    description:
      "Exit the Central Library from the main entrance and head south toward the academic square. Turn right at the first intersection and follow the pedestrian path between the buildings. Continue straight past the shaded seating area, then turn left toward the Cafeteria Building entrance.",
    creator: "Fatima Al-Zahrani",
    rating: 4.3,
    ratingCount: 12,
    status: "Approved",
  },
  {
    id: "path5",
    title: "Late Night Safe Path",
    from: "Dorms Building 1",
    to: "Engineering Complex",
    description:
      "Exit Dorms Building 1 and head east along the main pedestrian walkway. Continue straight past the cafeteria area, then turn left toward the central academic corridor. Follow the well-lit pathway beside Building 22 and continue straight until you reach the Engineering Complex entrance. The entire route stays within illuminated areas and avoids isolated sections.",
    creator: "Omar Al-Rashid",
    rating: 4.9,
    ratingCount: 31,
    status: "Approved",
  },
];

export function CommunityPathsDialog({
  open,
  onOpenChange,
  onCreatePath,
}: CommunityPathsDialogProps) {
  const { user } = useAuth();
  const [paths, setPaths] = useState<CommunityPath[]>(
    mockPaths.sort((a, b) => b.rating - a.rating),
  );
  const [sortBy, setSortBy] = useState<"rating" | "recent">(
    "rating",
  );

  const handleRatePath = (pathId: string, rating: number) => {
    if (!user || user.role !== "student") {
      toast.error("Only students can rate paths");
      return;
    }

    setPaths((prevPaths) =>
      prevPaths.map((path) => {
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
      }),
    );

    toast.success("Rating submitted successfully!");
  };

  const renderStars = (
    pathId: string,
    currentRating: number,
    userRating?: number,
  ) => {
    const isStudent = user?.role === "student";

    return (
      <div className="flex items-center gap-1">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatePath(pathId, star)}
              disabled={!isStudent}
              className={`focus:outline-none ${
                isStudent ? "cursor-pointer" : "cursor-default"
              } disabled:cursor-default`}
            >
              <Star
                className={`w-4 h-4 transition-colors ${
                  star <= (userRating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : star <= currentRating
                      ? "fill-yellow-200 text-yellow-200"
                      : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-sm font-medium ml-1">
          {currentRating.toFixed(1)}
        </span>
        <span className="text-xs text-muted-foreground">
          (
          {paths.find((p) => p.id === pathId)?.ratingCount || 0}
          )
        </span>
      </div>
    );
  };

  const sortedPaths = [...paths].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    return 0; // For 'recent' we'd sort by date
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Community Paths
          </DialogTitle>
          <DialogDescription>
            Browse and rate community-created navigation paths
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={
                sortBy === "rating" ? "default" : "outline"
              }
              onClick={() => setSortBy("rating")}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Top Rated
            </Button>
          </div>
          {user && user.role === "student" && (
            <Button
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onCreatePath();
              }}
            >
              Create Path
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-3 pr-4">
            {sortedPaths.map((path) => (
              <Card key={path.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {path.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        by {path.creator}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {path.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">
                      {path.from}
                    </span>
                    <span className="text-muted-foreground">
                      →
                    </span>
                    <span className="font-medium">
                      {path.to}
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
                      {renderStars(
                        path.id,
                        path.rating,
                        path.userRating,
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
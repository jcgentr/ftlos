import { useEffect, useState } from "react";
import { SingleSelectDropdown } from "./SingleSelectDropdown";
import { Button } from "./ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { RatingTableStatic } from "./RatingTable";
import { cn } from "@/lib/utils";
import { EntityType, SportCategory } from "@/hooks/useSportsData";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type ProfileRatingsProps = {
  sportsData: SportCategory[];
  isLoading: boolean;
};

export type UserRating = {
  id: string;
  userId: string;
  entityType: EntityType;
  entityId: number;
  entityName: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

// 12 rows; 6 min must be filled out

export function ProfileRatings({ sportsData, isLoading }: ProfileRatingsProps) {
  const { session } = useAuth();
  const [editingRatings, setEditingRatings] = useState(false);
  const [selects, setSelects] = useState<string[]>(Array(12).fill(""));
  const [ratings, setRatings] = useState<number[]>(Array(12).fill(0));
  const [userRatings, setUserRatings] = useState<UserRating[]>([]);
  const [combinedSportsData, setCombinedSportsData] = useState<SportCategory[]>([]);

  useEffect(() => {
    const fetchUserRatings = async () => {
      if (!session?.access_token || isLoading) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch ratings");

        const data = await response.json();
        setUserRatings(data);
      } catch (error) {
        console.error("Error fetching user ratings:", error);
        toast.error("Failed to load your ratings");
      }
    };

    if (!editingRatings) fetchUserRatings();
  }, [session, isLoading, editingRatings]);

  useEffect(() => {
    // Always start with a fresh copy of the original sportsData
    const newSportsData = JSON.parse(JSON.stringify(sportsData)) as SportCategory[];

    // Then add any entities from userRatings that don't exist in sportsData
    userRatings.forEach((rating) => {
      let categoryIndex = -1;

      if (rating.entityType === "ATHLETE") categoryIndex = 0;
      else if (rating.entityType === "TEAM") categoryIndex = 1;
      else if (rating.entityType === "SPORT") categoryIndex = 2;

      if (categoryIndex === -1 || !newSportsData[categoryIndex]) return;

      // Check if entity already exists
      const exists = newSportsData[categoryIndex].items.some(
        (item) => item.entityType === rating.entityType && item.entityId === rating.entityId
      );

      // If not, add it
      if (!exists) {
        newSportsData[categoryIndex].items.push({
          id: rating.entityId,
          entityId: rating.entityId,
          entityType: rating.entityType,
          value: rating.entityName,
          label: rating.entityName,
        });
      }
    });

    // Sort each category alphabetically
    newSportsData.forEach((category) => {
      category.items.sort((a, b) => a.label.localeCompare(b.label));
    });

    setCombinedSportsData(newSportsData);

    // Only update selects and ratings if we have userRatings
    if (userRatings.length > 0) {
      // Map ratings to items with values
      const ratingItems = userRatings.map((item) => {
        let value = "";

        // Find the corresponding item in newSportsData
        for (const category of newSportsData) {
          const matchingItem = category.items.find(
            (sportItem) => sportItem.entityType === item.entityType && sportItem.entityId === item.entityId
          );

          if (matchingItem) {
            value = matchingItem.value;
            break;
          }
        }

        return {
          value,
          rating: item.rating,
        };
      });

      // Sort by rating (highest to lowest)
      ratingItems.sort((a, b) => b.rating - a.rating);

      // Create new arrays with the sorted values
      const newSelects = Array(12).fill("");
      const newRatings = Array(12).fill(0);

      ratingItems.forEach((item, index) => {
        if (index < 12) {
          newSelects[index] = item.value;
          newRatings[index] = item.rating;
        }
      });

      setSelects(newSelects);
      setRatings(newRatings);
    }
  }, [sportsData, userRatings]);

  const handleSelectChange = (index: number, value: string) => {
    setSelects((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleRatingChange = (index: number, rating: number) => {
    setRatings((prev) => {
      const next = [...prev];
      next[index] = rating;
      return next;
    });
  };

  const getDisabledValues = (currentIndex: number) => {
    return selects.filter((_, idx) => idx !== currentIndex && selects[idx]);
  };

  const handleSaveRatings = async () => {
    try {
      // Filter out empty selections and ratings
      const validRatings = selects
        .map((value, idx) => ({ value, rating: ratings[idx] }))
        .filter((item) => item.value && item.rating !== 0);

      if (validRatings.length < 6) return;

      // Map the frontend selections to the backend expected format
      const ratingsPayload = validRatings.map((item) => {
        // Find the selected item in sportsData
        let entityType: EntityType | undefined;
        let entityId: number | undefined;

        // Search through all categories to find the matching item
        for (const category of combinedSportsData) {
          const foundItem = category.items.find((sportItem) => sportItem.value === item.value);
          if (foundItem) {
            entityType = foundItem.entityType;
            entityId = foundItem.entityId;
            break;
          }
        }

        if (!entityType || !entityId) {
          throw new Error(`Item not found: ${item.value}`);
        }

        return {
          entityType,
          entityId,
          rating: item.rating,
        };
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ ratings: ratingsPayload }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save ratings");
      }

      toast.success("Ratings saved successfully!");
      setEditingRatings(false);
    } catch (error) {
      console.error("Error saving ratings:", error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };
  const selectsLength = selects.filter(Boolean).length;
  const ratingsLength = ratings.filter(Boolean).length;
  const submitDisabled = selectsLength < 6 || ratingsLength < 6;

  return (
    <div className="mt-8 bg-white p-8 border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Build your profile</h2>
      {editingRatings ? (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground mb-4">
            You must fill out at least six rows, selecting an athlete, team, or sport and rating each from{" "}
            <span className="font-semibold text-red-600">-5</span> to{" "}
            <span className="font-semibold text-green-600">+5</span>.
          </p>
          <div className="mx-0 md:mx-4 space-y-4">
            {[...Array(12).keys()].map((idx) => (
              <RatingRow
                key={idx}
                value={selects[idx]}
                onChange={(val) => handleSelectChange(idx, val)}
                rating={ratings[idx]}
                onRatingChange={(rating) => handleRatingChange(idx, rating)}
                disabledValues={getDisabledValues(idx)}
                sportsData={combinedSportsData}
                isLoading={isLoading}
              />
            ))}
          </div>
          <div className="w-full flex justify-between">
            <Button variant="outline" onClick={() => setEditingRatings(false)}>
              Cancel
            </Button>
            <Button disabled={submitDisabled} onClick={handleSaveRatings}>
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <RatingTableStatic ratings={userRatings} />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setEditingRatings(true)}>Edit Ratings</Button>
          </div>
        </>
      )}
    </div>
  );
}

interface RatingRowProps {
  value: string;
  onChange: (value: string) => void;
  rating: number;
  onRatingChange: (rating: number) => void;
  disabledValues: string[];
  sportsData: SportCategory[];
  isLoading: boolean;
}

function RatingRow({ value, onChange, rating, onRatingChange, disabledValues, sportsData, isLoading }: RatingRowProps) {
  const handleThumbsUp = () => {
    onRatingChange(Math.min(rating + 1, 5));
  };

  const handleThumbsDown = () => {
    onRatingChange(Math.max(rating - 1, -5));
  };

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <SingleSelectDropdown
        selectedValue={value}
        onChange={onChange}
        disabledValues={disabledValues}
        sportsData={sportsData}
        isLoading={isLoading}
      />
      <div className="flex shrink-0 items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleThumbsDown}
                variant="outline"
                size="icon"
                className="bg-red-100 hover:bg-red-200 border-red-300 text-red-600"
                aria-label="Thumbs down"
              >
                <ThumbsDown className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Decrease rating</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div
          className={cn(
            "text-sm font-medium flex items-center justify-center w-8 h-6",
            rating < 0 ? "text-red-600" : rating > 0 ? "text-green-600" : "text-gray-900"
          )}
        >
          {rating > 0 ? `+${rating}` : rating}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleThumbsUp}
                variant="outline"
                size="icon"
                className="bg-green-100 hover:bg-green-200 border-green-300 text-green-600"
                aria-label="Thumbs up"
              >
                <ThumbsUp className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Increase rating</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

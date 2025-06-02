import { useState } from "react";
import { SingleSelectDropdown, sportsOptions } from "./SingleSelectDropdown";
import { Button } from "./ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { RatingTableStatic } from "./RatingTable";
import { cn } from "@/lib/utils";

// 12 rows; 6 min must be filled out

export function ProfileRatings() {
  const [editingRatings, setEditingRatings] = useState(false);
  const [selects, setSelects] = useState<string[]>(Array(12).fill(""));
  const [ratings, setRatings] = useState<number[]>(Array(12).fill(0));

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

  const getLabelForValue = (value: string) => {
    if (!value) return "";
    for (const group of sportsOptions) {
      const item = group.items.find((item) => item.value === value);
      if (item) return item.label;
    }
    return "";
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
          <div className="ml-4 space-y-4">
            {[...Array(12).keys()].map((idx) => (
              <RatingRow
                key={idx}
                value={selects[idx]}
                onChange={(val) => handleSelectChange(idx, val)}
                rating={ratings[idx]}
                onRatingChange={(rating) => handleRatingChange(idx, rating)}
                disabledValues={getDisabledValues(idx)}
              />
            ))}
          </div>
          <div className="w-full flex justify-between">
            <Button variant="outline" onClick={() => setEditingRatings(false)}>
              Cancel
            </Button>
            <Button disabled={submitDisabled} onClick={() => setEditingRatings(false)}>
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <RatingTableStatic
              selections={
                selects
                  .map((value, idx) => {
                    if (!value) return null;
                    const rating = ratings[idx];
                    if (rating === 0) return null;
                    const label = getLabelForValue(value);

                    return {
                      name: label,
                      rating: rating,
                    };
                  })
                  .filter(Boolean) as { name: string; rating: number }[]
              }
            />
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
}

function RatingRow({ value, onChange, rating, onRatingChange, disabledValues }: RatingRowProps) {
  const handleThumbsUp = () => {
    onRatingChange(Math.min(rating + 1, 5));
  };

  const handleThumbsDown = () => {
    onRatingChange(Math.max(rating - 1, -5));
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="flex items-center gap-3">
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
      <SingleSelectDropdown selectedValue={value} onChange={onChange} disabledValues={disabledValues} />
    </div>
  );
}

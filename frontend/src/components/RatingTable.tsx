import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface Athlete {
  name: string;
  category: string;
  sport: string;
  rating: number;
}

const athletes: Athlete[] = [
  { name: "Stephen Curry", category: "Player", sport: "Basketball", rating: 5 },
  { name: "Simone Biles", category: "Athlete", sport: "Gymnastics", rating: 5 },
  { name: "Lewis Hamilton", category: "Driver", sport: "Formula 1", rating: 4 },
  { name: "Lionel Messi", category: "Player", sport: "Football (Soccer)", rating: 5 },
  { name: "Serena Williams", category: "Player", sport: "Tennis", rating: 5 },
  { name: "Tom Brady", category: "Player", sport: "American Football", rating: 4 },
  { name: "Michael Phelps", category: "Swimmer", sport: "Swimming", rating: 5 },
];

export function RatingTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Sport</TableHead>
          <TableHead className="text-right">Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {athletes.map((athlete) => (
          <TableRow key={athlete.name}>
            <TableCell className="font-medium">{athlete.name}</TableCell>
            <TableCell>{athlete.category}</TableCell>
            <TableCell>{athlete.sport}</TableCell>
            <TableCell className="flex justify-end">
              <RatingButtons />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface RatingSelection {
  name: string;
  rating: number;
}

interface RatingTableStaticProps {
  selections: RatingSelection[];
}

export function RatingTableStatic({ selections }: RatingTableStaticProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          {/* <TableHead>Category</TableHead> */}
          {/* <TableHead>Sport</TableHead> */}
          <TableHead className="text-right">Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {selections.length > 0 ? (
          selections
            .sort((a, b) => b.rating - a.rating)
            .map(({ name, rating }) => (
              <TableRow key={name}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell className="flex justify-end">
                  <div
                    className={cn(
                      "text-sm font-medium flex items-center justify-center w-8 h-6",
                      rating < 0 ? "text-red-600" : rating > 0 ? "text-green-600" : "text-gray-900"
                    )}
                  >
                    {rating > 0 ? `+${rating}` : rating}
                  </div>
                </TableCell>
              </TableRow>
            ))
        ) : (
          <TableRow>
            <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
              No selections yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function RatingButtons() {
  const [rating, setRating] = useState<number>(0);

  const handleThumbsUp = () => {
    setRating((prev) => Math.min(prev + 1, 5));
  };

  const handleThumbsDown = () => {
    setRating((prev) => Math.max(prev - 1, -5));
  };

  return (
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
  );
}

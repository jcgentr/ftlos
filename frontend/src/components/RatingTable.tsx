import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

function RatingButtons() {
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
  };

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <Button
          key={rating}
          onClick={() => handleRatingClick(rating)}
          className={cn(
            "h-10 w-10 rounded-md border text-center text-sm transition-colors",
            selectedRating === rating
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background text-foreground hover:bg-primary/10"
          )}
          aria-label={`Rate ${rating} out of 5`}
        >
          {rating}
        </Button>
      ))}
    </div>
  );
}

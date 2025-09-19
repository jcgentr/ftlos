import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EntityType, UserRating } from "@/lib/types";
import { cn, createGoogleSearchLink } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface RatingTableStaticProps {
  ratings: UserRating[];
}

export function RatingTableStatic({ ratings }: RatingTableStaticProps) {
  const strongestRatings = ratings.slice(0, 6);
  const remainingRatings = ratings.slice(6);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ratings.length > 0 ? (
          <>
            {/* Top ratings */}
            {strongestRatings.map((rating) => (
              <RatingRow key={rating.id} rating={rating} />
            ))}

            {/* Visual separator and remaining ratings */}
            {remainingRatings.length > 0 && (
              <>
                <TableRow>
                  <TableCell colSpan={3} className="py-2">
                    <div className="text-xs text-center text-gray-500 py-1">Additional Ratings</div>
                  </TableCell>
                </TableRow>

                {remainingRatings.map((rating) => (
                  <RatingRow key={rating.id} rating={rating} />
                ))}
              </>
            )}
          </>
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
              No selections yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function RatingRow({ rating, className }: { rating: UserRating; className?: string }) {
  const { id, entityName, entityType, rating: ratingValue } = rating;

  return (
    <TableRow key={id} className={className}>
      <TableCell className="font-medium">
        <div className="flex items-center">
          {entityName}
          {(entityType === EntityType.TEAM || entityType === EntityType.ATHLETE) && (
            <a
              href={createGoogleSearchLink(entityName)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center ml-1 text-blue-500 hover:text-blue-700"
              title={`Search for ${entityName} on Google`}
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
            </a>
          )}
        </div>
      </TableCell>
      <TableCell className="font-medium">{entityType.charAt(0) + entityType.slice(1).toLowerCase()}</TableCell>
      <TableCell className="flex justify-end">
        <div
          className={cn(
            "text-sm font-medium flex items-center justify-center w-8 h-6",
            ratingValue < 0 ? "text-red-600" : ratingValue > 0 ? "text-green-600" : "text-gray-900"
          )}
        >
          {ratingValue > 0 ? `+${ratingValue}` : ratingValue}
        </div>
      </TableCell>
    </TableRow>
  );
}

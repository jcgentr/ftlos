import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserRating } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RatingTableStaticProps {
  ratings: UserRating[];
}

export function RatingTableStatic({ ratings }: RatingTableStaticProps) {
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
          ratings
            .sort((a, b) => b.rating - a.rating)
            .map(({ id, entityName, entityType, rating }) => (
              <TableRow key={id}>
                <TableCell className="font-medium">{entityName}</TableCell>
                <TableCell className="font-medium">
                  {entityType.charAt(0) + entityType.slice(1).toLowerCase()}
                </TableCell>
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
            <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
              No selections yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

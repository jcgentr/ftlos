import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
            <TableCell className="text-right">{athlete.rating}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

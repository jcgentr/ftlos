import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function Rankings() {
  return (
    <div className="p-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Search Rankings</h1>
        <div className="flex items-center gap-2 p-8 border border-accent rounded-lg">
          <Input type="text" placeholder="Search for team or player" />
          <div className="w-[300px]">
            <Select defaultValue="all-categories">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  <SelectItem value="teams">Teams</SelectItem>
                  <SelectItem value="players">Players</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[300px]">
            <Select defaultValue="all-sports">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-sports">All Sports</SelectItem>
                  <SelectItem value="baseball">Baseball</SelectItem>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="boston-red-sox">Boston Red Sox</SelectItem>
                  <SelectItem value="chicago-bulls">Chicago Bulls</SelectItem>
                  <SelectItem value="football">Football</SelectItem>
                  <SelectItem value="green-bay-packers">Green Bay Packers</SelectItem>
                  <SelectItem value="la-lakers">LA Lakers</SelectItem>
                  <SelectItem value="new-england-patriots">New England Patriots</SelectItem>
                  <SelectItem value="new-york-yankees">New York Yankees</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button>Search</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
          <div className="border border-accent rounded-lg">
            <div className="flex justify-between items-center p-4 border-b border-accent">
              <h2 className="text-3xl font-semibold flex items-center gap-2">
                <ThumbsUp className="flex-none" /> Most Popular Teams
              </h2>
              <div className="bg-green-600 text-white px-3 py-1 w-fit rounded-lg text-sm">Top 5</div>
            </div>
            <div className="text-center">
              <p className="p-8">No teams rated yet.</p>
            </div>
          </div>

          <div className="border border-accent rounded-lg">
            <div className="flex justify-between items-center p-4 border-b border-accent">
              <h2 className="text-3xl font-semibold flex items-center gap-2">
                <ThumbsUp className="flex-none" /> Most Popular Players
              </h2>
              <div className="bg-green-600 text-white px-3 py-1 w-fit rounded-lg text-sm">Top 5</div>
            </div>
            <div className="text-center">
              <p className="p-8">No players rated yet.</p>
            </div>
          </div>

          <div className="border border-accent rounded-lg">
            <div className="flex justify-between items-center p-4 border-b border-accent">
              <h2 className="text-3xl font-semibold flex items-center gap-2">
                <ThumbsDown className="flex-none" /> Least Popular Teams
              </h2>
              <div className="bg-red-600 text-white px-3 py-1 w-fit rounded-lg text-sm">Bottom 5</div>
            </div>
            <div className="text-center">
              <p className="p-8">No teams rated yet.</p>
            </div>
          </div>

          <div className="border border-accent rounded-lg">
            <div className="flex justify-between items-center p-4 border-b border-accent">
              <h2 className="text-3xl font-semibold flex items-center gap-2">
                <ThumbsDown className="flex-none" /> Least Popular Players
              </h2>
              <div className="bg-red-600 text-white px-3 py-1 w-fit rounded-lg text-sm">Bottom 5</div>
            </div>
            <div className="text-center">
              <p className="p-8">No players rated yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

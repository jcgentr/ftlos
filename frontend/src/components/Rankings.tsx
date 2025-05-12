import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function Rankings() {
  return (
    <div className="p-8 max-w-5xl w-full mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-4">Search Rankings</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 p-8 border border-gray-300 bg-white rounded-lg">
          <Input type="text" placeholder="Search for team or player" />
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
          <Select defaultValue="all-sports">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-sports">All Sports</SelectItem>
                <SelectItem value="american-football">American Football</SelectItem>
                <SelectItem value="football-soccer">Football (Soccer)</SelectItem>
                <SelectItem value="tennis">Tennis</SelectItem>
                <SelectItem value="baseball">Baseball</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button className="w-full sm:w-fit">Search</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
          <div className="border border-gray-300 bg-white rounded-lg">
            <div className="flex flex-wrap gap-2 justify-between items-center p-4 border-b border-gray-300">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <ThumbsUp className="flex-none" /> Most Popular Teams
              </h2>
              <div className="bg-green-100 text-green-700 border border-green-700 px-3 py-1 w-fit rounded-lg text-sm">
                Top 5
              </div>
            </div>
            <div className="text-center">
              <p className="p-8">No teams rated yet.</p>
            </div>
          </div>

          <div className="border border-gray-300 bg-white rounded-lg">
            <div className="flex flex-wrap gap-2 justify-between items-center p-4 border-b border-gray-300">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <ThumbsUp className="flex-none" /> Most Popular Players
              </h2>
              <div className="bg-green-100 text-green-700 border border-green-700 px-3 py-1 w-fit rounded-lg text-sm">
                Top 5
              </div>
            </div>
            <div className="text-center">
              <p className="p-8">No players rated yet.</p>
            </div>
          </div>

          <div className="border border-gray-300 bg-white rounded-lg">
            <div className="flex flex-wrap gap-2 justify-between items-center p-4 border-b border-gray-300">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <ThumbsDown className="flex-none" /> Least Popular Teams
              </h2>
              <div className="bg-red-100 text-red-700 border border-red-700 px-3 py-1 w-fit rounded-lg text-sm">
                Bottom 5
              </div>
            </div>
            <div className="text-center">
              <p className="p-8">No teams rated yet.</p>
            </div>
          </div>

          <div className="border border-gray-300 bg-white rounded-lg">
            <div className="flex flex-wrap gap-2 justify-between items-center p-4 border-b border-gray-300">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <ThumbsDown className="flex-none" /> Least Popular Players
              </h2>
              <div className="bg-red-100 text-red-700 border border-red-700 px-3 py-1 w-fit rounded-lg text-sm">
                Bottom 5
              </div>
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

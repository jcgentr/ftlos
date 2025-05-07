import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function Fans() {
  return (
    <div className="p-8 max-w-5xl w-full mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-4">Find a Fan</h1>
        <div className="flex items-center gap-2 p-8 border border-gray-300 bg-white rounded-lg">
          <Input type="text" placeholder="Search by name" />
          <Input type="text" placeholder="City, Country" />
          <Select defaultValue="any-sport">
            <SelectTrigger>
              <SelectValue placeholder="Any Sport" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="any-sport">Any Sport</SelectItem>
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
          <Input type="text" placeholder="Search by team" />
          <Button>Search</Button>
        </div>

        <div className="mt-8 p-8 border border-gray-300 bg-white rounded-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Fans For You</h2>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter Recommendations" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="similar-teams">Similar Teams</SelectItem>
                <SelectItem value="nearby-fans">Nearby Fans</SelectItem>
                <SelectItem value="similar-events">Similar Events</SelectItem>
                <SelectItem value="mutual-friends">Mutual Friends</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Improve this blue coloring */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
            <h1 className="text-2xl font-bold text-blue-700 mb-2">Welcome to Find a Fan!</h1>
            <p className="text-blue-600">We'll show personalized fan recommendations here once you:</p>
            <ul className="list-disc list-inside text-blue-600 mt-4 space-y-1">
              <li>Complete your profile with your favorite teams and players</li>
              <li>Connect with other fans</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

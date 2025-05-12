import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function Fans() {
  return (
    <div className="p-8 max-w-5xl w-full mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-4">Find a Fan</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 p-8 border border-gray-300 bg-white rounded-lg">
          <Input type="text" placeholder="Search by name" />
          <Input type="text" placeholder="City, Country" />
          <Select defaultValue="any-sport">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any Sport" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="any-sport">Any Sport</SelectItem>
                <SelectItem value="american-football">American Football</SelectItem>
                <SelectItem value="football-soccer">Football (Soccer)</SelectItem>
                <SelectItem value="tennis">Tennis</SelectItem>
                <SelectItem value="baseball">Baseball</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input type="text" placeholder="Search by team" />
          <Button className="w-full sm:w-fit">Search</Button>
        </div>

        <div className="mt-8 p-8 border border-gray-300 bg-white rounded-lg">
          <div className="flex items-center justify-between flex-wrap gap-2">
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
          <div className="bg-primary-foreground border border-primary rounded-lg p-6 my-6">
            <h1 className="text-2xl font-bold text-primary mb-2">Welcome to Find a Fan!</h1>
            <p className="text-primary">We'll show personalized fan recommendations here once you:</p>
            <ul className="list-disc list-inside text-primary mt-4 space-y-1">
              <li>Complete your profile with your favorite teams and players</li>
              <li>Connect with other fans</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

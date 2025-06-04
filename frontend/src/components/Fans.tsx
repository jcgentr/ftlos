import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router";
import { useSports } from "@/hooks/useSports";

interface Fan {
  supabaseId: string;
  name: string;
  location: string;
  profileImageUrl?: string;
  favoriteSports?: string;
}

export function Fans() {
  const { session } = useAuth();
  const { sports, isLoading: isLoadingSports } = useSports();
  const [nameQuery, setNameQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [sportQuery, setSportQuery] = useState("any-sport");
  const [teamQuery, setTeamQuery] = useState("");
  const [fans, setFans] = useState<Fan[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    // Validate that at least name or location is provided
    if (!nameQuery && !locationQuery) {
      toast.error("Please provide a name or location to search");
      return;
    }

    setIsSearching(true);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (nameQuery) params.append("name", nameQuery);
      if (locationQuery) params.append("location", locationQuery);

      // TODO: add these parameters later when implementing the full search
      // if (sportQuery !== "any-sport") params.append("sport", sportQuery);
      // if (teamQuery) params.append("team", teamQuery);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/search?${params}`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to search users");
      }

      const data = await response.json();
      setFans(data);

      if (data.length === 0) {
        toast.info("No fans found matching your criteria");
      }
    } catch (error) {
      console.error("Error searching fans:", error);
      toast.error("Error searching for fans");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl w-full mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-4">Find a Fan</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row items-center gap-2 p-8 border border-gray-300 bg-white rounded-lg"
        >
          <Input
            type="text"
            placeholder="Search by name"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
          />
          <Input
            type="text"
            placeholder="City, Country"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />
          <Select value={sportQuery} onValueChange={setSportQuery} defaultValue="any-sport">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any Sport" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="any-sport">Any Sport</SelectItem>
                {isLoadingSports ? (
                  <SelectItem value="loading" disabled>
                    Loading sports...
                  </SelectItem>
                ) : (
                  sports.map((sport) => (
                    <SelectItem key={sport.id} value={sport.slug}>
                      {sport.name}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Search by team"
            value={teamQuery}
            onChange={(e) => setTeamQuery(e.target.value)}
          />
          <Button
            type="submit"
            className="w-full sm:w-fit"
            onClick={handleSearch}
            disabled={isSearching || (!nameQuery && !locationQuery)}
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {fans.map((fan) => (
            <Link to={`/profile/${fan.supabaseId}`}>
              <div
                key={fan.supabaseId}
                className="border border-gray-300 bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  {fan.profileImageUrl ? (
                    <img src={fan.profileImageUrl} alt={fan.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {fan.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{fan.name}</h3>
                    <p className="text-gray-600">{fan.location}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
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

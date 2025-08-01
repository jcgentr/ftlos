import { useAuth } from "@/contexts/AuthContext";
import { useRecommendedUsers } from "@/hooks/useRecommendedUsers";
import { useSports } from "@/hooks/useSports";
import { useTeams } from "@/hooks/useTeams";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { EntityType } from "@/lib/types";
import { SingleSelectDropdown } from "./SingleSelectDropdown";
import { UserCard } from "./UserCard";

interface Fan {
  id: string;
  supabaseId: string;
  name: string;
  location: string;
  profileImageUrl?: string;
}

export function Fans() {
  const { session } = useAuth();
  const { teams, isLoading: isLoadingTeams } = useTeams();
  const { sports, isLoading: isLoadingSports } = useSports();
  const { recommendations, userMeetsCriteria } = useRecommendedUsers();
  const [nameQuery, setNameQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("any-sport");
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
      const params = new URLSearchParams();
      if (nameQuery) params.append("name", nameQuery);
      if (locationQuery) params.append("location", locationQuery);
      // Convert sportFilter (slug) to sportId if it's not "any-sport"
      if (sportFilter !== "any-sport") {
        const selectedSport = sports.find((sport) => sport.slug === sportFilter);
        if (selectedSport) {
          params.append("sportId", selectedSport.id.toString());
        }
      }
      if (teamQuery) params.append("team", teamQuery);

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
    <div className="p-4 sm:p-8 max-w-5xl w-full mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-4">Find a Fan</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row items-center gap-2 p-4 sm:p-8 border border-gray-300 bg-white rounded-lg"
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
          <Select value={sportFilter} onValueChange={setSportFilter} defaultValue="any-sport">
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
          <div className="w-full">
            <SingleSelectDropdown
              selectedValue={teamQuery}
              onChange={(value) => setTeamQuery(value)}
              placeholder="Search by team"
              sportsData={[
                {
                  category: "Teams",
                  items: teams.map((team) => ({
                    id: team.id,
                    entityId: team.id,
                    entityType: "TEAM" as EntityType.TEAM,
                    value: team.name,
                    label: team.name,
                  })),
                },
              ]}
              isLoading={isLoadingTeams}
            />
          </div>
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
            <UserCard key={fan.supabaseId} user={fan} showFriendButton={true} />
          ))}
        </div>

        <div className="mt-8 p-4 sm:p-8 border border-gray-300 bg-white rounded-lg">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-2xl font-semibold">Fans For You</h2>
          </div>

          {userMeetsCriteria && recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              {recommendations.map((user) => (
                <UserCard key={user.supabaseId} user={user} showFriendButton={true} />
              ))}
            </div>
          ) : (
            <div className="bg-primary-foreground border border-primary rounded-lg p-6 my-6">
              <h1 className="text-2xl font-bold text-primary mb-2">Welcome to Find a Fan!</h1>
              <p className="text-primary">We'll show personalized fan recommendations here once you:</p>
              <ul className="list-disc list-inside text-primary mt-4 space-y-1">
                <li>Complete your profile with your favorite teams and players</li>
                <li>Connect with other fans</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

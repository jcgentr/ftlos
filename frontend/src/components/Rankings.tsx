import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useSports } from "@/hooks/useSports";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Rankings() {
  const { sports, isLoading: isLoadingSports } = useSports();
  const [sportQuery, setSportQuery] = useState("any-sport");

  return (
    <div className="p-8 max-w-5xl w-full mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-4">Search Rankings</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 p-8 border border-gray-300 bg-white rounded-lg">
          <Input type="text" placeholder="Search for team or athlete" />
          <Select defaultValue="all-categories">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-categories">All Categories</SelectItem>
                <SelectItem value="teams">Teams</SelectItem>
                <SelectItem value="athletes">Athletes</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
          <Button className="w-full sm:w-fit">Search</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
          <TopTeamsRanking />
          <TopAthletesRanking />
          <BottomTeamsRanking />
          <BottomAthletesRanking />
        </div>
      </div>
    </div>
  );
}

type Team = {
  id: number;
  name: string;
  sportName: string;
  avgRating: number;
  ratingCount: number;
};

function TopTeamsRanking() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopTeams = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rankings/teams/top`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch top teams");
        }

        const data = await response.json();
        setTeams(data);
      } catch (err) {
        console.error("Error fetching top teams:", err);
        toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopTeams();
  }, []);

  return (
    <div className="border border-gray-300 bg-white rounded-lg">
      <div className="flex flex-wrap gap-2 justify-between items-center p-4 border-b border-gray-300">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <ThumbsUp className="flex-none" /> Most Popular Teams
        </h2>
        <div className="bg-green-100 text-green-700 border border-green-700 px-3 py-1 w-fit rounded-lg text-sm">
          Top 5
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : teams.length === 0 ? (
        <div className="p-8 text-center">No teams rated yet.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {teams.map((team) => (
            <li key={team.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{team.name}</h3>
                  <p className="text-sm text-gray-500">{team.sportName}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {team.avgRating > 0 ? "+" : ""}
                    {team.avgRating}
                  </div>
                  <div className="text-xs text-gray-500">
                    {team.ratingCount} rating{team.ratingCount === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BottomTeamsRanking() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBottomTeams = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rankings/teams/bottom`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch bottom teams");
        }

        const data = await response.json();
        setTeams(data);
      } catch (err) {
        console.error("Error fetching bottom teams:", err);
        toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBottomTeams();
  }, []);

  return (
    <div className="border border-gray-300 bg-white rounded-lg">
      <div className="flex flex-wrap gap-2 justify-between items-center p-4 border-b border-gray-300">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <ThumbsDown className="flex-none" /> Least Popular Teams
        </h2>
        <div className="bg-red-100 text-red-700 border border-red-700 px-3 py-1 w-fit rounded-lg text-sm">Bottom 5</div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : teams.length === 0 ? (
        <div className="p-8 text-center">No teams rated yet.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {teams.map((team) => (
            <li key={team.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{team.name}</h3>
                  <p className="text-sm text-gray-500">{team.sportName}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {team.avgRating > 0 ? "+" : ""}
                    {team.avgRating}
                  </div>
                  <div className="text-xs text-gray-500">
                    {team.ratingCount} rating{team.ratingCount === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type Athlete = {
  id: number;
  name: string;
  sportName: string;
  teamName: string;
  avgRating: number;
  ratingCount: number;
};

function TopAthletesRanking() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopAthletes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rankings/athletes/top`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch top athletes");
        }

        const data = await response.json();
        setAthletes(data);
      } catch (err) {
        console.error("Error fetching top athletes:", err);
        toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopAthletes();
  }, []);

  return (
    <div className="border border-gray-300 bg-white rounded-lg">
      <div className="flex flex-wrap gap-2 justify-between items-center p-4 border-b border-gray-300">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <ThumbsUp className="flex-none" /> Most Popular Athletes
        </h2>
        <div className="bg-green-100 text-green-700 border border-green-700 px-3 py-1 w-fit rounded-lg text-sm">
          Top 5
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : athletes.length === 0 ? (
        <div className="p-8 text-center">No athletes rated yet.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {athletes.map((athlete) => (
            <li key={athlete.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{athlete.name}</h3>
                  <p className="text-sm text-gray-500">
                    {athlete.sportName} • {athlete.teamName}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {athlete.avgRating > 0 ? "+" : ""}
                    {athlete.avgRating}
                  </div>
                  <div className="text-xs text-gray-500">
                    {athlete.ratingCount} rating{athlete.ratingCount === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BottomAthletesRanking() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBottomAthletes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rankings/athletes/bottom`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch bottom athletes");
        }

        const data = await response.json();
        setAthletes(data);
      } catch (err) {
        console.error("Error fetching bottom athletes:", err);
        toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBottomAthletes();
  }, []);

  return (
    <div className="border border-gray-300 bg-white rounded-lg">
      <div className="flex flex-wrap gap-2 justify-between items-center p-4 border-b border-gray-300">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <ThumbsDown className="flex-none" /> Least Popular Athletes
        </h2>
        <div className="bg-red-100 text-red-700 border border-red-700 px-3 py-1 w-fit rounded-lg text-sm">Bottom 5</div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : athletes.length === 0 ? (
        <div className="p-8 text-center">No athletes rated yet.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {athletes.map((athlete) => (
            <li key={athlete.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{athlete.name}</h3>
                  <p className="text-sm text-gray-500">
                    {athlete.sportName} • {athlete.teamName}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {athlete.avgRating > 0 ? "+" : ""}
                    {athlete.avgRating}
                  </div>
                  <div className="text-xs text-gray-500">
                    {athlete.ratingCount} rating{athlete.ratingCount === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

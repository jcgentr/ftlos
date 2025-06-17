// components/admin/SweepstakesAdmin.tsx
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface Sport {
  id: number;
  name: string;
  slug: string;
}

interface Team {
  id: number;
  name: string;
  sportId: number;
}

interface User {
  id: string;
  email: string;
  supabaseId: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  birthDate?: string;
  favoriteSports?: string;
  profileImageUrl?: string;
  isConnecting: boolean;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Game {
  sportId: string;
  teamOneId: string;
  teamTwoId: string;
  startTime: string;
  isFinal: boolean;
  [key: string]: string | boolean | number; // Add index signature
}

export function SweepstakesAdmin() {
  const { user, session } = useAuth();
  const [sports, setSports] = useState<Sport[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [games, setGames] = useState<Game[]>([
    { sportId: "", teamOneId: "", teamTwoId: "", startTime: "", isFinal: false },
  ]);

  useEffect(() => {
    // Fetch sports and teams data
    const fetchData = async () => {
      if (!user?.id || !session?.access_token) return;

      try {
        const [sportsRes, teamsRes, userRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/sports`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/teams?limit=100`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
        ]);

        const sportsData = (await sportsRes.json()) as Sport[];
        const teamsData = (await teamsRes.json()) as Team[];
        const userData = (await userRes.json()) as User;

        setSports(sportsData);
        setTeams(teamsData);
        // Check if user is admin - you'd need to add an isAdmin field to your User model
        // TODO: if not admin, redirect to sweepstake page
        setIsAdmin(userData.isAdmin === true);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load required data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addGame = () => {
    setGames([...games, { sportId: "", teamOneId: "", teamTwoId: "", startTime: "", isFinal: false }]);
  };

  const updateGame = (index: number, field: string, value: string | number | boolean) => {
    const updatedGames = [...games];
    updatedGames[index][field] = value;
    setGames(updatedGames);
  };

  const removeGame = (index: number) => {
    setGames(games.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.access_token) {
      toast.error("You must be logged in");
      return;
    }

    if (!isAdmin) {
      toast.error("Unauthorized");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sweepstakes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name,
          startDate,
          endDate,
          prizePool: parseFloat(prizePool),
          games,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create sweepstake");
      }

      toast.success("Sweepstake created successfully");

      // Reset form
      setName("");
      setStartDate("");
      setEndDate("");
      setPrizePool("");
      setGames([{ sportId: "", teamOneId: "", teamTwoId: "", startTime: "", isFinal: false }]);
    } catch (error) {
      console.error("Error creating sweepstake:", error);
      toast.error("Failed to create sweepstake");
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isAdmin) {
    return <div className="p-8">Unauthorized access</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Sweepstake</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 rounded border">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prize Pool ($)</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={prizePool}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrizePool(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Games</h2>

          {games.map((game, index) => (
            <div key={index} className="border p-4 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">Game {index + 1}</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => removeGame(index)}>
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sport</label>
                  <Select
                    value={game.sportId.toString()}
                    onValueChange={(value) => updateGame(index, "sportId", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {sports.map((sport) => (
                        <SelectItem key={sport.id} value={sport.id.toString()}>
                          {sport.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Game Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={game.startTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateGame(index, "startTime", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Team One</label>
                  <Select
                    value={game.teamOneId.toString()}
                    onValueChange={(value) => updateGame(index, "teamOneId", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team one" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams
                        .filter((team) => !game.sportId || team.sportId === parseInt(game.sportId))
                        .map((team) => (
                          <SelectItem key={team.id} value={team.id.toString()}>
                            {team.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Team Two</label>
                  <Select
                    value={game.teamTwoId.toString()}
                    onValueChange={(value) => updateGame(index, "teamTwoId", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team two" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams
                        .filter((team) => !game.sportId || team.sportId === parseInt(game.sportId))
                        .filter((team) => !game.teamOneId || team.id !== parseInt(game.teamOneId))
                        .map((team) => (
                          <SelectItem key={team.id} value={team.id.toString()}>
                            {team.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`game-${index}-final`}
                    checked={game.isFinal}
                    onCheckedChange={(checked) => updateGame(index, "isFinal", checked)}
                  />
                  <Label htmlFor={`game-${index}-final`}>Final Game</Label>
                </div>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addGame}>
            Add Game
          </Button>
        </div>

        <Button type="submit" className="w-full">
          Create Sweepstake
        </Button>
      </form>
    </div>
  );
}

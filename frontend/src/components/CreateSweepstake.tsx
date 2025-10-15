import { useAuth } from "@/contexts/AuthContext";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { playerBasedSports } from "@/lib/types";

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

interface Athlete {
  id: number;
  name: string;
  sportId: number;
  teamId: number;
  sport: {
    id: number;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Game {
  sportId: string;
  sportSlug?: string;
  teamOneId: string;
  teamTwoId: string;
  playerOneId: string;
  playerTwoId: string;
  startTime: string;
  isFinal: boolean;
  [key: string]: string | boolean | number | undefined;
}

const DEFAULT_GAME: Game = {
  sportId: "",
  sportSlug: "",
  teamOneId: "",
  teamTwoId: "",
  playerOneId: "",
  playerTwoId: "",
  startTime: "",
  isFinal: false,
};

export function CreateSweepstake() {
  const { session } = useAuth();
  const [sports, setSports] = useState<Sport[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [games, setGames] = useState<Game[]>([{ ...DEFAULT_GAME }]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.access_token) return;

      try {
        const [sportsRes, teamsRes, athletesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/sports`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/teams`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/athletes?sports=tennis,golf`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
        ]);

        const sportsData = (await sportsRes.json()) as Sport[];
        const teamsData = (await teamsRes.json()) as Team[];
        const athletesData = (await athletesRes.json()) as Athlete[];

        setSports(sportsData);
        setTeams(teamsData);
        setAthletes(athletesData);
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
    setGames([...games, DEFAULT_GAME]);
  };

  const updateGame = useCallback(
    (index: number, field: string, value: string | number | boolean) => {
      const updatedGames = [...games];
      updatedGames[index][field] = value;
      setGames(updatedGames);
    },
    [games]
  );

  const removeGame = useCallback(
    (index: number) => {
      setGames(games.filter((_, i) => i !== index));
    },
    [games]
  );

  const handleSportChange = useCallback(
    (index: number, value: string) => {
      const updatedGames = [...games];
      const sportSlug = sports.find((s) => s.id.toString() === value)?.slug || "";

      updatedGames[index] = {
        ...updatedGames[index],
        sportId: value,
        sportSlug: sportSlug,
        teamOneId: "",
        teamTwoId: "",
        playerOneId: "",
        playerTwoId: "",
      };

      setGames(updatedGames);
    },
    [games, sports]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.access_token) {
      toast.error("You must be logged in");
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
        const errorRes = await response.json();
        throw new Error(errorRes.error);
      }

      toast.success("Sweepstake created successfully");

      // Reset form
      setName("");
      setStartDate("");
      setEndDate("");
      setPrizePool("");
      setGames([{ ...DEFAULT_GAME }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update results");
    }
  };

  if (loading) {
    return <div>Loading sports and teams data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 rounded border">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder="Enter sweepstake name"
          required
        />
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
          <GameForm
            key={index}
            game={game}
            index={index}
            updateGame={updateGame}
            handleSportChange={handleSportChange}
            removeGame={removeGame}
            sports={sports}
            teams={teams}
            athletes={athletes}
            isPlayerBased={playerBasedSports.includes(game.sportSlug ?? "")}
          />
        ))}

        <Button type="button" variant="outline" onClick={addGame}>
          Add Game
        </Button>
      </div>

      <Button type="submit" className="w-full">
        Create Sweepstake
      </Button>
    </form>
  );
}

interface GameFormProps {
  game: Game;
  index: number;
  updateGame: (index: number, field: string, value: string | number | boolean) => void;
  handleSportChange: (index: number, value: string) => void;
  removeGame: (index: number) => void;
  sports: Sport[];
  teams: Team[];
  athletes: Athlete[];
  isPlayerBased: boolean;
}

const GameForm = React.memo(
  ({
    game,
    index,
    updateGame,
    handleSportChange,
    removeGame,
    sports,
    teams,
    athletes,
    isPlayerBased,
  }: GameFormProps) => {
    return (
      <div className="border p-4 rounded-md mb-4">
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold">Game {index + 1}</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => removeGame(index)}>
            Remove
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sport</label>
            <Select value={game.sportId} onValueChange={(value) => handleSportChange(index, value)}>
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateGame(index, "startTime", e.target.value)}
              required
            />
          </div>
        </div>

        {isPlayerBased ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Player One</label>
              <Select value={game.playerOneId} onValueChange={(value) => updateGame(index, "playerOneId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select player one" />
                </SelectTrigger>
                <SelectContent>
                  {athletes
                    .filter((athlete) => athlete.sportId.toString() === game.sportId)
                    .filter((athlete) => athlete.id.toString() !== game.playerTwoId)
                    .map((athlete) => (
                      <SelectItem key={athlete.id} value={athlete.id.toString()}>
                        {athlete.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Player Two</label>
              <Select value={game.playerTwoId} onValueChange={(value) => updateGame(index, "playerTwoId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select player two" />
                </SelectTrigger>
                <SelectContent>
                  {athletes
                    .filter((athlete) => athlete.sportId.toString() === game.sportId)
                    .filter((athlete) => athlete.id.toString() !== game.playerOneId)
                    .map((athlete) => (
                      <SelectItem key={athlete.id} value={athlete.id.toString()}>
                        {athlete.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Team One</label>
              <Select value={game.teamOneId} onValueChange={(value) => updateGame(index, "teamOneId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team one" />
                </SelectTrigger>
                <SelectContent>
                  {teams
                    .filter((team) => team.sportId.toString() === game.sportId)
                    .filter((team) => team.id.toString() !== game.teamTwoId)
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
              <Select value={game.teamTwoId} onValueChange={(value) => updateGame(index, "teamTwoId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team two" />
                </SelectTrigger>
                <SelectContent>
                  {teams
                    .filter((team) => team.sportId.toString() === game.sportId)
                    .filter((team) => team.id.toString() !== game.teamOneId)
                    .map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

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
    );
  }
);

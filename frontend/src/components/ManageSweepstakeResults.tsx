import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { playerBasedSports, SweepstakeStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface SweepstakeListItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  prizePool: string | number;
  status?: string;
}

interface SweepstakeDetail {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  prizePool: string | number;
  status: string;
  regularGames: SweepstakeGame[];
  finalGame: SweepstakeGame;
  hasSubmittedPicks: boolean;
}

interface SweepstakeGame {
  id: string;
  sportName: string;
  sportSlug: string;
  isPlayerBased: boolean;
  teamOne?: TeamInfo;
  teamTwo?: TeamInfo;
  playerOne?: PlayerInfo;
  playerTwo?: PlayerInfo;
  startTime: string;
  isFinal: boolean;
  userSelection: number | null;
  isCompleted?: boolean;
  winnerTeamId?: string | null;
  winnerPlayerId?: string | null;
}

interface TeamInfo {
  id: number;
  name: string;
}

interface PlayerInfo {
  id: number;
  name: string;
}

interface GameResult {
  gameId: string;
  winnerTeamId?: string;
  winnerPlayerId?: string;
}

export function ManageResults() {
  const { session } = useAuth();
  const [sweepstakes, setSweepstakes] = useState<SweepstakeListItem[]>([]);
  const [selectedSweepstake, setSelectedSweepstake] = useState<SweepstakeDetail | null>(null);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [submittingResults, setSubmittingResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSweepstakes();
  }, []);

  const fetchSweepstakes = async () => {
    if (!session?.access_token) {
      toast.error("You must be logged in");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sweepstakes`, {
        headers: { Authorization: `Bearer ${session!.access_token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch sweepstakes");

      const data = await response.json();
      const activeSweepstakes = data.active.map((sweepstake: SweepstakeListItem) => ({
        ...sweepstake,
        status: SweepstakeStatus.ACTIVE,
      }));
      const pastSweepstakes = data.past.map((sweepstake: SweepstakeListItem) => ({
        ...sweepstake,
        status: SweepstakeStatus.COMPLETED,
      }));

      setSweepstakes([...activeSweepstakes, ...pastSweepstakes]);
    } catch (error) {
      console.error("Error fetching sweepstakes:", error);
      toast.error("Failed to load sweepstakes");
    } finally {
      setLoading(false);
    }
  };

  const fetchSweepstakeDetails = async (sweepstakeId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sweepstakes/${sweepstakeId}`, {
        headers: { Authorization: `Bearer ${session!.access_token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch sweepstake details");

      const data = await response.json();
      setSelectedSweepstake(data);

      const allGames = [...(data.regularGames || [])];
      if (data.finalGame) {
        allGames.push(data.finalGame);
      }

      setGameResults(
        allGames.map((game: SweepstakeGame) => ({
          gameId: game.id!,
          winnerTeamId: game.winnerTeamId || undefined,
          winnerPlayerId: game.winnerPlayerId || undefined,
        }))
      );
    } catch (error) {
      console.error("Error fetching sweepstake details:", error);
      toast.error("Failed to load sweepstake details");
    } finally {
      setLoading(false);
    }
  };

  const updateGameResult = (gameId: string, winnerType: string, winnerId: string) => {
    setGameResults((prevResults) =>
      prevResults.map((result) => {
        if (result.gameId === gameId) {
          if (winnerType === "team") {
            return { ...result, winnerTeamId: winnerId, winnerPlayerId: undefined };
          } else {
            return { ...result, winnerPlayerId: winnerId, winnerTeamId: undefined };
          }
        }
        return result;
      })
    );
  };

  const handleResultsSubmit = async () => {
    if (!selectedSweepstake || gameResults.length === 0) {
      toast.error("No results to submit");
      return;
    }

    // Get only the game results that have a selected winner
    const completedResults = gameResults.filter((result) => result.winnerTeamId || result.winnerPlayerId);

    if (completedResults.length === 0) {
      toast.error("Please select a winner for at least one game");
      return;
    }

    setSubmittingResults(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sweepstakes/${selectedSweepstake.id}/results`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify({ gameResults: completedResults }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update results");
      }

      const result = await response.json();
      toast.success("Game results updated successfully");

      if (result.sweepstakeCompleted) {
        toast.success("All games completed! Sweepstake is now marked as completed.");
      }

      // Refresh sweepstakes list
      fetchSweepstakes();
      setSelectedSweepstake(null);
    } catch (error) {
      console.error("Error updating results:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update results");
    } finally {
      setSubmittingResults(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading sweepstakes...</div>;
  }

  console.log(gameResults);

  return (
    <div className="space-y-6 bg-white p-4 rounded border">
      {!selectedSweepstake ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Select a Sweepstake</h2>
          {sweepstakes.length === 0 ? (
            <p>No sweepstakes found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sweepstakes.map((sweepstake) => (
                <div key={sweepstake.id} className="border border-gray-300 bg-white rounded-lg max-w-[420px]">
                  <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <h2 className="text-xl font-semibold flex items-center gap-2">{sweepstake.name}</h2>
                  </div>
                  <div className="ml-8 py-4">
                    <p>
                      <span className="font-bold">Start Date:</span> {formatDate(sweepstake.startDate)}
                    </p>
                    <p>
                      <span className="font-bold">End Date:</span> {formatDate(sweepstake.endDate)}
                    </p>
                    <p>
                      <span className="font-bold">Prize Pool:</span>{" "}
                      <span className="text-success">${Number(sweepstake.prizePool).toLocaleString()}</span>
                    </p>
                    <div className="flex justify-between items-center mt-4 mr-4">
                      <Button onClick={() => fetchSweepstakeDetails(sweepstake.id)}>Update Results</Button>
                      <div className="text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            sweepstake.status === SweepstakeStatus.ACTIVE
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {sweepstake.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{selectedSweepstake.name} - Game Results</h2>
            <Button type="button" variant="outline" onClick={() => setSelectedSweepstake(null)}>
              Back to List
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-8">Loading games...</div>
          ) : (
            <>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Game</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Winner</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSweepstake && (
                      <>
                        {/* Show regular games first */}
                        {selectedSweepstake.regularGames.map((game) => (
                          <GameResultRow
                            key={game.id}
                            game={game}
                            gameResult={gameResults.find((r) => r.gameId === game.id)}
                            updateGameResult={updateGameResult}
                          />
                        ))}

                        {/* Show final game */}
                        {selectedSweepstake.finalGame && (
                          <GameResultRow
                            key={selectedSweepstake.finalGame.id}
                            game={selectedSweepstake.finalGame}
                            gameResult={gameResults.find((r) => r.gameId === selectedSweepstake.finalGame.id)}
                            updateGameResult={updateGameResult}
                            isFinalGame={true}
                          />
                        )}
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>

              <Button type="button" className="w-full" disabled={submittingResults} onClick={handleResultsSubmit}>
                {submittingResults ? "Submitting..." : "Submit Results"}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface GameResultRowProps {
  game: SweepstakeGame;
  gameResult?: GameResult;
  updateGameResult: (gameId: string, winnerType: string, winnerId: string) => void;
  isFinalGame?: boolean;
}

const GameResultRow = ({ game, gameResult, updateGameResult, isFinalGame }: GameResultRowProps) => {
  const isPlayerBased = playerBasedSports.includes(game.sportSlug);
  console.log(gameResult);

  return (
    <TableRow className={isFinalGame ? "bg-amber-50" : undefined}>
      <TableCell>
        {isFinalGame && <span className="font-semibold text-amber-600 mr-2">FINAL:</span>}
        {isPlayerBased
          ? `${game.playerOne?.name} vs ${game.playerTwo?.name}`
          : `${game.teamOne?.name} vs ${game.teamTwo?.name}`}
      </TableCell>
      <TableCell>{new Date(game.startTime).toLocaleString()}</TableCell>
      <TableCell>
        {game.isCompleted ? (
          <span className="text-green-600">Completed</span>
        ) : (
          <span className="text-amber-600">Pending</span>
        )}
      </TableCell>
      <TableCell>
        {isPlayerBased ? (
          <RadioGroup
            value={gameResult?.winnerPlayerId?.toString()}
            onValueChange={(value: string) => updateGameResult(game.id, "player", value)}
          >
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={game.playerOne?.id.toString() || ""} id={`player-one-${game.id}`} />
                <Label htmlFor={`player-one-${game.id}`}>{game.playerOne?.name}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={game.playerTwo?.id.toString() || ""} id={`player-two-${game.id}`} />
                <Label htmlFor={`player-two-${game.id}`}>{game.playerTwo?.name}</Label>
              </div>
            </div>
          </RadioGroup>
        ) : (
          <RadioGroup
            value={gameResult?.winnerTeamId?.toString()}
            onValueChange={(value: string) => updateGameResult(game.id, "team", value)}
          >
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={game.teamOne?.id.toString() || ""} id={`team-one-${game.id}`} />
                <Label htmlFor={`team-one-${game.id}`}>{game.teamOne?.name}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={game.teamTwo?.id.toString() || ""} id={`team-two-${game.id}`} />
                <Label htmlFor={`team-two-${game.id}`}>{game.teamTwo?.name}</Label>
              </div>
            </div>
          </RadioGroup>
        )}
      </TableCell>
    </TableRow>
  );
};

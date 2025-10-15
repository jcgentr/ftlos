import { useParams } from "react-router";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

type Team = {
  id: number;
  name: string;
};

type Athlete = {
  id: number;
  name: string;
};

type Game = {
  id: string;
  sportName: string;
  sportSlug: string;
  isPlayerBased: boolean;
  teamOne?: Team;
  teamTwo?: Team;
  playerOne?: Athlete;
  playerTwo?: Athlete;
  startTime: string;
  isFinal: boolean;
  isCompleted: boolean;
  winnerTeamId?: number | null;
  winnerPlayerId?: number | null;
  userSelection: number | null; // selectedAthleteId or selectedTeamId
};

type SweepstakeDetails = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  prizePool: string;
  status: "ACTIVE" | "COMPLETED";
  regularGames: Game[];
  finalGame: Game | null;
  hasSubmittedPicks: boolean;
};

export function Sweepstake() {
  const { sweepstakeId } = useParams();
  const { session } = useAuth();

  const [sweepstake, setSweepstake] = useState<SweepstakeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Track user selections
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSweepstake = async () => {
      if (!session?.access_token || !sweepstakeId) return;
      setLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sweepstakes/${sweepstakeId}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch sweepstake");

        const data = await response.json();
        setSweepstake(data);

        // Initialize selections with any existing user picks
        const initialSelections: Record<string, number> = {};

        if (data.regularGames) {
          data.regularGames.forEach((game: Game) => {
            if (game.userSelection) {
              initialSelections[game.id] = game.userSelection;
            }
          });
        }

        if (data.finalGame && data.finalGame.userSelection) {
          initialSelections[data.finalGame.id] = data.finalGame.userSelection;
        }

        setSelections(initialSelections);
      } catch (error) {
        console.error("Error fetching sweepstake:", error);
        toast.error("Failed to load sweepstake details");
      } finally {
        setLoading(false);
      }
    };

    fetchSweepstake();
  }, []);

  const handleSelection = (gameId: string, entityId: number) => {
    setSelections((prev) => ({
      ...prev,
      [gameId]: entityId,
    }));
  };

  const handleSubmit = async () => {
    if (!sweepstake || !session?.access_token) {
      toast.error("You must be logged in to submit picks");
      return;
    }

    // Ensure final game has a selection
    if (sweepstake.finalGame && !selections[sweepstake.finalGame.id]) {
      toast.error("You must make a selection for the final game");
      return;
    }

    setSubmitting(true);

    try {
      // Convert selections object to array of picks
      const picks = Object.entries(selections).map(([gameId, selectedId]) => {
        // Find the game to check if it's player-based or team-based
        const game =
          sweepstake.finalGame?.id === gameId
            ? sweepstake.finalGame
            : sweepstake.regularGames.find((g) => g.id === gameId);

        // Return the appropriate pick object based on game type
        if (game?.isPlayerBased) {
          return {
            gameId,
            selectedAthleteId: selectedId,
          };
        } else {
          return {
            gameId,
            selectedTeamId: selectedId,
          };
        }
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sweepstakes/${sweepstakeId}/picks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ picks }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit picks");
      }

      toast.success("Your picks have been submitted successfully!");

      // Refresh sweepstake data
      const updatedResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/sweepstakes/${sweepstakeId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setSweepstake(updatedData);
      }
    } catch (error) {
      console.error("Error submitting picks:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit picks");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 max-w-5xl w-full mx-auto">
        <div>Loading sweepstake details...</div>
      </div>
    );
  }

  if (!sweepstake) {
    return (
      <div className="p-4 sm:p-8 max-w-5xl w-full mx-auto">
        <div className="text-red-500">Sweepstake not found</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl w-full mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-4">{sweepstake.name}</h1>
        <div className="border border-gray-300 bg-white rounded-lg p-4 sm:p-8">
          <h2 className="text-2xl font-bold mb-4">Contest Details</h2>
          <div>
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
          </div>
        </div>

        {sweepstake.hasSubmittedPicks && (
          <div className="mt-4 bg-green-100 border border-green-500 text-green-700 rounded-lg p-4">
            <p>You have already submitted your picks for this sweepstake.</p>
          </div>
        )}

        <div>
          <h2 className="text-3xl font-bold mt-8">Regular Games</h2>
          <div className="bg-primary-foreground border border-primary rounded-lg p-6 my-4">
            <p className="text-primary">Pick winners for regular games plus the mandatory final game.</p>
          </div>
        </div>
        {/* Regular games */}
        {sweepstake.regularGames.length > 0 ? (
          <div className="space-y-4">
            {sweepstake.regularGames.map((game) => (
              <div key={game.id} className="border border-gray-300 bg-white rounded-lg p-4 sm:p-8">
                <div className="flex justify-between items-center flex-wrap gap-1">
                  <h2 className="text-xl font-bold">{game.sportName}</h2>
                  <span className="text-gray-500">{formatDate(game.startTime)}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full mt-4">
                  {game.isPlayerBased ? (
                    // Player-based game UI (e.g. tennis, golf)
                    <>
                      <Button
                        variant={selections[game.id] === game.playerOne?.id ? "default" : "outline"}
                        className="flex-1 text-lg relative min-h-[54px]"
                        onClick={() => handleSelection(game.id, game.playerOne!.id)}
                        disabled={sweepstake.hasSubmittedPicks || game.isCompleted}
                        size="lg"
                      >
                        {game.playerOne?.name}
                        {game.isCompleted && game.winnerPlayerId === game.playerOne?.id && <WinnerBadge />}
                      </Button>
                      <Button
                        variant={selections[game.id] === game.playerTwo?.id ? "default" : "outline"}
                        className="flex-1 text-lg relative min-h-[54px]"
                        onClick={() => handleSelection(game.id, game.playerTwo!.id)}
                        disabled={sweepstake.hasSubmittedPicks || game.isCompleted}
                        size="lg"
                      >
                        {game.playerTwo?.name}
                        {game.isCompleted && game.winnerPlayerId === game.playerTwo?.id && <WinnerBadge />}
                      </Button>
                    </>
                  ) : (
                    // Team-based game UI
                    <>
                      <Button
                        variant={selections[game.id] === game.teamOne?.id ? "default" : "outline"}
                        className="flex-1 text-lg relative min-h-[54px]"
                        onClick={() => handleSelection(game.id, game.teamOne!.id)}
                        disabled={sweepstake.hasSubmittedPicks || game.isCompleted}
                        size="lg"
                      >
                        {game.teamOne?.name}
                        {game.isCompleted && game.winnerTeamId === game.teamOne?.id && <WinnerBadge />}
                      </Button>
                      <Button
                        variant={selections[game.id] === game.teamTwo?.id ? "default" : "outline"}
                        className="flex-1 text-lg relative min-h-[54px]"
                        onClick={() => handleSelection(game.id, game.teamTwo!.id)}
                        disabled={sweepstake.hasSubmittedPicks || game.isCompleted}
                        size="lg"
                      >
                        {game.teamTwo?.name}
                        {game.isCompleted && game.winnerTeamId === game.teamTwo?.id && <WinnerBadge />}
                      </Button>
                    </>
                  )}
                </div>
                {game.isCompleted && (
                  <div className="mt-4">
                    <p>Game has been completed.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-primary-foreground border border-primary rounded-lg p-6 my-4">
            <p className="text-primary">No regular games available.</p>
          </div>
        )}
        {/* Final game */}
        {sweepstake.finalGame && (
          <div>
            <h2 className="text-3xl font-bold mt-8 mb-4">Final Game (Mandatory)</h2>
            <div className="border border-gray-300 bg-white rounded-lg p-4 sm:p-8">
              <div className="flex justify-between items-center flex-wrap gap-1">
                <h2 className="text-xl font-bold">{sweepstake.finalGame.sportName}</h2>
                <span className="text-gray-500">{formatDate(sweepstake.finalGame.startTime)}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full mt-4">
                {sweepstake.finalGame.isPlayerBased ? (
                  // Player-based final game UI
                  <>
                    <Button
                      size="lg"
                      variant={
                        selections[sweepstake.finalGame.id] === sweepstake.finalGame.playerOne?.id
                          ? "default"
                          : "outline"
                      }
                      className="flex-1 text-lg relative min-h-[54px]"
                      onClick={() => handleSelection(sweepstake.finalGame!.id, sweepstake.finalGame!.playerOne!.id)}
                      disabled={sweepstake.hasSubmittedPicks}
                    >
                      {sweepstake.finalGame.playerOne?.name}
                      {sweepstake.finalGame.isCompleted &&
                        sweepstake.finalGame.winnerPlayerId === sweepstake.finalGame.playerOne?.id && <WinnerBadge />}
                    </Button>
                    <Button
                      size="lg"
                      variant={
                        selections[sweepstake.finalGame.id] === sweepstake.finalGame.playerTwo?.id
                          ? "default"
                          : "outline"
                      }
                      className="flex-1 text-lg relative min-h-[54px]"
                      onClick={() => handleSelection(sweepstake.finalGame!.id, sweepstake.finalGame!.playerTwo!.id)}
                      disabled={sweepstake.hasSubmittedPicks}
                    >
                      {sweepstake.finalGame.playerTwo?.name}
                      {sweepstake.finalGame.isCompleted &&
                        sweepstake.finalGame.winnerPlayerId === sweepstake.finalGame.playerTwo?.id && <WinnerBadge />}
                    </Button>
                  </>
                ) : (
                  // Team-based final game UI
                  <>
                    <Button
                      size="lg"
                      variant={
                        selections[sweepstake.finalGame.id] === sweepstake.finalGame.teamOne?.id ? "default" : "outline"
                      }
                      className="flex-1 text-lg relative min-h-[54px]"
                      onClick={() => handleSelection(sweepstake.finalGame!.id, sweepstake.finalGame!.teamOne!.id)}
                      disabled={sweepstake.hasSubmittedPicks}
                    >
                      {sweepstake.finalGame.teamOne?.name}
                      {sweepstake.finalGame.isCompleted &&
                        sweepstake.finalGame.winnerTeamId === sweepstake.finalGame.teamOne?.id && <WinnerBadge />}
                    </Button>
                    <Button
                      size="lg"
                      variant={
                        selections[sweepstake.finalGame.id] === sweepstake.finalGame.teamTwo?.id ? "default" : "outline"
                      }
                      className="flex-1 text-lg relative min-h-[54px]"
                      onClick={() => handleSelection(sweepstake.finalGame!.id, sweepstake.finalGame!.teamTwo!.id)}
                      disabled={sweepstake.hasSubmittedPicks}
                    >
                      {sweepstake.finalGame.teamTwo?.name}
                      {sweepstake.finalGame.isCompleted &&
                        sweepstake.finalGame.winnerTeamId === sweepstake.finalGame.teamTwo?.id && <WinnerBadge />}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {sweepstake.finalGame && !sweepstake.hasSubmittedPicks && (
          <div className="mt-8">
            <div className="border border-gray-300 bg-white rounded-lg p-4 sm:p-8">
              <Button
                className="w-full bg-success hover:bg-success-lighter text-lg shadow-md"
                size="lg"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit picks"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WinnerBadge() {
  return (
    <span className="absolute -top-1 -right-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-600 border border-green-600">
      WINNER
    </span>
  );
}

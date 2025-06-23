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

type Game = {
  id: string;
  sportName: string;
  teamOne: Team;
  teamTwo: Team;
  startTime: string;
  isFinal: boolean;
  userSelection: number | null;
};

type SweepstakeDetails = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  prizePool: string;
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

  const handleSelection = (gameId: string, teamId: number) => {
    setSelections((prev) => ({
      ...prev,
      [gameId]: teamId,
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
      const picks = Object.entries(selections).map(([gameId, selectedTeamId]) => ({
        gameId,
        selectedTeamId,
      }));

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

        {sweepstake.regularGames.length > 0 ? (
          <div className="space-y-4">
            {sweepstake.regularGames.map((game) => (
              <div key={game.id} className="border border-gray-300 bg-white rounded-lg p-4 sm:p-8">
                <div className="flex justify-between items-center flex-wrap gap-1">
                  <h2 className="text-xl font-bold">{game.sportName}</h2>
                  <span className="text-gray-500">{formatDate(game.startTime)}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full mt-4">
                  <Button
                    variant={selections[game.id] === game.teamOne.id ? "default" : "outline"}
                    className={`flex-1 text-lg ${selections[game.id] === game.teamOne.id ? "shadow-md" : ""}`}
                    onClick={() => handleSelection(game.id, game.teamOne.id)}
                    disabled={sweepstake.hasSubmittedPicks}
                  >
                    {game.teamOne.name}
                  </Button>
                  <Button
                    variant={selections[game.id] === game.teamTwo.id ? "default" : "outline"}
                    className={`flex-1 text-lg ${selections[game.id] === game.teamTwo.id ? "shadow-md" : ""}`}
                    onClick={() => handleSelection(game.id, game.teamTwo.id)}
                    disabled={sweepstake.hasSubmittedPicks}
                  >
                    {game.teamTwo.name}
                  </Button>
                </div>
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
                <Button
                  variant={
                    selections[sweepstake.finalGame.id] === sweepstake.finalGame.teamOne.id ? "default" : "outline"
                  }
                  className={`flex-1 text-lg ${selections[sweepstake.finalGame.id] === sweepstake.finalGame.teamOne.id ? "shadow-md" : ""}`}
                  onClick={() => handleSelection(sweepstake.finalGame!.id, sweepstake.finalGame!.teamOne.id)}
                  disabled={sweepstake.hasSubmittedPicks}
                >
                  {sweepstake.finalGame.teamOne.name}
                </Button>
                <Button
                  variant={
                    selections[sweepstake.finalGame.id] === sweepstake.finalGame.teamTwo.id ? "default" : "outline"
                  }
                  className={`flex-1 text-lg ${selections[sweepstake.finalGame.id] === sweepstake.finalGame.teamTwo.id ? "shadow-md" : ""}`}
                  onClick={() => handleSelection(sweepstake.finalGame!.id, sweepstake.finalGame!.teamTwo.id)}
                  disabled={sweepstake.hasSubmittedPicks}
                >
                  {sweepstake.finalGame.teamTwo.name}
                </Button>
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

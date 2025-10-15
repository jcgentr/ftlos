import { useParams } from "react-router";
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

type SweepstakePerformance = {
  totalGames: number;
  completedGames: number;
  correctPicks: number;
  scorePercentage: number;
};

export function SweepstakeResults() {
  const { sweepstakeId } = useParams();
  const { session } = useAuth();

  const [sweepstake, setSweepstake] = useState<SweepstakeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Track user selections
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [performance, setPerformance] = useState<SweepstakePerformance>({
    totalGames: 0,
    completedGames: 0,
    correctPicks: 0,
    scorePercentage: 0,
  });

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

        // Calculate performance metrics
        let totalGames = data.regularGames.length;
        if (data.finalGame) totalGames += 1;

        let completedGames = data.regularGames.filter((game: Game) => game.isCompleted).length;
        if (data.finalGame?.isCompleted) completedGames += 1;

        let correctPicks = 0;

        // Count correct regular game picks
        data.regularGames.forEach((game: Game) => {
          if (game.isCompleted && game.userSelection) {
            const isCorrect = game.isPlayerBased
              ? game.userSelection === game.winnerPlayerId
              : game.userSelection === game.winnerTeamId;

            if (isCorrect) correctPicks += 1;
          }
        });

        // Count correct final game pick if exists
        if (data.finalGame?.isCompleted && data.finalGame.userSelection) {
          const isCorrect = data.finalGame.isPlayerBased
            ? data.finalGame.userSelection === data.finalGame.winnerPlayerId
            : data.finalGame.userSelection === data.finalGame.winnerTeamId;

          if (isCorrect) correctPicks += 1;
        }

        // Calculate percentage score (avoid division by zero)
        const scorePercentage = completedGames > 0 ? Math.round((correctPicks / completedGames) * 100) : 0;

        setPerformance({
          totalGames,
          completedGames,
          correctPicks,
          scorePercentage,
        });
      } catch (error) {
        console.error("Error fetching sweepstake:", error);
        toast.error("Failed to load sweepstake details");
      } finally {
        setLoading(false);
      }
    };

    fetchSweepstake();
  }, []);

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

        <ResultsSummary performance={performance} />

        <div>
          <h2 className="text-3xl font-bold mt-8 mb-4">Regular Games</h2>
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
                      <div
                        className={`flex-1 p-3 rounded-md border text-center relative ${
                          selections[game.id] === game.playerOne?.id
                            ? "bg-primary text-primary-foreground border-transparent"
                            : "bg-background border-gray-300"
                        }`}
                      >
                        <span className="text-lg">{game.playerOne?.name}</span>
                        {game.isCompleted && game.winnerPlayerId === game.playerOne?.id && <WinnerBadge />}
                      </div>
                      <div
                        className={`flex-1 p-3 rounded-md border text-center relative ${
                          selections[game.id] === game.playerTwo?.id
                            ? "bg-primary text-primary-foreground border-transparent"
                            : "bg-background border-gray-300"
                        }`}
                      >
                        <span className="text-lg">{game.playerTwo?.name}</span>
                        {game.isCompleted && game.winnerPlayerId === game.playerTwo?.id && <WinnerBadge />}
                      </div>
                    </>
                  ) : (
                    // Team-based game UI
                    <>
                      <div
                        className={`flex-1 p-3 rounded-md border text-center relative ${
                          selections[game.id] === game.teamOne?.id
                            ? "bg-primary text-primary-foreground border-transparent"
                            : "bg-background border-gray-300"
                        }`}
                      >
                        <span className="text-lg">{game.teamOne?.name}</span>
                        {game.isCompleted && game.winnerTeamId === game.teamOne?.id && <WinnerBadge />}
                      </div>
                      <div
                        className={`flex-1 p-3 rounded-md border text-center relative ${
                          selections[game.id] === game.teamTwo?.id
                            ? "bg-primary text-primary-foreground border-transparent"
                            : "bg-background border-gray-300"
                        }`}
                      >
                        <span className="text-lg">{game.teamTwo?.name}</span>
                        {game.isCompleted && game.winnerTeamId === game.teamTwo?.id && <WinnerBadge />}
                      </div>
                    </>
                  )}
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
                {sweepstake.finalGame.isPlayerBased ? (
                  // Player-based final game UI
                  <>
                    <div
                      className={`flex-1 p-3 rounded-md border text-center relative ${
                        selections[sweepstake.finalGame.id] === sweepstake.finalGame.playerOne?.id
                          ? "bg-primary text-primary-foreground border-transparent"
                          : "bg-background border-gray-300"
                      }`}
                    >
                      <span className="text-lg">{sweepstake.finalGame.playerOne?.name}</span>
                      {sweepstake.finalGame.isCompleted &&
                        sweepstake.finalGame.winnerPlayerId === sweepstake.finalGame.playerOne?.id && <WinnerBadge />}
                    </div>
                    <div
                      className={`flex-1 p-3 rounded-md border text-center relative ${
                        selections[sweepstake.finalGame.id] === sweepstake.finalGame.playerTwo?.id
                          ? "bg-primary text-primary-foreground border-transparent"
                          : "bg-background border-gray-300"
                      }`}
                    >
                      <span className="text-lg">{sweepstake.finalGame.playerTwo?.name}</span>
                      {sweepstake.finalGame.isCompleted &&
                        sweepstake.finalGame.winnerPlayerId === sweepstake.finalGame.playerTwo?.id && <WinnerBadge />}
                    </div>
                  </>
                ) : (
                  // Team-based final game UI
                  <>
                    <div
                      className={`flex-1 p-3 rounded-md border text-center relative ${
                        selections[sweepstake.finalGame.id] === sweepstake.finalGame.teamOne?.id
                          ? "bg-primary text-primary-foreground border-transparent"
                          : "bg-background border-gray-300"
                      }`}
                    >
                      <span className="text-lg">{sweepstake.finalGame.teamOne?.name}</span>
                      {sweepstake.finalGame.isCompleted &&
                        sweepstake.finalGame.winnerTeamId === sweepstake.finalGame.teamOne?.id && <WinnerBadge />}
                    </div>
                    <div
                      className={`flex-1 p-3 rounded-md border text-center relative ${
                        selections[sweepstake.finalGame.id] === sweepstake.finalGame.teamTwo?.id
                          ? "bg-primary text-primary-foreground border-transparent"
                          : "bg-background border-gray-300"
                      }`}
                    >
                      <span className="text-lg">{sweepstake.finalGame.teamTwo?.name}</span>
                      {sweepstake.finalGame.isCompleted &&
                        sweepstake.finalGame.winnerTeamId === sweepstake.finalGame.teamTwo?.id && <WinnerBadge />}
                    </div>
                  </>
                )}
              </div>
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

function ResultsSummary({ performance }: { performance: SweepstakePerformance }) {
  const { totalGames, completedGames, correctPicks, scorePercentage } = performance;

  // Determine score color based on percentage
  const getScoreColor = () => {
    if (scorePercentage >= 80) return "text-green-600";
    if (scorePercentage >= 50) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="border border-gray-300 bg-white rounded-lg p-4 sm:p-8 mt-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Your Performance</h2>

      {completedGames > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-500 text-sm">Total Games</p>
              <p className="text-2xl font-bold">{totalGames}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-500 text-sm">Completed Games</p>
              <p className="text-2xl font-bold">{completedGames}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-500 text-sm">Correct Picks</p>
              <p className="text-2xl font-bold">{correctPicks}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Overall Score</span>
              <span className={`font-bold ${getScoreColor()}`}>{scorePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  scorePercentage >= 80 ? "bg-green-500" : scorePercentage >= 50 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${scorePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md">
          <p>No games have been completed yet. Check back later to see your results!</p>
        </div>
      )}
    </div>
  );
}

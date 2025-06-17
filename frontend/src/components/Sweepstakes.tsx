import { Link } from "react-router";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

type Sweepstake = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  prizePool: string;
};

export function Sweepstakes() {
  const { session } = useAuth();
  const [activeSweepstakes, setActiveSweepstakes] = useState<Sweepstake[]>([]);
  const [pastSweepstakes, setPastSweepstakes] = useState<Sweepstake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSweepstakes = async () => {
      if (!session?.access_token) return;
      setLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sweepstakes`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch sweepstakes");

        const data = await response.json();
        setActiveSweepstakes(data.active);
        setPastSweepstakes(data.past);
      } catch (error) {
        console.error("Error fetching sweepstakes:", error);
        toast.error("Failed to load sweepstakes");
      } finally {
        setLoading(false);
      }
    };

    fetchSweepstakes();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-5xl w-full mx-auto">
        <div className="text-center">Loading sweepstakes...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl w-full mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-4">Active Sweepstakes</h1>

        {activeSweepstakes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSweepstakes.map((sweepstake) => (
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
                  <Link to={`/sweepstakes/${sweepstake.id}`}>
                    <Button className="mt-4">Make Your Picks</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-primary-foreground border border-primary rounded-lg p-6 my-4">
            <p className="text-primary">No active sweepstakes available.</p>
          </div>
        )}
      </div>

      <div className="mt-8 border border-gray-300 bg-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Past Sweepstakes</h2>
        {pastSweepstakes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastSweepstakes.map((sweepstake) => (
              <div key={sweepstake.id} className="border border-gray-300 bg-white rounded-lg max-w-[420px]">
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                  <h2 className="text-xl font-semibold flex items-center gap-2 truncate">{sweepstake.name}</h2>
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-primary-foreground border border-primary rounded-lg p-6">
            <p className="text-primary">No past sweepstakes available.</p>
          </div>
        )}
      </div>
    </div>
  );
}

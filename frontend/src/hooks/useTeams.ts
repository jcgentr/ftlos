import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Team {
  id: number;
  name: string;
  sportId: number;
}

export function useTeams() {
  const { session } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teams`, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch teams: ${response.status}`);
        }

        const data = await response.json();
        setTeams(data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        toast.error("Error fetching teams");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return { teams, isLoading };
}

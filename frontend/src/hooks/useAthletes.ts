import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface Athlete {
  id: number;
  name: string;
  sportId: number;
  teamId: number;
}

export function useAthletes() {
  const { session } = useAuth();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAthletes = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/athletes`, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch athletes: ${response.status}`);
        }

        const data = await response.json();
        setAthletes(data);
      } catch (err) {
        console.error("Error fetching athletes:", err);
        toast.error("Error fetching athletes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  return { athletes, isLoading };
}

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface Sport {
  id: number;
  name: string;
  slug: string;
}

export function useSports() {
  const { session } = useAuth();
  const [sports, setSports] = useState<Sport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSports = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sports`, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch sports: ${response.status}`);
        }

        const data = await response.json();
        setSports(data);
      } catch (error) {
        console.error("Error fetching sports:", error);
        toast.error("Error fetching sports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSports();
  }, []);

  return { sports, isLoading };
}

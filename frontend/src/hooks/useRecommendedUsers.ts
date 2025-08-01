import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type RecommendedUser = {
  id: string;
  supabaseId: string;
  name: string;
  location: string;
  profileImageUrl?: string;
  matchReason: string;
};

export function useRecommendedUsers() {
  const { session } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendedUser[]>([]);
  const [userMeetsCriteria, setUserMeetsCriteria] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendedUsers = async () => {
      if (!session?.access_token) return;

      setIsLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/recommended`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch recommended users");

        const { userMeetsCriteria, recommendations } = await response.json();

        setRecommendations(recommendations);
        setUserMeetsCriteria(userMeetsCriteria);
      } catch (error) {
        console.error("Error fetching recommended users:", error);
        toast.error("Failed to load your recommended users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedUsers();
  }, []);

  return {
    recommendations,
    userMeetsCriteria,
    isLoading,
  };
}

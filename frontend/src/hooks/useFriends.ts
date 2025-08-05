import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Friend } from "@/lib/types";

interface FriendRequest {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  requester: {
    id: string;
    supabaseId: string;
    firstName: string | null;
    lastName: string | null;
    location: string | null;
    profileImageUrl: string | null;
  };
}

export function useFriends() {
  const { session } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = async () => {
    if (!session?.access_token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/friends`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }

      const data = await response.json();
      setFriends(data);
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch friends");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    if (!session?.access_token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/pending`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pending requests");
      }

      const data = await response.json();
      setPendingRequests(data);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch pending requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
  }, []);

  const refreshAll = () => {
    fetchFriends();
    fetchPendingRequests();
  };

  return {
    friends,
    pendingRequests,
    loading,
    error,
    refetchFriends: fetchFriends,
    refetchPendingRequests: fetchPendingRequests,
    refreshAll,
  };
}

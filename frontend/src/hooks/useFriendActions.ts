import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useFriendActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  const sendFriendRequest = async (addresseeId: string) => {
    if (!session?.access_token) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ addresseeId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send friend request");
      }

      return await response.json();
    } catch (err) {
      console.error("Error sending friend request:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelFriendRequest = async (addresseeId: string) => {
    if (!session?.access_token) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/cancel/${addresseeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel friend request");
      }

      return await response.json();
    } catch (err) {
      console.error("Error canceling friend request:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    if (!session?.access_token) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/accept/${friendshipId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to accept friend request");
      }

      return await response.json();
    } catch (err) {
      console.error("Error accepting friend request:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectFriendRequest = async (friendshipId: string) => {
    if (!session?.access_token) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/reject/${friendshipId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to reject friend request");
      }

      return await response.json();
    } catch (err) {
      console.error("Error rejecting friend request:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFriend = async (friendId: string) => {
    if (!session?.access_token) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/${friendId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove friend");
      }

      return await response.json();
    } catch (err) {
      console.error("Error removing friend:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
  };
}

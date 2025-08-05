import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useFriendActions } from "@/hooks/useFriendActions";
import { toast } from "sonner";
import { FriendshipStatus } from "@/lib/types";
import { UserCheck, UserPlus, UserSearch, UserX } from "lucide-react";
import { Link } from "react-router";
import { useFriendship } from "@/contexts/FriendshipContext";

interface FriendRequestButtonProps {
  userId: string;
  friendshipStatus: FriendshipStatus;
}

export function FriendRequestButton({ userId, friendshipStatus }: FriendRequestButtonProps) {
  const { session } = useAuth();
  const { sendFriendRequest, cancelFriendRequest } = useFriendActions();
  const { friendshipStatuses, updateFriendshipStatus } = useFriendship();
  const [isLoading, setIsLoading] = useState(false);

  // update context with fresh API data
  useEffect(() => {
    updateFriendshipStatus(userId, friendshipStatus);
  }, [userId, friendshipStatus]);

  // Use the global state, fallback to prop if not in context
  const currentStatus = friendshipStatuses[userId] || friendshipStatus;

  const handleAddFriend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLoading(true);
    // Optimistically update the global state
    updateFriendshipStatus(userId, FriendshipStatus.OUTGOING_REQUEST);
    try {
      await sendFriendRequest(userId);
      toast.success("Friend request sent!");
    } catch (err) {
      // Revert on failure
      updateFriendshipStatus(userId, FriendshipStatus.NOT_FRIENDS);
      console.error("Failed to send friend request", err);
      toast.error("Failed to send friend request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLoading(true);
    // Optimistically update the global state
    updateFriendshipStatus(userId, FriendshipStatus.NOT_FRIENDS);
    try {
      await cancelFriendRequest(userId);
      toast.success("Friend request canceled");
    } catch (err) {
      // Revert on failure
      updateFriendshipStatus(userId, FriendshipStatus.OUTGOING_REQUEST);
      console.error("Failed to cancel friend request", err);
      toast.error("Failed to cancel friend request");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null;

  if (currentStatus === FriendshipStatus.FRIENDS) {
    return (
      <div className="bg-green-100 text-green-700 border border-green-700 px-3 py-1 rounded-lg text-sm flex items-center w-fit">
        <UserCheck className="mr-1 h-4 w-4" />
        Friends
      </div>
    );
  }

  if (currentStatus === FriendshipStatus.OUTGOING_REQUEST) {
    return (
      <Button variant="outline" size="sm" onClick={handleCancelRequest} disabled={isLoading}>
        <UserX />
        {isLoading ? "Cancelling..." : "Cancel Request"}
      </Button>
    );
  }

  if (currentStatus === FriendshipStatus.INCOMING_REQUEST) {
    return (
      <Link
        to={{
          pathname: "/profile",
          hash: "#friend-requests",
        }}
      >
        <Button variant="outline" size="sm">
          <UserSearch />
          View Request
        </Button>
      </Link>
    );
  }

  return (
    <Button variant="default" size="sm" onClick={handleAddFriend} disabled={isLoading}>
      <UserPlus />
      {isLoading ? "Sending..." : "Add Friend"}
    </Button>
  );
}

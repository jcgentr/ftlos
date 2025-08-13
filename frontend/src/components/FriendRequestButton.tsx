import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useFriendActions } from "@/hooks/useFriendActions";
import { toast } from "sonner";
import { FriendshipStatus } from "@/lib/types";
import { UserCheck, UserMinus, UserPlus, UserSearch, UserX } from "lucide-react";
import { Link } from "react-router";
import { useFriendship } from "@/contexts/FriendshipContext";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface FriendRequestButtonProps {
  userId: string;
  friendshipStatus: FriendshipStatus;
  onFriendshipChange?: () => void;
}

export function FriendRequestButton({ userId, friendshipStatus, onFriendshipChange }: FriendRequestButtonProps) {
  const { session } = useAuth();
  const { sendFriendRequest, cancelFriendRequest, removeFriend } = useFriendActions();
  const { friendshipStatuses, updateFriendshipStatus } = useFriendship();
  const [isLoading, setIsLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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
      onFriendshipChange?.();
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
      onFriendshipChange?.();
    } catch (err) {
      // Revert on failure
      updateFriendshipStatus(userId, FriendshipStatus.OUTGOING_REQUEST);
      console.error("Failed to cancel friend request", err);
      toast.error("Failed to cancel friend request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLoading(true);
    setIsPopoverOpen(false);
    // Optimistically update the global state
    updateFriendshipStatus(userId, FriendshipStatus.NOT_FRIENDS);
    try {
      await removeFriend(userId);
      toast.success("Friend removed");
      onFriendshipChange?.();
    } catch (err) {
      // Revert on failure
      updateFriendshipStatus(userId, FriendshipStatus.FRIENDS);
      console.error("Failed to remove friend", err);
      toast.error("Failed to remove friend");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null;

  if (currentStatus === FriendshipStatus.FRIENDS) {
    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div
            className="bg-green-100 text-green-700 border border-green-700 px-3 py-1 rounded-lg text-sm flex items-center w-fit cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsPopoverOpen(!isPopoverOpen);
            }}
          >
            <UserCheck className="mr-1 h-4 w-4" />
            Friends
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRemoveFriend}
            disabled={isLoading}
            className="flex items-center"
          >
            <UserMinus />
            Remove Friend
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  if (currentStatus === FriendshipStatus.OUTGOING_REQUEST) {
    return (
      <Button variant="outline" size="sm" onClick={handleCancelRequest} disabled={isLoading}>
        <UserX />
        Cancel Request
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
      Add Friend
    </Button>
  );
}

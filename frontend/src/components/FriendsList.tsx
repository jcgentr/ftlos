import { Link } from "react-router";
import { useFriends } from "@/hooks/useFriends";
import { Button } from "./ui/button";
import { UserCard } from "./UserCard";
import { useFriendActions } from "@/hooks/useFriendActions";
import { toast } from "sonner";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FriendRequest, FriendshipStatus, SortOption } from "@/lib/types";
import { useFriendship } from "@/contexts/FriendshipContext";

export function FriendsList() {
  const { friends, pendingRequests, loading, error, refetchFriends, refetchPendingRequests } = useFriends();
  const { acceptFriendRequest, rejectFriendRequest, isLoading } = useFriendActions();
  const { updateFriendshipStatus } = useFriendship();
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [sortOption, setSortOption] = useState<SortOption>("none");

  const handleAcceptRequest = async (request: FriendRequest) => {
    setProcessingIds((prev) => new Set(prev).add(request.id));
    updateFriendshipStatus(request.requesterId, FriendshipStatus.FRIENDS);
    try {
      await acceptFriendRequest(request.id);
      toast.success("Friend request accepted!");
      refetchFriends();
      refetchPendingRequests();
    } catch (err) {
      updateFriendshipStatus(request.requesterId, FriendshipStatus.INCOMING_REQUEST);
      console.error("Error accepting friend request:", err);
      toast.error("Failed to accept friend request");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(request.id);
        return newSet;
      });
    }
  };

  const handleRejectRequest = async (request: FriendRequest) => {
    setProcessingIds((prev) => new Set(prev).add(request.id));
    updateFriendshipStatus(request.requesterId, FriendshipStatus.NOT_FRIENDS);
    try {
      await rejectFriendRequest(request.id);
      toast.success("Friend request rejected");
      refetchPendingRequests();
    } catch (err) {
      updateFriendshipStatus(request.requesterId, FriendshipStatus.INCOMING_REQUEST);
      console.error("Error rejecting friend request:", err);
      toast.error("Failed to reject friend request");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(request.id);
        return newSet;
      });
    }
  };

  const sortedFriends = [...friends].sort((a, b) => {
    const nameA = `${a.firstName || ""} ${a.lastName || ""}`.trim().toLowerCase();
    const nameB = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase();

    if (sortOption === "asc") {
      return nameA.localeCompare(nameB);
    } else if (sortOption === "desc") {
      return nameB.localeCompare(nameA);
    }
    return 0;
  });

  return (
    <div className="mt-8 bg-white p-8 border border-gray-300 rounded-lg">
      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" id="friend-requests">
            Friend Requests
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="border border-gray-300 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-grow">
                  <UserCard user={request.requester} showFriendButton={false} />
                </div>
                <div className="flex gap-2 self-end sm:self-auto">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAcceptRequest(request)}
                    disabled={processingIds.has(request.id) || isLoading}
                  >
                    {processingIds.has(request.id) ? "Processing..." : "Accept"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRejectRequest(request)}
                    disabled={processingIds.has(request.id) || isLoading}
                  >
                    {processingIds.has(request.id) ? "Processing..." : "Decline"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold" id="friends">
          Friends
        </h2>
        {friends.length > 0 && (
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-[130px]" size="sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Sort</SelectItem>
              <SelectItem value="asc">A-Z</SelectItem>
              <SelectItem value="desc">Z-A</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading friends...</p>
      ) : error ? (
        <p className="text-red-500">Error loading friends: {error}</p>
      ) : friends.length === 0 ? (
        <div className="space-y-4">
          <p className="text-gray-500">You haven't added any friends yet.</p>
          <div className="flex justify-end">
            <Link to="/fans">
              <Button>Find Friends</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {sortedFriends.map((friend) => (
              <UserCard key={friend.id} user={friend} showFriendButton={false} />
            ))}
          </div>
          <div className="flex justify-end">
            <Link to="/fans">
              <Button>Find More Friends</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

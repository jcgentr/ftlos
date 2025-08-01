import { Link } from "react-router";
import { useFriends } from "@/hooks/useFriends";
import { Button } from "./ui/button";
import { UserCard } from "./UserCard";
import { useFriendActions } from "@/hooks/useFriendActions";
import { toast } from "sonner";
import { useState } from "react";

export function FriendsList() {
  const { friends, pendingRequests, loading, error, refetchFriends, refetchPendingRequests } = useFriends();
  const { acceptFriendRequest, rejectFriendRequest, isLoading } = useFriendActions();
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const handleAcceptRequest = async (friendshipId: string) => {
    setProcessingIds((prev) => new Set(prev).add(friendshipId));

    try {
      await acceptFriendRequest(friendshipId);
      toast.success("Friend request accepted!");
      refetchFriends();
      refetchPendingRequests();
    } catch (err) {
      console.error("Error accepting friend request:", err);
      toast.error("Failed to accept friend request");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(friendshipId);
        return newSet;
      });
    }
  };

  const handleRejectRequest = async (friendshipId: string) => {
    setProcessingIds((prev) => new Set(prev).add(friendshipId));

    try {
      await rejectFriendRequest(friendshipId);
      toast.success("Friend request rejected");
      refetchPendingRequests();
    } catch (err) {
      console.error("Error rejecting friend request:", err);
      toast.error("Failed to reject friend request");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(friendshipId);
        return newSet;
      });
    }
  };

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
                    onClick={() => handleAcceptRequest(request.id)}
                    disabled={processingIds.has(request.id) || isLoading}
                  >
                    {processingIds.has(request.id) ? "Processing..." : "Accept"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRejectRequest(request.id)}
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
      <h2 className="text-2xl font-semibold mb-4" id="friends">
        Friends
      </h2>
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
            {friends.map((friend) => (
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

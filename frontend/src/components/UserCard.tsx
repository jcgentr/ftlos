import { Link } from "react-router";
import { FriendRequestButton } from "./FriendRequestButton";
import { FriendshipStatus } from "@/lib/types";

interface UserCardProps {
  user: {
    id: string;
    supabaseId: string;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
    location?: string | null;
    matchReason?: string;
    friendshipStatus?: FriendshipStatus;
  };
  showFriendButton?: boolean;
}

export function UserCard({ user, showFriendButton = false }: UserCardProps) {
  const displayName =
    user.name ||
    (user.firstName || user.lastName ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Unknown User");

  return (
    <Link to={`/profile/${user.supabaseId}`}>
      <div className="border border-gray-300 bg-white rounded-lg p-4 hover:shadow-md transition-shadow space-y-2">
        <div className="flex items-center gap-3 shrink-0">
          {user.profileImageUrl ? (
            <img src={user.profileImageUrl} alt={displayName} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {displayName.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">{displayName}</h3>
            {user.location && <p className="text-gray-600 text-sm">{user.location}</p>}
          </div>
        </div>

        {(user.matchReason || showFriendButton) && (
          <div className="flex items-center justify-between gap-2 mt-2 w-full">
            {user.matchReason && (
              <div className="text-sm text-gray-600 truncate italic flex-grow" title={user.matchReason}>
                {user.matchReason}
              </div>
            )}

            {showFriendButton && (
              <div className="ml-auto">
                <FriendRequestButton
                  userId={user.id}
                  friendshipStatus={user.friendshipStatus || FriendshipStatus.NOT_FRIENDS}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

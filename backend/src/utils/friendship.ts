import { PrismaClient, FriendshipStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Define our API response friendship status enum
export enum FriendshipStatusResponse {
  FRIENDS = "FRIENDS",
  OUTGOING_REQUEST = "OUTGOING_REQUEST",
  INCOMING_REQUEST = "INCOMING_REQUEST",
  NOT_FRIENDS = "NOT_FRIENDS",
}

/**
 * Gets friendship status between current user and a list of target users
 * @param currentUserId The ID of the current user
 * @param userIds Array of user IDs to check friendship status against
 * @returns Map of userId -> friendship status
 */
export async function getFriendshipStatusForUsers(
  currentUserId: string,
  userIds: string[]
): Promise<Map<string, FriendshipStatusResponse>> {
  // Get all relevant friendship records in one query
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        // Current user is requester
        {
          requesterId: currentUserId,
          addresseeId: { in: userIds },
        },
        // Current user is addressee
        {
          addresseeId: currentUserId,
          requesterId: { in: userIds },
        },
      ],
    },
  });

  // Create a map of userId -> friendship status
  const statusMap = new Map<string, FriendshipStatusResponse>();

  friendships.forEach((friendship) => {
    let targetUserId: string;
    let status: FriendshipStatusResponse;

    // Current user is requester
    if (friendship.requesterId === currentUserId) {
      targetUserId = friendship.addresseeId;
      status =
        friendship.status === FriendshipStatus.ACCEPTED
          ? FriendshipStatusResponse.FRIENDS
          : friendship.status === FriendshipStatus.PENDING
            ? FriendshipStatusResponse.OUTGOING_REQUEST
            : FriendshipStatusResponse.NOT_FRIENDS;
    } else {
      // Current user is addressee
      targetUserId = friendship.requesterId;
      status =
        friendship.status === FriendshipStatus.ACCEPTED
          ? FriendshipStatusResponse.FRIENDS
          : friendship.status === FriendshipStatus.PENDING
            ? FriendshipStatusResponse.INCOMING_REQUEST
            : FriendshipStatusResponse.NOT_FRIENDS;
    }

    statusMap.set(targetUserId, status);
  });

  return statusMap;
}

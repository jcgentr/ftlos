import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { PrismaClient, FriendshipStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const sendFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const supabaseId = req.user?.sub;

    if (!supabaseId) {
      res.status(401).json({ error: "Unauthorized - User not found in token" });
      return;
    }

    const { addresseeId } = req.body;

    if (!addresseeId) {
      res.status(400).json({ error: "Addressee ID is required" });
      return;
    }

    // Get requester user
    const requester = await prisma.user.findUnique({
      where: { supabaseId },
      select: { id: true },
    });

    if (!requester) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Get addressee user
    const addressee = await prisma.user.findUnique({
      where: { id: addresseeId },
      select: { id: true },
    });

    if (!addressee) {
      res.status(404).json({ error: "Addressee user not found" });
      return;
    }

    // Check if requester is trying to friend themself
    if (requester.id === addressee.id) {
      res.status(400).json({ error: "Cannot send friend request to yourself" });
      return;
    }

    // Check if friendship already exists in any direction
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: requester.id, addresseeId: addressee.id }, // they already made this request
          { requesterId: addressee.id, addresseeId: requester.id }, // or someone already made a request to them
        ],
      },
    });

    if (existingFriendship) {
      res.status(400).json({ error: "Friend request already exists" });
      return;
    }

    // Create friend request
    const friendship = await prisma.friendship.create({
      data: {
        requesterId: requester.id,
        addresseeId: addressee.id,
        status: FriendshipStatus.PENDING,
      },
    });

    res.status(201).json(friendship);
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: "Failed to send friend request" });
  }
};

export const acceptFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const supabaseId = req.user?.sub;

    if (!supabaseId) {
      res.status(401).json({ error: "Unauthorized - User not found in token" });
      return;
    }

    const { friendshipId } = req.params;

    const user = await prisma.user.findUnique({
      where: { supabaseId },
      select: { id: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Find the friendship
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      res.status(404).json({ error: "Friend request not found" });
      return;
    }

    // Verify the current user is the addressee
    if (friendship.addresseeId !== user.id) {
      res.status(403).json({ error: "Not authorized to accept this request" });
      return;
    }

    // Verify the request is pending
    if (friendship.status !== FriendshipStatus.PENDING) {
      res.status(400).json({ error: "Friend request is not pending" });
      return;
    }

    // Update the friendship status
    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: FriendshipStatus.ACCEPTED },
    });

    res.status(200).json(updatedFriendship);
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ error: "Failed to accept friend request" });
  }
};

export const rejectFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const supabaseId = req.user?.sub;

    if (!supabaseId) {
      res.status(401).json({ error: "Unauthorized - User not found in token" });
      return;
    }

    const { friendshipId } = req.params;

    const user = await prisma.user.findUnique({
      where: { supabaseId },
      select: { id: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Find the friendship
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      res.status(404).json({ error: "Friend request not found" });
      return;
    }

    // Verify the current user is the addressee
    if (friendship.addresseeId !== user.id) {
      res.status(403).json({ error: "Not authorized to reject this request" });
      return;
    }

    // Update the friendship status
    // const updatedFriendship = await prisma.friendship.update({
    //   where: { id: friendshipId },
    //   data: { status: FriendshipStatus.REJECTED },
    // });

    // Delete the friendship instead of updating its status
    await prisma.friendship.delete({
      where: { id: friendshipId },
    });

    res.status(200).json({ message: "Friend request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ error: "Failed to reject friend request" });
  }
};

export const getPendingRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const supabaseId = req.user?.sub;

    if (!supabaseId) {
      res.status(401).json({ error: "Unauthorized - User not found in token" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId },
      select: { id: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Get pending requests sent to the user
    const pendingRequests = await prisma.friendship.findMany({
      where: {
        addresseeId: user.id,
        status: FriendshipStatus.PENDING,
      },
      include: {
        requester: {
          select: {
            id: true,
            supabaseId: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            location: true,
          },
        },
      },
    });

    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error("Error fetching pending friend requests:", error);
    res.status(500).json({ error: "Failed to fetch pending friend requests" });
  }
};

export const getOutgoingRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const supabaseId = req.user?.sub;

    if (!supabaseId) {
      res.status(401).json({ error: "Unauthorized - User not found in token" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId },
      select: { id: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Get pending requests sent by the user
    const outgoingRequests = await prisma.friendship.findMany({
      where: {
        requesterId: user.id,
        status: FriendshipStatus.PENDING,
      },
      include: {
        addressee: {
          select: {
            id: true,
            supabaseId: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            location: true,
          },
        },
      },
    });

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.error("Error fetching outgoing friend requests:", error);
    res.status(500).json({ error: "Failed to fetch outgoing friend requests" });
  }
};

export const getFriends = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const supabaseId = req.user?.sub;

    if (!supabaseId) {
      res.status(401).json({ error: "Unauthorized - User not found in token" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId },
      select: { id: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Get all accepted friendships
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: user.id, status: FriendshipStatus.ACCEPTED },
          { addresseeId: user.id, status: FriendshipStatus.ACCEPTED },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            supabaseId: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            location: true,
          },
        },
        addressee: {
          select: {
            id: true,
            supabaseId: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            location: true,
          },
        },
      },
    });

    // Transform the result to return just the friend data
    const friends = friendships.map((friendship) => {
      // If user is requester, return addressee as friend
      if (friendship.requesterId === user.id) {
        return friendship.addressee;
      }
      // If user is addressee, return requester as friend
      return friendship.requester;
    });

    res.status(200).json(friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
};

export const getUserFriends = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!targetUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Get all accepted friendships for the specified user
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: targetUser.id, status: FriendshipStatus.ACCEPTED },
          { addresseeId: targetUser.id, status: FriendshipStatus.ACCEPTED },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            supabaseId: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            location: true,
          },
        },
        addressee: {
          select: {
            id: true,
            supabaseId: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            location: true,
          },
        },
      },
    });

    // Transform the result to return just the friend data
    const friends = friendships.map((friendship) => {
      // If target user is requester, return addressee as friend
      if (friendship.requesterId === targetUser.id) {
        return friendship.addressee;
      }
      // If target user is addressee, return requester as friend
      return friendship.requester;
    });

    res.status(200).json(friends);
  } catch (error) {
    console.error("Error fetching user's friends:", error);
    res.status(500).json({ error: "Failed to fetch user's friends" });
  }
};

export const removeFriend = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const supabaseId = req.user?.sub;

    if (!supabaseId) {
      res.status(401).json({ error: "Unauthorized - User not found in token" });
      return;
    }

    const { friendId } = req.params;

    const user = await prisma.user.findUnique({
      where: { supabaseId },
      select: { id: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Find the friendship in either direction
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: user.id, addresseeId: friendId, status: FriendshipStatus.ACCEPTED },
          { requesterId: friendId, addresseeId: user.id, status: FriendshipStatus.ACCEPTED },
        ],
      },
    });

    if (!friendship) {
      res.status(404).json({ error: "Friendship not found" });
      return;
    }

    // Delete the friendship
    await prisma.friendship.delete({
      where: { id: friendship.id },
    });

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ error: "Failed to remove friend" });
  }
};

export const cancelFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const supabaseId = req.user?.sub;

    if (!supabaseId) {
      res.status(401).json({ error: "Unauthorized - User not found in token" });
      return;
    }

    const { userId } = req.params;

    const requester = await prisma.user.findUnique({
      where: { supabaseId },
      select: { id: true },
    });

    if (!requester) {
      res.status(401).json({ error: "Current user not found" });
      return;
    }

    // Find the pending friend request
    const friendRequest = await prisma.friendship.findFirst({
      where: {
        requesterId: requester.id,
        addresseeId: userId,
        status: FriendshipStatus.PENDING,
      },
    });

    if (!friendRequest) {
      res.status(404).json({ error: "Friend request not found" });
      return;
    }

    // Delete the friend request
    await prisma.friendship.delete({
      where: { id: friendRequest.id },
    });

    res.status(200).json({ message: "Friend request canceled successfully" });
  } catch (error) {
    console.error("Error canceling friend request:", error);
    res.status(500).json({ error: "Failed to cancel friend request" });
  }
};

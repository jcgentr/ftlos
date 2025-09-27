import { Request, Response } from "express";
import { Prisma, PrismaClient, TagSentiment } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";
import { FriendshipStatusResponse, getFriendshipStatusForUsers } from "../utils/friendship";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, supabaseId } = req.body;

    if (!email || !supabaseId) {
      res.status(400).json({ error: "Email and supabaseId are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { supabaseId },
    });

    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    const user = await prisma.user.create({
      data: {
        email,
        supabaseId,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserSupabaseId = req.user?.sub;

    if (id !== currentUserSupabaseId) {
      res.status(403).json({ error: "Not authorized to view this user profile" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId: id },
      select: {
        id: true,
        email: true,
        supabaseId: true,
        firstName: true,
        lastName: true,
        location: true,
        birthDate: true,
        favoriteSports: true,
        isConnecting: true,
        createdAt: true,
        updatedAt: true,
        profileImageUrl: true,
        isAdmin: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const getPublicUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUserSupabaseId = req.user?.sub;

    const currentUser = await prisma.user.findUnique({
      where: { supabaseId: currentUserSupabaseId },
      select: { id: true },
    });

    if (!currentUser) {
      res.status(401).json({ error: "Current user not found" });
      return;
    }

    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { supabaseId: id, isConnecting: true },
      select: {
        id: true,
        email: true,
        supabaseId: true,
        firstName: true,
        lastName: true,
        location: true,
        birthDate: true,
        favoriteSports: true,
        isConnecting: true,
        createdAt: true,
        updatedAt: true,
        profileImageUrl: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const friendshipStatusMap = await getFriendshipStatusForUsers(currentUser.id, [user.id]);
    const friendshipStatus = friendshipStatusMap.get(user.id) || FriendshipStatusResponse.NOT_FRIENDS;

    const userWithStatus = {
      ...user,
      birthDate: friendshipStatus === FriendshipStatusResponse.FRIENDS ? user.birthDate : null,
      friendshipStatus,
    };

    res.status(200).json(userWithStatus);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserSupabaseId = req.user?.sub;
    const updateData = req.body;

    if (id !== currentUserSupabaseId) {
      res.status(403).json({ error: "Not authorized to update this user profile" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { supabaseId: id },
    });

    if (!existingUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { supabaseId: id },
      data: updateData,
      select: {
        id: true,
        email: true,
        supabaseId: true,
        firstName: true,
        lastName: true,
        location: true,
        birthDate: true,
        favoriteSports: true,
        isConnecting: true,
        createdAt: true,
        updatedAt: true,
        profileImageUrl: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const searchUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, location, sportId, team } = req.query;
    const currentUserSupabaseId = req.user?.sub;

    if (!name && !location && !sportId && !team) {
      res.status(400).json({ error: "At least one search parameter is required" });
      return;
    }

    const currentUser = await prisma.user.findUnique({
      where: { supabaseId: currentUserSupabaseId },
      select: { id: true },
    });

    if (!currentUser) {
      res.status(401).json({ error: "Current user not found" });
      return;
    }

    // Get userIds who love the given sport
    let userIdsWithSport: string[] = [];
    if (sportId) {
      const sportTaglines = await prisma.userTagline.findMany({
        where: {
          entityType: "SPORT",
          entityId: Number(sportId),
          sentiment: TagSentiment.LOVES,
        },
        select: {
          userId: true,
        },
      });
      userIdsWithSport = sportTaglines.map((tagline) => tagline.userId);
    }

    // Get userIds who love the given team(s)
    let userIdsWithTeam: string[] = [];
    if (team) {
      // First find the team(s) that match the name
      const teams = await prisma.team.findMany({
        where: {
          name: {
            contains: team as string,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
        },
      });

      // If any teams found, get users who love those teams
      if (teams.length > 0) {
        const teamIds = teams.map((team) => team.id);
        const teamTaglines = await prisma.userTagline.findMany({
          where: {
            entityType: "TEAM",
            entityId: { in: teamIds },
            sentiment: TagSentiment.LOVES,
          },
          select: {
            userId: true,
          },
        });
        userIdsWithTeam = teamTaglines.map((tagline) => tagline.userId);
      }
    }

    const whereConditions: Prisma.UserWhereInput = {
      isConnecting: true, // Only return users who are open to connecting
      supabaseId: { not: currentUserSupabaseId }, // Exclude the current user
    };

    // Add sport filter if provided
    if (sportId && userIdsWithSport.length > 0) {
      whereConditions.id = { in: userIdsWithSport };
    }

    // Add team filter if provided
    if (team && userIdsWithTeam.length > 0) {
      if (whereConditions.id) {
        // If we already have sportId filter, we need to find the intersection
        whereConditions.id = {
          in: userIdsWithSport.filter((id) => userIdsWithTeam.includes(id)),
        };
      } else {
        whereConditions.id = { in: userIdsWithTeam };
      }
    }

    // If we have filters but no users match, return early
    if ((sportId && userIdsWithSport.length === 0) || (team && userIdsWithTeam.length === 0)) {
      res.status(200).json([]);
      return;
    }

    if (name) {
      // Search in both firstName and lastName
      whereConditions.OR = [
        { firstName: { contains: name as string, mode: "insensitive" } },
        { lastName: { contains: name as string, mode: "insensitive" } },
      ];
    }

    if (location) {
      whereConditions.location = {
        contains: location as string,
        mode: "insensitive",
      };
    }

    const users = await prisma.user.findMany({
      where: whereConditions,
      select: {
        id: true,
        supabaseId: true,
        firstName: true,
        lastName: true,
        location: true,
        favoriteSports: true,
        profileImageUrl: true,
      },
      take: 50, // Limit results
    });

    // Format users for frontend display
    const formattedUsers = users.map((user) => ({
      id: user.id,
      supabaseId: user.supabaseId,
      name:
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.firstName || user.lastName || "Anonymous",
      location: user.location || "Unknown location",
      profileImageUrl: user.profileImageUrl,
    }));

    const userIds = formattedUsers.map((user) => user.id);

    const friendshipStatusMap = await getFriendshipStatusForUsers(currentUser.id, userIds);

    const usersWithStatus = formattedUsers.map((user) => ({
      ...user,
      friendshipStatus: friendshipStatusMap.get(user.id) || FriendshipStatusResponse.NOT_FRIENDS,
    }));

    res.status(200).json(usersWithStatus);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Failed to search users" });
  }
};

const RECOMMENDATION_COUNT = 6;
const RATING_LEVEL = 3;

export const getRecommendedUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUserSupabaseId = req.user?.sub;

    // 1. First, check if the current user meets the criteria
    const currentUser = await prisma.user.findUnique({
      where: { supabaseId: currentUserSupabaseId },
      include: {
        taglines: true,
        ratings: true,
      },
    });

    if (!currentUser) {
      res.status(401).json({ error: "Current user not found" });
      return;
    }

    // Check if user meets all criteria: isConnecting, has taglines, and has ratings
    const hasTaglines = currentUser.taglines.length > 0;
    const hasRatings = currentUser.ratings.length > 0;
    const isConnecting = currentUser.isConnecting;

    if (!isConnecting || !hasTaglines || !hasRatings) {
      // If user doesn't meet criteria, return empty recommendations
      res.status(200).json({
        userMeetsCriteria: false,
        recommendations: [],
      });
      return;
    }

    // 2. If user meets criteria, find similar users based on shared interests

    // Collect all liked entity IDs from taglines
    const userLikedEntityIds = currentUser.taglines
      .filter((t) => t.sentiment === TagSentiment.LOVES)
      .map((t) => t.entityId);

    // Collect all highly rated entity IDs from ratings
    const highlyRatedEntityIds = currentUser.ratings.filter((r) => r.rating > RATING_LEVEL).map((r) => r.entityId);

    // Combine all liked and highly rated entity IDs
    const allLikedEntityIds = [...new Set([...userLikedEntityIds, ...highlyRatedEntityIds])];

    let userTaglineMatches: {
      userId: string;
      entityId: number;
      entityType: "ATHLETE" | "TEAM" | "SPORT";
    }[] = [];
    let userRatingMatches: {
      userId: string;
      entityId: number;
      entityType: "ATHLETE" | "TEAM" | "SPORT";
    }[] = [];

    if (allLikedEntityIds.length > 0) {
      [userTaglineMatches, userRatingMatches] = await Promise.all([
        prisma.userTagline.findMany({
          where: {
            entityId: { in: allLikedEntityIds },
            sentiment: TagSentiment.LOVES,
            userId: { not: currentUser.id },
          },
          select: {
            userId: true,
            entityId: true,
            entityType: true,
          },
        }),
        prisma.userRating.findMany({
          where: {
            entityId: { in: allLikedEntityIds },
            rating: { gt: RATING_LEVEL },
            userId: { not: currentUser.id },
          },
          select: {
            userId: true,
            entityId: true,
            entityType: true,
          },
        }),
      ]);
    }

    // Combine all matches
    const allMatches = [...userTaglineMatches, ...userRatingMatches];

    // Count matches per user ID to sort by match count
    const userMatchCounts = allMatches.reduce(
      (acc, match) => {
        acc[match.userId] = acc[match.userId] || { count: 0, matches: [] };
        acc[match.userId].count += 1;
        acc[match.userId].matches.push({
          entityId: match.entityId,
          entityType: match.entityType,
        });
        return acc;
      },
      {} as Record<string, { count: number; matches: Array<{ entityId: number; entityType: string }> }>
    );

    // Get unique user IDs sorted by match count
    const sortedUserIds = Object.keys(userMatchCounts).sort(
      (a, b) => userMatchCounts[b].count - userMatchCounts[a].count
    );

    let recommendedUsers: {
      id: string;
      supabaseId: string;
      name: string;
      location: string;
      profileImageUrl: string | null;
      matchReason: string;
    }[] = [];

    // If we have matching users
    if (sortedUserIds.length > 0) {
      // Get the top users (or fewer if not available)
      const topUserIds = sortedUserIds.slice(0, RECOMMENDATION_COUNT);

      // Get user details
      const userDetails = await prisma.user.findMany({
        where: {
          id: { in: topUserIds },
          isConnecting: true,
        },
        select: {
          id: true,
          supabaseId: true,
          firstName: true,
          lastName: true,
          location: true,
          profileImageUrl: true,
        },
      });

      // Get entity names for match reasons
      const entityIds = new Set<{ id: number; type: string }>();
      for (const userId in userMatchCounts) {
        for (const match of userMatchCounts[userId].matches) {
          entityIds.add({ id: match.entityId, type: match.entityType });
        }
      }

      // Extract IDs by entity type
      const sportIds: number[] = [];
      const teamIds: number[] = [];
      const athleteIds: number[] = [];

      Array.from(entityIds).forEach((entity) => {
        if (entity.type === "SPORT") sportIds.push(entity.id);
        else if (entity.type === "TEAM") teamIds.push(entity.id);
        else if (entity.type === "ATHLETE") athleteIds.push(entity.id);
      });

      // Fetch all entities in parallel
      const [sports, teams, athletes] = await Promise.all([
        sportIds.length > 0
          ? prisma.sport.findMany({
              where: { id: { in: sportIds } },
              select: { id: true, name: true },
            })
          : [],
        teamIds.length > 0
          ? prisma.team.findMany({
              where: { id: { in: teamIds } },
              select: { id: true, name: true },
            })
          : [],
        athleteIds.length > 0
          ? prisma.athlete.findMany({
              where: { id: { in: athleteIds } },
              select: { id: true, name: true },
            })
          : [],
      ]);

      // Create a unified entity lookup map
      const entityNameMap = new Map<string, string>();
      sports.forEach((s) => entityNameMap.set(`SPORT_${s.id}`, s.name));
      teams.forEach((t) => entityNameMap.set(`TEAM_${t.id}`, t.name));
      athletes.forEach((a) => entityNameMap.set(`ATHLETE_${a.id}`, a.name));

      // Use the unified map for lookups
      recommendedUsers = userDetails.map((user) => {
        const userMatches = userMatchCounts[user.id].matches;
        let matchReason = "Similar interests";

        if (userMatches.length > 0) {
          const firstMatch = userMatches[0];
          const entityKey = `${firstMatch.entityType}_${firstMatch.entityId}`;
          const entityName = entityNameMap.get(entityKey);
          if (entityName) {
            matchReason = `Also likes ${entityName}`;
          }
        }

        return {
          id: user.id,
          supabaseId: user.supabaseId,
          name:
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.firstName || user.lastName || "Anonymous",
          location: user.location || "Unknown location",
          profileImageUrl: user.profileImageUrl,
          matchReason,
        };
      });
    }

    // If we don't have enough recommendations, add random users
    if (recommendedUsers.length < RECOMMENDATION_COUNT) {
      const existingIds = recommendedUsers.map((u) => u.supabaseId);

      const randomUsers = await prisma.user.findMany({
        where: {
          isConnecting: true,
          supabaseId: {
            not: currentUserSupabaseId,
            notIn: existingIds,
          },
        },
        select: {
          id: true,
          supabaseId: true,
          firstName: true,
          lastName: true,
          location: true,
          profileImageUrl: true,
        },
        take: RECOMMENDATION_COUNT - recommendedUsers.length,
      });

      const formattedRandomUsers = randomUsers.map((user) => ({
        id: user.id,
        supabaseId: user.supabaseId,
        name:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.firstName || user.lastName || "Anonymous",
        location: user.location || "Unknown location",
        profileImageUrl: user.profileImageUrl,
        matchReason: "New user",
      }));

      recommendedUsers = [...recommendedUsers, ...formattedRandomUsers];
    }

    const userIds = recommendedUsers.map((user) => user.id);

    const friendshipStatusMap = await getFriendshipStatusForUsers(currentUser.id, userIds);

    const recommendedUsersWithStatus = recommendedUsers.map((user) => ({
      ...user,
      friendshipStatus: friendshipStatusMap.get(user.id) || FriendshipStatusResponse.NOT_FRIENDS,
    }));

    res.status(200).json({
      userMeetsCriteria: true,
      recommendations: recommendedUsersWithStatus,
    });
  } catch (error) {
    console.error("Error getting recommended users:", error);
    res.status(500).json({ error: "Failed to get recommended users" });
  }
};

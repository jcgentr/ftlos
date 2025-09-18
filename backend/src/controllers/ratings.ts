import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { EntityType, UserRating, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type RatingItem = {
  entityType: EntityType;
  entityId: number;
  rating: number;
  position?: number;
};

export const saveUserRatings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const supabaseId = req.user?.sub;

    if (!supabaseId) {
      res.status(401).json({ error: "Unauthorized - User not found in token" });
      return;
    }

    // Get the ratings array from the request body
    const { ratings } = req.body as { ratings: RatingItem[] };

    if (!ratings || !Array.isArray(ratings) || ratings.length === 0) {
      res.status(400).json({ error: "Ratings array is required and cannot be empty" });
      return;
    }

    // Validate all ratings
    for (const item of ratings) {
      if (
        !item.entityType ||
        !Object.values(EntityType).includes(item.entityType) ||
        typeof item.entityId !== "number" ||
        typeof item.rating !== "number" ||
        item.rating < -5 ||
        item.rating > 5
      ) {
        res.status(400).json({
          error: "Invalid rating format. Each rating must include entityType, entityId, and rating (-5 to +5)",
          invalidItem: item,
        });
        return;
      }
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId },
      select: { id: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Use a transaction to delete all existing ratings and create new ones
    const result = await prisma.$transaction(async (tx) => {
      // 1. Delete all existing ratings
      await tx.userRating.deleteMany({
        where: { userId: user.id },
      });

      // 2. Create all new ratings
      return Promise.all(
        ratings.map((item, index) =>
          tx.userRating.create({
            data: {
              userId: user.id,
              entityType: item.entityType,
              entityId: item.entityId,
              rating: item.rating,
              position: item.position ?? index,
            },
          })
        )
      );
    });

    res.status(200).json({
      success: true,
      message: `${result.length} ratings saved successfully`,
    });
  } catch (error) {
    console.error("Error saving user ratings:", error);
    res.status(500).json({ error: "Failed to save ratings" });
  }
};

export const getCurrentUserRatings = async (req: AuthenticatedRequest, res: Response) => {
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

    const ratings = await prisma.userRating.findMany({
      where: { userId: user.id },
      orderBy: { position: "asc" },
      take: 12,
    });

    // Extract unique IDs for each entity type
    const athleteIds = new Set();
    const teamIds = new Set();
    const sportIds = new Set();

    ratings.forEach((rating: UserRating) => {
      if (rating.entityType === "ATHLETE") athleteIds.add(rating.entityId);
      else if (rating.entityType === "TEAM") teamIds.add(rating.entityId);
      else if (rating.entityType === "SPORT") sportIds.add(rating.entityId);
    });

    // Fetch all entities in parallel
    const [athletes, teams, sports] = await Promise.all([
      athleteIds.size > 0
        ? prisma.athlete.findMany({
            where: { id: { in: Array.from(athleteIds) as number[] } },
            select: { id: true, name: true },
          })
        : [],
      teamIds.size > 0
        ? prisma.team.findMany({
            where: { id: { in: Array.from(teamIds) as number[] } },
            select: { id: true, name: true },
          })
        : [],
      sportIds.size > 0
        ? prisma.sport.findMany({
            where: { id: { in: Array.from(sportIds) as number[] } },
            select: { id: true, name: true },
          })
        : [],
    ]);

    // Create lookup maps for entity names
    const entityNameMap = new Map();
    athletes.forEach((a) => entityNameMap.set(`ATHLETE_${a.id}`, a.name));
    teams.forEach((t) => entityNameMap.set(`TEAM_${t.id}`, t.name));
    sports.forEach((s) => entityNameMap.set(`SPORT_${s.id}`, s.name));

    // Add entity names to ratings
    const ratingsWithNames = ratings.map((rating: UserRating) => {
      const key = `${rating.entityType}_${rating.entityId}`;
      return {
        ...rating,
        entityName: entityNameMap.get(key) || "Unknown",
      };
    });

    res.status(200).json(ratingsWithNames);
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
};

export const getUserRatings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { supabaseId: userId },
      select: { id: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const ratings = await prisma.userRating.findMany({
      where: { userId: user.id },
      orderBy: { position: "asc" },
      take: 6,
    });

    // Extract unique IDs for each entity type
    const athleteIds = new Set();
    const teamIds = new Set();
    const sportIds = new Set();

    ratings.forEach((rating: UserRating) => {
      if (rating.entityType === "ATHLETE") athleteIds.add(rating.entityId);
      else if (rating.entityType === "TEAM") teamIds.add(rating.entityId);
      else if (rating.entityType === "SPORT") sportIds.add(rating.entityId);
    });

    // Fetch all entities in parallel
    const [athletes, teams, sports] = await Promise.all([
      athleteIds.size > 0
        ? prisma.athlete.findMany({
            where: { id: { in: Array.from(athleteIds) as number[] } },
            select: { id: true, name: true },
          })
        : [],
      teamIds.size > 0
        ? prisma.team.findMany({
            where: { id: { in: Array.from(teamIds) as number[] } },
            select: { id: true, name: true },
          })
        : [],
      sportIds.size > 0
        ? prisma.sport.findMany({
            where: { id: { in: Array.from(sportIds) as number[] } },
            select: { id: true, name: true },
          })
        : [],
    ]);

    // Create lookup maps for entity names
    const entityNameMap = new Map();
    athletes.forEach((a) => entityNameMap.set(`ATHLETE_${a.id}`, a.name));
    teams.forEach((t) => entityNameMap.set(`TEAM_${t.id}`, t.name));
    sports.forEach((s) => entityNameMap.set(`SPORT_${s.id}`, s.name));

    // Add entity names to ratings
    const ratingsWithNames = ratings.map((rating: UserRating) => {
      const key = `${rating.entityType}_${rating.entityId}`;
      return {
        ...rating,
        entityName: entityNameMap.get(key) || "Unknown",
      };
    });

    res.status(200).json(ratingsWithNames);
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
};

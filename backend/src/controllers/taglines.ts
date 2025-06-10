import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { EntityType, TagSentiment, UserTagline, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type TaglineItem = {
  entityType: EntityType;
  entityId: number;
  sentiment: TagSentiment;
  position: number;
};

export const saveUserTagline = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const supabaseId = req.user?.sub;

    if (!supabaseId) {
      res.status(401).json({ error: "Unauthorized - User not found in token" });
      return;
    }

    // Get the tagline items array from the request body
    const { taglines } = req.body as { taglines: TaglineItem[] };

    if (!taglines || !Array.isArray(taglines) || taglines.length === 0) {
      res.status(400).json({ error: "Taglines array is required and cannot be empty" });
      return;
    }

    if (taglines.length !== 4) {
      res.status(400).json({ error: "Exactly 4 tagline items are required" });
      return;
    }

    // Validate all tagline items
    for (const item of taglines) {
      if (
        !item.entityType ||
        !Object.values(EntityType).includes(item.entityType) ||
        typeof item.entityId !== "number" ||
        !item.sentiment ||
        !Object.values(TagSentiment).includes(item.sentiment) ||
        typeof item.position !== "number" ||
        item.position < 0 ||
        item.position > 3
      ) {
        res.status(400).json({
          error:
            "Invalid tagline format. Each tagline must include entityType, entityId, sentiment, and position (0-3)",
          invalidItem: item,
        });
        return;
      }
    }

    // Check for duplicate positions
    const positions = taglines.map((item) => item.position);
    if (new Set(positions).size !== positions.length) {
      res.status(400).json({ error: "Duplicate positions are not allowed" });
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

    // Use a transaction to delete all existing taglines and create new ones
    const result = await prisma.$transaction(async (tx) => {
      // 1. Delete all existing taglines
      await tx.userTagline.deleteMany({
        where: { userId: user.id },
      });

      // 2. Create all new taglines
      return Promise.all(
        taglines.map((item) =>
          tx.userTagline.create({
            data: {
              userId: user.id,
              entityType: item.entityType,
              entityId: item.entityId,
              sentiment: item.sentiment,
              position: item.position,
            },
          })
        )
      );
    });

    res.status(200).json({
      success: true,
      message: `${result.length} tagline items saved successfully`,
    });
  } catch (error) {
    console.error("Error saving user tagline:", error);
    res.status(500).json({ error: "Failed to save tagline" });
  }
};

export const getCurrentUserTagline = async (req: AuthenticatedRequest, res: Response) => {
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

    const taglines = await prisma.userTagline.findMany({
      where: { userId: user.id },
      orderBy: { position: "asc" },
    });

    // Extract unique IDs for each entity type
    const athleteIds = new Set();
    const teamIds = new Set();
    const sportIds = new Set();

    taglines.forEach((tagline: UserTagline) => {
      if (tagline.entityType === "ATHLETE") athleteIds.add(tagline.entityId);
      else if (tagline.entityType === "TEAM") teamIds.add(tagline.entityId);
      else if (tagline.entityType === "SPORT") sportIds.add(tagline.entityId);
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

    // Add entity names to taglines
    const taglinesWithNames = taglines.map((tagline: UserTagline) => {
      const key = `${tagline.entityType}_${tagline.entityId}`;
      return {
        ...tagline,
        entityName: entityNameMap.get(key) || "Unknown",
      };
    });

    res.status(200).json(taglinesWithNames);
  } catch (error) {
    console.error("Error fetching user tagline:", error);
    res.status(500).json({ error: "Failed to fetch tagline" });
  }
};

export const getUserTagline = async (req: AuthenticatedRequest, res: Response) => {
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

    const taglines = await prisma.userTagline.findMany({
      where: { userId: user.id },
      orderBy: { position: "asc" },
    });

    // Extract unique IDs for each entity type
    const athleteIds = new Set();
    const teamIds = new Set();
    const sportIds = new Set();

    taglines.forEach((tagline: UserTagline) => {
      if (tagline.entityType === "ATHLETE") athleteIds.add(tagline.entityId);
      else if (tagline.entityType === "TEAM") teamIds.add(tagline.entityId);
      else if (tagline.entityType === "SPORT") sportIds.add(tagline.entityId);
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

    // Add entity names to taglines
    const taglinesWithNames = taglines.map((tagline: UserTagline) => {
      const key = `${tagline.entityType}_${tagline.entityId}`;
      return {
        ...tagline,
        entityName: entityNameMap.get(key) || "Unknown",
      };
    });

    res.status(200).json(taglinesWithNames);
  } catch (error) {
    console.error("Error fetching user tagline:", error);
    res.status(500).json({ error: "Failed to fetch tagline" });
  }
};

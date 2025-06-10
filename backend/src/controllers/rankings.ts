// backend/src/controllers/rankings.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get top 5 teams based on user ratings
export const getTopTeams = async (_req: Request, res: Response) => {
  try {
    // First get the average ratings for teams
    const teamRatings = await prisma.userRating.groupBy({
      by: ["entityId"],
      where: {
        entityType: "TEAM",
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
      orderBy: {
        _avg: {
          rating: "desc",
        },
      },
      take: 5,
    });

    // Then fetch the team details for these IDs
    const teamIds = teamRatings.map((r) => r.entityId);
    const teams = await prisma.team.findMany({
      where: {
        id: {
          in: teamIds,
        },
      },
      include: {
        sport: true,
      },
    });

    // Combine the data
    const result = teamRatings.map((rating) => {
      const team = teams.find((t) => t.id === rating.entityId);
      return {
        id: rating.entityId,
        name: team?.name || "Unknown",
        sportName: team?.sport.name || "Unknown",
        avgRating: parseFloat(rating._avg.rating?.toFixed(2) || "0"),
        ratingCount: rating._count.rating,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching top teams:", error);
    res.status(500).json({ error: "Failed to fetch top teams" });
  }
};

export const getBottomTeams = async (_req: Request, res: Response) => {
  try {
    // First get the average ratings for teams
    const teamRatings = await prisma.userRating.groupBy({
      by: ["entityId"],
      where: {
        entityType: "TEAM",
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
      orderBy: {
        _avg: {
          rating: "asc", // Ascending for bottom teams
        },
      },
      take: 5,
    });

    // Then fetch the team details for these IDs
    const teamIds = teamRatings.map((r) => r.entityId);
    const teams = await prisma.team.findMany({
      where: {
        id: {
          in: teamIds,
        },
      },
      include: {
        sport: true,
      },
    });

    // Combine the data
    const result = teamRatings.map((rating) => {
      const team = teams.find((t) => t.id === rating.entityId);
      return {
        id: rating.entityId,
        name: team?.name || "Unknown",
        sportName: team?.sport.name || "Unknown",
        avgRating: parseFloat(rating._avg.rating?.toFixed(2) || "0"),
        ratingCount: rating._count.rating,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching bottom teams:", error);
    res.status(500).json({ error: "Failed to fetch bottom teams" });
  }
};

export const getTopAthletes = async (_req: Request, res: Response) => {
  try {
    // First get the average ratings for athletes
    const athleteRatings = await prisma.userRating.groupBy({
      by: ["entityId"],
      where: {
        entityType: "ATHLETE",
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
      orderBy: {
        _avg: {
          rating: "desc",
        },
      },
      take: 5,
    });

    // Then fetch the athlete details for these IDs
    const athleteIds = athleteRatings.map((r) => r.entityId);
    const athletes = await prisma.athlete.findMany({
      where: {
        id: {
          in: athleteIds,
        },
      },
      include: {
        sport: true,
        team: true,
      },
    });

    // Combine the data
    const result = athleteRatings.map((rating) => {
      const athlete = athletes.find((a) => a.id === rating.entityId);
      return {
        id: rating.entityId,
        name: athlete?.name || "Unknown",
        sportName: athlete?.sport.name || "Unknown",
        teamName: athlete?.team.name || "Unknown",
        avgRating: parseFloat(rating._avg.rating?.toFixed(2) || "0"),
        ratingCount: rating._count.rating,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching top athletes:", error);
    res.status(500).json({ error: "Failed to fetch top athletes" });
  }
};

export const getBottomAthletes = async (_req: Request, res: Response) => {
  try {
    // First get the average ratings for athletes
    const athleteRatings = await prisma.userRating.groupBy({
      by: ["entityId"],
      where: {
        entityType: "ATHLETE",
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
      orderBy: {
        _avg: {
          rating: "asc", // Ascending for bottom athletes
        },
      },
      take: 5,
    });

    // Then fetch the athlete details for these IDs
    const athleteIds = athleteRatings.map((r) => r.entityId);
    const athletes = await prisma.athlete.findMany({
      where: {
        id: {
          in: athleteIds,
        },
      },
      include: {
        sport: true,
        team: true,
      },
    });

    // Combine the data
    const result = athleteRatings.map((rating) => {
      const athlete = athletes.find((a) => a.id === rating.entityId);
      return {
        id: rating.entityId,
        name: athlete?.name || "Unknown",
        sportName: athlete?.sport.name || "Unknown",
        teamName: athlete?.team.name || "Unknown",
        avgRating: parseFloat(rating._avg.rating?.toFixed(2) || "0"),
        ratingCount: rating._count.rating,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching bottom athletes:", error);
    res.status(500).json({ error: "Failed to fetch bottom athletes" });
  }
};

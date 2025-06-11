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

export const searchRankings = async (req: Request, res: Response) => {
  try {
    const { query, category, sportId } = req.query;

    if (!query || query.toString().trim() === "") {
      res.status(400).json({ error: "Search query is required" });
      return;
    }

    const searchString = `%${query}%`;
    let results: Array<{
      id: number;
      name: string;
      sportName: string;
      teamName?: string;
      type: "TEAM" | "ATHLETE";
      avgRating: number | null;
      ratingCount: number;
    }> = [];

    // Search in the appropriate category (or both if no category specified)
    if (!category || category === "all-categories" || category === "teams") {
      const teams = await prisma.team.findMany({
        where: {
          name: {
            contains: searchString,
            mode: "insensitive",
          },
          ...(sportId && sportId !== "any-sport" ? { sportId: parseInt(sportId.toString()) } : {}),
        },
        include: {
          sport: true,
        },
        take: 20,
      });

      // Get ratings for each team
      const teamIds = teams.map((team) => team.id);
      const teamRatings =
        teamIds.length > 0
          ? await prisma.userRating.groupBy({
              by: ["entityId"],
              where: {
                entityType: "TEAM",
                entityId: { in: teamIds },
              },
              _avg: {
                rating: true,
              },
              _count: {
                rating: true,
              },
            })
          : [];

      // Format team results
      const teamResults = teams.map((team) => {
        const rating = teamRatings.find((r) => r.entityId === team.id);
        return {
          id: team.id,
          name: team.name,
          sportName: team.sport.name,
          type: "TEAM" as const,
          avgRating: rating ? parseFloat(rating._avg.rating?.toFixed(2) || "0") : null,
          ratingCount: rating?._count.rating || 0,
        };
      });

      results = teamResults;
    }

    if (!category || category === "all-categories" || category === "athletes") {
      const athletes = await prisma.athlete.findMany({
        where: {
          name: {
            contains: searchString,
            mode: "insensitive",
          },
          ...(sportId && sportId !== "any-sport" ? { sportId: parseInt(sportId.toString()) } : {}),
        },
        include: {
          sport: true,
          team: true,
        },
        take: 20,
      });

      // Get ratings for each athlete
      const athleteIds = athletes.map((athlete) => athlete.id);
      const athleteRatings =
        athleteIds.length > 0
          ? await prisma.userRating.groupBy({
              by: ["entityId"],
              where: {
                entityType: "ATHLETE",
                entityId: { in: athleteIds },
              },
              _avg: {
                rating: true,
              },
              _count: {
                rating: true,
              },
            })
          : [];

      // Format athlete results
      const athleteResults = athletes.map((athlete) => {
        const rating = athleteRatings.find((r) => r.entityId === athlete.id);
        return {
          id: athlete.id,
          name: athlete.name,
          sportName: athlete.sport.name,
          teamName: athlete.team.name,
          type: "ATHLETE" as const,
          avgRating: rating ? parseFloat(rating._avg.rating?.toFixed(2) || "0") : null,
          ratingCount: rating?._count.rating || 0,
        };
      });

      results = [...results, ...athleteResults];
    }

    // Sort results by rating count (most rated first)
    results.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0));

    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching rankings:", error);
    res.status(500).json({ error: "Failed to search rankings" });
  }
};

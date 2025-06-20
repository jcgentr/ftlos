import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

    let teams;

    if (limit) {
      // If limit is specified, get random teams with limit
      teams = await prisma.$queryRaw<
        Array<{
          id: number;
          name: string;
          sport_id: number;
          created_at: Date;
          updated_at: Date;
        }>
      >`
        SELECT * FROM teams
        ORDER BY RANDOM()
        LIMIT ${limit}
      `;
    } else {
      // If no limit is specified, get all teams
      teams = await prisma.team.findMany();
    }

    // Transform from DB column names to JS property names
    const transformedTeams = teams.map((team) => ({
      id: team.id,
      name: team.name,
      sportId: "sport_id" in team ? team.sport_id : team.sportId,
      createdAt: "created_at" in team ? team.created_at : team.createdAt,
      updatedAt: "updated_at" in team ? team.updated_at : team.updatedAt,
    }));

    // Sort alphabetically
    const sortedTeams = [...transformedTeams].sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json(sortedTeams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

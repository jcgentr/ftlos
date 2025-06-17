import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSomeTeams = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const teams = await prisma.$queryRaw<
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

    // Transform from DB column names to JS property names
    const transformedTeams = teams.map((team) => ({
      id: team.id,
      name: team.name,
      sportId: team.sport_id,
      createdAt: team.created_at,
      updatedAt: team.updated_at,
    }));

    // Then sort alphabetically after random selection
    const sortedTeams = [...transformedTeams].sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json(sortedTeams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

import { Request, Response } from "express";
import { PrismaClient, Team } from "@prisma/client";

const prisma = new PrismaClient();

export const getSomeTeams = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const teams = await prisma.$queryRaw<Team[]>`
      SELECT * FROM teams
      ORDER BY RANDOM()
      LIMIT ${limit}
    `;

    // Then sort alphabetically after random selection
    const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json(sortedTeams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

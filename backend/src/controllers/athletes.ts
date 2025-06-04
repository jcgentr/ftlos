import { Request, Response } from "express";
import { Athlete, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSomeAthletes = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const athletes = await prisma.$queryRaw<Athlete[]>`
      SELECT * FROM athletes
      ORDER BY RANDOM()
      LIMIT ${limit}
    `;

    // Then sort alphabetically after random selection
    const sortedAthletes = [...athletes].sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json(sortedAthletes);
  } catch (error) {
    console.error("Error fetching athletes:", error);
    res.status(500).json({ error: "Failed to fetch athletes" });
  }
};

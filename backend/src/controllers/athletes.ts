import { Request, Response } from "express";
import { Athlete, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAthletes = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

    let athletes;

    if (limit) {
      // If limit is specified, get random athletes with limit
      athletes = await prisma.$queryRaw<Athlete[]>`
        SELECT * FROM athletes
        ORDER BY RANDOM()
        LIMIT ${limit}
      `;
    } else {
      // If no limit is specified, get all athletes
      athletes = await prisma.athlete.findMany();
    }

    // Sort alphabetically
    const sortedAthletes = [...athletes].sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json(sortedAthletes);
  } catch (error) {
    console.error("Error fetching athletes:", error);
    res.status(500).json({ error: "Failed to fetch athletes" });
  }
};

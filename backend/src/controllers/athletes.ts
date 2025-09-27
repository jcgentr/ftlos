import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAthletes = async (req: Request, res: Response) => {
  try {
    const { sports } = req.query;

    let whereClause = {};

    // If sports are provided (comma-separated sport slugs like "tennis,golf")
    if (sports) {
      const sportsArray = (sports as string).split(",");
      whereClause = {
        sport: {
          slug: {
            in: sportsArray,
          },
        },
      };
    }

    const athletes = await prisma.athlete.findMany({
      where: whereClause,
      include: {
        sport: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json(athletes);
  } catch (error) {
    console.error("Error fetching athletes:", error);
    res.status(500).json({ error: "Failed to fetch athletes" });
  }
};

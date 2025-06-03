import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSports = async (_req: Request, res: Response) => {
  try {
    const sports = await prisma.sport.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.status(200).json(sports);
  } catch (error) {
    console.error("Error fetching sports:", error);
    res.status(500).json({ error: "Failed to fetch sports" });
  }
};

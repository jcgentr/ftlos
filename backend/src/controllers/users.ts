import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, supabaseId } = req.body;

    if (!email || !supabaseId) {
      res.status(400).json({ error: "Email and supabaseId are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { supabaseId },
    });

    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    const user = await prisma.user.create({
      data: {
        email,
        supabaseId,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

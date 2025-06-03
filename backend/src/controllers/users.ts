import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { supabaseId: id },
      select: {
        id: true,
        email: true,
        supabaseId: true,
        firstName: true,
        lastName: true,
        location: true,
        birthDate: true,
        favoriteSports: true,
        isConnecting: true,
        createdAt: true,
        updatedAt: true,
        profileImageUrl: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const getPublicUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { supabaseId: id, isConnecting: true },
      select: {
        supabaseId: true,
        firstName: true,
        lastName: true,
        location: true,
        birthDate: true,
        favoriteSports: true,
        isConnecting: true,
        createdAt: true,
        updatedAt: true,
        profileImageUrl: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { supabaseId: id },
    });

    if (!existingUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { supabaseId: id },
      data: updateData,
      select: {
        id: true,
        email: true,
        supabaseId: true,
        firstName: true,
        lastName: true,
        location: true,
        birthDate: true,
        favoriteSports: true,
        isConnecting: true,
        createdAt: true,
        updatedAt: true,
        profileImageUrl: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

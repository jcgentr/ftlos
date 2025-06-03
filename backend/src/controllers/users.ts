import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";

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

export const searchUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, location } = req.query;
    const currentUserSupabaseId = req.user?.sub;

    if (!name && !location) {
      res.status(400).json({ error: "At least one search parameter is required" });
      return;
    }

    const whereConditions: Prisma.UserWhereInput = {
      isConnecting: true, // Only return users who are open to connecting
      supabaseId: { not: currentUserSupabaseId }, // Exclude the current user
    };

    if (name) {
      // Search in both firstName and lastName
      whereConditions.OR = [
        { firstName: { contains: name as string, mode: "insensitive" } },
        { lastName: { contains: name as string, mode: "insensitive" } },
      ];
    }

    if (location) {
      whereConditions.location = {
        contains: location as string,
        mode: "insensitive",
      };
    }

    const users = await prisma.user.findMany({
      where: whereConditions,
      select: {
        supabaseId: true,
        firstName: true,
        lastName: true,
        location: true,
        favoriteSports: true,
        profileImageUrl: true,
      },
      take: 50, // Limit results
    });

    // Format users for frontend display
    const formattedUsers = users.map((user) => ({
      supabaseId: user.supabaseId,
      name:
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.firstName || user.lastName || "Anonymous",
      location: user.location || "Unknown location",
      profileImageUrl: user.profileImageUrl,
      favoriteSports: user.favoriteSports,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Failed to search users" });
  }
};

import { Request, Response } from "express";
import { PrismaClient, GamePick as PrismaGamePick } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";

const prisma = new PrismaClient();

export const createSweepstake = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, startDate, endDate, prizePool, games } = req.body;
    const supabaseId = req.user?.sub;

    if (!supabaseId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    // Find the user and check if they're an admin
    const user = await prisma.user.findUnique({
      where: { supabaseId },
      select: { id: true, isAdmin: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.isAdmin) {
      res.status(403).json({ error: "Unauthorized: Admin access required" });
      return;
    }

    // Validate required fields
    if (!name || !startDate || !endDate || !prizePool || !games || !Array.isArray(games)) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Validate games data
    for (const game of games) {
      if (!game.sportId || !game.teamOneId || !game.teamTwoId || !game.startTime) {
        res.status(400).json({ error: "Each game must have a sport, two teams, and a start time" });
        return;
      }
    }

    // Check if at least one game is marked as final
    if (!games.some((game) => game.isFinal === true)) {
      res.status(400).json({ error: "At least one game must be marked as the final" });
      return;
    }

    // Create the sweepstake and its games in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the sweepstake
      const sweepstake = await tx.sweepstake.create({
        data: {
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          prizePool: parseFloat(prizePool.toString()),
          status: "ACTIVE",
          createdById: user.id,
        },
      });

      // Create all the games
      for (const game of games) {
        await tx.game.create({
          data: {
            sweepstakeId: sweepstake.id,
            sportId: parseInt(game.sportId.toString()),
            teamOneId: parseInt(game.teamOneId.toString()),
            teamTwoId: parseInt(game.teamTwoId.toString()),
            startTime: new Date(game.startTime),
            isFinal: Boolean(game.isFinal),
          },
        });
      }

      return sweepstake;
    });

    res.status(201).json({
      id: result.id,
      name: result.name,
      message: "Sweepstake created successfully",
    });
  } catch (error) {
    console.error("Error creating sweepstake:", error);
    res.status(500).json({ error: "Failed to create sweepstake" });
  }
};

export const getAllSweepstakes = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();

    // Auto-update expired sweepstakes first
    await prisma.sweepstake.updateMany({
      where: {
        status: "ACTIVE",
        endDate: {
          lt: currentDate,
        },
      },
      data: {
        status: "COMPLETED",
      },
    });

    const [activeSweepstakes, pastSweepstakes] = await Promise.all([
      // Get active sweepstakes
      prisma.sweepstake.findMany({
        where: {
          status: "ACTIVE",
          endDate: {
            gte: currentDate,
          },
        },
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          prizePool: true,
        },
        orderBy: {
          startDate: "asc",
        },
      }),

      // Get past sweepstakes
      prisma.sweepstake.findMany({
        where: {
          status: "COMPLETED",
        },
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          prizePool: true,
        },
        orderBy: {
          endDate: "desc",
        },
        take: 10, // Limit to 10 past sweepstakes
      }),
    ]);

    res.status(200).json({
      active: activeSweepstakes,
      past: pastSweepstakes,
    });
  } catch (error) {
    console.error("Error fetching sweepstakes:", error);
    res.status(500).json({ error: "Failed to fetch sweepstakes" });
  }
};

export const getSweepstakeById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Get the sweepstake with all its games
    const sweepstake = await prisma.sweepstake.findUnique({
      where: { id },
      include: {
        games: {
          include: {
            sport: true,
            teamOne: true,
            teamTwo: true,
          },
          orderBy: [{ isFinal: "asc" }, { startTime: "asc" }],
        },
      },
    });

    if (!sweepstake) {
      res.status(404).json({ error: "Sweepstake not found" });
      return;
    }

    // Check if user is authenticated and has existing picks
    const userId = req.user?.sub;
    let userPicks: Record<string, number> | null = null;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { supabaseId: userId },
      });

      if (user) {
        // Find existing entry and picks
        const entry = await prisma.sweepstakeEntry.findUnique({
          where: {
            userId_sweepstakeId: {
              userId: user.id,
              sweepstakeId: sweepstake.id,
            },
          },
          include: {
            picks: {
              select: {
                gameId: true,
                selectedTeamId: true,
              },
            },
          },
        });

        if (entry) {
          userPicks = entry.picks.reduce(
            (acc, pick) => {
              acc[pick.gameId] = pick.selectedTeamId;
              return acc;
            },
            {} as Record<string, number>
          );
        }
      }
    }

    // Format the response
    const formattedGames = sweepstake.games.map((game) => ({
      id: game.id,
      sportName: game.sport.name,
      teamOne: {
        id: game.teamOne.id,
        name: game.teamOne.name,
      },
      teamTwo: {
        id: game.teamTwo.id,
        name: game.teamTwo.name,
      },
      startTime: game.startTime,
      isFinal: game.isFinal,
      userSelection: userPicks ? userPicks[game.id] : null,
    }));

    const regularGames = formattedGames.filter((game) => !game.isFinal);
    const finalGame = formattedGames.find((game) => game.isFinal);

    res.status(200).json({
      id: sweepstake.id,
      name: sweepstake.name,
      startDate: sweepstake.startDate,
      endDate: sweepstake.endDate,
      prizePool: sweepstake.prizePool,
      regularGames,
      finalGame,
      hasSubmittedPicks: userPicks !== null,
    });
  } catch (error) {
    console.error("Error fetching sweepstake:", error);
    res.status(500).json({ error: "Failed to fetch sweepstake" });
  }
};

type GamePickSubmission = Pick<PrismaGamePick, "gameId" | "selectedTeamId">;

export const submitSweepstakePicks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: sweepstakeId } = req.params;
    const { picks } = req.body as { picks: GamePickSubmission[] };
    const supabaseId = req.user?.sub;

    if (!picks || !Array.isArray(picks) || picks.length === 0) {
      res.status(400).json({ error: "Valid picks are required" });
      return;
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { supabaseId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Get the sweepstake and check if it's valid
    const sweepstake = await prisma.sweepstake.findUnique({
      where: { id: sweepstakeId },
      include: {
        games: {
          select: { id: true, isFinal: true },
        },
      },
    });

    if (!sweepstake) {
      res.status(404).json({ error: "Sweepstake not found" });
      return;
    }

    // Check if sweepstake is still active
    const currentDate = new Date();
    if (sweepstake.status !== "ACTIVE" || sweepstake.endDate < currentDate) {
      res.status(400).json({ error: "This sweepstake is no longer active" });
      return;
    }

    // Validate that all required games have picks
    const gameIds = sweepstake.games.map((game) => game.id);
    const finalGameId = sweepstake.games.find((game) => game.isFinal)?.id;

    // Ensure the final game has a pick
    if (finalGameId && !picks.some((pick) => pick.gameId === finalGameId)) {
      res.status(400).json({ error: "A pick for the final game is required" });
      return;
    }

    // Validate that all picks are for valid games in this sweepstake
    for (const pick of picks) {
      if (!gameIds.includes(pick.gameId)) {
        res.status(400).json({ error: `Invalid game ID: ${pick.gameId}` });
        return;
      }
    }

    // Create or update the entry and picks
    await prisma.$transaction(async (tx) => {
      // Find or create entry
      let entry = await tx.sweepstakeEntry.findUnique({
        where: {
          userId_sweepstakeId: {
            userId: user.id,
            sweepstakeId,
          },
        },
      });

      if (!entry) {
        entry = await tx.sweepstakeEntry.create({
          data: {
            userId: user.id,
            sweepstakeId,
          },
        });
      } else {
        // Delete existing picks if re-submitting
        await tx.gamePick.deleteMany({
          where: { sweepstakeEntryId: entry.id },
        });
      }

      // Create new picks
      for (const pick of picks) {
        await tx.gamePick.create({
          data: {
            sweepstakeEntryId: entry.id,
            gameId: pick.gameId,
            selectedTeamId: pick.selectedTeamId,
          },
        });
      }
    });

    res.status(200).json({ success: true, message: "Picks submitted successfully" });
  } catch (error) {
    console.error("Error submitting picks:", error);
    res.status(500).json({ error: "Failed to submit picks" });
  }
};

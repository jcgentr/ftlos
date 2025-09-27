import { Request, Response } from "express";
import { PrismaClient, GamePick as PrismaGamePick } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";

const prisma = new PrismaClient();

// Array of sport slugs that use player vs player format
const playerBasedSports = ["tennis", "golf"];

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
      if (!game.sportId || !game.startTime) {
        res.status(400).json({ error: "Each game must have a sport and a start time" });
        return;
      }

      // Convert dates for comparison
      const gameTime = new Date(game.startTime);
      const sweepstakeStart = new Date(startDate);
      const sweepstakeEnd = new Date(endDate);

      // Validate game time is within sweepstake dates
      if (gameTime < sweepstakeStart) {
        res.status(400).json({
          error: `Game cannot start before the sweepstake's start date (${sweepstakeStart.toISOString()})`,
        });
        return;
      }

      if (gameTime > sweepstakeEnd) {
        res.status(400).json({
          error: `Game cannot start after the sweepstake's end date (${sweepstakeEnd.toISOString()})`,
        });
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
        if (!game.sportSlug) {
          throw new Error("Each game must have a sport");
        }

        const isPlayerBasedSport = playerBasedSports.includes(game.sportSlug);

        // Validate fields based on sport type
        if (isPlayerBasedSport) {
          // For player-based sports like Tennis and Golf
          if (!game.playerOneId || !game.playerTwoId) {
            throw new Error(`Player-based sport (${game.sportSlug}) requires playerOneId and playerTwoId`);
          }

          await tx.game.create({
            data: {
              sweepstakeId: sweepstake.id,
              sportId: parseInt(game.sportId.toString()),
              playerOneId: parseInt(game.playerOneId.toString()),
              playerTwoId: parseInt(game.playerTwoId.toString()),
              startTime: new Date(game.startTime),
              isFinal: Boolean(game.isFinal),
            },
          });
        } else {
          // For team-based sports
          if (!game.teamOneId || !game.teamTwoId) {
            throw new Error(`Team-based sport (${game.sportSlug}) requires teamOneId and teamTwoId`);
          }

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
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to create sweepstake" });
    }
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
            playerOne: true,
            playerTwo: true,
            picks: {
              where: {
                sweepstakeEntry: {
                  user: {
                    supabaseId: req.user?.sub,
                  },
                },
              },
              select: {
                selectedTeamId: true,
                selectedAthleteId: true,
              },
            },
          },
          orderBy: [{ isFinal: "asc" }, { startTime: "asc" }],
        },
        entries: {
          where: {
            user: {
              supabaseId: req.user?.sub,
            },
          },
          select: { id: true },
        },
      },
    });

    if (!sweepstake) {
      res.status(404).json({ error: "Sweepstake not found" });
      return;
    }

    // Format the response
    const formattedGames = sweepstake.games.map((game) => {
      const isPlayerBased = playerBasedSports.includes(game.sport.slug);
      const userPick = game.picks[0];

      if (isPlayerBased) {
        // Handle player-based sports (tennis, golf)
        return {
          id: game.id,
          sportName: game.sport.name,
          sportSlug: game.sport.slug,
          isPlayerBased: true,
          playerOne: game.playerOne
            ? {
                id: game.playerOne.id,
                name: game.playerOne.name,
              }
            : null,
          playerTwo: game.playerTwo
            ? {
                id: game.playerTwo.id,
                name: game.playerTwo.name,
              }
            : null,
          startTime: game.startTime,
          isFinal: game.isFinal,
          userSelection: userPick?.selectedAthleteId || null,
        };
      } else {
        // Handle team-based sports
        return {
          id: game.id,
          sportName: game.sport.name,
          sportSlug: game.sport.slug,
          isPlayerBased: false,
          teamOne: game.teamOne
            ? {
                id: game.teamOne.id,
                name: game.teamOne.name,
              }
            : null,
          teamTwo: game.teamTwo
            ? {
                id: game.teamTwo.id,
                name: game.teamTwo.name,
              }
            : null,
          startTime: game.startTime,
          isFinal: game.isFinal,
          userSelection: userPick?.selectedTeamId || null,
        };
      }
    });

    const regularGames = formattedGames.filter((game) => !game.isFinal);
    const finalGame = formattedGames.find((game) => game.isFinal);

    res.status(200).json({
      id: sweepstake.id,
      name: sweepstake.name,
      startDate: sweepstake.startDate,
      endDate: sweepstake.endDate,
      prizePool: sweepstake.prizePool,
      status: sweepstake.status,
      regularGames,
      finalGame,
      hasSubmittedPicks: sweepstake.entries.length > 0,
    });
  } catch (error) {
    console.error("Error fetching sweepstake:", error);
    res.status(500).json({ error: "Failed to fetch sweepstake" });
  }
};

type GamePickSubmission = Pick<PrismaGamePick, "gameId" | "selectedTeamId" | "selectedAthleteId">;

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
          select: {
            id: true,
            isFinal: true,
            sport: {
              select: {
                slug: true,
              },
            },
          },
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

      // Get the corresponding game
      const game = sweepstake.games.find((g) => g.id === pick.gameId);
      if (!game) continue;

      const isPlayerBasedSport = playerBasedSports.includes(game.sport.slug);

      if (isPlayerBasedSport) {
        if (!pick.selectedAthleteId) {
          res.status(400).json({
            error: `Player-based sport (${game.sport.slug}) requires selecting a player for game ID: ${pick.gameId}`,
          });
          return;
        }
      } else {
        if (!pick.selectedTeamId) {
          res.status(400).json({
            error: `Team-based sport requires selecting a team for game ID: ${pick.gameId}`,
          });
          return;
        }
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
        const game = sweepstake.games.find((g) => g.id === pick.gameId);
        if (!game) continue;

        const isPlayerBasedSport = playerBasedSports.includes(game.sport.slug);

        await tx.gamePick.create({
          data: {
            sweepstakeEntryId: entry.id,
            gameId: pick.gameId,
            selectedTeamId: isPlayerBasedSport ? undefined : pick.selectedTeamId,
            selectedAthleteId: isPlayerBasedSport ? pick.selectedAthleteId : undefined,
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

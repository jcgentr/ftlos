import { PrismaClient } from "../src/generated/prisma";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const prisma = new PrismaClient();

type SportData = {
  name: string;
  slug: string;
};

type TeamData = {
  "Team ID": string;
  "Team Name": string;
  Sport: string;
};

type AthleteData = {
  "Athlete Name": string;
  Sport: string;
  Team: string;
  Team_id: string;
};

async function main() {
  console.log("Starting seed process...");

  // clear existing data (optional)
  await prisma.athlete.deleteMany();
  await prisma.team.deleteMany();
  await prisma.sport.deleteMany();

  // Reset sequences
  await prisma.$executeRaw`ALTER SEQUENCE athletes_id_seq RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE teams_id_seq RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE sports_id_seq RESTART WITH 1;`;

  console.log("Cleared existing data and reset sequences");

  const sportMap = new Map<string, number>();
  const teamMap = new Map<string, number>();

  const sportsData: SportData[] = [];

  await new Promise<void>((resolve) => {
    fs.createReadStream(path.join(__dirname, "../../data/FTLOS Initial Sports.csv"))
      .pipe(csv())
      .on("data", (data) => sportsData.push(data))
      .on("end", () => resolve());
  });

  console.log(`Read ${sportsData.length} sports from CSV`);

  for (const sport of sportsData) {
    try {
      const createdSport = await prisma.sport.create({
        data: {
          name: sport.name,
          slug: sport.slug,
        },
      });
      sportMap.set(sport.name, createdSport.id);
      console.log(`Created sport: ${sport.name} with ID ${createdSport.id}`);
    } catch (error) {
      console.error(`Error creating sport ${sport.name}:`, error);
    }
  }

  const teamsData: TeamData[] = [];

  await new Promise<void>((resolve) => {
    fs.createReadStream(path.join(__dirname, "../../data/FTLOS Inital Teams.csv"))
      .pipe(csv())
      .on("data", (data) => teamsData.push(data))
      .on("end", () => resolve());
  });

  console.log(`Read ${teamsData.length} teams from CSV`);

  const uniqueSports = [...new Set(teamsData.map((team) => team["Sport"]))];

  // create any sports that weren't in sports csv file
  for (const sportName of uniqueSports) {
    if (sportMap.has(sportName)) continue;
    const slug = sportName.toLowerCase().replace(/\s+/g, "-");

    try {
      const sport = await prisma.sport.create({
        data: {
          name: sportName,
          slug: slug,
        },
      });
      sportMap.set(sportName, sport.id);
      console.log(`Created sport: ${sportName} with ID ${sport.id}`);
    } catch (error) {
      console.error(`Error creating sport ${sportName}:`, error);
    }
  }

  for (const team of teamsData) {
    const teamName = team["Team Name"];
    const sportName = team["Sport"];
    const sportId = sportMap.get(sportName) as number;
    const externalId = team["Team ID"];

    try {
      const createdTeam = await prisma.team.create({
        data: {
          name: teamName,
          sportId: sportId,
        },
      });
      teamMap.set(externalId, createdTeam.id);
      console.log(`Created team: ${teamName} with ID ${createdTeam.id}`);
    } catch (error) {
      console.error(`Error creating team ${teamName}:`, error);
    }
  }

  const athletesData: AthleteData[] = [];

  await new Promise<void>((resolve) => {
    fs.createReadStream(path.join(__dirname, "../../data/FTLOS Inital Athletes.csv"))
      .pipe(csv())
      .on("data", (data) => athletesData.push(data))
      .on("end", () => resolve());
  });

  console.log(`Read ${athletesData.length} athletes from CSV`);

  for (const athlete of athletesData) {
    const athleteName = athlete["Athlete Name"];
    const sportName = athlete["Sport"];
    const teamExternalId = athlete["Team_id"];

    const sportId = sportMap.get(sportName) as number;
    const teamId = teamMap.get(teamExternalId) as number;

    if (!sportId || !teamId) {
      console.error(`Missing sport or team for athlete ${athleteName}`);
      continue;
    }

    try {
      const createdAthlete = await prisma.athlete.create({
        data: {
          name: athleteName,
          sportId: sportId,
          teamId: teamId,
        },
      });
      console.log(`Created athlete: ${createdAthlete.name}`);
    } catch (error) {
      console.error(`Error creating athlete ${athleteName}:`, error);
    }
  }

  console.log("Seed completed successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    throw new Error("Seed failed");
  });

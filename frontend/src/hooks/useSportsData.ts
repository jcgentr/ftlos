import { useState, useEffect } from "react";
import { useSports } from "./useSports";
import { useTeams } from "./useTeams";
import { useAthletes } from "./useAthletes";

export enum EntityType {
  ATHLETE = "ATHLETE",
  TEAM = "TEAM",
  SPORT = "SPORT",
}

export type SportItem = {
  id: number;
  entityId: number;
  entityType: EntityType;
  value: string;
  label: string;
};

export type SportCategory = {
  category: "Athletes" | "Teams" | "Sports";
  items: SportItem[];
};

export type SportsData = SportCategory[];

export function useSportsData() {
  const { sports, isLoading: sportsLoading } = useSports();
  const { teams, isLoading: teamsLoading } = useTeams();
  const { athletes, isLoading: athletesLoading } = useAthletes();

  const [sportsData, setSportsData] = useState<SportsData>([]);
  const isLoading = sportsLoading || teamsLoading || athletesLoading;

  useEffect(() => {
    if (isLoading) return;

    const formattedData: SportsData = [
      {
        category: "Athletes",
        items: athletes.map((athlete) => ({
          id: athlete.id,
          entityId: athlete.id,
          entityType: EntityType.ATHLETE,
          value: athlete.name,
          label: athlete.name,
        })),
      },
      {
        category: "Teams",
        items: teams.map((team) => ({
          id: team.id,
          entityId: team.id,
          entityType: EntityType.TEAM,
          value: team.name,
          label: team.name,
        })),
      },
      {
        category: "Sports",
        items: sports.map((sport) => ({
          id: sport.id,
          entityId: sport.id,
          entityType: EntityType.SPORT,
          value: sport.name,
          label: sport.name,
        })),
      },
    ];

    setSportsData(formattedData);
  }, [sports, teams, athletes, isLoading]);

  return { sportsData, isLoading };
}

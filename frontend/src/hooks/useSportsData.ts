import { useState, useEffect } from "react";
import { useSports } from "./useSports";
import { useTeams } from "./useTeams";
import { useAthletes } from "./useAthletes";
import { EntityType, SportCategory } from "@/lib/types";

export function useSportsData() {
  const { sports, isLoading: sportsLoading } = useSports();
  const { teams, isLoading: teamsLoading } = useTeams();
  const { athletes, isLoading: athletesLoading } = useAthletes();

  const [sportsData, setSportsData] = useState<SportCategory[]>([]);
  const isLoading = sportsLoading || teamsLoading || athletesLoading;

  useEffect(() => {
    if (isLoading) return;

    const formattedData: SportCategory[] = [
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

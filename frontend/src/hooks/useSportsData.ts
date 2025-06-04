import { useState, useEffect } from "react";
import { useSports } from "./useSports";
import { useTeams } from "./useTeams";
import { useAthletes } from "./useAthletes";

export type SportItem = {
  id: number;
  value: string;
  label: string;
};

export type SportCategory = {
  category: string;
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
          value: athlete.name,
          label: athlete.name,
        })),
      },
      {
        category: "Teams",
        items: teams.map((team) => ({
          id: team.id,
          value: team.name,
          label: team.name,
        })),
      },
      {
        category: "Sports",
        items: sports.map((sport) => ({
          id: sport.id,
          value: sport.name,
          label: sport.name,
        })),
      },
    ];

    setSportsData(formattedData);
  }, [sports, teams, athletes, isLoading]);

  return { sportsData, isLoading };
}

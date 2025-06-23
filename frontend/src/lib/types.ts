export type UserProfile = {
  id: string;
  email: string;
  supabaseId: string;
  firstName: string | null;
  lastName: string | null;
  location: string | null;
  birthDate: string | null;
  favoriteSports: string | null;
  isConnecting: boolean;
  createdAt: string;
  updatedAt: string;
  profileImageUrl: string | null;
};

export type UserTagline = {
  id: string;
  userId: string;
  entityType: EntityType;
  entityId: number;
  entityName: string;
  sentiment: "LOVE" | "LOATHE";
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type UserRating = {
  id: string;
  userId: string;
  entityType: EntityType;
  entityId: number;
  entityName: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

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

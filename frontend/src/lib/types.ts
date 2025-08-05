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
  friendshipStatus?: FriendshipStatus;
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

export enum FriendshipStatus {
  FRIENDS = "FRIENDS",
  OUTGOING_REQUEST = "OUTGOING_REQUEST",
  INCOMING_REQUEST = "INCOMING_REQUEST",
  NOT_FRIENDS = "NOT_FRIENDS",
}

export interface Friend {
  id: string;
  supabaseId: string;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  location: string | null;
}

export type SortOption = "none" | "asc" | "desc";

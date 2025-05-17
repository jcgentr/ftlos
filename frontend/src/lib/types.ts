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
};

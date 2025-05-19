import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { RatingTableStatic } from "./RatingTable";
import { useParams } from "react-router";
import { UserProfile } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function ProfileOther() {
  const { profileId } = useParams();
  const { session } = useAuth();
  const [profile, setProfile] = useState<Omit<UserProfile, "email" | "id"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProfilePic, setLoadingProfilePic] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) return;

      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${profileId}/public`, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setProfile(null);
        console.error("Error during fetching user profile:", err);
        toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-8 max-w-3xl w-full mx-auto">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-8 max-w-3xl w-full mx-auto">Profile not found.</div>;
  }

  return (
    <div className="p-8 max-w-3xl w-full mx-auto">
      <div className="bg-white p-8 border border-gray-300 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">
          {!profile.firstName && !profile.lastName ? "Profile" : `${profile.firstName} ${profile.lastName}`.trim()}
        </h1>
        <div className="flex justify-between items-center">
          <div className="bg-gray-100 text-gray-700 border border-gray-700 px-3 py-1 rounded-lg text-sm">
            {profile.location || "Location not set"}
          </div>
          <div
            className={`px-3 py-1 rounded-lg text-sm border ${
              profile.isConnecting
                ? "bg-green-100 text-green-700 border-green-700"
                : "bg-red-100 text-red-700 border-red-700"
            }`}
          >
            {profile.isConnecting ? "Connecting" : "Not Connecting"}
          </div>
        </div>
        <div className="w-52 h-52 m-auto mt-4 relative bg-gray-200 overflow-hidden rounded-full">
          {loadingProfilePic && (
            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            </div>
          )}
          <img
            src="https://images.unsplash.com/photo-1627796795540-18e2db6d3908?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="profile image"
            className="w-full h-full object-cover"
            onLoad={() => setLoadingProfilePic(false)}
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mt-8">Personal Information</h2>
          <p>
            <span className="font-bold">Name:</span>{" "}
            {!profile.firstName && !profile.lastName ? "Not set" : `${profile.firstName} ${profile.lastName}`.trim()}
          </p>
          <p>
            <span className="font-bold">Date of Birth:</span> {formatDate(profile.birthDate)}
          </p>
          <p>
            <span className="font-bold">Favorite Sports:</span> {profile.favoriteSports || "Not set"}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white p-8 border border-gray-300 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Favorite Teams & Players</h2>
        <RatingTableStatic />
      </div>
    </div>
  );
}

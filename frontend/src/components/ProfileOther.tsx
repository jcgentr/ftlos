import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { RatingTableStatic } from "./RatingTable";
import { useParams } from "react-router";
import { UserProfile } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";

export function ProfileOther() {
  const { profileId } = useParams();
  const { session } = useAuth();
  const [profile, setProfile] = useState<Omit<UserProfile, "email" | "id"> | null>(null);
  const [loading, setLoading] = useState(true);

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
          {profile.profileImageUrl ? (
            <img src={profile.profileImageUrl} alt="profile image" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <User className="text-gray-500" size={80} strokeWidth={1.5} />
            </div>
          )}
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
        </div>
      </div>

      <div className="mt-8 bg-white p-8 border border-gray-300 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Favorite Teams & Players</h2>
        {/* TODO: add user's selections from backend */}
        <RatingTableStatic selections={[]} />
      </div>
    </div>
  );
}

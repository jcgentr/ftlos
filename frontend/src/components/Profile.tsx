import { Link } from "react-router";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";
import { formatDate } from "@/lib/utils";
import { User } from "lucide-react";
import { Tagline } from "./Tagline";
import { ProfileRatings } from "./ProfileRatings";

export function Profile() {
  const { profile, loading, updateProfile } = useUserProfile();
  const [updating, setUpdating] = useState(false);

  const handleToggleConnecting = async () => {
    if (!profile) return;
    setUpdating(true);
    try {
      const updatedProfile = await updateProfile({ isConnecting: !profile.isConnecting });

      if (updatedProfile) {
        toast.success(`You are now ${updatedProfile.isConnecting ? "connecting" : "not connecting"}`);
      }
    } catch (err) {
      console.error("Error updating connecting status:", err);
    } finally {
      setUpdating(false);
    }
  };

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
            <span className="font-bold">Email:</span> {profile.email}
          </p>
          <p>
            <span className="font-bold">Date of Birth:</span> {formatDate(profile.birthDate)}
          </p>
        </div>
        <div className="flex justify-end items-center mt-8 gap-4 flex-wrap">
          <Button
            onClick={handleToggleConnecting}
            disabled={updating}
            className={`${profile.isConnecting ? "bg-red-500 hover:bg-red-600" : "bg-success hover:bg-success-lighter"} transition-all`}
          >
            {updating ? "Updating..." : profile.isConnecting ? "Stop Connecting" : "Start Connecting"}
          </Button>
          <Link to="/profile/edit">
            <Button>Edit Profile</Button>
          </Link>
        </div>
      </div>

      <Tagline />

      <ProfileRatings />
    </div>
  );
}

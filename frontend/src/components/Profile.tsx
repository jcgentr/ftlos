import { Link } from "react-router";
import { RatingTable } from "./RatingTable";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";
import { formatDate } from "@/lib/utils";

export function Profile() {
  const { profile, loading, updateProfile } = useUserProfile();
  const [loadingProfilePic, setLoadingProfilePic] = useState(true);
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
            <span className="font-bold">Email:</span> {profile.email}
          </p>
          <p>
            <span className="font-bold">Date of Birth:</span> {formatDate(profile.birthDate)}
          </p>
          <p>
            <span className="font-bold">Favorite Sports:</span> {profile.favoriteSports || "Not set"}
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

      <div className="mt-8 bg-white p-8 border border-gray-300 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Rate Teams & Players</h2>
        <RatingTable />
      </div>
    </div>
  );
}

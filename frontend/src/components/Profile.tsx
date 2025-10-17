import { Link } from "react-router";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";
import { User } from "lucide-react";
import { Tagline } from "./Tagline";
import { ProfileRatings } from "./ProfileRatings";
import { useSportsData } from "@/hooks/useSportsData";
import { FriendsList } from "./FriendsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ProfilePosts } from "./ProfilePosts";

export function Profile() {
  const { profile, loading, updateProfile } = useUserProfile();
  const [updating, setUpdating] = useState(false);
  const { sportsData, isLoading: sportsLoading } = useSportsData();

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
    return <div className="p-4 sm:p-8 max-w-3xl w-full mx-auto">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-4 sm:p-8 max-w-3xl w-full mx-auto">Profile not found.</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl w-full mx-auto">
      <div className="bg-white p-8 border border-gray-300 rounded-lg">
        <div className="w-full h-auto m-auto relative">
          <div className="w-full mx-auto h-80 relative bg-gray-200 transform rotate-2 shadow-xl/30">
            {profile.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt="profile image" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <User className="text-gray-500" size={80} strokeWidth={1.5} />
              </div>
            )}
          </div>
        </div>
        <h1 className="text-4xl font-bold my-4">
          {!profile.firstName && !profile.lastName ? "Profile" : `${profile.firstName} ${profile.lastName}`.trim()}
        </h1>

        <Tabs defaultValue="about">
          <TabsList className="w-full mb-2">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>
          <TabsContent value="about">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="bg-gray-100 text-gray-700 border border-gray-700 px-3 py-1 rounded-lg text-sm">
                {profile.location || "Location not set"}
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <div
                  className={`px-3 py-1 rounded-lg text-sm border ${
                    profile.isConnecting
                      ? "bg-green-100 text-green-700 border-green-700"
                      : "bg-red-100 text-red-700 border-red-700"
                  }`}
                >
                  {profile.isConnecting ? "Connecting" : "Not Connecting"}
                </div>
                <Button
                  onClick={handleToggleConnecting}
                  disabled={updating}
                  size="sm"
                  className={`${profile.isConnecting ? "bg-red-500 hover:bg-red-600" : "bg-success hover:bg-success-lighter"} transition-all`}
                >
                  {updating ? "Updating..." : profile.isConnecting ? "Stop Connecting" : "Start Connecting"}
                </Button>
                <Link to="/profile/edit">
                  <Button size="sm">Edit Profile</Button>
                </Link>
              </div>
            </div>

            <Tagline sportsData={sportsData} isLoading={sportsLoading} />
            <ProfileRatings sportsData={sportsData} isLoading={sportsLoading} />
            <FriendsList />
          </TabsContent>
          <TabsContent value="posts">
            <ProfilePosts isOwnProfile={true} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

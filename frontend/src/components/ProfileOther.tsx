import { useEffect, useState } from "react";
import { RatingTableStatic } from "./RatingTable";
import { useParams } from "react-router";
import { FriendshipStatus, UserProfile, UserRating, UserTagline } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";
import { TaglineStatic } from "./Tagline";
import { FriendRequestButton } from "./FriendRequestButton";
import { FriendsListOther } from "./FriendsListOther";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ProfilePosts } from "./ProfilePosts";

export function ProfileOther() {
  const { profileId } = useParams();
  const { session } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRatings, setUserRatings] = useState<UserRating[]>([]);
  const [userTaglines, setUserTaglines] = useState<UserTagline[]>([]);

  const fetchProfile = async (showLoading = true) => {
    if (showLoading) setLoading(true);
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
      if (showLoading) setProfile(null);
      console.error("Error during fetching user profile:", err);
      if (showLoading) {
        toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchUserRatings = async () => {
    if (!session?.access_token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings/${profileId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch ratings");

      const data = await response.json();
      setUserRatings(data);
    } catch (error) {
      console.error("Error fetching user ratings:", error);
      toast.error("Failed to load your ratings");
    }
  };

  const fetchUserTaglines = async () => {
    if (!session?.access_token || !profileId) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/taglines/${profileId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch taglines");

      const data = await response.json();
      setUserTaglines(data);
    } catch (error) {
      console.error("Error fetching user taglines:", error);
      toast.error("Failed to load taglines");
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchProfile();
      fetchUserRatings();
      fetchUserTaglines();
    }
  }, [profileId]);

  const handleFriendshipChange = () => {
    fetchProfile(false);
  };

  if (loading) {
    return <div className="p-4 sm:p-8 max-w-3xl w-full mx-auto">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-4 sm:p-8 max-w-3xl w-full mx-auto">Profile not found.</div>;
  }

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

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
        <h1 className="text-4xl font-bold my-4">{!profile.firstName && !profile.lastName ? "Profile" : fullName}</h1>

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
                {profile.friendshipStatus && (
                  <FriendRequestButton
                    userId={profile.id}
                    friendshipStatus={profile.friendshipStatus}
                    onFriendshipChange={handleFriendshipChange}
                  />
                )}
              </div>
            </div>

            <div className="mt-4 py-2 border-t-2 border-gray-300">
              <TaglineStatic taglines={userTaglines} />
            </div>

            <div className="mb-2 pt-4 border-t-2 border-gray-300">
              <h2 className="text-2xl font-semibold mb-2">Ratings</h2>
              <RatingTableStatic ratings={userRatings} />
            </div>

            {profile.friendshipStatus === FriendshipStatus.FRIENDS && (
              <FriendsListOther userId={profile.id} userName={fullName} />
            )}
          </TabsContent>
          <TabsContent value="posts">
            <ProfilePosts isOwnProfile={false} userId={profile.supabaseId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { UserProfile } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export function useUserProfile() {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id || !session?.access_token) return;

      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
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
  }, [user, session]);

  const uploadProfileImage = async (imageFile: File): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error("Error uploading profile image:", err);
      toast.error("Failed to upload profile image");
      return null;
    }
  };

  const updateProfile = async (updateData: Partial<UserProfile>, profileImage?: File) => {
    if (!user || !profile) return null;

    try {
      const profileData = { ...updateData };

      if (profileImage) {
        const imageUrl = await uploadProfileImage(profileImage);
        if (imageUrl) {
          profileData.profileImageUrl = imageUrl;
        }
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
      return null;
    }
  };

  return { profile, loading, updateProfile, setProfile };
}

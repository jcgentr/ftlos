import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Link, useNavigate } from "react-router";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner";
import { PlacesAutocomplete } from "./PlacesAutocomplete";

export function ProfileEdit() {
  const { profile, loading, updateProfile } = useUserProfile();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    birthDate: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        location: profile.location || "",
        birthDate: profile.birthDate || "",
      });

      if (profile.profileImageUrl) {
        setImagePreview(profile.profileImageUrl);
      }
    }
  }, [profile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedProfile = await updateProfile(formData, profileImage || undefined);

      if (updatedProfile) {
        toast.success("Profile updated successfully");
        navigate("/profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4 sm:p-8 max-w-3xl w-full mx-auto">Loading profile...</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl w-full mx-auto">
      <div className="bg-white p-8 border border-gray-300 rounded-lg">
        <form onSubmit={handleSubmit}>
          <h1 className="text-4xl font-bold mb-6">Edit Profile</h1>
          <Label className="mb-2" htmlFor="firstName">
            First Name
          </Label>
          <Input
            type="text"
            id="firstName"
            placeholder="Enter your first name"
            className="mb-6"
            value={formData.firstName}
            onChange={handleChange}
          />

          <Label className="mb-2" htmlFor="lastName">
            Last Name
          </Label>
          <Input
            type="text"
            id="lastName"
            placeholder="Enter your last name"
            className="mb-6"
            value={formData.lastName}
            onChange={handleChange}
          />

          <PlacesAutocomplete
            value={formData.location || ""}
            onChange={(value) => setFormData({ ...formData, location: value })}
          />

          <Label className="mb-2 pt-6" htmlFor="birthDate">
            Date of Birth
          </Label>
          <Input type="date" id="birthDate" className="mb-6" value={formData.birthDate} onChange={handleChange} />

          <Label className="mb-2" htmlFor="profile-picture">
            Profile Picture
          </Label>
          <Input type="file" id="profile-picture" className="mb-6" accept="image/*" onChange={handleImageChange} />

          {imagePreview && (
            <div className="mb-6">
              <img src={imagePreview} alt="Profile preview" className="w-[200px] h-auto" />
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <Link to="/profile">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

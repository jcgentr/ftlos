import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { NavLink } from "react-router";

export function ProfileEdit() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 max-w-3xl w-full mx-auto">
      <div className="bg-white p-8 border border-gray-300 rounded-lg">
        <h1 className="text-4xl font-bold mb-6">Edit Profile</h1>
        <Label className="mb-2" htmlFor="first-name">
          First Name
        </Label>
        <Input type="text" id="first-name" placeholder="Enter your first name" className="mb-6" />

        <Label className="mb-2" htmlFor="last-name">
          Last Name
        </Label>
        <Input type="text" id="last-name" placeholder="Enter your last name" className="mb-6" />

        <Label className="mb-2" htmlFor="location">
          Location
        </Label>
        <Input type="text" id="location" placeholder="Enter your location" className="mb-6" />

        <Label className="mb-2" htmlFor="date-of-birth">
          Date of Birth
        </Label>
        <Input type="date" id="date-of-birth" className="mb-6" />

        <Label className="mb-2" htmlFor="favorite-sports">
          Favorite Sports
        </Label>
        <Input type="text" id="favorite-sports" placeholder="Type to search sports..." />
        <p className="mt-1 mb-6 text-sm text-gray-500">Search and select your favorite sports</p>

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
          <NavLink to="/profile">
            <Button variant="outline">Cancel</Button>
          </NavLink>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}

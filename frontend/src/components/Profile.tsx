import { NavLink } from "react-router";
import { RatingTable } from "./RatingTable";
import { Button } from "./ui/button";
import { useState } from "react";

export function Profile() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="p-8 max-w-3xl w-full mx-auto">
      <div className="bg-white p-8 border border-gray-300 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Patrick's Profile</h1>
        <div className="flex justify-between items-center">
          <div className="bg-gray-100 text-gray-700 border border-gray-700 px-3 py-1 rounded-lg text-sm">
            New York, USA
          </div>
          <div className="bg-green-100 text-green-700 border border-green-700 px-3 py-1 rounded-lg text-sm">
            Connecting
          </div>
        </div>
        <div className="w-52 h-52 m-auto mt-4 relative bg-gray-200 overflow-hidden rounded-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            </div>
          )}
          <img
            src="https://images.unsplash.com/photo-1627796795540-18e2db6d3908?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="profile image"
            className="w-full h-full object-cover"
            onLoad={() => setIsLoading(false)}
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mt-8">Personal Information</h2>
          <p>
            <span className="font-bold">Name:</span> Patrick Starr
          </p>
          <p>
            <span className="font-bold">Date of Birth:</span> Not set
          </p>
          <p>
            <span className="font-bold">Favorite Sports:</span> Football, Basketball, Baseball
          </p>
        </div>
        <div className="flex justify-end items-center mt-8 gap-4 flex-wrap">
          <Button className="bg-success hover:bg-success-lighter">Stop Connecting</Button>
          <NavLink to="/profile/edit">
            <Button>Edit Profile</Button>
          </NavLink>
        </div>
      </div>

      <div className="mt-8 bg-white p-8 border border-gray-300 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Rate Teams & Players</h2>
        <RatingTable />
      </div>
    </div>
  );
}

import { RatingTable } from "./RatingTable";
import { Button } from "./ui/button";

export function Profile() {
  return (
    <div className="p-8">
      <div className="m-auto p-8 max-w-[700px] border border-accent rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Patrick's Profile</h1>
        <div className="flex justify-between items-center">
          <div className="bg-black text-white px-3 py-1 rounded-lg text-sm">New York, USA</div>
          <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">Connecting</div>
        </div>
        <div className="w-52 h-auto m-auto mt-4">
          <img
            src="https://images.unsplash.com/photo-1627796795540-18e2db6d3908?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="profile image"
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
      </div>

      <div className="max-w-[1000px] m-auto">
        <h2 className="text-2xl font-semibold mt-8 mb-4">Rate Teams & Players</h2>
        <RatingTable />
        <div className="flex justify-between items-center my-8">
          <Button>Edit Profile</Button>
          <Button className="bg-green-600 hover:bg-green-500">Stop Connecting</Button>
        </div>
      </div>
    </div>
  );
}

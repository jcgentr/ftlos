import { NavLink } from "react-router";
import { Button } from "./ui/button";
import { Star, UserPen } from "lucide-react";
import { RatingTable } from "./RatingTable";

export function Home() {
  return (
    <div className="p-8 max-w-5xl ml-auto mr-auto">
      <h1 className="text-5xl font-bold text-primary">Are you the only person in the world who...</h1>
      <div className="text-center space-y-2 my-10">
        <p>
          <span className="font-bold text-primary">supports</span> <span className="font-bold">Real Betis</span>
        </p>
        <p>
          <span className="font-bold text-primary">hates</span> <span className="font-bold">Golden State Warriors</span>
        </p>
        <p>
          <span className="font-bold text-primary">loves</span> <span className="font-bold">Phil Mickelson</span>
        </p>
        <p>
          <span className="font-bold text-primary">watches</span> <span className="font-bold">Field Hockey</span>
        </p>
        <p className="mt-8 text-2xl">You aren't alone anymore! Find your new best friend here!</p>
      </div>

      {/* Connect with Fans */}
      <div className="border border-accent mt-12 rounded-lg">
        <div className="flex justify-between items-center p-4 border-b border-accent">
          <h2 className="text-2xl font-bold">Connect with Fans</h2>
          <NavLink to="/fans">
            <Button variant="outline">Find More Fans</Button>
          </NavLink>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center py-4">
          <p>We'll show personalized fan recommendations here once you:</p>
          <p className="flex items-center gap-2 mt-4">
            <UserPen /> Complete your profile with interests
          </p>
          <p className="flex items-center gap-2">
            <Star /> Rate some sports entities
          </p>
          <NavLink to="/fans" className="mt-4">
            <Button>Browse All Fans</Button>
          </NavLink>
        </div>
      </div>
      {/* Rate These Sports Entities */}
      <div className="border border-accent mt-8 rounded-lg">
        <div className="p-4 border-b border-accent">
          <h2 className="text-2xl font-bold">Rate These Sports Entities</h2>
          <p>Help us learn your preferences! Rate from 1 (strongly dislike) to 5 (strongly like)</p>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center py-4">
          <RatingTable />
          <Button className="mt-4">Get New Entitites to Rate</Button>
        </div>
      </div>
    </div>
  );
}

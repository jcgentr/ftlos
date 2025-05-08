import { NavLink } from "react-router";
import { Button } from "./ui/button";

export function Sweepstakes() {
  return (
    <div className="p-8 max-w-5xl w-full mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-4">Active Sweepstakes</h1>

        <div className="border border-gray-300 bg-white rounded-lg max-w-[420px]">
          <div className="flex justify-between items-center p-4 border-b border-gray-300">
            <h2 className="text-xl font-semibold flex items-center gap-2">All Sports Sweepstake</h2>
          </div>
          <div className="ml-8 py-4">
            <p>
              <span className="font-bold">Start Date:</span> April 23, 2025
            </p>
            <p>
              <span className="font-bold">End Date:</span> April 30, 2025
            </p>
            <p>
              <span className="font-bold">Prize Pool:</span> <span className="text-success">$10,000.00</span>
            </p>
            <NavLink to="/sweepstakes/1">
              <Button className="mt-4">Make Your Picks</Button>
            </NavLink>
          </div>
        </div>
      </div>

      <div className="mt-8 border border-gray-300 bg-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold">Past Sweepstakes</h2>
        <div className="bg-primary-foreground border border-primary rounded-lg p-6 my-4">
          <p className="text-primary">No past sweepstakes available.</p>
        </div>
      </div>
    </div>
  );
}

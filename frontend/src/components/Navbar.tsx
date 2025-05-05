import { NavLink } from "react-router";
import { Button } from "./ui/button";
import { LogOut, Ticket, Trophy, User, Users } from "lucide-react";

export function Navbar() {
  return (
    <nav className="bg-background text-foreground p-4">
      <ul className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <li className="font-bold">
            <NavLink to="/" end>
              FTLOS
            </NavLink>
          </li>
          <li>
            <NavLink to="/fans" className={({ isActive }) => (isActive ? "text-primary" : "text-gray-500")}>
              <Button variant="link" className="text-inherit text-base hover:text-primary">
                <Users /> Find A Fan
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? "text-primary" : "text-gray-500")}>
              <Button variant="link" className="text-inherit text-base hover:text-primary">
                <Trophy /> Rankings
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/sweepstakes" className={({ isActive }) => (isActive ? "text-primary" : "text-gray-500")}>
              <Button variant="link" className="text-inherit text-base hover:text-primary">
                <Ticket /> Sweepstakes
              </Button>
            </NavLink>
          </li>
        </div>

        <div className="flex gap-2 items-center">
          <li>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? "text-primary" : "text-gray-500")}>
              <Button variant="link" className="text-inherit text-base hover:text-primary">
                <User /> Profile
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/logout" className={({ isActive }) => (isActive ? "text-primary" : "text-gray-500")}>
              <Button variant="link" className="text-inherit text-base hover:text-primary">
                <LogOut /> Logout
              </Button>
            </NavLink>
          </li>
        </div>
      </ul>
    </nav>
  );
}

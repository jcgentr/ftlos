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
            <NavLink to="/fans" className={({ isActive }) => (isActive ? "text-primary" : "")}>
              <Button variant="link" className="text-inherit text-base">
                <Users /> Find A Fan
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? "text-primary" : "")}>
              <Button variant="link" className="text-inherit text-base">
                <Trophy /> Rankings
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/sweepstakes" className={({ isActive }) => (isActive ? "text-primary" : "")}>
              <Button variant="link" className="text-inherit text-base">
                <Ticket /> Sweepstakes
              </Button>
            </NavLink>
          </li>
        </div>

        <div className="flex gap-2 items-center">
          <li>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? "text-primary" : "")}>
              <Button variant="link" className="text-inherit text-base">
                <User /> Profile
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/logout">
              <Button variant="link" className="text-inherit text-base">
                <LogOut /> Logout
              </Button>
            </NavLink>
          </li>
        </div>
      </ul>
    </nav>
  );
}

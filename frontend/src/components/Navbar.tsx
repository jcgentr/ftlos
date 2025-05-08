import { Link, NavLink } from "react-router";
import { Button } from "./ui/button";
import { LogOut, Ticket, Trophy, User, Users } from "lucide-react";
import logoImage from "/logo.png";

export function Navbar() {
  return (
    <nav className="bg-white text-primary p-6">
      <ul className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <li className="flex-none mt-1">
            <NavLink to="/" end>
              <img src={logoImage} alt="FTLOS Logo" width={100} height={100} className="h-auto" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/fans" className={({ isActive }) => (isActive ? "text-primary" : "text-gray-500")}>
              <Button variant="link" className="text-inherit text-base hover:text-primary">
                <Users /> <span>Find A Fan</span>
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? "text-primary" : "text-gray-500")}>
              <Button variant="link" className="text-inherit text-base hover:text-primary">
                <Trophy /> <span>Rankings</span>
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/sweepstakes" className={({ isActive }) => (isActive ? "text-primary" : "text-gray-500")}>
              <Button variant="link" className="text-inherit text-base hover:text-primary">
                <Ticket /> <span>Sweepstakes</span>
              </Button>
            </NavLink>
          </li>
        </div>

        <div className="flex gap-2 items-center">
          <li>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? "text-primary" : "text-gray-500")}>
              <Button variant="link" className="text-inherit text-base hover:text-primary">
                <User /> <span>Profile</span>
              </Button>
            </NavLink>
          </li>
          <li>
            <Link to="/logout" className="text-gray-500">
              <Button variant="link" className="text-inherit text-base hover:text-primary">
                <LogOut /> <span>Logout</span>
              </Button>
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
}

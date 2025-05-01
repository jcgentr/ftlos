import { NavLink } from "react-router";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="bg-background text-foreground p-4">
      <ul className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <li>
            <NavLink to="/" end>
              FTLOS
            </NavLink>
          </li>
          <li>
            <NavLink to="/fans">Find A Fan</NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard">Rankings</NavLink>
          </li>
          <li>
            <NavLink to="/sweepstakes">Sweepstakes</NavLink>
          </li>
        </div>

        <div className="flex gap-2 items-center">
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li>
            <NavLink to="/logout">
              <Button>Logout</Button>
            </NavLink>
          </li>
        </div>
      </ul>
    </nav>
  );
}

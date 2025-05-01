import { NavLink } from "react-router";

export function Navbar() {
  return (
    <nav className="bg-gray-300 p-4">
      <ul className="flex justify-between">
        <div className="flex gap-2">
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

        <div className="flex gap-2">
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li>
            <NavLink to="/logout">Logout</NavLink>
          </li>
        </div>
      </ul>
    </nav>
  );
}

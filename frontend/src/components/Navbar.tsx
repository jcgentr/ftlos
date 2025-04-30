import { NavLink } from "react-router";

export function Navbar() {
  return (
    <nav className="bg-amber-100">
      <ul>
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/spotify">Spotify</NavLink>
        </li>
      </ul>
    </nav>
  );
}

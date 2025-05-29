import { Link, NavLink } from "react-router";
import { Button } from "./ui/button";
import { LogIn, LogOut, Menu, Ticket, Trophy, User, UserPlus, Users, X } from "lucide-react";
import logoImage from "/logo.png";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, signOut } = useAuth();

  // Handle screen resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      // Close menu when resizing to desktop
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    setIsOpen(false);
    signOut();
  };

  const MainNavItems = () => (
    <>
      <li>
        <NavLink
          to="/fans"
          className={({ isActive }) => (isActive ? "text-primary" : "text-muted-foreground")}
          onClick={() => setIsOpen(false)}
        >
          <Button variant="link" className="text-inherit text-base hover:text-primary">
            <Users /> <span>Find A Fan</span>
          </Button>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/leaderboard"
          className={({ isActive }) => (isActive ? "text-primary" : "text-muted-foreground")}
          onClick={() => setIsOpen(false)}
        >
          <Button variant="link" className="text-inherit text-base hover:text-primary">
            <Trophy /> <span>Rankings</span>
          </Button>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/sweepstakes"
          className={({ isActive }) => (isActive ? "text-primary" : "text-muted-foreground")}
          onClick={() => setIsOpen(false)}
        >
          <Button variant="link" className="text-inherit text-base hover:text-primary">
            <Ticket /> <span>Sweepstakes</span>
          </Button>
        </NavLink>
      </li>
    </>
  );

  const ProfileNavItems = () => (
    <>
      {user ? (
        <>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? "text-primary" : "text-muted-foreground")}
              onClick={() => setIsOpen(false)}
            >
              <Button variant="link" className="text-inherit text-base hover:text-primary">
                <User /> <span>Profile</span>
              </Button>
            </NavLink>
          </li>
          <li>
            <Link to="#" className="text-muted-foreground" onClick={handleLogout}>
              <Button variant="link" className="text-inherit text-base hover:text-primary">
                <LogOut /> <span>Logout</span>
              </Button>
            </Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "text-primary" : "text-muted-foreground")}
              onClick={() => setIsOpen(false)}
            >
              <Button variant="link" className="text-inherit text-base hover:text-primary">
                <LogIn /> <span>Login</span>
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/signup"
              className={({ isActive }) => (isActive ? "text-primary" : "text-muted-foreground")}
              onClick={() => setIsOpen(false)}
            >
              <Button variant="link" className="text-inherit text-base hover:text-primary">
                <UserPlus /> <span>Sign Up</span>
              </Button>
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white text-primary p-6 relative">
      <ul className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <li className="flex-none mt-1">
            <NavLink to="/" end>
              <img src={logoImage} alt="FTLOS Logo" width={100} height={100} className="h-auto" />
            </NavLink>
          </li>

          {/* Desktop Navigation - Main Links */}
          {!isMobile && (
            <div className="flex gap-2 items-center">
              <MainNavItems />
            </div>
          )}
        </div>

        {/* Desktop Navigation - Profile & Logout */}
        {!isMobile && (
          <div className="flex gap-2 items-center">
            <ProfileNavItems />
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="z-20">
            {isOpen ? <X /> : <Menu />}
          </Button>
        )}
      </ul>

      {/* Mobile Menu Dropdown */}
      {isMobile && isOpen && (
        <div className="absolute top-full right-0 bg-white shadow-lg rounded-bl-md z-10 w-64 border-t">
          <div className="flex flex-col p-4">
            <ul className="flex flex-col space-y-2">
              <MainNavItems />
            </ul>

            {/* Profile and Logout at the bottom */}
            <ul className="flex flex-col space-y-2 mt-4 pt-4 border-t">
              <ProfileNavItems />
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}

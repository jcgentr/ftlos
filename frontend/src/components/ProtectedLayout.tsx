import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

export function ProtectedLayout() {
  const { loading, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !session) {
      // redirect to login page if not authenticated
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [loading, session, navigate, location]);

  return session ? <Outlet /> : null;
}

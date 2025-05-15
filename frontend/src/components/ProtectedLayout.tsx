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

  if (loading) {
    return (
      <div className="p-8 max-w-xl w-full mx-auto">
        <div className="flex flex-col">
          <div className="bg-white rounded-lg border shadow-sm animate-pulse">
            <div className="p-6 space-y-2">
              <div className="h-7 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return session ? <Outlet /> : null;
}

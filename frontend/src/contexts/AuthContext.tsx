import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const previousSessionRef = useRef<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUserSession(session);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      console.log(previousSessionRef.current);

      if (event === "INITIAL_SESSION") {
        setUserSession(session);
        previousSessionRef.current = session;
      } else if (event === "SIGNED_IN") {
        // Only update if this is a new sign in (previousSession was null)
        // or if the user ID has changed (different user signed in)
        // or jwt changes (not sure if this is actually needed)
        if (
          !previousSessionRef.current ||
          previousSessionRef.current?.user?.id !== session?.user?.id ||
          previousSessionRef?.current?.access_token !== session?.access_token
        ) {
          setUserSession(session);
        }
        previousSessionRef.current = session;
      } else if (event === "SIGNED_OUT") {
        setUserSession(null);
        previousSessionRef.current = null;
      } else if (event === "PASSWORD_RECOVERY") {
        // handle password recovery event
      } else if (event === "TOKEN_REFRESHED") {
        setUserSession(session);
        previousSessionRef.current = session;
      } else if (event === "USER_UPDATED") {
        setUserSession(session);
        previousSessionRef.current = session;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session: userSession,
    user: userSession?.user ?? null,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

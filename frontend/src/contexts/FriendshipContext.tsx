import { FriendshipStatus } from "@/lib/types";
import { createContext, useCallback, useContext, useState } from "react";

type FriendshipMap = Record<string, FriendshipStatus>;

interface FriendshipContextType {
  friendshipStatuses: FriendshipMap;
  updateFriendshipStatus: (userId: string, status: FriendshipStatus) => void;
}

const FriendshipContext = createContext<FriendshipContextType | undefined>(undefined);

export function FriendshipProvider({ children }: { children: React.ReactNode }) {
  const [friendshipStatuses, setFriendshipStatuses] = useState<FriendshipMap>({});

  const updateFriendshipStatus = useCallback((userId: string, status: FriendshipStatus) => {
    setFriendshipStatuses((prev) => ({
      ...prev,
      [userId]: status,
    }));
  }, []);

  return (
    <FriendshipContext.Provider value={{ friendshipStatuses, updateFriendshipStatus }}>
      {children}
    </FriendshipContext.Provider>
  );
}

export function useFriendship() {
  const context = useContext(FriendshipContext);
  if (context === undefined) {
    throw new Error("useFriendship must be used within a FriendshipProvider");
  }
  return context;
}

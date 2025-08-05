import { UserCard } from "./UserCard";
import { useEffect, useState } from "react";
import { Friend, SortOption } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface FriendsListOtherProps {
  userId: string;
  userName: string;
}

export function FriendsListOther({ userId, userName }: FriendsListOtherProps) {
  const { session } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("none");

  const fetchFriends = async () => {
    if (!session?.access_token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/${userId}`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }

      const data = await response.json();
      setFriends(data);
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch friends");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const sortedFriends = [...friends].sort((a, b) => {
    const nameA = `${a.firstName || ""} ${a.lastName || ""}`.trim().toLowerCase();
    const nameB = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase();

    if (sortOption === "asc") {
      return nameA.localeCompare(nameB);
    } else if (sortOption === "desc") {
      return nameB.localeCompare(nameA);
    }
    return 0;
  });

  return (
    <div className="mt-8 bg-white p-8 border border-gray-300 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold" id="friends">
          Friends
        </h2>
        {friends.length > 0 && (
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-[130px]" size="sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Sort</SelectItem>
              <SelectItem value="asc">A-Z</SelectItem>
              <SelectItem value="desc">Z-A</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      {loading ? (
        <p className="text-gray-500">Loading friends...</p>
      ) : error ? (
        <p className="text-red-500">Error loading friends: {error}</p>
      ) : friends.length === 0 ? (
        <div className="space-y-4">
          <p className="text-gray-500">{userName} hasn't added any friends yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {sortedFriends.map((friend) => (
            <UserCard key={friend.id} user={friend} showFriendButton={false} />
          ))}
        </div>
      )}
    </div>
  );
}

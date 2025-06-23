import { Link } from "react-router";
import { Button } from "./ui/button";
import { Star, UserPen } from "lucide-react";
import { useEffect, useState } from "react";
import { useRecommendedUsers } from "@/hooks/useRecommendedUsers";

// Define our entities to rotate through, keeping actions constant
const entitySets = [
  [
    { entity: "Real Betis" },
    { entity: "Golden State Warriors" },
    { entity: "Phil Mickelson" },
    { entity: "Field Hockey" },
  ],
  [{ entity: "Arsenal FC" }, { entity: "Los Angeles Lakers" }, { entity: "Serena Williams" }, { entity: "Formula 1" }],
  [
    { entity: "Chicago Cubs" },
    { entity: "New York Yankees" },
    { entity: "Lewis Hamilton" },
    { entity: "Rugby matches" },
  ],
  [
    { entity: "Manchester United" },
    { entity: "Dallas Cowboys" },
    { entity: "Simone Biles" },
    { entity: "Cricket tournaments" },
  ],
  [{ entity: "Liverpool FC" }, { entity: "Tottenham Hotspur" }, { entity: "Tiger Woods" }, { entity: "Ice Hockey" }],
];

// Fixed actions that don't change
const actions = ["supports", "loathes", "loves", "watches"];

export function Home() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { recommendations, userMeetsCriteria } = useRecommendedUsers();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentSetIndex((prev) => (prev + 1) % entitySets.length);
        setIsAnimating(false);
      }, 500);
    }, 3650);

    return () => clearInterval(interval);
  }, []);

  const currentSet = entitySets[currentSetIndex];

  return (
    <div className="p-4 sm:p-8 max-w-5xl w-full mx-auto">
      <h1 className="text-5xl font-bold text-primary">Are you the only person in the world who...</h1>
      <div className="text-center space-y-2 my-10">
        {actions.map((action, index) => (
          <p
            key={index}
            className={`transition-all duration-500 ${isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
          >
            <span className="font-bold text-primary text-lg">{action}</span>{" "}
            <span className="font-bold text-lg">{currentSet[index].entity}</span>
          </p>
        ))}
        <p className="mt-8 text-2xl">You aren't alone anymore! Find your new best friend here!</p>
      </div>

      {/* Connect with Fans */}
      <div className="border border-gray-300 mt-12 rounded-lg bg-white">
        <div className="flex flex-wrap gap-2 justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-2xl font-bold">Connect with Fans</h2>
          <Link to="/fans">
            <Button variant="outline">Find More Fans</Button>
          </Link>
        </div>
        {userMeetsCriteria && recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {recommendations.map((user) => (
              <Link to={`/profile/${user.supabaseId}`} key={user.supabaseId}>
                <div className="border border-gray-300 bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between md:flex-col gap-2">
                    <div className="flex items-center gap-3 shrink-0">
                      {user.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-gray-600 text-sm">{user.location}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 truncate md:ml-auto" title={user.matchReason}>
                      {user.matchReason}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 justify-center items-center p-4">
            <p>We'll show personalized fan recommendations here once you:</p>
            <p className="flex items-center gap-2 mt-4">
              <UserPen /> Complete your{" "}
              <Link to="/profile">
                <span className="text-primary font-medium hover:underline">profile</span>
              </Link>{" "}
              with interests
            </p>
            <p className="flex items-center gap-2">
              <Star /> Rate some sports entities
            </p>
            <Link to="/fans" className="mt-4">
              <Button>Browse All Fans</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

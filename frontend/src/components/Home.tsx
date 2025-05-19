import { Link } from "react-router";
import { Button } from "./ui/button";
import { Star, UserPen } from "lucide-react";
import { RatingTable } from "./RatingTable";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentSetIndex((prev) => (prev + 1) % entitySets.length);
        setIsAnimating(false);
      }, 500); // Half the transition time for switching content
    }, 3650);

    return () => clearInterval(interval);
  }, []);

  const currentSet = entitySets[currentSetIndex];

  return (
    <div className="p-8 max-w-5xl w-full mx-auto">
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
      </div>
      {/* Rate These Sports Entities */}
      <div className="border border-gray-300 mt-8 rounded-lg bg-white">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-2xl font-bold">Rate These Sports Entities</h2>
          <p>Help us learn your preferences! Rate from 1 (strongly dislike) to 5 (strongly like)</p>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center py-4">
          <div className="w-full px-4">
            <RatingTable />
          </div>
          <Button className="mt-4">Get New Entitites to Rate</Button>
        </div>
      </div>
    </div>
  );
}

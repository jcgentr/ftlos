import { useParams } from "react-router";
import { Button } from "./ui/button";
import { useState } from "react";

export function Sweepstake() {
  const { sweepstakeId } = useParams();
  const [baseballSelection, setBaseballSelection] = useState("new-york-yankees");
  const [basketballSelection, setBasketballSelection] = useState("la-lakers");
  const [footballSelection, setFootballSelection] = useState("green-bay-packers");
  const [finalSelection, setFinalSelection] = useState("dallas-cowboys");

  console.log({ sweepstakeId });

  return (
    <div className="p-8 max-w-5xl w-full mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-4">All Sports Sweepstake</h1>
        <div className="border border-gray-300 bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Contest Details</h2>
          <div>
            <p>
              <span className="font-bold">Start Date:</span> April 23, 2025
            </p>
            <p>
              <span className="font-bold">End Date:</span> April 30, 2025
            </p>
            <p>
              <span className="font-bold">Prize Pool:</span> <span className="text-success">$10,000.00</span>
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mt-8">Regular Games</h2>
          <div className="bg-primary-foreground border border-primary rounded-lg p-6 my-4">
            <p className="text-primary">Pick winners for up to 10 regular games plus the mandatory final game.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="border border-gray-300 bg-white rounded-lg p-8">
            <div className="flex justify-between items-center flex-wrap gap-1">
              <h2 className="text-xl font-bold">Baseball</h2>
              <span className="text-gray-500">April 24, 2025, 5:20 PM</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full my-4">
              <Button
                variant={baseballSelection === "new-york-yankees" ? "default" : "outline"}
                className={`flex-1 text-lg ${baseballSelection === "new-york-yankees" ? "shadow-md" : ""}`}
                onClick={() => setBaseballSelection("new-york-yankees")}
              >
                New York Yankees
              </Button>
              <Button
                variant={baseballSelection === "boston-red-sox" ? "default" : "outline"}
                className={`flex-1 text-lg ${baseballSelection === "boston-red-sox" ? "shadow-md" : ""}`}
                onClick={() => setBaseballSelection("boston-red-sox")}
              >
                Boston Red Sox
              </Button>
            </div>
            <Button className="w-full bg-success hover:bg-success-lighter text-lg" size="lg">
              Submit Pick
            </Button>
          </div>
          <div className="border border-gray-300 bg-white rounded-lg p-8">
            <div className="flex justify-between items-center flex-wrap gap-1">
              <h2 className="text-lg font-bold">Basketball</h2>
              <span className="text-gray-500">April 25, 2025, 5:20 PM</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full my-4">
              <Button
                variant={basketballSelection === "la-lakers" ? "default" : "outline"}
                className={`flex-1 text-lg ${basketballSelection === "la-lakers" ? "shadow-md" : ""}`}
                onClick={() => setBasketballSelection("la-lakers")}
              >
                LA Lakers
              </Button>
              <Button
                variant={basketballSelection === "chicago-bulls" ? "default" : "outline"}
                className={`flex-1 text-lg ${basketballSelection === "chicago-bulls" ? "shadow-md" : ""}`}
                onClick={() => setBasketballSelection("chicago-bulls")}
              >
                Chicago Bulls
              </Button>
            </div>
            <Button className="w-full bg-success hover:bg-success-lighter text-lg" size="lg">
              Submit Pick
            </Button>
          </div>
          <div className="border border-gray-300 bg-white rounded-lg p-8">
            <div className="flex justify-between items-center flex-wrap gap-1">
              <h2 className="text-xl font-bold">Football</h2>
              <span className="text-gray-500">April 26, 2025, 5:20 PM</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full my-4">
              <Button
                variant={footballSelection === "green-bay-packers" ? "default" : "outline"}
                className={`flex-1 text-lg ${footballSelection === "green-bay-packers" ? "shadow-md" : ""}`}
                onClick={() => setFootballSelection("green-bay-packers")}
              >
                Green Bay Packers
              </Button>
              <Button
                variant={footballSelection === "new-england-patriots" ? "default" : "outline"}
                className={`flex-1 text-lg ${footballSelection === "new-england-patriots" ? "shadow-md" : ""}`}
                onClick={() => setFootballSelection("new-england-patriots")}
              >
                New England Patriots
              </Button>
            </div>
            <Button className="w-full bg-success hover:bg-success-lighter text-lg" size="lg">
              Submit Pick
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mt-8 mb-4">Final Game (Mandatory)</h2>
          <div className="border border-gray-300 bg-white rounded-lg p-8">
            <div className="flex justify-between items-center flex-wrap gap-1">
              <h2 className="text-xl font-bold">Football</h2>
              <span className="text-gray-500">May 1, 2025, 7:30 PM</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full my-4">
              <Button
                variant={finalSelection === "dallas-cowboys" ? "default" : "outline"}
                className={`flex-1 text-lg ${finalSelection === "dallas-cowboys" ? "shadow-md" : ""}`}
                onClick={() => setFinalSelection("dallas-cowboys")}
              >
                Dallas Cowboys
              </Button>
              <Button
                variant={finalSelection === "san-francisco-49ers" ? "default" : "outline"}
                className={`flex-1 text-lg ${finalSelection === "san-francisco-49ers" ? "shadow-md" : ""}`}
                onClick={() => setFinalSelection("san-francisco-49ers")}
              >
                San Francisco 49ers
              </Button>
            </div>
            <Button className="w-full bg-success hover:bg-success-lighter text-lg" size="lg">
              Submit Final Pick
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

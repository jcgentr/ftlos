import { useParams } from "react-router";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function Sweepstake() {
  const { sweepstakeId } = useParams();

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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Baseball</h2>
              <span className="text-gray-500">April 24, 2025, 5:20 PM</span>
            </div>
            <Tabs defaultValue="new-york-yankees" className="w-full my-4">
              <TabsList className="w-full h-12">
                <TabsTrigger
                  value="new-york-yankees"
                  className="text-lg data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white transition-colors cursor-pointer"
                >
                  New York Yankees
                </TabsTrigger>
                <TabsTrigger
                  value="boston-red-sox"
                  className="text-lg data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white transition-colors cursor-pointer"
                >
                  Boston Red Sox
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button className="w-full bg-success hover:bg-success-lighter text-lg" size="lg">
              Submit Pick
            </Button>
          </div>
          <div className="border border-gray-300 bg-white rounded-lg p-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Basketball</h2>
              <span className="text-gray-500">April 25, 2025, 5:20 PM</span>
            </div>
            <Tabs defaultValue="la-lakers" className="w-full my-4">
              <TabsList className="w-full h-12">
                <TabsTrigger
                  value="la-lakers"
                  className="text-lg data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white transition-colors cursor-pointer"
                >
                  LA Lakers
                </TabsTrigger>
                <TabsTrigger
                  value="chicago-bulls"
                  className="text-lg data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white transition-colors cursor-pointer"
                >
                  Chicago Bulls
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button className="w-full bg-success hover:bg-success-lighter text-lg" size="lg">
              Submit Pick
            </Button>
          </div>
          <div className="border border-gray-300 bg-white rounded-lg p-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Football</h2>
              <span className="text-gray-500">April 26, 2025, 5:20 PM</span>
            </div>
            <Tabs defaultValue="green-bay-packers" className="w-full my-4">
              <TabsList className="w-full h-12">
                <TabsTrigger
                  value="green-bay-packers"
                  className="text-lg data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white transition-colors cursor-pointer"
                >
                  Green Bay Packers
                </TabsTrigger>
                <TabsTrigger
                  value="new-england-patriots"
                  className="text-lg data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white transition-colors cursor-pointer"
                >
                  New England Patriots
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button className="w-full bg-success hover:bg-success-lighter text-lg" size="lg">
              Submit Pick
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mt-8 mb-4">Final Game (Mandatory)</h2>
          <div className="border border-gray-300 bg-white rounded-lg p-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Football</h2>
              <span className="text-gray-500">May 1, 2025, 7:30 PM</span>
            </div>
            <Tabs defaultValue="dallas-cowboys" className="w-full my-4">
              <TabsList className="w-full h-12">
                <TabsTrigger
                  value="dallas-cowboys"
                  className="text-lg data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white transition-colors cursor-pointer"
                >
                  Dallas Cowboys
                </TabsTrigger>
                <TabsTrigger
                  value="san-francisco-49ers"
                  className="text-lg data-[state=active]:bg-primary data-[state=active]:shadow-md data-[state=active]:text-white transition-colors cursor-pointer"
                >
                  San Francisco 49ers
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button className="w-full bg-success hover:bg-success-lighter text-lg" size="lg">
              Submit Final Pick
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

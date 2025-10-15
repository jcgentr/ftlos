import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CreateSweepstake } from "./CreateSweepstake";
import { ManageResults } from "./ManageSweepstakeResults";

interface User {
  id: string;
  email: string;
  supabaseId: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  birthDate?: string;
  favoriteSports?: string;
  profileImageUrl?: string;
  isConnecting: boolean;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function SweepstakesAdmin() {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("create");

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id || !session?.access_token) return;

      try {
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        const userData = (await userRes.json()) as User;

        if (!userData.isAdmin) {
          toast.error("You don't have admin access");
          navigate("/sweepstakes");
        }

        setIsAdmin(userData.isAdmin === true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast.error("Failed to verify admin status");
        navigate("/sweepstakes");
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <div className="p-4 sm:p-8 max-w-2xl w-full mx-auto">Loading...</div>;
  }

  if (!isAdmin) {
    return <div className="p-4 sm:p-8 max-w-2xl w-full mx-auto">Unauthorized access</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sweepstakes Admin</h1>

      <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border border-gray-300 w-full">
          <TabsTrigger className="cursor-pointer" value="create">
            Create Sweepstake
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="results">
            Manage Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <CreateSweepstake />
        </TabsContent>

        <TabsContent value="results">
          <ManageResults />
        </TabsContent>
      </Tabs>
    </div>
  );
}

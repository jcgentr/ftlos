import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function ChangePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formError) {
      setFormError(null);
    }

    if (confirmPassword && password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError(null);
    }
  }, [password, confirmPassword]);

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) return;
    setFormError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Password updated successfully");
      navigate("/");
    } catch (error: unknown) {
      const supabaseError = error as { message: string };
      console.error("Error updating password:", error);
      setFormError(supabaseError.message || "Failed to update password");
      toast.error(supabaseError.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl w-full mx-auto">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Set up a New Password</CardTitle>
            <CardDescription>Your password must be different from your previous one.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmission}>
              <div className="flex flex-col gap-6">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    {formError}
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Enter your password again"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                <Button type="submit" className="w-full" disabled={Boolean(error) || loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

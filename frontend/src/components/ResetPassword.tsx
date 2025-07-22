import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export function ResetPassword() {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formError) {
      setFormError(null);
    }
  }, [email]);

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/change-password`,
      });

      if (error) {
        throw error;
      }

      toast.success("Reset instructions sent to your email");
    } catch (error: unknown) {
      const supabaseError = error as { message: string };
      console.error("Error during password reset:", error);
      setFormError(supabaseError.message || "Failed to send reset instructions");
      toast.error(supabaseError.message || "Failed to send reset instructions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl w-full mx-auto">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Include the email address associated with your account and we'll send you an email with instructions to
              reset your password.
            </CardDescription>
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Instructions"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Remember your password?{" "}
                <Link to="/login">
                  <span className="underline underline-offset-4 hover:text-primary">Login</span>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Post, User } from "@/lib/types";

interface PostComposerProps {
  onPostCreated?: (newPost: Post) => void;
  user: User | null;
}

const MAX_CHARS = 280;

export function PostComposer({ onPostCreated, user }: PostComposerProps) {
  const { session } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const remainingChars = MAX_CHARS - content.length;

  const handleSubmit = async () => {
    if (!session?.access_token) return;

    if (!content.trim()) {
      toast.error("Post cannot be empty");
      return;
    }

    if (content.length > MAX_CHARS) {
      toast.error(`Post exceeds maximum length of ${MAX_CHARS} characters`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create post: ${response.status}`);
      }

      const newPost = await response.json();

      toast.success("Post created successfully!");
      setContent("");
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = () => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-background">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.profileImageUrl ?? undefined} alt={user?.firstName || "User"} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 flex flex-col">
          <Textarea
            placeholder="What's happening?"
            className="min-h-[80px] border-none resize-none p-0 focus-visible:ring-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_CHARS}
          />

          <div className="flex justify-between items-center mt-2">
            <span
              className={`text-sm ${
                remainingChars <= 0 ? "text-red-500" : remainingChars < 20 ? "text-yellow-500" : "text-muted-foreground"
              }`}
            >
              {remainingChars} {`character${remainingChars !== 1 ? "s" : ""}`} remaining
            </span>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim() || content.length > MAX_CHARS}
              className="rounded-full px-4"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

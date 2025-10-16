import { forwardRef, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UserPartial } from "@/lib/types";

interface Post {
  id: string;
  content: string;
  userId: string;
  user: UserPartial;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLikedByCurrentUser: boolean;
}

interface PostItemProps {
  post: Post;
}

export const PostItem = forwardRef<HTMLDivElement, PostItemProps>(({ post }, ref) => {
  const { user: currentUser, session } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  const isCurrentUser = currentUser?.id === post.user.supabaseId;
  const profilePath = isCurrentUser ? "/profile" : `/profile/${post.user.supabaseId}`;

  const getInitials = (user: UserPartial) => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleLike = async () => {
    if (!session?.access_token) return;

    setIsLiking(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post.id}/like`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isLiked ? "unlike" : "like"} post`);
      }

      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error(`Error ${isLiked ? "unliking" : "liking"} post:`, error);
      toast.error(`Failed to ${isLiked ? "unlike" : "like"} the post. Please try again.`);
    } finally {
      setIsLiking(false);
    }
  };

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <div ref={ref} className="py-4 px-2 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
      <div className="flex gap-3">
        <Link to={profilePath}>
          <Avatar className="h-10 w-10 shrink-0 cursor-pointer">
            <AvatarImage src={post.user.profileImageUrl ?? undefined} alt={post.user.firstName || "User"} />
            <AvatarFallback>{getInitials(post.user)}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <Link to={profilePath} className="hover:underline">
              <span className="font-semibold text-sm">
                {post.user.firstName} {post.user.lastName}
              </span>
            </Link>
            <span className="text-gray-500 dark:text-gray-400 text-sm">· {formattedDate}</span>
          </div>

          <p className="mt-1 whitespace-pre-wrap break-words">{post.content}</p>

          <div className="flex justify-between mt-3 max-w-md">
            <button
              className={cn(
                "flex items-center gap-1 transition-colors",
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              )}
              onClick={handleLike}
              disabled={isLiking}
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-xs">{likeCount > 0 ? likeCount : ""}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

PostItem.displayName = "PostItem";

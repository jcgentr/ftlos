import { useCallback, useEffect, useRef, useState } from "react";
import { PostComposer } from "./PostComposer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Post, User } from "@/lib/types";
import { PostItem } from "./PostItem";

export function Feed() {
  const { user, session } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;

      const options = {
        rootMargin: "0px",
        scrollMargin: "0px",
        threshold: 1.0,
      };

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMorePosts && nextCursor) {
          console.log("loading more posts...");
          setPage((prev) => prev + 1);
        }
      }, options);

      if (node) observer.current.observe(node);
    },
    [loading, hasMorePosts, nextCursor]
  );

  const fetchPosts = async (cursorParam?: string, isRefresh = false) => {
    if (!session?.access_token) return;

    if (!isRefresh) {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams();
      if (cursorParam) {
        params.append("cursor", cursorParam);
      }
      params.append("pageSize", "10");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load posts: ${response.status}`);
      }

      const data = await response.json();

      if (!cursorParam) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => {
          // Create a map of existing post IDs for faster lookup
          const existingPostIds = new Map(prev.map((post) => [post.id, true]));
          // Filter out any posts that already exist
          const uniqueNewPosts = data.posts.filter((post: Post) => !existingPostIds.has(post.id));

          return [...prev, ...uniqueNewPosts];
        });
      }

      // Store pagination info
      setHasMorePosts(data.pagination.hasNextPage);
      setNextCursor(data.pagination.nextCursor);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load feed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      if (!user?.id || !session?.access_token) return;

      setLoading(true);
      try {
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        const userData = (await userRes.json()) as User;
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast.error("Failed to verify admin status");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (page === 1) {
      // Initial load - no cursor
      fetchPosts();
    } else if (nextCursor) {
      // Load more with cursor
      fetchPosts(nextCursor);
    }
  }, [page]);

  const handleNewPost = (newPost: Post) => {
    setPosts((prev) => {
      // Check if it already exists (unlikely for a new post, but good practice)
      if (prev.some((p) => p.id === newPost.id)) {
        return prev;
      }
      return [newPost, ...prev];
    });
  };

  return (
    <div className="container max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-4xl font-bold mb-4">Feed</h1>

      <PostComposer onPostCreated={handleNewPost} user={currentUser} />

      <div className="space-y-4">
        {loading && page === 1 ? (
          <div className="text-center py-10">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">No posts yet. Be the first to post something!</div>
        ) : (
          <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg p-4 mb-4 bg-background">
            {posts.map((post, index) => (
              <PostItem ref={posts.length === index + 1 ? lastPostRef : null} key={post.id} post={post} />
            ))}
            {loading && <div className="text-center py-4">Loading more posts...</div>}
            {!hasMorePosts && posts.length > 0 && (
              <div className="text-center py-4 text-muted-foreground">No more posts to load</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

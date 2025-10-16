import { Response } from "express";
import { FriendshipStatus, PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const DEFAULT_PAGE_SIZE = 10;

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content } = req.body;
    const currentUserSupabaseId = req.user?.sub;

    if (!content) {
      res.status(400).json({ error: "Content is required" });
      return;
    }

    // Check if content exceeds maximum length (e.g., 280 characters like X)
    if (content.length > 280) {
      res.status(400).json({ error: "Content exceeds maximum length of 280 characters" });
      return;
    }

    const currentUser = await prisma.user.findUnique({
      where: { supabaseId: currentUserSupabaseId },
      select: { id: true },
    });

    if (!currentUser) {
      res.status(401).json({ error: "Current user not found" });
      return;
    }

    const post = await prisma.post.create({
      data: {
        content,
        userId: currentUser.id,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            supabaseId: true,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    const formattedPost = {
      id: post.id,
      content: post.content,
      userId: post.userId,
      user: post.user,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likeCount: post._count.likes,
      isLikedByCurrentUser: false,
    };

    res.status(201).json(formattedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const getFeed = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUserSupabaseId = req.user?.sub;
    const pageSize = parseInt(req.query.pageSize as string) || DEFAULT_PAGE_SIZE;
    const cursor = req.query.cursor as string | undefined;

    const currentUser = await prisma.user.findUnique({
      where: { supabaseId: currentUserSupabaseId },
      select: { id: true },
    });

    if (!currentUser) {
      res.status(401).json({ error: "Current user not found" });
      return;
    }

    // Get all friend IDs (users the current user has accepted friendship with)
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: currentUser.id, status: FriendshipStatus.ACCEPTED },
          { addresseeId: currentUser.id, status: FriendshipStatus.ACCEPTED },
        ],
      },
      select: {
        requesterId: true,
        addresseeId: true,
      },
    });

    // Extract friend IDs
    const friendIds = friendships.map((friendship) =>
      friendship.requesterId === currentUser.id ? friendship.addresseeId : friendship.requesterId
    );

    // Include current user's ID to get their posts as well
    const relevantUserIds = [currentUser.id, ...friendIds];

    // Fetch posts from current user and friends, ordered by recency
    const posts = await prisma.post.findMany({
      where: {
        userId: {
          in: relevantUserIds,
        },
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            supabaseId: true,
          },
        },
        _count: {
          select: { likes: true },
        },
        likes: {
          where: {
            userId: currentUser.id,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1, // Take one extra to determine if there are more
    });

    // Check if there are more posts
    const hasNextPage = posts.length > pageSize;
    // Remove the extra post we used to check for more
    const paginatedPosts = hasNextPage ? posts.slice(0, pageSize) : posts;

    const formattedPosts = paginatedPosts.map((post) => ({
      id: post.id,
      content: post.content,
      userId: post.userId,
      user: post.user,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likeCount: post._count.likes,
      isLikedByCurrentUser: post.likes.length > 0,
    }));

    const nextCursor = hasNextPage ? paginatedPosts[paginatedPosts.length - 1].createdAt.toISOString() : null;

    res.status(200).json({
      posts: formattedPosts,
      pagination: {
        hasNextPage,
        nextCursor,
      },
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ error: "Failed to fetch feed" });
  }
};

export const getUserPosts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUserSupabaseId = req.user?.sub;
    const { userId } = req.params;
    const pageSize = parseInt(req.query.pageSize as string) || DEFAULT_PAGE_SIZE;
    const cursor = req.query.cursor as string | undefined;

    const currentUser = await prisma.user.findUnique({
      where: { supabaseId: currentUserSupabaseId },
      select: { id: true },
    });

    if (!currentUser) {
      res.status(401).json({ error: "Current user not found" });
      return;
    }

    // Verify the target user exists
    const targetUser = await prisma.user.findUnique({
      where: { supabaseId: userId },
      select: { id: true },
    });

    if (!targetUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Fetch posts for the specified user
    const posts = await prisma.post.findMany({
      where: {
        userId: targetUser.id,
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            supabaseId: true,
          },
        },
        _count: {
          select: { likes: true },
        },
        likes: {
          where: {
            userId: currentUser.id,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
    });

    // Check if there are more posts
    const hasNextPage = posts.length > pageSize;
    // Remove the extra post we used to check for more
    const paginatedPosts = hasNextPage ? posts.slice(0, pageSize) : posts;

    const formattedPosts = paginatedPosts.map((post) => ({
      id: post.id,
      content: post.content,
      userId: post.userId,
      user: post.user,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likeCount: post._count.likes,
      isLikedByCurrentUser: post.likes.length > 0,
    }));

    const nextCursor = hasNextPage ? paginatedPosts[paginatedPosts.length - 1].createdAt.toISOString() : null;

    res.status(200).json({
      posts: formattedPosts,
      pagination: {
        hasNextPage,
        nextCursor,
      },
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
};

export const likePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUserSupabaseId = req.user?.sub;
    const { postId } = req.params;

    const currentUser = await prisma.user.findUnique({
      where: { supabaseId: currentUserSupabaseId },
      select: { id: true },
    });

    if (!currentUser) {
      res.status(401).json({ error: "Current user not found" });
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // Check if user already liked the post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: currentUser.id,
        },
      },
    });

    if (existingLike) {
      res.status(409).json({ error: "Post already liked" });
      return;
    }

    await prisma.postLike.create({
      data: {
        postId,
        userId: currentUser.id,
      },
    });

    // Get updated like count
    const likeCount = await prisma.postLike.count({
      where: { postId },
    });

    res.status(201).json({ success: true, likeCount });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
};

export const unlikePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUserSupabaseId = req.user?.sub;
    const { postId } = req.params;

    const currentUser = await prisma.user.findUnique({
      where: { supabaseId: currentUserSupabaseId },
      select: { id: true },
    });

    if (!currentUser) {
      res.status(401).json({ error: "Current user not found" });
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // Check if like exists
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: currentUser.id,
        },
      },
    });

    if (!existingLike) {
      res.status(404).json({ error: "Like not found" });
      return;
    }

    await prisma.postLike.delete({
      where: {
        postId_userId: {
          postId,
          userId: currentUser.id,
        },
      },
    });

    // Get updated like count
    const likeCount = await prisma.postLike.count({
      where: { postId },
    });

    res.status(200).json({ success: true, likeCount });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ error: "Failed to unlike post" });
  }
};

export const deletePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUserSupabaseId = req.user?.sub;
    const { postId } = req.params;

    const currentUser = await prisma.user.findUnique({
      where: { supabaseId: currentUserSupabaseId },
      select: { id: true, isAdmin: true },
    });

    if (!currentUser) {
      res.status(401).json({ error: "Current user not found" });
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // Check if user is authorized to delete the post (must be post owner or admin)
    if (post.userId !== currentUser.id && !currentUser.isAdmin) {
      res.status(403).json({ error: "Not authorized to delete this post" });
      return;
    }

    // Delete the post (this will also delete all associated likes due to cascade)
    await prisma.post.delete({
      where: { id: postId },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

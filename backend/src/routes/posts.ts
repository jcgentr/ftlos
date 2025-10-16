import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createPost, likePost, unlikePost, deletePost, getFeed, getUserPosts } from "../controllers/posts";

const router = Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getFeed);
router.get("/user/:userId", authMiddleware, getUserPosts);
router.post("/:postId/like", authMiddleware, likePost);
router.delete("/:postId/like", authMiddleware, unlikePost);
router.delete("/:postId", authMiddleware, deletePost);

export default router;

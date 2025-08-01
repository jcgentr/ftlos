import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests,
  getFriends,
  getUserFriends,
  removeFriend,
  getOutgoingRequests,
  cancelFriendRequest,
} from "../controllers/friends";

const router = Router();

router.post("/request", authMiddleware, sendFriendRequest);
router.patch("/accept/:friendshipId", authMiddleware, acceptFriendRequest);
router.patch("/reject/:friendshipId", authMiddleware, rejectFriendRequest);
router.get("/pending", authMiddleware, getPendingRequests);
router.get("/outgoing", authMiddleware, getOutgoingRequests);
router.get("/", authMiddleware, getFriends);
router.get("/:userId", authMiddleware, getUserFriends);
router.delete("/:friendId", authMiddleware, removeFriend);
router.delete("/cancel/:userId", authMiddleware, cancelFriendRequest);

export default router;

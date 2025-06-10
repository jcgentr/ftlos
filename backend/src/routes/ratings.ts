import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { saveUserRatings, getCurrentUserRatings, getUserRatings } from "../controllers/ratings";

const router = Router();

router.post("/", authMiddleware, saveUserRatings);
router.get("/", authMiddleware, getCurrentUserRatings);
router.get("/:userId", authMiddleware, getUserRatings);

export default router;

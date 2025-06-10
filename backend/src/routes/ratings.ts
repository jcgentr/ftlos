import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { saveUserRatings, getUserRatings } from "../controllers/ratings";

const router = Router();

router.post("/", authMiddleware, saveUserRatings);
router.get("/", authMiddleware, getUserRatings);

export default router;

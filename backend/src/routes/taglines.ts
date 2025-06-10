import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { saveUserTagline, getCurrentUserTagline, getUserTagline } from "../controllers/taglines";

const router = Router();

router.post("/", authMiddleware, saveUserTagline);
router.get("/", authMiddleware, getCurrentUserTagline);
router.get("/:userId", authMiddleware, getUserTagline);

export default router;

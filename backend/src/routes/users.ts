import { authMiddleware } from "../middleware/auth";
import { createUser, getUser, updateUser } from "../controllers/users";
import { Router } from "express";

const router = Router();

router.post("/", authMiddleware, createUser);
router.get("/:id", authMiddleware, getUser);
router.patch("/:id", authMiddleware, updateUser);

export default router;

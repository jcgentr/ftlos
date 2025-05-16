import { authMiddleware } from "../middleware/auth";
import { createUser } from "../controllers/users";
import { Router } from "express";

const router = Router();

router.post("/", authMiddleware, createUser);

export default router;

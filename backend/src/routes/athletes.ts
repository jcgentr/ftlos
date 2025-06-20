import express from "express";
import { authMiddleware } from "../middleware/auth";
import { getAthletes } from "../controllers/athletes";

const router = express.Router();

router.get("/", authMiddleware, getAthletes);

export default router;

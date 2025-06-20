import express from "express";
import { authMiddleware } from "../middleware/auth";
import { getTeams } from "../controllers/teams";

const router = express.Router();

router.get("/", authMiddleware, getTeams);

export default router;

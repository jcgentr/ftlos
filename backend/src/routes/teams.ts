import express from "express";
import { authMiddleware } from "../middleware/auth";
import { getSomeTeams } from "../controllers/teams";

const router = express.Router();

router.get("/", authMiddleware, getSomeTeams);

export default router;

import express from "express";
import { authMiddleware } from "../middleware/auth";
import { getSomeAthletes } from "../controllers/athletes";

const router = express.Router();

router.get("/", authMiddleware, getSomeAthletes);

export default router;

import express from "express";
import { getAllSports } from "../controllers/sports";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, getAllSports);

export default router;

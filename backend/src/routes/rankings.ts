import express from "express";
import { getBottomAthletes, getBottomTeams, getTopAthletes, getTopTeams } from "../controllers/rankings";

const router = express.Router();

router.get("/teams/top", getTopTeams);
router.get("/teams/bottom", getBottomTeams);
router.get("/athletes/top", getTopAthletes);
router.get("/athletes/bottom", getBottomAthletes);

export default router;

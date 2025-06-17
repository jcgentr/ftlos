import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createSweepstake,
  getAllSweepstakes,
  getSweepstakeById,
  submitSweepstakePicks,
} from "../controllers/sweepstakes";

const router = Router();

router.get("/", authMiddleware, getAllSweepstakes);
router.get("/:id", authMiddleware, getSweepstakeById);
router.post("/", authMiddleware, createSweepstake);
router.post("/:id/picks", authMiddleware, submitSweepstakePicks);

export default router;

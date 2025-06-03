import express from "express";
import { getAllSports } from "../controllers/sports";

const router = express.Router();

router.get("/", getAllSports);

export default router;

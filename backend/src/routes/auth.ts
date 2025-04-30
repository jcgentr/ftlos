import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
  res.send("logged in");
});

export default router;

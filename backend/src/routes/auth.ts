import { Response, Router } from "express";
// import { User, ApiResponse } from "@ftlos/shared/src/types";
import { AuthenticatedRequest, authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/user", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;

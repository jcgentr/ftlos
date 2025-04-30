import { Router } from "express";
import { User, ApiResponse } from "@ftlos/shared/src/types";

const router = Router();

router.get("/login", (req, res) => {
  const mockUser: User = {
    id: "1",
    email: "test@example.com",
    name: "Test User",
    createdAt: new Date(),
  };

  const response: ApiResponse<User> = {
    data: mockUser,
    error: null,
  };

  res.json(response);
});

export default router;

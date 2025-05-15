import { JWT_SECRET } from "../config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type SupabaseUser = {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  email: string;
  phone: string;
  // app_metadata: Record<string, any>;
  // user_metadata: Record<string, any>;
  role: string;
  aal: string;
  // amr: Array<Record<string, any>>;
  session_id: string;
  is_anonymous: boolean;
};

export interface AuthenticatedRequest extends Request {
  user?: SupabaseUser;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!JWT_SECRET) {
    res.status(500).json({ success: false, message: "JWT_SECRET is undefined" });
    return;
  }

  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authorization token is missing or malformed",
      });
      return;
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the token locally using the JWT secret
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add user info to the request
    req.user = decoded as unknown as SupabaseUser;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Token expired",
      });
      return;
    }

    console.error("Error validating token:", error);
    res.status(500).json({
      success: false,
      message: "Server error during token validation",
    });
  }
};

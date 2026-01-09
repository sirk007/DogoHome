import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    userType: string;
  };
}

// Read JWT secret from .env
const USER_JWT_SECRET = process.env.USER_JWT_SECRET || "defaultSecret";

export const validateUserToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) {
    return res.status(401).json({ error: "User not logged in!" });
  }

  try {
    const validToken = verify(accessToken, USER_JWT_SECRET) as {
      id: number;
      username: string;
      userType: string;
    };

    req.user = validToken;
    next();
  } catch (err: any) {
    return res.status(403).json({ error: err.message });
  }
};
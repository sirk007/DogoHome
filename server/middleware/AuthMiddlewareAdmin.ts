import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

// Extend Express Request type to include admin
export interface AdminAuthRequest extends Request {
  admin?: {
    id: number;
    username: string;
    userType: string;
  };
}

// Read Admin JWT secret from .env
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "defaultAdminSecret";

export const validateAdminToken = (
  req: AdminAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.header("adminAccessToken");
  if (!accessToken) {
    return res.status(401).json({ error: "Admin not logged in!" });
  }

  try {
    const validToken = verify(accessToken, ADMIN_JWT_SECRET) as {
      id: number;
      username: string;
      userType: string;
    };

    req.admin = validToken;
    next();
  } catch (err: any) {
    return res.status(403).json({ error: err.message });
  }
};

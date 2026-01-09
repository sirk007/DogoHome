import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

// Extend Express Request type to include shelter
export interface ShelterAuthRequest extends Request {
  shelter?: {
    id: number;
    username: string;
    userType: string;
  };
}

// Read Shelter JWT secret from .env
const SHELTER_JWT_SECRET = process.env.SHELTER_JWT_SECRET || "defaultShelterSecret";

export const validateShelterToken = (
  req: ShelterAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.header("accessShelterToken");
  if (!accessToken) {
    return res.status(401).json({ error: "Shelter not logged in!" });
  }

  try {
    const validToken = verify(accessToken, SHELTER_JWT_SECRET) as {
      id: number;
      username: string;
      userType: string;
    };

    req.shelter = validToken;
    next();
  } catch (err: any) {
    return res.status(403).json({ error: err.message });
  }
};
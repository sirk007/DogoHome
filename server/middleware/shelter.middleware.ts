import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

// ---------------------------
// EXTEND EXPRESS REQUEST TYPE
// ---------------------------
// Add `shelter` property to Request type for authenticated shelter info
export interface ShelterAuthRequest extends Request {
  shelter?: {
    id: number; // Shelter ID from JWT
    email: string;
    userType: string; // Shelter type/role (e.g., "Admin", "ShelterUser")
  };
}

// ---------------------------
// JWT SECRET
// ---------------------------
// Read Shelter JWT secret from environment variables
// Fallback to default string for development
const SHELTER_JWT_SECRET =
  process.env.SHELTER_JWT_SECRET || "defaultShelterSecret";

// ---------------------------
// VALIDATE SHELTER TOKEN MIDDLEWARE
// ---------------------------
// Description:
//   - Ensures that incoming requests contain a valid Shelter JWT in the "accessShelterToken" header
//   - Populates `req.shelter` with decoded JWT info if valid
//   - Returns 401 if no token is provided
//   - Returns 403 if token is invalid or expired
export const validateShelterToken = (
  req: ShelterAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // Get JWT from request headers
  const accessToken = req.header("accessShelterToken");

  // ---------------------------
  // CHECK TOKEN PRESENCE
  // --------------------------
  if (!accessToken) {
    return res.status(401).json({ error: "Shelter not logged in!" });
  }

  try {
    // Verify token using JWT secret
    // If valid, decode payload and attach to req.shelter
    const validToken = verify(accessToken, SHELTER_JWT_SECRET) as {
      id: number;
      email: string;
      userType: string;
    };

    // Attach shelter info to request for use in protected shelter routes
    req.shelter = validToken;

    // Proceed to next middleware or route handler
    next();
  } catch (err: any) {
    // Invalid or expired token
    return res.status(403).json({ error: err.message });
  }
};

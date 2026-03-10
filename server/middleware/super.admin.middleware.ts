import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

// ---------------------------
// EXTEND EXPRESS REQUEST TYPE
// ---------------------------
// Add `superAdmin` property to Request type for authenticated super admin info
export interface SuperAdminAuthRequest extends Request {
  superAdmin?: {
    id: number; // Super Admin ID from JWT
    username: string; // Super Admin username
    userType: string; // Super Admin type/role (e.g., "SuperAdmin")
  };
}

// ---------------------------
// JWT SECRET
// ---------------------------
// Read Super Admin JWT secret from environment variables
// Fallback to default string for development
const SUPER_ADMIN_JWT_SECRET =
  process.env.SUPER_ADMIN_JWT_SECRET || "defaultSuperAdminSecret";

// ---------------------------
// VALIDATE SUPER ADMIN TOKEN MIDDLEWARE
// ---------------------------
// Description:
//   - Ensures that incoming requests contain a valid Super Admin JWT in the "superAdminAccessToken" header
//   - Populates `req.superAdmin` with decoded JWT info if valid
//   - Returns 401 if no token is provided
//   - Returns 403 if token is invalid or expired
export const validateSuperAdminToken = (
  req: SuperAdminAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // Get JWT from request headers
  const accessToken = req.header("superAdminAccessToken");

  // ---------------------------
  // CHECK TOKEN PRESENCE
  // ---------------------------
  if (!accessToken) {
    return res.status(401).json({ error: "Super Admin not logged in!" });
  }

  try {
    // Verify token using JWT secret
    // If valid, decode payload and attach to req.superAdmin
    const validToken = verify(accessToken, SUPER_ADMIN_JWT_SECRET) as {
      id: number;
      username: string;
      userType: string;
    };

    // Attach super admin info to request for use in protected super admin routes
    req.superAdmin = validToken;

    // Proceed to next middleware or route handler
    next();
  } catch (err: any) {
    // Invalid or expired token
    return res.status(403).json({ error: err.message });
  }
};

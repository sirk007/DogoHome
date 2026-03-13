import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

// ---------------------------
// EXTEND EXPRESS REQUEST TYPE
// ---------------------------
// Add `admin` property to Request type for authenticated admin info
export interface AdminAuthRequest extends Request {
  admin?: {
    id: number; // Admin ID from JWT
    email: string; // Admin email
    userType: string; // Admin type/role (e.g., "Admin")
  };
}

// ---------------------------
// JWT SECRET
// ---------------------------
// Read Admin JWT secret from environment variables
// Fallback to default string for development
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "defaultAdminSecret";

// ---------------------------
// VALIDATE ADMIN TOKEN MIDDLEWARE
// ---------------------------
// Description:
//   - Ensures that incoming requests contain a valid Admin JWT in the "adminAccessToken" header
//   - Populates `req.admin` with decoded JWT info if valid
//   - Returns 401 if no token is provided
//   - Returns 403 if token is invalid or expired
export const validateAdminToken = (
  req: AdminAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // Get JWT from request headers
  const accessToken = req.header("adminAccessToken");

  // ---------------------------
  // CHECK TOKEN PRESENCE
  // ---------------------------
  if (!accessToken) {
    return res.status(401).json({ error: "Admin not logged in!" });
  }

  try {
    // Verify token using JWT secret
    // If valid, decode payload and attach to req.admin
    const validToken = verify(accessToken, ADMIN_JWT_SECRET) as {
      id: number;
      email: string;
      userType: string;
    };

    // Attach admin info to request for use in protected admin routes
    req.admin = validToken;

    // Proceed to next middleware or route handler
    next();
  } catch (err: any) {
    // Invalid or expired token
    return res.status(403).json({ error: err.message });
  }
};

import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

// ---------------------------
// EXTEND EXPRESS REQUEST TYPE
// ---------------------------
// Add `user` property to Request type for authenticated user info
export interface AuthRequest extends Request {
  user?: {
    id: number; // User ID from JWT
    username: string; // Username from JWT
    userType: string; // User type/role (e.g., "Admin", "User")
  };
}

// ---------------------------
// JWT SECRET
// ---------------------------
// Read secret from environment variables
// Fallback to default string for development
const USER_JWT_SECRET = process.env.USER_JWT_SECRET || "defaultSecret";

// ---------------------------
// VALIDATE USER TOKEN MIDDLEWARE
// ---------------------------
// Description:
//   - Ensures that incoming requests contain a valid JWT in the "accessToken" header
//   - Populates `req.user` with decoded JWT info if valid
//   - Returns 401 if no token provided
//   - Returns 403 if token is invalid or expired
export const validateUserToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Get JWT from request headers
  const accessToken = req.header("accessToken");

  // ---------------------------
  // CHECK TOKEN PRESENCE
  // ---------------------------
  if (!accessToken) {
    return res.status(401).json({ error: "User not logged in!" });
  }

  try {
    // Verify token using JWT secret
    // If valid, decode payload and attach to req.user
    const validToken = verify(accessToken, USER_JWT_SECRET) as {
      id: number;
      username: string;
      userType: string;
    };

    // Attach user info to request for use in routes
    req.user = validToken;

    // Proceed to next middleware or route handler
    next();
  } catch (err: any) {
    // Invalid or expired token
    return res.status(403).json({ error: err.message });
  }
};

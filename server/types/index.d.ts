// ----------------------------------------------
// Global Type Declarations
// ----------------------------------------------
//
// This file extends Express's built-in Request type
// so we can safely attach authenticated user data
// (user, shelter, admin) inside middleware.
//
// Without this file, TypeScript would throw errors
// when accessing req.user, req.shelter, or req.admin.
// ----------------------------------------------
import { UserAttributes } from "../../models/Users.model";

// ----------------------------------------------
// Express Request Augmentation
// ----------------------------------------------
//
// `declare global` allows us to merge our custom types
// into existing type definitions provided by Express.
//
// This does NOT create runtime code — it only informs
// TypeScript about additional properties on req.
// ----------------------------------------------
declare global {
  namespace Express {
    interface Request {
      /**
       * Populated when a standard User is authenticated.
       * Set by user-auth middleware after token validation.
       */
      user?: {
        id: number;
        email: string;
        userType: string;
      };
      /**
       * Populated when a Shelter account is authenticated.
       * Allows shelter-specific authorization in routes.
       */
      shelter?: {
        id: number;
        email: string;
        userType: string;
      };
      /**
       * Populated when an Admin account is authenticated.
       * Used for elevated privileges and protected admin routes.
       */
      admin?: {
        id: number;
        email: string;
        userType: string;
      };
      /**
       * Populated when a SuperAdmin account is authenticated.
       * Used for elevated privileges and protected super admin routes.
       */
      superAdmin?: {
        id: number;
        email: string;
        userType: string;
      };
    }
  }
}

// ----------------------------------------------
// Important Notes
// ----------------------------------------------
// - These properties are attached dynamically at runtime
//   by authentication middleware.
// - Making them optional (?) reflects real request flow:
//   not every request is authenticated.
// - Keeps route handlers clean and fully typed.
// ----------------------------------------------

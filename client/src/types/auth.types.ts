/**
 * ------------------------------------------
 * Auth Types
 * ------------------------------------------
 * Defines types related to authentication and user roles in the app.
 *
 * Includes:
 * - Minimal identity for AuthContext/hooks (AuthIdentity)
 * - User roles (UserRole)
 * - Full login responses from the backend (AuthLoginResponse)
 * - Authentication state structure (AuthState)
 *
 * These types help standardize auth handling across the frontend.
 */

import type { UserBase, UserLoginResponse } from "./user.types";
import type { ShelterBase, ShelterLoginResponse } from "./shelter.types";
import type { AdminBase, AdminLoginResponse } from "./admin.types";

/**
 * ------------------------------------------
 * AuthLoginResponse type
 * ------------------------------------------
 * Represents the full login response from the backend, including JWT.
 * Can be one of: User, Shelter, or Admin login responses.
 */

export type AuthIdentity = UserBase | ShelterBase | AdminBase;

// Full login response from backend (includes JWT)
export type AuthLoginResponse =
  | UserLoginResponse
  | ShelterLoginResponse
  | AdminLoginResponse;

/**
 * ------------------------------------------
 * UserRole type
 * ------------------------------------------
 * Defines all possible roles a user can have in the system.
 *
 * Roles:
 * - ""        -> represents a non-authenticated user or initial state
 * - "User"    -> a regular user (e.g., adopters)
 * - "Admin"   -> system administrator with elevated privileges
 * - "Shelter" -> shelter staff managing animals and shelters
 *
 */
export type UserRole = "" | "User" | "Admin" | "Shelter";

/**
 * ------------------------------------------
 * AuthState interface
 * ------------------------------------------
 * Represents authentication state in the app.
 *
 * Default values:
 * - username: ""  -> no user logged in
 * - id: 0        -> unauthenticated
 * - userType: "" -> guest / unauthenticated
 * - status: false -> not authenticated
 *
 * Optional token is only used in some hooks for convenience; production apps
 * should rely on sessionStorage/localStorage for security.
 */
export interface AuthState {
  username: string;
  id: number;
  userType: UserRole;
  status: boolean;
  token?: string;
}

/**
 * ------------------------------------------
 * Admin Types
 * ------------------------------------------
 * Defines all TypeScript types related to system administrators.
 *
 * Includes:
 * - Minimal identity for AuthContext/hooks (AdminBase)
 * - Full admin profile (AdminProfile)
 * - Placeholder for future admin registration attributes (AdminCreationAttributes)
 * - Login response from backend (AdminLoginResponse)
 *
 * Purpose:
 * Standardizes admin-related data structures for consistent
 * usage across the frontend (contexts, hooks, forms, etc.).
 */

/**
 * Minimal admin identity used in AuthContext or hooks.
 */
export interface AdminBase {
  id: number;
  username: string;
  email: string;
  userType: "Admin";
}

/**
 * Full Admin profile with extended fields
 */
export interface AdminProfile extends AdminBase {
  age?: number;
}

/**
 * Attributes required for admin registration.
 * Excludes 'id' and 'userType', which are set by the backend.
 */
export interface AdminCreationAttributes extends Omit<
  AdminProfile,
  "id" | "userType"
> {
  password: string;
}

/**
 * Response returned by the backend on successful login.
 * Includes a JWT token for authentication.
 */
export interface AdminLoginResponse extends AdminBase {
  token: string;
}

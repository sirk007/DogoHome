/**
 * ------------------------------------------
 * Super Admin Types
 * Defines all Typescript types related to the system's Super Admins.
 *
 * Includes:
 * - Minimal identity for AuthContext/hooks (SuperAdminBase)
 * - Full Super Admin profile (SuperAdminProfile)
 * - Placeholder for future Super Admin registration attributes (SuperAdminCreationAttributes)
 * - Login response from backend (SuperAdminLoginResponse)
 *
 * Purpose:
 * Standardizes Super Admin-related data structures for consistent
 * usage across the frontend (contexts, hooks, forms, etc.).
 *
 */

/**
 * Minimal Super Admin identity used in AuthContext or hooks.
 */
export interface SuperAdminBase {
  id: number;
  username: string;
  email: string;
  userType: "SuperAdmin";
}

/**
 * Full Super Admin profile with extended fields
 */
export interface SuperAdminProfile extends SuperAdminBase {
  age?: number;
}

/**
 * Attributes required for Super Admin registration.
 * Excludes 'id' and 'userType', which are set by the backend.
 */
export interface SuperAdminCreationAttributes extends Omit<
  SuperAdminProfile,
  "id" | "userType"
> {
  password: string;
}

/**
 * Response returned by the backend on successful login.
 * Includes a JWT token for authentication.
 */
export interface SuperAdminLoginResponse extends SuperAdminBase {
  token: string;
}

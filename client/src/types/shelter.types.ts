/**
 * ------------------------------------------
 * Shelter Types
 * ------------------------------------------
 * Defines all TypeScript types related to shelters in the system.
 *
 * Includes:
 * - Minimal identity for AuthContext/hooks (ShelterBase)
 * - Full shelter profile (ShelterProfile)
 * - Registration attributes (ShelterCreationAttributes)
 * - Login response from backend (ShelterLoginResponse)
 *
 * Purpose:
 * Standardizes shelter-related data structures for consistent
 * usage across the frontend (contexts, hooks, forms, etc.).
 */

/**
 * Minimal shelter identity used in AuthContext or hooks.
 */
export interface ShelterBase {
  id: number;
  username: string;
  email: string;
  userType: "Shelter";
}

/**
 * Full Shelter profile with extended fields
 */
export interface ShelterProfile extends ShelterBase {
  shelterName: string;
  countyId: number;
  address: string;
  phoneNumber: string;
}

/**
 * Attributes required for shelter registration.
 * Excludes 'id' and 'userType', which are set by the backend.
 */
export interface ShelterCreationAttributes extends Omit<
  ShelterProfile,
  "id" | "userType"
> {
  password: string;
}

/**
 * Response returned by the backend on successful login.
 * Includes a JWT token for authentication.
 */
export interface ShelterLoginResponse extends ShelterBase {
  token: string;
}

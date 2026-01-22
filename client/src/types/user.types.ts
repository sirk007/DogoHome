/**
 * ------------------------------------------
 * User Types
 * ------------------------------------------
 * Defines all TypeScript types related to users in the system.
 *
 * Includes:
 * - Minimal identity for AuthContext/hooks (UserBase)
 * - Full user profile (UserProfile)
 * - Registration attributes (UserCreationAttributes)
 * - Login response from backend (UserLoginResponse)
 *
 * Purpose:
 * Standardizes user-related data structures for consistent
 * usage across the frontend (contexts, hooks, forms, etc.).
 */

/**
 * Minimal user identity used in AuthContext or hooks.
 */
export interface UserBase {
  id: number;
  username: string;
  userType: "User";
}

/**
 * Full User profile with extended fields
 */
export interface UserProfile extends UserBase {
  email: string;
  age: number;
  activityLevel: "Low" | "Medium" | "High";
  hasGarden: boolean;
  hasOtherPets: boolean;
  hasKids: boolean;
  petExperienceLevel: "None" | "Beginner" | "Experience";
  maxDogSize: "Small" | "Medium" | "Large";
  preferredEnergyLevel?: "Low" | "Medium" | "High";
  preferredAgeRangeMin?: number;
  preferredAgeRangeMax?: number;
}

/**
 * Attributes required for user registration.
 * Excludes 'id' and 'userType', which are set by the backend.
 */
export interface UserCreationAttributes extends Omit<
  UserProfile,
  "id" | "userType"
> {
  password: string;
}

/**
 * Response returned by the backend on successful login.
 * Includes a JWT token for authentication.
 */
export interface UserLoginResponse extends UserBase {
  token: string;
}

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
 * Why it's needed:
 * - Strongly types the user role across the app
 * - Helps enforce role-based access control (RBAC)
 * - Works with ProtectedRoute to conditionally render pages
 */
export type UserRole = "" | "User" | "Admin" | "Shelter";


/**
 * ------------------------------------------
 * AuthState interface
 * ------------------------------------------
 * Represents the shape of the authentication state in the app.
 * This state is typically stored in React context or a global hook.
 * 
 * Properties:
 * - username: string
 *     The display name of the authenticated user. Empty string if not logged in.
 * 
 * - id: number
 *     Unique identifier for the user from the database. 0 indicates unauthenticated.
 * 
 * - userType: UserRole
 *     Role of the currently authenticated user. Helps determine access to routes/features.
 * 
 * - status: boolean
 *     Indicates whether the user is authenticated (true) or not (false).
 * 
 * - token?: string
 *     Optional JWT token (currently stored in some implementations for convenience).
 *     NOTE: In the safer version, tokens are stored in sessionStorage instead of state.
 * 
 * Why it's needed:
 * - Provides a typed structure for authentication state.
 * - Ensures consistency when updating or reading auth data across components.
 * - Works with hooks like useAuth and context like AuthContext to manage app-wide auth state.
 */
export interface AuthState {
  username: string;
  id: number;
  userType: UserRole;
  status: boolean;
  token?: string;
}
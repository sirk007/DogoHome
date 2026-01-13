import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import type { UserRole } from "../types/auth";
import type { ReactNode } from "react";

/**
 * --------------------------------------------
 * Props for ProtectedRoute
 * --------------------------------------------
 * - children: ReactNode -> The component(s) to render if access is allowed
 * - allowedRoles?: UserRole[] -> Optional list of roles that can access this route
 */
interface Props {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * --------------------------------------------
 * ProtectedRoute Component
 * --------------------------------------------
 * Wraps any route to provide role-based access control (RBAC).
 * It ensures only authenticated users with the proper role
 * can access certain pages.
 *
 * Responsibilities:
 * 1. Wait for auth status to finish loading before rendering
 * 2. Redirect unauthenticated users to landing page
 * 3. Redirect authenticated users who don't have required role
 * 4. Render children if user is authorized
 */
const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { authState, loading } = useAuthContext();

  // --------------------------------------------
  // 1. Auth is still resolving
  // --------------------------------------------
  // While the useAuth hook is checking tokens or verifying with backend,
  // we don't want to render the protected content yet
  if (loading) {
    return <div>Loading...</div>; // Could be replaced with a spinner for better UX
  }

  // --------------------------------------------
  // 2. Not authenticated
  // --------------------------------------------
  // If the user is not logged in, redirect them to the landing page
  if (!authState.status) {
    return <Navigate to="/" replace />;
  }

  // --------------------------------------------
  // 3. Authenticated but does not have the required role
  // --------------------------------------------
  // If allowedRoles is defined, check if the user's role matches.
  // If not, redirect to landing page (or another route if desired)
  if (allowedRoles && !allowedRoles.includes(authState.userType)) {
    return <Navigate to="/" replace />;
  }

  // --------------------------------------------
  // 4. Authorized
  // --------------------------------------------
  // User is authenticated and has a valid role (if role check is applied)
  // Render the protected component(s)
  return <>{children}</>;
};

export default ProtectedRoute;

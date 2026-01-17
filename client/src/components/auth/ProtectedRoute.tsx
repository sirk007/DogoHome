import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuthContext } from "../../context/AuthContext";
import type { UserRole } from "../../types/auth.types";

/**
 * --------------------------------------------
 * Props for ProtectedRoute
 * --------------------------------------------
 * - children: ReactNode
 *     The component(s) to render if access is granted
 *
 * - allowedRoles?: UserRole[]
 *     Optional list of roles allowed to access this route.
 *     If omitted, any authenticated user may access.
 */
interface Props {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * --------------------------------------------
 * ProtectedRoute Component
 * --------------------------------------------
 * Centralized route guard for the application.
 *
 * Responsibilities:
 * 1. Wait for auth state to resolve
 * 2. Redirect unauthenticated users
 * 3. Enforce role-based access control (RBAC)
 * 4. Render protected content when authorized
 *
 * This component relies on the unified AuthContext
 * as the single source of truth for authentication.
 */
const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  // --------------------------------------------
  // 1. Access unified authentication state
  // --------------------------------------------
  const { authState, loading } = useAuthContext();

  // --------------------------------------------
  // 2. Authentication is still being verified
  // --------------------------------------------
  // Prevents flashing protected content before auth resolves
  if (loading) {
    return <div>Loading...</div>;
  }

  // --------------------------------------------
  // 3. User is not authenticated
  // --------------------------------------------
  // Redirect to public landing or login page
  if (!authState.status) {
    return <Navigate to="/" replace />;
  }

  // --------------------------------------------
  // 4. Role-based authorization check
  // --------------------------------------------
  // If roles are specified, ensure the user has one of them
  if (allowedRoles && allowedRoles.length > 0) {
    switch (authState.userType) {
      case "Admin":
      case "User":
      case "Shelter":
        if (!allowedRoles.includes(authState.userType)) {
          return <Navigate to="/" replace />;
        }
        break;

      default:
        // Unknown or invalid role → deny access
        return <Navigate to="/" replace />;
    }
  }

  // --------------------------------------------
  // 5. Access granted
  // --------------------------------------------
  return <>{children}</>;
};

export default ProtectedRoute;

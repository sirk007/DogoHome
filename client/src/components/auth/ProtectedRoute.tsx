import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthContext } from "../../context/AuthContext";
import type { UserRole } from "../../types/auth.types";

/**
 * ============================================
 * COMPONENT CONTRACT
 * --------------------------------------------
 * ProtectedRoute acts as an authorization gate.
 *
 * - children: content to render if access granted
 * - allowedRoles: optional role restriction layer
 *
 * Serves as a boundary between routing and
 * authenticated application space.
 */
interface Props {
  children: ReactNode;
  allowedRoles?: UserRole[];
}
// ============================================

/**
 * ============================================
 * ProtectedRoute
 * --------------------------------------------
 * Route-level access control component.
 *
 * Decision Flow:
 * 1. Await authentication state resolution
 * 2. Verify authentication status
 * 3. Enforce role-based authorization (optional)
 * 4. Render children or redirect
 * ============================================
 */
const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  /**
   * ============================================
   * AUTH CONTEXT BOUNDARY
   * --------------------------------------------
   * Consumes global authentication state.
   *
   * - authState: contains status + role
   * - loading: indicates auth resolution phase
   */
  const { authState, loading } = useAuthContext();

  // ============================================

  /**
   * ============================================
   * DEBUG TRACE (Render Visibility)
   * --------------------------------------------
   * Logs render decisions for development.
   */
  console.log(
    "ProtectedRoute render → authState:",
    authState,
    "loading:",
    loading,
  );
  // ============================================

  /**
   * ============================================
   * 1. LOADING STATE
   * --------------------------------------------
   * While authentication state is resolving,
   * render fallback to prevent premature routing.
   */
  if (loading) {
    console.log("ProtectedRoute: still loading, rendering fallback");
    return <div>Loading...</div>;
  }

  /**
   * ============================================
   * 2. AUTHENTICATION CHECK
   * --------------------------------------------
   * If user is not authenticated,
   * redirect to public entry route.
   */
  if (!authState.status) {
    console.log("ProtectedRoute: user not authenticated → redirecting to /");
    return <Navigate to="/" replace />;
  }

  /**
   * ============================================
   * 3. ROLE AUTHORIZATION (Optional)
   * --------------------------------------------
   * If allowedRoles is defined,
   * ensure user role is permitted.
   */
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(authState.userType)) {
      console.log(
        `ProtectedRoute: user role "${authState.userType}" not allowed → redirecting to /`,
      );
      return <Navigate to="/" replace />;
    }
  }

  /**
   * ============================================
   * 4. ACCESS GRANTED
   * --------------------------------------------
   * Authentication and authorization satisfied.
   * Render protected content.
   */
  console.log("ProtectedRoute: access granted, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;

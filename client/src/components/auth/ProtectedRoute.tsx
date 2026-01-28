import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthContext } from "../../context/AuthContext";
import type { UserRole } from "../../types/auth.types";

interface Props {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { authState, loading } = useAuthContext();

  // ----------------------------
  // Log every render
  // ----------------------------
  console.log(
    "ProtectedRoute render → authState:",
    authState,
    "loading:",
    loading,
  );

  // ----------------------------
  // 1. Loading state
  // ----------------------------
  if (loading) {
    console.log("ProtectedRoute: still loading, rendering fallback");
    return <div>Loading...</div>;
  }

  // ----------------------------
  // 2. Not authenticated
  // ----------------------------
  if (!authState.status) {
    console.log("ProtectedRoute: user not authenticated → redirecting to /");
    return <Navigate to="/" replace />;
  }

  // ----------------------------
  // 3. Role-based authorization
  // ----------------------------
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(authState.userType)) {
      console.log(
        `ProtectedRoute: user role "${authState.userType}" not allowed → redirecting to /`,
      );
      return <Navigate to="/" replace />;
    }
  }

  // ----------------------------
  // 4. Access granted
  // ----------------------------
  console.log("ProtectedRoute: access granted, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;

import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import type { UserRole } from '../types/auth';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  allowedRoles?: UserRole[];
  loading?: boolean;
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { authState } = useAuthContext();

  // Show nothing or spinner while checking auth
  if (authState.status === false) {
    return <div>Loading...</div>; // <-- wait for useAuth to finish
  }

  // Not logged in → redirect
  if (!authState.status) return <Navigate to="/" replace />;

  // Logged in but wrong role
  if (allowedRoles && !allowedRoles.includes(authState.userType)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
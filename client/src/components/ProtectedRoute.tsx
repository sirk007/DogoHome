import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import type { UserRole } from '../types/auth';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { authState, loading } = useAuthContext();

  // 1️⃣ Auth still resolving
  if (loading) {
    return <div>Loading...</div>;
  }

  // 2️⃣ Not authenticated
  if (!authState.status) {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Authenticated but wrong role
  if (allowedRoles && !allowedRoles.includes(authState.userType)) {
    return <Navigate to="/" replace />;
  }

  // 4️⃣ Authorized
  return <>{children}</>;
};

export default ProtectedRoute;
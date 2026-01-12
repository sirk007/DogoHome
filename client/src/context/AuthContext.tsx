// context/AuthContext.tsx
import { createContext, useContext } from 'react';
import type { FC } from 'react';
import type { ReactNode } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { AuthState } from '../types/auth';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
  authState: AuthState;
  setAuthState: Dispatch<SetStateAction<AuthState>>;
  loading: boolean; // <-- new
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider wraps your app and provides:
 * - authState
 * - setAuthState
 * - loading (while checking token on refresh)
 */
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const { authState, setAuthState, loading } = useAuth(); // get loading from hook

  return (
    <AuthContext.Provider value={{ authState, setAuthState, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to consume AuthContext
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
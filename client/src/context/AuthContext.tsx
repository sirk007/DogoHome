import { createContext, useContext } from 'react';
import type { ReactNode, Dispatch, SetStateAction, FC } from 'react';
import type { AuthState } from '../types/auth';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
  authState: AuthState;
  setAuthState: Dispatch<SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider
 * Explicitly typed as a Function Component
 */
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const { authState, setAuthState } = useAuth();

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
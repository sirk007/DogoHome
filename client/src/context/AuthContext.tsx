import React, {
  createContext,
  useContext,
  type FC,
  type ReactNode,
} from "react";
import { useAuth } from "../hooks/useAuth";
import type { AuthState } from "../types/auth";
import type { Dispatch, SetStateAction } from "react";

/**
 * --------------------------------------------
 * AuthContextType
 * --------------------------------------------
 * Defines the shape of the context value that will be provided
 * to all components in the app that need access to authentication info.
 *
 * Properties:
 * - authState: AuthState -> Current user information and login status
 * - setAuthState: Dispatch<SetStateAction<AuthState>> -> Allows manual updates to authState
 * - loading: boolean -> True when authentication is being verified
 * - logout: () => void -> Clears all tokens and resets authState
 */
interface AuthContextType {
  authState: AuthState;
  setAuthState: Dispatch<SetStateAction<AuthState>>;
  loading: boolean;
  logout: () => void;
}

/**
 * --------------------------------------------
 * AuthContext
 * --------------------------------------------
 * React context that will provide auth info throughout the app.
 *
 * Initialized with undefined to enforce using the custom hook
 * (useAuthContext) to consume the context safely.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * --------------------------------------------
 * AuthProviderProps
 * --------------------------------------------
 * Standard React pattern for provider props.
 * We accept children, which can be any ReactNode.
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * --------------------------------------------
 * AuthProvider
 * --------------------------------------------
 * Wraps the application (usually in App.tsx) to provide:
 * - authState
 * - setAuthState
 * - loading
 * - logout
 *
 * Responsibilities:
 * 1. Calls useAuth hook to get current auth state and helper functions.
 * 2. Provides these values via AuthContext.Provider.
 * 3. Ensures that any component inside the provider can access auth info.
 */
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  // Grab all authentication info and helpers from the custom hook
  const { authState, setAuthState, loading, logout } = useAuth();

  return (
    <AuthContext.Provider value={{ authState, setAuthState, loading, logout }}>
      {children} {/* Render all child components */}
    </AuthContext.Provider>
  );
};

/**
 * --------------------------------------------
 * useAuthContext
 * --------------------------------------------
 * Custom hook for consuming the AuthContext safely.
 *
 * Throws an error if called outside AuthProvider.
 * Ensures that all components consuming authState, setAuthState,
 * loading, or logout are within the provider tree.
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};

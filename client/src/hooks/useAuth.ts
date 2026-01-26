/**
 * --------------------------------------------
 * useAuth Hook
 * --------------------------------------------
 * Centralized authentication management hook for the app.
 *
 * Responsibilities:
 * - Checks for active JWT tokens in sessionStorage for Users, Admins, and Shelters
 * - Validates token expiration on the client
 * - Verifies token authenticity with backend APIs
 * - Maintains auth state (username, id, role, login status)
 * - Provides a loading state while authentication check is in progress
 * - Supplies a logout helper to clear tokens and reset state
 *
 * Benefits:
 * - Ensures consistent auth state across all components
 * - Protects against expired or tampered tokens
 * - Simplifies login persistence and session management
 */

import { useState, useEffect } from "react";
import type { AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode"; // used to decode JWT and check expiration
import { fetchUserAuth, fetchAdminAuth, fetchShelterAuth } from "../api/auth";
import type { AuthState, UserRole, AuthIdentity } from "../types/auth.types";

/**
 * --------------------------------------------
 * TOKEN_KEYS
 * --------------------------------------------
 * Maps user roles to their corresponding sessionStorage keys.
 * This allows the hook to check for any active token in a structured way.
 */
const TOKEN_KEYS = {
  user: "accessToken",
  admin: "adminAccessToken",
  shelter: "accessShelterToken",
} as const;

/**
 * --------------------------------------------
 * Type Guard: isValidUserRole
 * --------------------------------------------
 * Ensures that a value retrieved from backend or elsewhere
 * is a valid UserRole as defined in types/auth.ts
 */
const isValidUserRole = (role: any): role is UserRole =>
  role === "User" || role === "Admin" || role === "Shelter";

/**
 * --------------------------------------------
 * JwtPayload interface
 * --------------------------------------------
 * Only stores the fields we care about for client-side checks.
 * Here, we only need the 'exp' (expiration) to determine if the token is expired.
 */
interface JwtPayload {
  exp: number;
}

/**
 * --------------------------------------------
 * useAuth Hook
 * --------------------------------------------
 * Manages authentication state across the app.
 * Responsibilities:
 * 1. Checks sessionStorage for valid tokens
 * 2. Validates token expiration
 * 3. Fetches user data from backend to verify token
 * 4. Updates authState and loading state
 * 5. Provides a logout helper to clear tokens and reset state
 */
export const useAuth = () => {
  // -----------------------------
  // Local state
  // -----------------------------
  const [authState, setAuthState] = useState<AuthState>({
    username: "", // username of authenticated user
    id: 0, // database ID of user
    userType: "", // role: User, Admin, Shelter
    status: false, // whether user is logged in
    token: undefined, // Initially undefined
  });

  const [loading, setLoading] = useState(true); // tracks whether auth check is in progress

  // -----------------------------
  // Effect: runs on component mount
  // -----------------------------
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true); // start auth check

      // -----------------------------
      // 1. Check for any active token
      // -----------------------------
      const tokenEntry = Object.entries(TOKEN_KEYS).find(([role, key]) => {
        const token = sessionStorage.getItem(key);
        if (!token) return false;

        try {
          const decoded: JwtPayload = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            // Token expired → remove from storage
            sessionStorage.removeItem(key);
            return false;
          }
          return true; // token exists and not expired
        } catch {
          // Invalid token → remove from storage
          sessionStorage.removeItem(key);
          return false;
        }
      });

      // -----------------------------
      // 2. No valid token found
      // -----------------------------
      if (!tokenEntry) {
        setAuthState({ username: "", id: 0, userType: "", status: false });
        setLoading(false);
        return;
      }

      const [role, key] = tokenEntry; // role: 'User' | 'Admin' | 'Shelter'
      const token = sessionStorage.getItem(key)!; // token is guaranteed here

      try {
        // -----------------------------
        // 3. Verify token with backend
        // -----------------------------
        let response: AxiosResponse<AuthIdentity>;

        if (role === "user") response = await fetchUserAuth(token);
        else if (role === "admin") response = await fetchAdminAuth(token);
        else response = await fetchShelterAuth(token);

        // -----------------------------
        // 4. Update auth state with verified data
        // -----------------------------
        const { id, username, userType } = response.data;
        setAuthState({
          username,
          id,
          userType: isValidUserRole(userType) ? userType : "",
          status: true,
          token, // Store the JWT token in the state
        });
      } catch {
        // Network or unexpected error -> treat as unauthenticated
        sessionStorage.removeItem(key);
        setAuthState({ username: "", id: 0, userType: "", status: false });
      } finally {
        setLoading(false); // auth check complete
      }
    };

    checkAuth(); // run auth check once on mount
  }, []);

  // -----------------------------
  // Logout helper
  // -----------------------------
  // Clears all stored tokens and resets auth state
  const logout = () => {
    Object.values(TOKEN_KEYS).forEach((key) => sessionStorage.removeItem(key));
    setAuthState({ username: "", id: 0, userType: "", status: false });
  };

  // -----------------------------
  // Return values
  // -----------------------------
  // - authState: current authentication information
  // - setAuthState: allows manual updates if needed (e.g., after login)
  // - loading: indicates if auth check is in progress
  // - logout: clears tokens and resets state
  return { authState, setAuthState, loading, logout };
};

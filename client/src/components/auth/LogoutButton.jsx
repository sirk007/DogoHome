import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

/**
 * ==============================
 * LogoutButton
 * ------------------------------
 * Component to handle user, shelter, or admin logout.
 *
 * Responsibilities:
 * 1. Clear stored JWT tokens from sessionStorage
 * 2. Reset global auth state in context
 * 3. Redirect user to the login page
 *
 * Notes:
 * - Works with any authenticated role (user/shelter/admin)
 * - Simple button component; can be styled or wrapped in MUI
 * ==============================
 */
const LogoutButton = () => {
  /**
   * ============================================
   * CONTEXT & NAVIGATION
   * --------------------------------------------
   * - setAuthState: updates the AuthContext
   * - navigate: redirect hook from react-router-dom
   * ============================================
   */

  const { setAuthState } = useAuthContext();
  const navigate = useNavigate();

  /**
   * ============================================
   * LOGOUT HANDLER
   * --------------------------------------------
   * Clears all stored JWT tokens, resets auth context,
   * and redirects the user to /login.
   * ============================================
   */
  const logout = () => {
    // Clear all tokens
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("adminAccessToken");
    sessionStorage.removeItem("shelterAccessToken");

    // Reset auth state
    setAuthState({
      username: "",
      id: 0,
      userType: "",
      status: false,
    });

    // Redirect to login or landing page
    navigate("/login");
  };

  /**
   * ============================================
   * RENDER
   * --------------------------------------------
   * Simple logout button with onClick handler
   * ============================================
   */
  return <button onClick={logout}>Logout</button>;
};

export default LogoutButton;

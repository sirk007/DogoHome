import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { loginUser } from "../../api/authUser";
import { useNavigate } from "react-router-dom";

/**
 * --------------------------------------------
 * LoginUser Component
 * --------------------------------------------
 * Handles user login functionality:
 * - Accepts username and password
 * - Calls login API
 * - Stores token in sessionStorage
 * - Updates global auth context
 * - Redirects user to /user page
 */
const LoginUser: React.FC = () => {
  // -----------------------------
  // Access Auth Context
  // -----------------------------
  const { setAuthState } = useAuthContext(); // to update global auth state after login
  const navigate = useNavigate(); // for programmatic navigation after login

  // -----------------------------
  // Local component state
  // -----------------------------
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // stores API or validation errors

  // -----------------------------
  // Login handler
  // -----------------------------
  const handleLogin = async () => {
    try {
      // 1. Call login API
      const res = await loginUser(username, password);
      console.log("Login response:", res.data);

      // 2. Store JWT in sessionStorage
      sessionStorage.setItem("accessToken", res.data.token);

      // 3. Update global auth context
      // This ensures the rest of the app knows the user is logged in
      setAuthState({
        username: res.data.username,
        id: res.data.id,
        userType: res.data.userType || "User", // default to 'User' if API doesn't provide
        status: true,
      });

      // 4. Clear previous errors
      setError("");

      // 5. Navigate to user landing page
      navigate("/user");
    } catch (err: any) {
      console.error("Login failed", err);
      // Show API error or fallback
      setError(err.response?.data?.error || "Login failed");
    }
  };

  // -----------------------------
  // Logout handler
  // -----------------------------
  const handleLogout = () => {
    // 1. Remove token from sessionStorage
    sessionStorage.removeItem("accessToken");
    // 2. Reset auth context
    setAuthState({ username: "", id: 0, userType: "", status: false });
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    // -----------------------------
    // Outer container
    // -----------------------------
    // Centers the login form and sets a max width for readability.
    <div style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
      {/*-----------------------------
      // Header
      // ----------------------------- */}
      <h2>User Login</h2>

      {/*-----------------------------
      // Username input
      // Controlled input for username
      // Updates local state 'username on change
      // ----------------------------- */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "0.5rem", width: "100%" }}
        />
      </div>

      {/*-----------------------------
      // Password input
      // Controlled input for password
      // Updates local state 'password' on change
      // ----------------------------- */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "0.5rem", width: "100%" }}
        />
      </div>

      {/*-----------------------------
      // Error display
      // Shows login error if API fails or credentials are wrong
      // ----------------------------- */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* -----------------------------
      //  Action buttons
      // handleLogin triggers API call, updates context, navigates
      // handleLogout clears sessionStorage and context
      // ----------------------------- */}
      <button
        onClick={handleLogin}
        style={{ padding: "0.5rem 1rem", marginRight: "1rem" }}
      >
        Login
      </button>
      <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>
        Logout
      </button>
    </div>
  );
};

export default LoginUser;

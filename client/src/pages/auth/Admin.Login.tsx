import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { loginAdmin } from "../../api/admin.api";

const LoginAdmin: React.FC = () => {
  const { setAuthState } = useAuthContext();

  /**
   * ----------------------------
   * Local form state
   * ----------------------------
   * Controlled inputs for login form.
   */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Error message shown to the user
  const [error, setError] = useState("");

  /**
   * ----------------------------
   * Handle admin login
   * ----------------------------
   * Sends credentials to backend and updates auth state.
   */
  const handleLogin = async () => {
    try {
      const res = await loginAdmin(username, password);

      /**
       * Store admin token in sessionStorage.
       * Keeping tokens out of React state improves security.
       */
      sessionStorage.setItem("accessAdminToken", res.data.token);
      console.log("Login response:", res.data);
      /**
       * Update global authentication context.
       * This allows protected admin routes to unlock.
       */
      setAuthState({
        username: res.data.username,
        id: res.data.id,
        userType: "Admin",
        status: true,
      });
      // Clear any previous errors
      setError("");
      //window.location.reload(); // Optional: reload for full auth check
    } catch (err: any) {
      console.error("Login failed", err);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  /**
   * ----------------------------
   * Handle admin logout
   * ----------------------------
   * Clears token and resets auth state.
   */
  const handleLogout = () => {
    sessionStorage.removeItem("accessAdminToken");
    setAuthState({ username: "", id: 0, userType: "", status: false });
  };

  /**
   * ----------------------------
   * Rendered UI
   * ----------------------------
   */
  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
      {/* Page heading */}
      <h2>Admin Login</h2>

      {/* Username input */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "0.5rem", width: "100%" }}
        />
      </div>

      {/* Password input */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "0.5rem", width: "100%" }}
        />
      </div>

      {/* Error feedback */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Action buttons */}
      <button
        onClick={handleLogin}
        style={{ padding: "0.5rem 1rem", marginRight: "1rem" }}
      >
        Login
      </button>

      {/* Action buttons - LOGOUT TESTING STATE */}
      <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>
        Logout
      </button>
    </div>
  );
};

export default LoginAdmin;

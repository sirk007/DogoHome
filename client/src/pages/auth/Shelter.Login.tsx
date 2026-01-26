import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { loginShelter } from "../../api/shelter.api";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import type { ShelterLoginResponse } from "../../types/shelter.types";

/**
 * --------------------------------------------
 * LoginShelter Component
 * --------------------------------------------
 * Shelter login form:
 * - Collects username and password
 * - Calls backend /login endpoint for shelters
 * - Stores token in sessionStorage
 * - Updates global auth context
 * - Handles logout
 */
const LoginShelter: React.FC = () => {
  // -----------------------------
  // Auth context & navigation
  // -----------------------------
  const { setAuthState } = useAuthContext(); // allows updating auth state globally
  const navigate = useNavigate(); // for programmatic redirect

  // -----------------------------
  // Local state
  // -----------------------------
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // -----------------------------
  // Login handler
  // -----------------------------
  const handleLogin = async () => {
    try {
      // Call backend login
      const loginResponse: ShelterLoginResponse = await loginShelter(
        username,
        password,
      );

      // -----------------------------
      // Store token safely
      // -----------------------------
      // Clear other tokens to prevent cross-role conflicts
      sessionStorage.clear();
      sessionStorage.setItem("accessShelterToken", loginResponse.token);

      // -----------------------------
      // Update global auth state
      // -----------------------------
      setAuthState({
        username: loginResponse.username,
        id: loginResponse.id,
        userType: loginResponse.userType,
        status: true,
        token: loginResponse.token,
      });

      setError(""); // clear previous errors
      setUsername("");
      setPassword("");

      navigate("/shelter"); // redirect to shelter dashboard
    } catch (err: any) {
      console.error("Login failed", err);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  // -----------------------------
  // Logout handler
  // -----------------------------
  const handleLogout = () => {
    sessionStorage.removeItem("accessShelterToken");
    setAuthState({ username: "", id: 0, userType: "", status: false });
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Box sx={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Shelter Login
      </Typography>

      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box>
        <Button variant="contained" onClick={handleLogin} sx={{ mr: 1 }}>
          Login
        </Button>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default LoginShelter;

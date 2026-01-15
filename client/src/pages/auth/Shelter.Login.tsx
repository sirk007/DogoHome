import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { loginShelter } from "../../api/shelter.api";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";

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
      const res = await loginShelter(username, password);

      const token = res.data.token;
      if (!token) throw new Error("No token returned");

      // -----------------------------
      // Store token safely
      // -----------------------------
      // Clear other tokens to prevent cross-role conflicts
      sessionStorage.clear();
      sessionStorage.setItem("accessShelterToken", token);

      // -----------------------------
      // Update global auth state
      // -----------------------------
      setAuthState({
        username: res.data.username,
        id: res.data.id,
        userType: "Shelter",
        status: true,
      });

      setError(""); // clear previous errors
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
      {/* 1. Page Title */}
      <Typography variant="h5" gutterBottom>
        {" "}
        Shelter Login
      </Typography>

      {/* 2. Username Input */}
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* 3. Password Input */}
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* 4. Error Message */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* 6. Action Buttons */}
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

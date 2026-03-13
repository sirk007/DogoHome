/**
 * --------------------------------------------
 * LoginUser
 * --------------------------------------------
 * User login form:
 * - Collects username and password
 * - Calls backend /login endpoint for users
 * - Stores token in sessionStorage
 * - Updates global auth context
 */

import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { loginUser } from "../../api/user.api";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import type { UserLoginResponse } from "../../types/user.types";

const LoginUser: React.FC = () => {
  const { setAuthState } = useAuthContext();
  const navigate = useNavigate();

  // -----------------------------
  // Local state
  // -----------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // -----------------------------
  // Login handler
  // -----------------------------
  const handleLogin = async () => {
    try {
      console.log("Login attempt with:", { email, password });

      const loginResponse: UserLoginResponse = await loginUser(email, password);

      // -----------------------------
      // Store token safely
      // -----------------------------
      sessionStorage.clear();
      sessionStorage.setItem("accessToken", loginResponse.token);

      // -----------------------------
      // Update global auth state
      // -----------------------------
      setAuthState({
        id: loginResponse.id,
        username: loginResponse.username,
        email: loginResponse.email,
        userType: loginResponse.userType,
        status: true,
      });

      setError(""); // clear previous errors
      setEmail("");
      setPassword("");

      navigate("/user"); // redirect to user dashboard
    } catch (err: any) {
      console.error("Login failed", err);
      setError(err?.response?.data?.error || "Login failed");
    }
  };

  // -----------------------------
  // Logout handler
  // -----------------------------
  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      email: "",
      id: 0,
      userType: "",
      status: false,
    });
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Box sx={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        User Login
      </Typography>

      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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

export default LoginUser;

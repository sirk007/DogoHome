import React from "react";
import Navbar from "../../../components/navbar/Navbar";
import { Typography, Box, Paper, Button } from "@mui/material";
import { useAuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * --------------------------------------------
 * UserLandingPage Component
 * --------------------------------------------
 * Dashboard page for logged-in users:
 * - Welcomes the user by name
 * - Displays basic dashboard cards (Profile, Posts)
 * - Provides Logout functionality
 * - Wrapped in Navbar for consistent layout/navigation
 */
const UserLandingPage: React.FC = () => {
  // -----------------------------
  // Auth Context
  // -----------------------------
  const { authState, setAuthState } = useAuthContext(); // access username and logout
  const navigate = useNavigate(); // programmatic navigation

  // -----------------------------
  // Logout Handler
  // -----------------------------
  const handleLogout = () => {
    // Clear user token
    sessionStorage.removeItem("accessToken");
    // Reset global auth state
    setAuthState({ username: "", id: 0, userType: "", status: false });
    // Redirect to landing page
    navigate("/");
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    // -----------------------------
    // Navbar wraps the page
    // -----------------------------
    // Keeps header/navigation consistent across the app
    <Navbar>
      {/*-----------------------------
      // Main content container
      // ----------------------------- */}
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {authState.username} 👋
        </Typography>

        {/*-----------------------------
        // Dashboard cards section
        // ----------------------------- */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 2 }}>
          {/* Example card: My Profile */}
          <Paper sx={{ flex: "1 1 300px", p: 3, minWidth: 250 }}>
            <Typography variant="h6">My Profile</Typography>
            <Button variant="contained" size="small">
              Edit Profile
            </Button>
          </Paper>

          {/* Example card: My Posts */}
          <Paper sx={{ flex: "1 1 300px", p: 3, minWidth: 250 }}>
            <Typography variant="h6">My Posts</Typography>
            <Button variant="contained" size="small">
              View Posts
            </Button>
          </Paper>
        </Box>

        {/*-----------------------------
        // Logout section
        // ----------------------------- */}
        <Box sx={{ mt: 4 }}>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
    </Navbar>
  );
};

export default UserLandingPage;

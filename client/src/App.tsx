import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { AuthProvider, useAuthContext } from "./context/AuthContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import LandingPage from "./pages/public/Landing";
import UserRegistrationPage from "./pages/auth/User.Registration";
import ShelterRegistrationPage from "./pages/auth/Shelter.Registration";
import UserLandingPage from "./pages/user/userLandingPage/UserLandingPage";
import ShelterAnimalPage from "./pages/shelter/ShelterAnimalPage";
import ShelterProfile from "./pages/shelter/ShelterProfile";
import ShelterDashboard from "./pages/shelter/ShelterDashboard";
import { ModalProvider } from "./context/ModalContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ModalProvider>
          <AppContent />
        </ModalProvider>
      </BrowserRouter>
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { authState, loading } = useAuthContext();

  // Prevent flash before auth check
  if (loading) return null;

  return (
    // Flex container: navbar + main content
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* ----------------------------- */}
      {/* NAVBAR */}
      {/* ----------------------------- */}
      {authState.status && <Navbar />}

      {/* ----------------------------- */}
      {/* MAIN CONTENT + FOOTER */}
      {/* ----------------------------- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Take remaining space next to navbar
          display: "flex",
          flexDirection: "column", // Allows footer to stick at bottom
          minHeight: "100vh",
        }}
      >
        {/* Page content */}
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/registration" element={<UserRegistrationPage />} />
            <Route
              path="/shelter/registration"
              element={<ShelterRegistrationPage />}
            />

            {/* USER PROTECTED */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <UserLandingPage />
                </ProtectedRoute>
              }
            />

            {/* SHELTER PROTECTED */}
            <Route
              path="/shelter"
              element={
                <ProtectedRoute allowedRoles={["Shelter"]}>
                  <ShelterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shelter/profile"
              element={
                <ProtectedRoute allowedRoles={["Shelter"]}>
                  <ShelterProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shelter/animals/add"
              element={
                <ProtectedRoute allowedRoles={["Shelter"]}>
                  <ShelterAnimalPage />
                </ProtectedRoute>
              }
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>

        {/* Footer always sticks at bottom of main content */}
        <Footer />
      </Box>
    </Box>
  );
};

export default App;

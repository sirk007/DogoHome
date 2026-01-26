import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuthContext } from "./context/AuthContext";

// Components & Pages
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import LandingPage from "./pages/public/Landing";
import UserRegistrationPage from "./pages/auth/User.Registration";
import ShelterRegistrationPage from "./pages/auth/Shelter.Registration";

import UserLandingPage from "./pages/user/userLandingPage/UserLandingPage";
import ShelterAnimalPage from "./pages/shelter/ShelterAnimalPage";
import ShelterProfile from "./components/shelter/ShelterProfile";
import ShelterDashboard from "./pages/shelter/ShelterDashboard";
import { ModalProvider } from "./context/ModalContext";

/**
 * App component - the root of the React application
 *
 * Responsibilities:
 * 1. Wraps the app in BrowserRouter for routing.
 * 2. Provides a flex layout to ensure footer sticks to the bottom.
 * 3. Defines public and protected routes.
 * 4. Ensures role-based access via ProtectedRoute.
 * 5. Redirects unknown routes to the landing page.
 */
function App() {
  // Get auth state from context
  const { authState } = useAuthContext();
  // NOTE: Currently used for optional debugging, could remove in production

  return (
    <BrowserRouter>
      <ModalProvider>
        {/** Navbar is global - Dynamically show links based on authState */}
        <Navbar />
        {/* Flex container: main content + footer layout */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh", // ensures footer is pushed to bottom
          }}
        >
          {/* Main content grows to fill remaining space above footer */}
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              {/* --------------------------------------
                PUBLIC ROUTES
            -------------------------------------- */}
              {/* Landing page - accessible by everyone */}
              <Route path="/" element={<LandingPage />} />

              {/* Registration routes */}
              <Route path="/registration" element={<UserRegistrationPage />} />
              <Route
                path="/shelter/registration"
                element={<ShelterRegistrationPage />}
              />

              {/* --------------------------------------
                PROTECTED ROUTES - USER
            -------------------------------------- */}
              {/* Only authenticated users with role 'User' can access */}
              <Route
                path="/user"
                element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <UserLandingPage />
                  </ProtectedRoute>
                }
              />

              {/* --------------------------------------
                PROTECTED ROUTES - SHELTER
            -------------------------------------- */}
              {/* Shelter-specific routes */}
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

              {/* Add animal page - only accessible to authenticated shelters */}
              <Route
                path="/shelter/animals/add"
                element={
                  <ProtectedRoute allowedRoles={["Shelter"]}>
                    <ShelterAnimalPage />
                  </ProtectedRoute>
                }
              />

              {/* --------------------------------------
                FALLBACK ROUTE
            -------------------------------------- */}
              {/* Redirect all unknown routes to the landing page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>

          {/* --------------------------------------
            FOOTER
            Always sticks to bottom thanks to flex layout
        -------------------------------------- */}
          <Footer />
        </Box>
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;

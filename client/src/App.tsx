import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { AuthProvider, useAuthContext } from "./context/AuthContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import LandingPage from "./pages/public/Landing";
import UserRegistrationPage from "./pages/auth/User.Registration";
import UserHome from "./pages/user/UserHome";
import InspectPosts from "./pages/user/InspectPosts";
import UserPost from "./pages/user/UserPost";
import UserFindDog from "./pages/user/UserFindDog";
import UserExplore from "./pages/user/UserExplore";
import UserActivity from "./pages/user/UserActivity";

import ShelterRegistrationPage from "./pages/auth/Shelter.Registration";
import ShelterAnimalPage from "./pages/shelter/ShelterAnimalPage";
import ShelterProfile from "./pages/shelter/ShelterProfile";
import ShelterDashboard from "./pages/shelter/ShelterDashboard";

import "leaflet/dist/leaflet.css";
import { ModalProvider } from "./context/ModalContext";
import UserShelterView from "./pages/user/UserShelterView";
import LostPost from "@pages/user/create/LostPost";
import FoundPost from "@pages/user/create/FoundPost";
import SightingPost from "@pages/user/create/SightingPost";
import ShelterMessagesPage from "@pages/shelter/ShelterMessagesPage";
import UserMessagesPage from "@pages/user/UserMessagesPage";

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
                  <UserHome />
                </ProtectedRoute>
              }
            />
            {/* USER PROTECTED */}
            <Route
              path="/user/explore"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <UserExplore />
                </ProtectedRoute>
              }
            />
            {/* USER PROTECTED */}
            <Route
              path="/user/shelter/:shelterId"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <UserShelterView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/activity"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <UserActivity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/posts"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <UserPost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/create/lost"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <LostPost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/create/found"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <FoundPost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/create/sighting"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <SightingPost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/inspect"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <InspectPosts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/searchDogs"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <UserFindDog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/messages"
              element={
                <ProtectedRoute allowedRoles={["User"]}>
                  <UserMessagesPage />
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
            <Route
              path="/shelter/messages"
              element={
                <ProtectedRoute allowedRoles={["Shelter"]}>
                  <ShelterMessagesPage />
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

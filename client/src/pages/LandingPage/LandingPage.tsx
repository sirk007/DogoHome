import React, { useState } from "react";
import { Link } from "react-router-dom";

import LoginUser from "../userLogin/LoginUser";
import LoginShelter from "../shelterLogin/LoginShelter";

import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  CardActions,
  Modal,
  Divider,
} from "@mui/material";

import Navbar from "../../components/navbar/Navbar";

/**
 * --------------------------------------------
 * LandingPage Component
 * --------------------------------------------
 * The landing page serves as the first page users and shelters see.
 * Responsibilities:
 * 1. Display a showcase of dogs available for adoption
 * 2. Provide a modal for signing in (User or Shelter)
 * 3. Links to registration for new accounts
 */
const LandingPage: React.FC = () => {
  // -----------------------------
  // Modal state
  // -----------------------------
  const [signInOpen, setSignInOpen] = useState(false); // controls sign-in modal visibility
  const [loginType, setLoginType] = useState<"User" | "Shelter">("User"); // switches between User/Shelter login forms

  // -----------------------------
  // Sample dogs for display
  // -----------------------------
  // In a real app, this could be fetched from the backend
  const randomDogs = [
    { id: 1, name: "Buddy", shelter: "Happy Tails" },
    { id: 2, name: "Lucy", shelter: "Paws & Co." },
    { id: 3, name: "Max", shelter: "Furry Friends" },
    { id: 4, name: "Bella", shelter: "Safe Paws" },
    { id: 5, name: "Charlie", shelter: "Kind Hearts" },
    { id: 6, name: "Daisy", shelter: "Good Dogs Shelter" },
  ];

  return (
    // -----------------------------
    // Navbar wraps the page
    // -----------------------------
    // The Navbar provides the site header and navigation.
    // By passing `onSignInClick`, we allow the Navbar to open the sign-in modal.
    // This keeps the modal state controlled from the LandingPage while
    // keeping the Navbar reusable and stateless regarding login state.
    <Navbar onSignInClick={() => setSignInOpen(true)}>
      {/* ================= DOGS SECTION ================= 
      // -----------------------------
      // Hero / showcase area
      // -----------------------------
      // This section highlights some adoptable dogs.
      // Box + Container layout ensures spacing, max width, and responsiveness.
      */}
      <Box
        sx={{
          width: "100%",
          py: { xs: 4, md: 6 },
          bgcolor: "background.default",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            mx: "auto",
            px: 2,
            maxWidth: { xs: 600, sm: 900, md: 1200, lg: 1536 },
          }}
        >
          {/*-----------------------------
          // Section title
          // ----------------------------- */}
          <Typography variant="h4" textAlign="center" gutterBottom>
            Meet Some Dogs Looking for a Home
          </Typography>

          {/*-----------------------------
          // Dog Cards Grid
          // ----------------------------- */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            }}
          >
            {/* Loop through randomDogs to render each card */}
            {randomDogs.map((dog) => (
              <Card
                key={dog.id}
                sx={{
                  width: { xs: "100%", sm: 260, md: 280, lg: 300 },
                }}
              >
                <CardContent>
                  <Typography variant="h6">{dog.name}</Typography>
                  <Typography variant="body2">
                    Shelter: {dog.shelter}
                  </Typography>
                </CardContent>
                <CardActions>
                  {/* Placeholder button for potential "view more" details */}
                  <Button size="small" variant="outlined">
                    View More
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ================= SIGN IN MODAL ================= 
      // -----------------------------
      // Sign-in modal
      // -----------------------------
      // Opens when `signInOpen` is true.
      // Centered using absolute positioning and transform.
      // Width is responsive for mobile and desktop.
      */}
      <Modal open={signInOpen} onClose={() => setSignInOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {/*-----------------------------
          // Modal Header
          // ----------------------------- */}
          <Typography variant="h6" textAlign="center" gutterBottom>
            Sign In
          </Typography>
          {/*-----------------------------
          // User/Shelter Toggle
          // ----------------------------- */}
          <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
            <Button
              variant={loginType === "User" ? "contained" : "outlined"}
              onClick={() => setLoginType("User")}
            >
              User
            </Button>
            <Button
              variant={loginType === "Shelter" ? "contained" : "outlined"}
              onClick={() => setLoginType("Shelter")}
            >
              Shelter
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/*-----------------------------
          // Conditional login form
          // ----------------------------- */}

          {/* Only render the form relevant to the selected loginType */}
          {loginType === "User" && <LoginUser />}
          {loginType === "Shelter" && <LoginShelter />}

          {/*-----------------------------
          // Registration Links
          // ----------------------------- */}
          <Box mt={3} textAlign="center">
            {loginType === "User" && (
              <Typography variant="body2">
                Don&apos;t have an account?{" "}
                <Link to="/registration">Register as User</Link>
              </Typography>
            )}
            {loginType === "Shelter" && (
              <Typography variant="body2">
                Don&apos;t have an account?{" "}
                <Link to="/shelter/registration">Register as Shelter</Link>
              </Typography>
            )}
          </Box>
        </Box>
      </Modal>
    </Navbar>
  );
};

export default LandingPage;

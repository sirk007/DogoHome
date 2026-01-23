import React from "react";
import { Link } from "react-router-dom";

import LoginUser from "../auth/User.Login";
import LoginShelter from "../auth/Shelter.Login";

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

import { useModalContext } from "../../context/ModalContext"; // ✅ use global modal context

/**
 * LandingPage Component
 */
const LandingPage: React.FC = () => {
  const { isLoginOpen, loginType, closeLogin, openLogin } = useModalContext();

  const randomDogs = [
    { id: 1, name: "Buddy", shelter: "Happy Tails" },
    { id: 2, name: "Lucy", shelter: "Paws & Co." },
    { id: 3, name: "Max", shelter: "Furry Friends" },
    { id: 4, name: "Bella", shelter: "Safe Paws" },
    { id: 5, name: "Charlie", shelter: "Kind Hearts" },
    { id: 6, name: "Daisy", shelter: "Good Dogs Shelter" },
  ];

  return (
    <>
      {/* ================= DOGS SECTION ================= */}
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
          <Typography variant="h4" textAlign="center" gutterBottom>
            Meet Some Dogs Looking for a Home
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            }}
          >
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
                  <Button size="small" variant="outlined">
                    View More
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ================= SIGN IN MODAL ================= */}
      <Modal open={isLoginOpen} onClose={closeLogin}>
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
          <Typography variant="h6" textAlign="center" gutterBottom>
            Sign In
          </Typography>

          {/* Toggle between User/Shelter */}
          <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
            <Button
              variant={loginType === "User" ? "contained" : "outlined"}
              onClick={() => openLogin("User")}
            >
              User
            </Button>
            <Button
              variant={loginType === "Shelter" ? "contained" : "outlined"}
              onClick={() => openLogin("Shelter")}
            >
              Shelter
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* Conditionally render forms */}
          {loginType === "User" && <LoginUser />}
          {loginType === "Shelter" && <LoginShelter />}

          {/* Registration Links */}
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
    </>
  );
};

export default LandingPage;

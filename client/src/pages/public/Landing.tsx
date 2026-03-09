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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

import { useModalContext } from "../../context/ModalContext";
import HeroSection from "@components/landing/HeroSection";
import SearchBar from "@components/landing/SearchBar";
import FeatureBox from "@components/landing/FeatureBox";

const LandingPage: React.FC = () => {
  const { isLoginOpen, loginType, closeLogin, openLogin } = useModalContext();

  const randomDogs = [
    { id: 1, name: "Buddy", shelter: "Happy Tails" },
    { id: 2, name: "Lucy", shelter: "Paws & Co." },
    { id: 3, name: "Max", shelter: "Furry Friends" },
    { id: 4, name: "Bella", shelter: "Safe Paws" },
  ];

  const randomShelters = [
    { id: 1, name: "Happy Tails", location: "New York" },
    { id: 2, name: "Safe Paws", location: "California" },
    { id: 3, name: "Furry Friends", location: "Texas" },
    { id: 4, name: "Kind Hearts", location: "Florida" },
  ];

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <HeroSection openLogin={openLogin} />
      <Box>{/* Main hero text */}</Box>

      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <FeatureBox
              title="Find Pets & Shelters"
              description="Browse shelters across Ireland and discover animals looking for a new home."
            />

            <FeatureBox
              title="Community Pet Alerts"
              description="Report lost pets, found animals, or unusual sightings on the shared community map."
            />

            <FeatureBox
              title="Connect With Shelters"
              description="Message shelters directly and start the adoption process from one platform."
            />
          </Box>
        </Container>
      </Box>

      {/* ================= SEARCH BAR SECTION ================= */}
      <SearchBar
        onSearch={(filters) => {
          console.log("Search with filters:", filters);
          // Implement search functionality here
        }}
      />

      {/* ================= FEATURED SHELTERS ================= */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom textAlign="center">
            Find a Loving Shelter Near You
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {randomShelters.map((shelter) => (
              <Card key={shelter.id} sx={{ width: { xs: "100%", sm: 260 } }}>
                <CardContent>
                  <Typography variant="h6">{shelter.name}</Typography>
                  <Typography variant="body2">{shelter.location}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="outlined">
                    View Shelter
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ================= FEATURED ANIMALS ================= */}
      <Box sx={{ py: 6, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom textAlign="center">
            Meet Some Pets
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {randomDogs.map((dog) => (
              <Card key={dog.id} sx={{ width: { xs: "100%", sm: 260 } }}>
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

      {/* ================= LOGIN MODAL ================= */}
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

          {loginType === "User" && <LoginUser />}
          {loginType === "Shelter" && <LoginShelter />}

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

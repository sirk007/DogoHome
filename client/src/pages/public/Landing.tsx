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
      <Box
        sx={{
          height: { xs: "50vh", md: "60vh" },
          position: "relative",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          px: 2,
        }}
      >
        {/* Top-right buttons */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: { xs: "flex-end", sm: "flex-start" },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => openLogin("User")}
            size="small"
            sx={{ flex: { xs: "1 1 48%", sm: "auto" } }}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            color="success"
            component={Link}
            to="/registration"
            size="small"
            sx={{ flex: { xs: "1 1 48%", sm: "auto" } }}
          >
            Register
          </Button>
        </Box>

        {/* Main hero text */}
        <Stack
          spacing={2}
          maxWidth={700}
          alignItems="center"
          justifyContent="center"
          height="100%"
          textAlign="center"
          mx="auto"
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              lineHeight: 1.2,
              letterSpacing: "0.02em",
              color: "rgb(31, 2, 247)",
              textShadow: "0 0 8px rgba(0,0,0,0.5)",
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
            }}
          >
            Helping You Find Your <br />
            New Best Friend!
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              lineHeight: 1.5,
              textShadow: "0 0 6px rgba(0,0,0,0.3)",
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" },
            }}
          >
            Discover loving animals and connect with local shelters <br />
            to find your perfect pet today.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              fontStyle: "italic",
              textShadow: "0 0 4px rgba(0,0,0,0.2)",
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
            }}
          >
            Join our community of pet lovers!
          </Typography>
        </Stack>
      </Box>

      {/* ================= SEARCH BAR SECTION ================= */}
      <Box sx={{ py: 3, px: 2, bgcolor: "background.paper", boxShadow: 1 }}>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <FormControl sx={{ minWidth: { xs: "100%", sm: 150 } }}>
            <InputLabel>County</InputLabel>
            <Select defaultValue="">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Kildare">Kildare</MenuItem>
              <MenuItem value="Dublin">Dublin</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: { xs: "100%", sm: 120 } }}>
            <InputLabel>Radius</InputLabel>
            <Select defaultValue="">
              <MenuItem value={5}>5 km</MenuItem>
              <MenuItem value={10}>10 km</MenuItem>
              <MenuItem value={25}>25 km</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: { xs: "100%", sm: 150 } }}>
            <InputLabel>Animal Type</InputLabel>
            <Select defaultValue="">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Dog">Dog</MenuItem>
              <MenuItem value="Cat">Cat</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            sx={{ minWidth: { xs: "100%", sm: 120 } }}
          >
            Search
          </Button>
        </Container>
      </Box>

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

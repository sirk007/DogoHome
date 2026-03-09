import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Stack } from "@mui/material";

interface HeroSectionProps {
  openLogin: (type: "User" | "Shelter") => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ openLogin }) => {
  return (
    <Box
      sx={{
        height: { xs: "70vh", md: "80vh" },
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Stack
        spacing={3}
        maxWidth={750}
        alignItems="center"
        justifyContent="center"
        height="100%"
        textAlign="center"
        mx="auto"
        sx={{ position: "relative", zIndex: 2 }}
      >
        {/* Main Title */}
        <Typography
          sx={{
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "0.03em",
            color: "white",
            fontSize: { xs: "2rem", sm: "2.8rem", md: "3.6rem" },
            textShadow: "0 6px 20px rgba(0,0,0,0.4)",
          }}
        >
          Helping You Find Your <br />
          <Box component="span" sx={{ color: "#ffd166" }}>
            New Best Friend!
          </Box>
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 300,
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.9)",
            maxWidth: 550,
            fontSize: { xs: "1rem", md: "1.2rem" },
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          Discover loving animals and connect with local shelters
          <br />
          to find your perfect pet today.
        </Typography>

        {/* Buttons */}
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          justifyContent="center"
        >
          <Button
            variant="contained"
            onClick={() => openLogin("User")}
            sx={{
              px: 4,
              py: 1.3,
              borderRadius: 3,
              fontWeight: 600,
              background: "linear-gradient(45deg,#ff8c42,#ff6b35)",
              boxShadow: "0 8px 25px rgba(255,107,53,0.4)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 30px rgba(255,107,53,0.6)",
              },
              transition: "0.3s ease",
            }}
          >
            Sign In
          </Button>

          <Button
            variant="outlined"
            component={Link}
            to="/registration"
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: 3,
              borderColor: "rgba(255,255,255,0.7)",
              color: "white",
              fontWeight: 600,
              backdropFilter: "blur(6px)",
              "&:hover": {
                borderColor: "white",
                background: "rgba(255,255,255,0.1)",
              },
              transition: "0.3s ease",
            }}
          >
            Register
          </Button>
        </Stack>

        {/* Footer Tagline */}
        <Typography
          variant="body1"
          sx={{
            fontStyle: "italic",
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.02em",
            textShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          Join our community of pet lovers!
        </Typography>
      </Stack>
    </Box>
  );
};

export default HeroSection;

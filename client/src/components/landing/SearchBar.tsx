import React, { useState } from "react";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Paper,
} from "@mui/material";

interface SearchBarProps {
  onSearch: (filters: {
    county: string;
    radius: number;
    animalType: string;
  }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [county, setCounty] = useState("");
  const [radius, setRadius] = useState<number | "">("");
  const [animalType, setAnimalType] = useState("");
  const [mode, setMode] = useState<"pets" | "shelters">("pets");

  const handleSearch = () => {
    onSearch({
      county,
      radius: radius || 0,
      animalType,
    });
  };

  return (
    <Box sx={{ py: 6, px: 2, display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: { xs: "95%", sm: "80%", md: 700, lg: 900 },
          p: 4,
          borderRadius: 3,

          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(16px)",

          border: "1px solid rgba(255,255,255,0.4)",

          boxShadow: `
      0 8px 32px rgba(0,0,0,0.05)
    `,
        }}
      >
        <Stack spacing={3} alignItems="center">
          {/* Mode Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            width="100%"
            maxWidth={500}
          >
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{
                py: 1.2,
                bgcolor: "#ff8f00",
                "&:hover": {
                  bgcolor: "#ff6f00",
                },
              }}
            >
              Find Lost Pets
            </Button>

            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{
                py: 1.2,
                bgcolor: "#0077b6",
                "&:hover": {
                  bgcolor: "#005f8f",
                },
              }}
            >
              Find Shelters
            </Button>
          </Stack>

          {/* Filters */}
          <Container
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* County */}
            <FormControl sx={{ minWidth: { xs: "100%", sm: 160 } }}>
              <InputLabel>County</InputLabel>
              <Select
                value={county}
                label="County"
                onChange={(e) => setCounty(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Kildare">Kildare</MenuItem>
                <MenuItem value="Dublin">Dublin</MenuItem>
                <MenuItem value="Cork">Cork</MenuItem>
              </Select>
            </FormControl>

            {/* Radius */}
            <FormControl sx={{ minWidth: { xs: "100%", sm: 140 } }}>
              <InputLabel>Radius</InputLabel>
              <Select
                value={radius}
                label="Radius"
                onChange={(e) => setRadius(Number(e.target.value))}
              >
                <MenuItem value={5}>5 km</MenuItem>
                <MenuItem value={10}>10 km</MenuItem>
                <MenuItem value={25}>25 km</MenuItem>
                <MenuItem value={50}>50 km</MenuItem>
              </Select>
            </FormControl>

            {/* Animal Type */}
            <FormControl sx={{ minWidth: { xs: "100%", sm: 160 } }}>
              <InputLabel>Animal Type</InputLabel>
              <Select
                value={animalType}
                label="Animal Type"
                onChange={(e) => setAnimalType(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Dog">Dog</MenuItem>
                <MenuItem value="Cat">Cat</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            {/* Search Button */}
            <Button
              variant="contained"
              sx={{ minWidth: { xs: "100%", sm: 140 } }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Container>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SearchBar;

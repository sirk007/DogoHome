import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  CardActions,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";

const UserHome: React.FC = () => {
  const { authState } = useAuthContext();
  const username = authState.username || "Guest";

  // ---------------- MOCK FILTER DATA ----------------
  const counties = ["Dublin", "Kildare", "Meath"];
  const species = ["Dog", "Cat", "Other"];
  const sizes = ["Small", "Medium", "Large"];

  // ---------------- MOCK ANIMALS ----------------
  const [animals] = useState([
    {
      id: 1,
      name: "Buddy",
      species: "Dog",
      age: "2 years",
      size: "Medium",
      goodWithKids: true,
      goodWithPets: true,
      shelter: "Happy Tails",
    },
    {
      id: 2,
      name: "Luna",
      species: "Cat",
      age: "1 year",
      size: "Small",
      goodWithKids: false,
      goodWithPets: true,
      shelter: "Safe Paws",
    },
  ]);

  // ---------------- MOCK SHELTERS ----------------
  const [shelters] = useState([
    { id: 1, name: "Happy Tails", pets: 12, location: "Dublin" },
    { id: 2, name: "Furry Friends", pets: 7, location: "Kildare" },
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ================= HEADER ================= */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {username} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ready to find your new best friend today?
        </Typography>
      </Box>

      {/* ================= FILTERS ================= */}
      <Card sx={{ mb: 5, p: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>County</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="">All</MenuItem>
                  {counties.map((county) => (
                    <MenuItem key={county} value={county}>
                      {county}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Species</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="">All</MenuItem>
                  {species.map((sp) => (
                    <MenuItem key={sp} value={sp}>
                      {sp}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Size</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="">Any</MenuItem>
                  {sizes.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
            >
              <FormControlLabel control={<Checkbox />} label="Good with kids" />
              <FormControlLabel
                control={<Checkbox />}
                label="Good with other pets"
              />
              <Button variant="contained">Apply Filters</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* ================= ANIMALS ================= */}
      <Box mb={6}>
        <Typography variant="h5" gutterBottom>
          Animals Near You
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {animals.map((animal) => (
            <Card key={animal.id} sx={{ width: 280, mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{animal.name}</Typography>
                <Typography variant="body2">
                  {animal.species} • {animal.age}
                </Typography>
                <Typography variant="body2">Size: {animal.size}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Shelter: {animal.shelter}
                </Typography>
                <Typography variant="body2">
                  Good with kids: {animal.goodWithKids ? "Yes" : "No"}
                </Typography>
                <Typography variant="body2">
                  Good with pets: {animal.goodWithPets ? "Yes" : "No"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="outlined">
                  View Profile
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ mb: 5 }} />

      {/* ================= REPORT SIGHTING ================= */}
      <Card sx={{ mb: 6, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Seen an animal in need?
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Help shelters and other users by reporting sightings near you.
          </Typography>
          <Button variant="contained">+ Report a Sighting</Button>
        </CardContent>
      </Card>

      {/* ================= SHELTERS ================= */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Shelters Near You
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {shelters.map((shelter) => (
            <Card key={shelter.id} sx={{ width: 280, mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{shelter.name}</Typography>
                <Typography variant="body2">{shelter.location}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pets available: {shelter.pets}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="outlined">
                  View Shelter
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Box>
    </Container>
  );
};

export default UserHome;

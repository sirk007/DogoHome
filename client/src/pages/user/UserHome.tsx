/**
 * UserHome.tsx
 *
 * Purpose:
 * - Quick overview / dashboard for logged-in users
 * - Preview nearby animals and shelters
 * - Provide clear entry points into deeper features (Explore, Posts)
 *
 * NOTE:
 * - This page intentionally uses mock data
 * - Filters here are visual-only previews
 * - Full search & filtering lives in /user/explore
 */

import React, { useEffect, useState } from "react";
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
import { fetchPublicShelters } from "../../api/shelter.api";
import { fetchAnimalsByShelterId } from "@api/animal.api";
import type { ShelterProfile } from "../../types/shelter.types";
import type { Animal } from "../../types/animal.types";

const UserHome: React.FC = () => {
  const { authState } = useAuthContext();
  const username = authState.username || "Guest";

  // ---------------- FILTER MOCKS ----------------
  const counties = ["Dublin", "Kildare", "Meath"];
  const species = ["Dog", "Cat", "Other"];
  const sizes = ["Small", "Medium", "Large"];

  // ---------------- STATE ----------------
  const [shelters, setShelters] = useState<ShelterProfile[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);

  // ---------------- EFFECT: FETCH SHELTERS + RANDOM ANIMALS ----------------
  useEffect(() => {
    const fetchSheltersAndAnimals = async () => {
      try {
        // 1️⃣ Fetch all public shelters
        const allShelters = await fetchPublicShelters();
        if (!allShelters.length) return;

        // 2️⃣ Shuffle shelters and pick up to 4
        const selectedShelters = [...allShelters]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);

        setShelters(selectedShelters);

        // 3️⃣ Fetch a random animal from each selected shelter
        const animalPromises = selectedShelters.map(async (shelter) => {
          try {
            const shelterAnimals = await fetchAnimalsByShelterId(shelter.id);
            if (!shelterAnimals.length) return null;
            const randomIndex = Math.floor(
              Math.random() * shelterAnimals.length,
            );
            return shelterAnimals[randomIndex];
          } catch (err) {
            console.error(
              `Failed to fetch animals for shelter ${shelter.id}:`,
              err,
            );
            return null;
          }
        });

        // 4️⃣ Wait for all random animals and filter out nulls
        const randomAnimals = (await Promise.all(animalPromises)).filter(
          (animal): animal is Animal => animal !== null,
        );

        setAnimals(randomAnimals);
      } catch (err) {
        console.error("Failed to fetch shelters or animals:", err);
      }
    };

    fetchSheltersAndAnimals();
  }, []);

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
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
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              flexWrap="wrap"
            >
              {/* County Filter */}
              <FormControl sx={{ flex: { xs: 1, sm: 1 } }}>
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

              {/* Species Filter */}
              <FormControl sx={{ flex: { xs: 1, sm: 1 } }}>
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

              {/* Size Filter */}
              <FormControl sx={{ flex: { xs: 1, sm: 1 } }}>
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

            {/* Checkboxes */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
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
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          justifyContent={{ xs: "center", sm: "flex-start" }}
        >
          {animals.length === 0 ? (
            <Typography>No animals available right now.</Typography>
          ) : (
            animals.map((animal) => (
              <Card
                key={animal.id}
                sx={{ width: { xs: "100%", sm: 280 }, mb: 2 }}
              >
                <CardContent>
                  <Typography variant="h6">{animal.name}</Typography>
                  <Typography variant="body2">
                    {animal.species} • {animal.age}
                  </Typography>
                  <Typography variant="body2">Size: {animal.size}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Shelter: {animal.shelterId}
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
            ))
          )}
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
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          justifyContent={{ xs: "center", sm: "flex-start" }}
        >
          {shelters.length === 0 ? (
            <Typography>No shelters found.</Typography>
          ) : (
            shelters.map((shelter) => (
              <Card
                key={shelter.id}
                sx={{ width: { xs: "100%", sm: 280 }, mb: 2 }}
              >
                <CardContent>
                  <Typography variant="h6">{shelter.shelterName}</Typography>
                  <Typography variant="body2">{shelter.address}</Typography>
                  {shelter.phoneNumber && (
                    <Typography variant="body2">
                      📞 {shelter.phoneNumber}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    County ID: {shelter.countyId}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="outlined">
                    View Shelter
                  </Button>
                </CardActions>
              </Card>
            ))
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default UserHome;

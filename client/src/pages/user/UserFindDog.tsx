import React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
} from "@mui/material";

const mockAnimals = [
  {
    id: 1,
    name: "Buddy",
    species: "Dog",
    age: "2 years",
    size: "Medium",
    shelter: "Happy Tails",
    goodWithKids: true,
    goodWithPets: true,
  },
  {
    id: 2,
    name: "Luna",
    species: "Cat",
    age: "1 year",
    size: "Small",
    shelter: "Safe Paws",
    goodWithKids: false,
    goodWithPets: true,
  },
  {
    id: 3,
    name: "Max",
    species: "Dog",
    age: "4 years",
    size: "Large",
    shelter: "Furry Friends",
    goodWithKids: true,
    goodWithPets: false,
  },
];

const nearbyShelters = [
  { id: 1, name: "Happy Tails", pets: 12 },
  { id: 2, name: "Furry Friends", pets: 7 },
  { id: 3, name: "Safe Paws", pets: 5 },
];

const UserFindDog: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* ================= HEADER ================= */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Find an Animal 🐾
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search for animals from shelters near you
        </Typography>
      </Box>

      {/* ================= MAIN LAYOUT ================= */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "flex-start",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* ================= LEFT: SEARCH + RESULTS ================= */}
        <Box sx={{ flex: 3 }}>
          {/* Filters */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Search Filters
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="Species" placeholder="Dog, Cat" fullWidth />
                <TextField label="Age" placeholder="Puppy, Adult" fullWidth />
                <TextField label="Size" placeholder="Small, Medium" fullWidth />
                <Button variant="contained">Search</Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Results */}
          <Typography variant="h5" gutterBottom>
            Animals Available
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            {mockAnimals.map((animal) => (
              <Card key={animal.id} sx={{ width: 280 }}>
                <CardContent>
                  <Typography variant="h6">{animal.name}</Typography>
                  <Typography variant="body2">
                    {animal.species} • {animal.age}
                  </Typography>
                  <Typography variant="body2">Size: {animal.size}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Shelter: {animal.shelter}
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    {animal.goodWithKids && (
                      <Chip label="Good with kids" size="small" />
                    )}
                    {animal.goodWithPets && (
                      <Chip label="Good with pets" size="small" />
                    )}
                  </Stack>
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

        {/* ================= RIGHT: SHELTERS ================= */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Shelters Near You
          </Typography>

          <Stack spacing={2}>
            {nearbyShelters.map((shelter) => (
              <Card key={shelter.id}>
                <CardContent>
                  <Typography variant="subtitle1">{shelter.name}</Typography>
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
      </Box>
    </Container>
  );
};

export default UserFindDog;

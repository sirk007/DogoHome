import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Card,
  CardContent,
  CardActions,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { fetchShelterProfile } from "../../api/shelter.api";
import type { Animal } from "../../types/animal.types";
import type { ShelterProfile } from "../../types/shelter.types";

// Mock data for now
const mockAnimals: Animal[] = [
  {
    id: 1,
    name: "Buddy",
    species: "Dog",
    age: 3,
    ageUnit: "Years",
    health: "Good",
    size: "Medium",
    activityLevel: "High",
    goodWithKids: true,
    goodWithPets: true,
    shelterId: 1,
  },
];

export default function ShelterDashboard() {
  const navigate = useNavigate();
  const { authState } = useAuthContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // -----------------------------
  // State for full shelter profile
  // -----------------------------
  const [profile, setProfile] = useState<ShelterProfile | null>(null);

  useEffect(() => {
    if (!authState.token) return;

    fetchShelterProfile(authState.token)
      .then((data) => setProfile(data))
      .catch((err) => console.error("Failed to fetch shelter profile:", err));
  }, [authState.token]);

  return (
    <Box sx={{ p: 4 }}>
      {/* ================= HEADER ================= */}
      <Box sx={{ mb: 3 }}>
        {profile ? (
          <>
            <Typography variant="h6">
              Logged in as: {profile.username}
            </Typography>
            <Typography>Email: {profile.email}</Typography>
            <Typography>Shelter Name: {profile.shelterName}</Typography>
            <Typography>Address: {profile.address}</Typography>
            <Typography>Phone: {profile.phoneNumber}</Typography>
            <Typography variant="body2" color="text.secondary">
              Shelter ID: {profile.id} | Role: {profile.userType}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h6">
              Logged in as: {authState.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Shelter ID: {authState.id} | Role: {authState.userType}
            </Typography>
          </>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Shelter Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your animals
          </Typography>
        </Box>

        <Button variant="contained">Add Animal</Button>
      </Box>

      {/* TEMPORARY TEST BUTTON */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/shelter/profile")}
      >
        Test Shelter Profile
      </Button>

      {/* ================= TABLE OR CARD VIEW ================= */}
      {isMobile ? (
        <Stack spacing={2}>
          {mockAnimals.map((animal) => (
            <Card key={animal.id}>
              <CardContent>
                <Typography variant="h6">{animal.name}</Typography>
                <Typography>Species: {animal.species}</Typography>
                <Typography>
                  Age: {animal.age} {animal.ageUnit}
                </Typography>
                <Typography>Health: {animal.health}</Typography>
                <Typography>Size: {animal.size}</Typography>
                <Typography>Activity Level: {animal.activityLevel}</Typography>
                <Typography>
                  Good with Kids: {animal.goodWithKids ? "Yes" : "No"}
                </Typography>
                <Typography>
                  Good with Pets: {animal.goodWithPets ? "Yes" : "No"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Edit</Button>
                <Button size="small" color="error">
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Species</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Health</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Activity Level</TableCell>
                <TableCell>Good with Kids</TableCell>
                <TableCell>Good with Pets</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {mockAnimals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell>{animal.name}</TableCell>
                  <TableCell>{animal.species}</TableCell>
                  <TableCell>
                    {animal.age} {animal.ageUnit}
                  </TableCell>
                  <TableCell>{animal.health}</TableCell>
                  <TableCell>{animal.size}</TableCell>
                  <TableCell>{animal.activityLevel}</TableCell>
                  <TableCell>{animal.goodWithKids ? "Yes" : "No"}</TableCell>
                  <TableCell>{animal.goodWithPets ? "Yes" : "No"}</TableCell>
                  <TableCell align="right">
                    <Button size="small">Edit</Button>
                    <Button size="small" color="error">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

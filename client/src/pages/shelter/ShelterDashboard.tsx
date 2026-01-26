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

import type { Animal } from "../../types/animal.types";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect Mobile
  return (
    <Box sx={{ p: 4 }}>
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // stack on mobile
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
        /* Mobile: show cards stacked */
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
        /* Desktop: show table */
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

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import type { ShelterProfile } from "../../types/shelter.types";
import type { Animal } from "../../types/animal.types";
import { fetchPublicShelterById } from "../../api/shelter.api";
import { fetchAnimalsByShelterId } from "../../api/animal.api";

const ANIMALS_PER_PAGE = 6;

const categories = ["All", "Dog", "Cat", "Rabbit", "Other"];

const UserShelterView: React.FC = () => {
  const { shelterId } = useParams<{ shelterId: string }>();
  const navigate = useNavigate();

  const [shelter, setShelter] = useState<ShelterProfile | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!shelterId) return;
    const id = Number(shelterId);

    fetchPublicShelterById(id).then(setShelter);
    fetchAnimalsByShelterId(id).then(setAnimals);
  }, [shelterId]);

  // Filter animals by category
  const filteredAnimals = useMemo(() => {
    if (selectedCategory === "All") return animals;
    return animals.filter(
      (a) => a.species.toLowerCase() === selectedCategory.toLowerCase(),
    );
  }, [animals, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAnimals.length / ANIMALS_PER_PAGE);

  const paginatedAnimals = filteredAnimals.slice(
    (page - 1) * ANIMALS_PER_PAGE,
    page * ANIMALS_PER_PAGE,
  );

  if (!shelter) {
    return (
      <Box p={4}>
        <Typography>Loading shelter...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1000, margin: "0 auto" }}>
      {/* Back Button */}
      <Button variant="outlined" onClick={() => navigate(-1)}>
        Back
      </Button>

      {/* Shelter Header */}
      <Box mt={3}>
        <Typography variant="h4" gutterBottom>
          {shelter.shelterName}
        </Typography>
        <Typography>{shelter.address}</Typography>
        {shelter.phoneNumber && (
          <Typography>📞 {shelter.phoneNumber}</Typography>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Filter Tabs */}
      <Tabs
        value={selectedCategory}
        onChange={(_, value) => {
          setSelectedCategory(value);
          setPage(1);
        }}
        sx={{ mb: 3 }}
      >
        {categories.map((cat) => (
          <Tab key={cat} label={cat} value={cat} />
        ))}
      </Tabs>

      {/* Animal List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {paginatedAnimals.length === 0 && (
          <Typography>No animals in this category.</Typography>
        )}

        {paginatedAnimals.map((animal) => (
          <Card
            key={animal.id}
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: 2,
            }}
          >
            {/* Image Placeholder */}
            <CardMedia
              component="img"
              image={animal.pictureUrl || "/placeholder.jpg"}
              alt={animal.name}
              sx={{
                width: 140,
                height: 120,
                objectFit: "cover",
              }}
            />

            {/* Animal Info */}
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{animal.name}</Typography>
              <Typography color="text.secondary">
                {animal.species} • {animal.size}
              </Typography>
            </CardContent>

            <Box sx={{ pr: 3 }}>
              <Button variant="contained">View</Button>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </Button>

          <Typography>
            Page {page} of {totalPages}
          </Typography>

          <Button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UserShelterView;

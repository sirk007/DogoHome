import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import type { ShelterProfile } from "../../types/shelter.types";
import type { Animal } from "../../types/animal.types";
import { fetchPublicShelterById } from "../../api/shelter.api";
import { fetchAnimalsByShelterId } from "../../api/animal.api";

const UserShelterView: React.FC = () => {
  const { shelterId } = useParams<{ shelterId: string }>();
  const navigate = useNavigate();

  const [shelter, setShelter] = useState<ShelterProfile | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    if (!shelterId) return;

    const id = Number(shelterId);

    fetchPublicShelterById(id).then(setShelter);
    fetchAnimalsByShelterId(id).then(setAnimals);
  }, [shelterId]);

  if (!shelter) {
    return (
      <Box p={4}>
        <Typography>Loading shelter...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Back Button */}
      <Button variant="outlined" onClick={() => navigate(-1)}>
        Back
      </Button>

      {/* Shelter Info */}
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

      {/* Animals Section */}
      <Typography variant="h5" gutterBottom>
        Animals Available
      </Typography>

      {animals.length === 0 && (
        <Typography>No animals currently listed.</Typography>
      )}

      {animals.map((animal) => (
        <Box
          key={animal.id}
          sx={{
            p: 2,
            mb: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
          }}
        >
          <Typography fontWeight="bold">{animal.name}</Typography>
          <Typography>
            {animal.species} • {animal.size}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default UserShelterView;

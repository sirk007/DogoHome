import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Stack } from "@mui/material";
import AnimalCard from "./AnimalCard";
import { useAuthContext } from "../../context/AuthContext";
import { fetchShelterAnimals, deleteAnimal } from "../../api/authShelterAnimals";

interface Animal {
  id: number;
  animal: string;
  animalName: string;
  animalAge: string;
  animalHealth: string;
  animalDescription?: string;
  picture?: string | null;
}

const AnimalList: React.FC = () => {
  const { authState } = useAuthContext();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnimals = async () => {
    if (!authState.token) return;
    setLoading(true);
    try {
      const res = await fetchShelterAnimals(authState.token);
      // Convert BLOB to base64 string if needed
      const animalsWithImages = res.data.map((a: any) => ({
        ...a,
        picture: a.picture ? `data:image/jpeg;base64,${a.picture}` : null,
      }));
      setAnimals(animalsWithImages);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load animals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAnimals(); }, [authState.token]);

  const handleDelete = async (id: number) => {
    if (!authState.token) return;
    try {
      await deleteAnimal(id, authState.token);
      setAnimals(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete animal");
    }
  };

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (animals.length === 0) return <Typography sx={{ mt: 2 }}>No animals registered yet.</Typography>;

  return (
    <Stack spacing={2} direction="row" flexWrap="wrap" justifyContent="flex-start">
      {animals.map(animal => (
        <AnimalCard key={animal.id} {...animal} onDelete={handleDelete} />
      ))}
    </Stack>
  );
};

export default AnimalList;
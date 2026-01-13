import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Stack } from "@mui/material";
import AnimalCard from "./AnimalCard";
import { useAuthContext } from "../../context/AuthContext";
import {
  fetchShelterAnimals,
  deleteAnimal,
} from "../../api/authShelterAnimals";

/**
 * ----------------------------
 * Animal type definition
 * ----------------------------
 * Represents a single animal returned from the backend.
 */

interface Animal {
  id: number;
  animal: string;
  animalName: string;
  animalAge: string;
  animalHealth: string;
  animalDescription?: string;
  picture?: string | null;
}

/**
 * ----------------------------
 * AnimalList Component
 * ----------------------------
 * Displays all animals registered by the logged-in shelter.
 */
const AnimalList: React.FC = () => {
  const { authState } = useAuthContext();

  // Stores animals fetched from the backend
  const [animals, setAnimals] = useState<Animal[]>([]);

  // Controls loading spinner visibility
  const [loading, setLoading] = useState(true);

  // Stores any error messages
  const [error, setError] = useState<string | null>(null);

  /**
   * ----------------------------
   * Fetch shelter animals
   * ----------------------------
   * Uses the shelter token to retrieve animals from the backend.
   */
  const loadAnimals = async () => {
    if (!authState.token) return;
    setLoading(true);
    try {
      const res = await fetchShelterAnimals(authState.token);
      /**
       * Convert BLOB images to base64 URLs so the browser can display them.
       */
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

  /**
   * ----------------------------
   * Fetch animals on mount
   * ----------------------------
   * Runs whenever the auth token changes.
   */
  useEffect(() => {
    loadAnimals();
  }, [authState.token]);

  /**
   * ----------------------------
   * Delete animal handler
   * ----------------------------
   * Removes animal both from backend and local state.
   */
  const handleDelete = async (id: number) => {
    if (!authState.token) return;
    try {
      await deleteAnimal(id, authState.token);
      // Remove deleted animal from UI instantly
      setAnimals((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete animal");
    }
  };

  /**
   * ----------------------------
   * Conditional Rendering States
   * ----------------------------
   */

  // Loading spinner while data is being fetched
  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;

  // Error state
  if (error) return <Typography color="error">{error}</Typography>;

  // Empty state
  if (animals.length === 0)
    return <Typography sx={{ mt: 2 }}>No animals registered yet.</Typography>;

  /**
   * ----------------------------
   * Render Animal Cards
   * ----------------------------
   */
  return (
    <Stack
      spacing={2}
      direction="row"
      flexWrap="wrap"
      justifyContent="flex-start"
    >
      {animals.map((animal) => (
        <AnimalCard key={animal.id} {...animal} onDelete={handleDelete} />
      ))}
    </Stack>
  );
};

export default AnimalList;

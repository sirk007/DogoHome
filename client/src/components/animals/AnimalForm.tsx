import React, { useState } from "react";
import { Box, TextField, Button, Stack, Typography, Alert } from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";
import { createAnimal } from "../../api/authShelterAnimals";

interface AnimalFormData {
  animal: string;
  animalName: string;
  animalAge: string;
  animalHealth: string;
  animalDescription?: string;
  picture?: File | null;
}

interface Props {
  onAnimalCreated?: () => void; // Callback to refresh the list
}

const AnimalForm: React.FC<Props> = ({ onAnimalCreated }) => {
  const { authState } = useAuthContext();
  const [formData, setFormData] = useState<AnimalFormData>({
    animal: "",
    animalName: "",
    animalAge: "",
    animalHealth: "",
    animalDescription: "",
    picture: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "picture" && files) setFormData(prev => ({ ...prev, picture: files[0] }));
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authState.token || authState.userType !== "Shelter") {
      setError("You must be logged in as a shelter to add animals.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createAnimal(formData, authState.token);
      setSuccess("Animal added successfully!");
      setFormData({ animal: "", animalName: "", animalAge: "", animalHealth: "", animalDescription: "", picture: null });
      onAnimalCreated?.(); // Refresh list
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to add animal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" mb={2}>Add a New Animal</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Animal Type" name="animal" value={formData.animal} onChange={handleChange} required />
          <TextField label="Name" name="animalName" value={formData.animalName} onChange={handleChange} required />
          <TextField label="Age" name="animalAge" value={formData.animalAge} onChange={handleChange} required />
          <TextField label="Health Status" name="animalHealth" value={formData.animalHealth} onChange={handleChange} required />
          <TextField label="Description" name="animalDescription" value={formData.animalDescription} onChange={handleChange} multiline rows={3} />
          <Button variant="contained" component="label">
            Upload Picture
            <input type="file" name="picture" hidden accept="image/*" onChange={handleChange} />
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? "Adding..." : "Add Animal"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default AnimalForm;
import { useState, type FormEvent } from "react";
import { useAuthContext } from "../../context/AuthContext";
import type { AnimalCreationAttributes } from "../../types/animal.types";
import { createAnimal } from "../../api/animal.api";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

interface AnimalFormProps {
  onSuccess?: () => void;
}

const AnimalForm: React.FC<AnimalFormProps> = ({ onSuccess }) => {
  const { authState } = useAuthContext();

  const [form, setForm] = useState<AnimalCreationAttributes>({
    species: "Dog",
    name: "",
    age: 0,
    ageUnit: "Years",
    health: "Good",
    size: "Medium",
    activityLevel: "Medium",
    goodWithKids: false,
    goodWithPets: false,
    description: "",
    pictureUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // ---------- Handlers ----------

  // For text, number, textarea
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // For MUI Select
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // For checkboxes
  const handleCheckboxChange =
    (name: keyof AnimalCreationAttributes) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [name]: e.target.checked }));
    };

  // ---------- Submit ----------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!authState.token) throw new Error("No shelter token found");
      await createAnimal(form, authState.token);
      setMessage("Animal added successfully!");
      setForm({
        species: "Dog",
        name: "",
        age: 0,
        ageUnit: "Years",
        health: "Good",
        size: "Medium",
        activityLevel: "Medium",
        goodWithKids: false,
        goodWithPets: false,
        description: "",
        pictureUrl: "",
      });
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to add animal");
    } finally {
      setLoading(false);
    }
  };

  // ---------- JSX ----------
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 500,
        mx: "auto",
      }}
    >
      {/* Species */}
      <FormControl fullWidth>
        <InputLabel>Species</InputLabel>
        <Select
          name="species"
          value={form.species}
          onChange={handleSelectChange}
          label="Species"
        >
          <MenuItem value="Dog">Dog</MenuItem>
          <MenuItem value="Cat">Cat</MenuItem>
          <MenuItem value="Rabbit">Rabbit</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      {/* Name */}
      <TextField
        label="Name"
        name="name"
        value={form.name}
        onChange={handleInputChange}
        required
        fullWidth
      />

      {/* Age */}
      <TextField
        label="Age"
        name="age"
        type="number"
        value={form.age}
        onChange={handleInputChange}
        inputProps={{ min: 0 }}
        required
        fullWidth
      />

      {/* Age Unit */}
      <FormControl fullWidth>
        <InputLabel>Age Unit</InputLabel>
        <Select
          name="ageUnit"
          value={form.ageUnit}
          onChange={handleSelectChange}
          label="Age Unit"
        >
          <MenuItem value="Years">Years</MenuItem>
          <MenuItem value="Months">Months</MenuItem>
        </Select>
      </FormControl>

      {/* Health */}
      <FormControl fullWidth>
        <InputLabel>Health</InputLabel>
        <Select
          name="health"
          value={form.health}
          onChange={handleSelectChange}
          label="Health"
        >
          <MenuItem value="Good">Good</MenuItem>
          <MenuItem value="Needs Medication">Needs Medication</MenuItem>
          <MenuItem value="Critical">Critical</MenuItem>
        </Select>
      </FormControl>

      {/* Size */}
      <FormControl fullWidth>
        <InputLabel>Size</InputLabel>
        <Select
          name="size"
          value={form.size}
          onChange={handleSelectChange}
          label="Size"
        >
          <MenuItem value="Small">Small</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Large">Large</MenuItem>
        </Select>
      </FormControl>

      {/* Activity Level */}
      <FormControl fullWidth>
        <InputLabel>Activity Level</InputLabel>
        <Select
          name="activityLevel"
          value={form.activityLevel}
          onChange={handleSelectChange}
          label="Activity Level"
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>
      </FormControl>

      {/* Checkboxes */}
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={form.goodWithKids}
              onChange={handleCheckboxChange("goodWithKids")}
            />
          }
          label="Good with Kids"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.goodWithPets}
              onChange={handleCheckboxChange("goodWithPets")}
            />
          }
          label="Good with Pets"
        />
      </FormGroup>

      {/* Description */}
      <TextField
        label="Description"
        name="description"
        value={form.description || ""}
        onChange={handleInputChange}
        multiline
        minRows={3}
        fullWidth
      />

      {/* Picture URL */}
      <TextField
        label="Picture URL"
        name="pictureUrl"
        value={form.pictureUrl || ""}
        onChange={handleInputChange}
        fullWidth
      />

      {/* Submit */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Animal"}
      </Button>

      {message && (
        <Typography color={message.includes("success") ? "green" : "error"}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default AnimalForm;

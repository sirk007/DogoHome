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
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import type { ShelterProfile } from "../../types/shelter.types";
import type { Animal } from "../../types/animal.types";
import { fetchPublicShelterById } from "../../api/shelter.api";
import { fetchAnimalsByShelterId } from "../../api/animal.api";
import { sendMessageUser } from "../../api/message.api";

const ANIMALS_PER_PAGE = 6;
const categories = ["All", "Dog", "Cat", "Rabbit", "Other"];

// ---------------------------
// MessageForm Component
// ---------------------------
const MessageForm: React.FC<{ shelterId: number; animalId?: number }> = ({
  shelterId,
  animalId,
}) => {
  const [message, setMessage] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    success: boolean;
    msg: string;
  }>({ open: false, success: true, msg: "" });

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      await sendMessageUser({
        receiverId: shelterId,
        content: message,
        animalId,
      });
      setSnackbar({ open: true, success: true, msg: "Message sent!" });
      setMessage("");
    } catch (err: any) {
      console.error(err);
      setSnackbar({
        open: true,
        success: false,
        msg: err.message || "Failed to send message",
      });
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6">Send a message to this shelter</Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.success ? "success" : "error"}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// ---------------------------
// UserShelterView Component
// ---------------------------
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

  const filteredAnimals = useMemo(() => {
    if (selectedCategory === "All") return animals;
    return animals.filter(
      (a) => a.species.toLowerCase() === selectedCategory.toLowerCase(),
    );
  }, [animals, selectedCategory]);

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

      {/* Message Form */}
      <MessageForm shelterId={shelter.id} />

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
            sx={{ display: "flex", alignItems: "center", borderRadius: 2 }}
          >
            <CardMedia
              component="img"
              image={animal.pictureUrl || "/placeholder.jpg"}
              alt={animal.name}
              sx={{ width: 140, height: 120, objectFit: "cover" }}
            />

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

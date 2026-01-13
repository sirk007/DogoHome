import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CardMedia,
} from "@mui/material";

/**
 * ----------------------------
 * AnimalCard Component
 * ----------------------------
 * Displays an individual animal's details in a card format.
 * Optional deletion capability if onDelete callback is provided.
 */
interface AnimalProps {
  id: number;
  animal: string; // Type (Dog, Cat, etc.)
  animalName: string;
  animalAge: string;
  animalHealth: string;
  animalDescription?: string; // Optional description
  picture?: string | null; // Optional image URL
  onDelete?: (id: number) => void; // Callback when delete button is clicked
}

const AnimalCard: React.FC<AnimalProps> = ({
  id,
  animal,
  animalName,
  animalAge,
  animalHealth,
  animalDescription,
  picture,
  onDelete,
}) => {
  // Calls parent's onDelete callback with this animal's id
  const handleDelete = () => onDelete?.(id);

  return (
    <Card sx={{ maxWidth: 280 }}>
      {/* ------------------- Picture ------------------- */}
      {picture && (
        <CardMedia
          component="img"
          height="140"
          image={picture}
          alt={animalName}
        />
      )}

      {/* ------------------- Animal Details ------------------- */}
      <CardContent>
        <Typography variant="subtitle1">
          {animalName} ({animal})
        </Typography>
        <Typography variant="body2">Age: {animalAge}</Typography>
        <Typography variant="body2">Health: {animalHealth}</Typography>
        {animalDescription && (
          <Typography variant="body2">{animalDescription}</Typography>
        )}
      </CardContent>

      {/* ------------------- Optional Delete Button ------------------- */}
      {onDelete && (
        <CardActions>
          <Button color="error" size="small" onClick={handleDelete}>
            Delete
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default AnimalCard;

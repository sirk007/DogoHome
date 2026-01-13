import React from "react";
import { Card, CardContent, CardActions, Typography, Button, CardMedia } from "@mui/material";

interface AnimalProps {
  id: number;
  animal: string;
  animalName: string;
  animalAge: string;
  animalHealth: string;
  animalDescription?: string;
  picture?: string | null;
  onDelete?: (id: number) => void;
}

const AnimalCard: React.FC<AnimalProps> = ({ id, animal, animalName, animalAge, animalHealth, animalDescription, picture, onDelete }) => {
  const handleDelete = () => onDelete?.(id);

  return (
    <Card sx={{ maxWidth: 280 }}>
      {picture && <CardMedia component="img" height="140" image={picture} alt={animalName} />}
      <CardContent>
        <Typography variant="subtitle1">{animalName} ({animal})</Typography>
        <Typography variant="body2">Age: {animalAge}</Typography>
        <Typography variant="body2">Health: {animalHealth}</Typography>
        {animalDescription && <Typography variant="body2">{animalDescription}</Typography>}
      </CardContent>
      {onDelete && <CardActions><Button color="error" size="small" onClick={handleDelete}>Delete</Button></CardActions>}
    </Card>
  );
};

export default AnimalCard;
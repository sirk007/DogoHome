import React from "react";
import { useNavigate } from "react-router-dom"; // <-- added
import ReportLostPetImg from "../../assets/ReportLostPet.png";
import ReportFoundPetImg from "../../assets/ReportFoundPet.png";
import ReportAnimalSightingImg from "../../assets/ReportAnimalSighting.png";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";

const UserPost: React.FC = () => {
  const navigate = useNavigate(); // <-- added

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflowX: "auto",
      }}
    >
      {/* Main container */}
      <Box
        sx={{
          width: "100%",
          borderRight: "10px solid",
          borderColor: "divider",
          p: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Community Posts
        </Typography>

        <Typography variant="subtitle1" color="text.secondary">
          Have you seen a missing or misplaced animal?
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Post it here to let people in your community know.
        </Typography>

        {/* Cards row */}
        <Box
          sx={{
            display: "flex",
            gap: 4,
            mt: 5,
            justifyContent: "center",
            flexWrap: "wrap", // wrap on small screens
          }}
        >
          {/* Report Lost Pet */}
          <Card
            sx={{
              flex: 1,
              minWidth: 280,
              maxWidth: 350,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardMedia
              component="img"
              image={ReportLostPetImg}
              alt="Lost pet"
              sx={{
                width: "100%",
                height: 180,
                objectFit: "cover",
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom>
                Report Lost Pet
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Create a post to help find your missing pet.
              </Typography>
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/user/create/lost")}
              >
                Create Lost Pet Post
              </Button>
            </Box>
          </Card>

          {/* Report Found Pet */}
          <Card
            sx={{
              flex: 1,
              minWidth: 280,
              maxWidth: 350,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardMedia
              component="img"
              image={ReportFoundPetImg}
              alt="Found pet"
              sx={{
                width: "100%",
                height: 180,
                objectFit: "cover",
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom>
                Report Found Pet
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Create a post about an animal you&apos;ve found.
              </Typography>
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/user/create/found")}
              >
                Create Found Pet Post
              </Button>
            </Box>
          </Card>

          {/* Report Animal Sighting */}
          <Card
            sx={{
              flex: 1,
              minWidth: 280,
              maxWidth: 350,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardMedia
              component="img"
              image={ReportAnimalSightingImg}
              alt="Animal sighting"
              sx={{
                width: "100%",
                height: 180,
                objectFit: "cover",
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom>
                Report Animal Sighting
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Create a post if you&apos;ve spotted an animal that might be
                lost or out of place.
              </Typography>
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button fullWidth variant="contained">
                Create Sighting Post
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default UserPost;

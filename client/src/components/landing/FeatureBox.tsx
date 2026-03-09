import { Box, Typography } from "@mui/material";

interface FeatureBoxProps {
  title: string;
  description: string;
  color?: string;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ title, description }) => {
  return (
    <Box
      sx={{
        flex: {
          xs: "1 1 100%", // phones
          sm: "1 1 calc(50% - 16px)", // tablets
          md: "1 1 calc(33.33% - 16px)", // desktop
        },
        p: 3,
        minHeight: 140,
        color: "white",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>

      <Typography variant="body2">{description}</Typography>
    </Box>
  );
};

export default FeatureBox;

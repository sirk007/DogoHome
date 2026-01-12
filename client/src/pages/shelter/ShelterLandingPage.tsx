import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import { Typography } from '@mui/material';

const ShelterLandingPage: React.FC = () => {
  return (
    <Navbar>
      <Typography variant="h4" gutterBottom>
        Shelter Dashboard
      </Typography>
      <Typography>
        Use the menu to manage animals, add new ones, or update your profile.
      </Typography>
    </Navbar>
  );
};

export default ShelterLandingPage;
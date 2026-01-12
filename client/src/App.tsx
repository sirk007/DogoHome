import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import Footer from './components/footer/Footer';
import { Box } from '@mui/material';
import UserRegistrationPage from './pages/userRegistration/UserRegistration';
import ShelterRegistrationPage from './pages/shelterRegistration/ShelterRegistration';
import LandingPage from './pages/LandingPage/LandingPage';

import UserLandingPage from './pages/user/userLandingPage/UserLandingPage';
import ShelterLandingPage from './pages/shelter/ShelterLandingPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { authState } = useAuthContext();

  return (
    <BrowserRouter>
      {/* Optional: debug auth state */}
      {/* <div style={{ padding: 16 }}>
        <pre>{JSON.stringify(authState, null, 2)}</pre>
      </div>*/}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // full viewport height
        }}
      >
        {/* Main content grows to push footer down */}
        <Box component="main" sx={{ flexGrow: 1 }}>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />


        {/* Registration routes */}
        <Route path="/registration" element={<UserRegistrationPage />} />
        <Route path="/shelter/registration" element={<ShelterRegistrationPage />} />

        {/* Protected user landing page */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <UserLandingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shelter"
              element={
                <ProtectedRoute allowedRoles={['Shelter']}>
                  <ShelterLandingPage />
                </ProtectedRoute>
              }>

            </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      </Box>

        
      </Box>
      {/* Footer always at bottom */}
        <Footer />
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import LoginUser from './pages/userLogin/LoginUser';
import LoginShelter from './pages/shelterLogin/LoginShelter';
import LoginAdmin from './pages/adminLogin/LoginAdmin';

const LandingPage = () => (
  <div style={{ maxWidth: 500, margin: '2rem auto', textAlign: 'center' }}>
    <h1>Welcome to DogoHome</h1>
    <p>Please choose your login type:</p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
      <Link to="/login/user">
        <button>User Login</button>
      </Link>
      <Link to="/login/shelter">
        <button>Shelter Login</button>
      </Link>
      <Link to="/login/admin">
        <button>Admin Login</button>
      </Link>
    </div>
  </div>
);

function App() {
  const { authState } = useAuthContext();

  return (
    <BrowserRouter>
      <div style={{ padding: 16 }}>
        {/* Debug: show current auth state */}
        <pre>{JSON.stringify(authState, null, 2)}</pre>

        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Login routes */}
          <Route path="/login/user" element={<LoginUser />} />
          <Route path="/login/shelter" element={<LoginShelter />} />
          <Route path="/login/admin" element={<LoginAdmin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
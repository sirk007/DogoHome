import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { loginUser } from '../../api/authUser';
import { useNavigate } from 'react-router-dom';

const LoginUser: React.FC = () => {
  const { setAuthState } = useAuthContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await loginUser(username, password);
      console.log('Login response:', res.data);

      sessionStorage.setItem('accessToken', res.data.token);

      setAuthState({
        username: res.data.username,
        id: res.data.id,
        userType: res.data.userType || 'User',
        status: true,
      });

      setError('');
      navigate('/user');
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    setAuthState({ username: '', id: 0, userType: '', status: false });
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
      <h2>User Login</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ padding: '0.5rem', width: '100%' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '0.5rem', width: '100%' }}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handleLogin}
        style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}
      >
        Login
      </button>
      <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
        Logout
      </button>
    </div>
  );
};

export default LoginUser;
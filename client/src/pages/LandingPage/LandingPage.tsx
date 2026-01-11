import React, { useState } from 'react';
import LoginUser from '../userLogin/LoginUser';
import LoginShelter from '../shelterLogin/LoginShelter';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [loginType, setLoginType] = useState<'User' | 'Shelter'>('User');

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', textAlign: 'center' }}>
      <h1>Welcome to DogoHome</h1>

      {/* Toggle Buttons */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setLoginType('User')}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '1rem',
            backgroundColor: loginType === 'User' ? '#007bff' : '#ccc',
            color: loginType === 'User' ? '#fff' : '#000',
          }}
        >
          User Login
        </button>
        <button
          onClick={() => setLoginType('Shelter')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: loginType === 'Shelter' ? '#007bff' : '#ccc',
            color: loginType === 'Shelter' ? '#fff' : '#000',
          }}
        >
          Shelter Login
        </button>
      </div>

      {/* Conditional Rendering of Forms */}
      {loginType === 'User' && <LoginUser />}
      {loginType === 'Shelter' && <LoginShelter />}

      {/* Registration Links */}
      <div style={{ marginTop: '2rem' }}>
        {loginType === 'User' && (
          <p>
            Don't have an account?{' '}
            <Link to="/registration">Register as User</Link>
          </p>
        )}
        {loginType === 'Shelter' && (
          <p>
            Don't have an account?{' '}
            <Link to="/shelter/registration">Register as Shelter</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
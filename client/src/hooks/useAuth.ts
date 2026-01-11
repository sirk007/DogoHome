import { useState, useEffect } from 'react';
import type { AxiosResponse } from 'axios';
import { fetchUserAuth, fetchAdminAuth, fetchShelterAuth } from '../api/auth';
import type { AuthState, UserRole } from '../types/auth';

const isValidUserRole = (role: any): role is UserRole => {
  return role === 'User' || role === 'Admin' || role === 'Shelter' || role === '';
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    username: '',
    id: 0,
    userType: '',
    status: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const tokens = {
        user: sessionStorage.getItem('accessToken'),
        admin: sessionStorage.getItem('adminAccessToken'),
        shelter: sessionStorage.getItem('accessShelterToken'),
      };

      // If no token exists, don't call backend
      if (!tokens.user && !tokens.admin && !tokens.shelter) return;

      try {
        let response: AxiosResponse<any> | undefined;

        if (tokens.user) response = await fetchUserAuth(tokens.user);
        else if (tokens.admin) response = await fetchAdminAuth(tokens.admin);
        else if (tokens.shelter) response = await fetchShelterAuth(tokens.shelter);

        if (!response || response.data?.error) {
          setAuthState(prev => ({ ...prev, status: false }));
          console.warn('Auth check failed:', response?.data?.error);
          return;
        }

        const role = response.data.userType;

        setAuthState({
          username: response.data.username ?? '',
          id: response.data.id ?? 0,
          userType: isValidUserRole(role) ? role : '',
          status: true,
        });
      } catch (err) {
        setAuthState(prev => ({ ...prev, status: false }));
        console.error('Auth check failed', err);
      }
    };

    checkAuth();
  }, []);

  return { authState, setAuthState };
};
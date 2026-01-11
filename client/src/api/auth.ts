import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3002/api', // Adjust the baseURL as needed
});

// --- User Login ---
export const loginUser = (username: string, password: string) => 
  API.post('/users/login', { username, password });

// --- Shelter Login ---
export const loginShelter = (username: string, password: string) =>
  API.post('/shelters/login', { username, password });

// --- Admin Login ---
export const loginAdmin = (username: string, password: string) =>
  API.post('/admins/login', { username, password });

export const fetchUserAuth = async (token: string) => 
    API.get('/users/auth', {
        headers: { accessToken: token }
});

export const fetchShelterAuth = async (token: string) => 
    API.get('/shelters/authShelter', {
        headers: { accessShelterToken: token }
    });

export const fetchAdminAuth = async (token: string) => 
    API.get('/admins/authAdmin', {
        headers: { accessAdminToken: token }
    });
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3002/api/users' });

// --- User Login ---
export const loginUser = (username: string, password: string) =>
  API.post('/login', { username, password });

// --- User Registration ---
export const registerUser = (username: string, password: string) =>
  API.post('/register', { username, password });

// --- Fetch Authenticated User ---
export const fetchUserAuth = (token: string) =>
  API.get('/auth', { headers: { accessToken: token } });
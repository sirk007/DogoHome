import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3002/api/shelters' });

// --- Shelter Login ---
export const loginShelter = (username: string, password: string) =>
  API.post('/login', { username, password });

// --- Shelter Registration ---
export const registerShelter = (username: string, password: string) =>
  API.post('/register', { username, password });

// --- Fetch Authenticated Shelter ---
export const fetchShelterAuth = (token: string) =>
  API.get('/authShelter', { headers: { accessShelterToken: token } });
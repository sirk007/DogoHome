import axios from 'axios';

/**
 * --------------------------------------------
 * Axios instance for Shelter API
 * --------------------------------------------
 * Creates a pre-configured Axios instance with the base URL
 * pointing to the shelters API endpoint.
 *
 * Why:
 * - Centralizes API configuration for all shelter-related requests
 * - Easy to switch endpoints for production or staging environments
 */
const API = axios.create({ baseURL: 'http://localhost:3002/api/shelters' });

/**
 * --------------------------------------------
 * loginShelter
 * --------------------------------------------
 * Sends a POST request to authenticate a shelter account.
 *
 * Parameters:
 * - username: string -> shelter's login username
 * - password: string -> shelter's login password
 *
 * Returns:
 * - Axios response containing:
 *   - JWT token for session management
 *   - shelter info (username, id, role)
 *
 * Why:
 * - Centralized login function for shelters
 * - Used in login forms to obtain a session token
 */
export const loginShelter = (username: string, password: string) =>
  API.post('/login', { username, password });

/**
 * --------------------------------------------
 * registerShelter
 * --------------------------------------------
 * Sends a POST request to create a new shelter account.
 *
 * Parameters:
 * - username: string -> desired username
 * - password: string -> desired password
 *
 * Returns:
 * - Axios response with newly created shelter data
 *
 * Why:
 * - Provides a safe, centralized way to register new shelters
 * - Keeps front-end logic clean and separated from API calls
 */
export const registerShelter = (username: string, password: string) =>
  API.post('/register', { username, password });

/**
 * --------------------------------------------
 * fetchShelterAuth
 * --------------------------------------------
 * Sends a GET request to verify the shelter's token and fetch its info.
 *
 * Parameters:
 * - token: string -> JWT stored in sessionStorage
 *
 * Returns:
 * - Axios response containing shelter data if token is valid
 * - Error if token is invalid or expired
 *
 * Why:
 * - Ensures front-end only treats a shelter as authenticated if backend verifies token
 * - Used in useAuth hook to maintain persistent login across refreshes
 * - Supports role-based access control for shelter-specific routes
 */
export const fetchShelterAuth = (token: string) =>
  API.get('/authShelter', { headers: { accessShelterToken: token } });
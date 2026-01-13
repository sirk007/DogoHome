import axios from 'axios';

/**
 * --------------------------------------------
 * Axios instance for User API
 * --------------------------------------------
 * Creates a pre-configured Axios instance with the base URL
 * pointing to the users API endpoint.
 *
 * Why:
 * - Centralizes the API base URL so all user requests use the same configuration
 * - Makes it easier to modify the base URL later (e.g., production vs. development)
 */
const API = axios.create({ baseURL: 'http://localhost:3002/api/users' });

/**
 * --------------------------------------------
 * loginUser
 * --------------------------------------------
 * Sends a POST request to the backend to authenticate a user.
 *
 * Parameters:
 * - username: string -> the user's login username
 * - password: string -> the user's password
 *
 * Returns:
 * - Axios response containing:
 *   - token (JWT)
 *   - user info (username, id, role)
 *
 * Why:
 * - Centralized function for user login
 * - Can be used in login forms to authenticate and obtain a session token
 */
export const loginUser = (username: string, password: string) =>
  API.post('/login', { username, password });

/**
 * --------------------------------------------
 * registerUser
 * --------------------------------------------
 * Sends a POST request to the backend to create a new user account.
 *
 * Parameters:
 * - username: string -> desired username for new account
 * - password: string -> desired password for new account
 *
 * Returns:
 * - Axios response with newly created user info
 *
 * Why:
 * - Centralizes user registration API calls
 * - Allows front-end forms to create new users safely
 */
export const registerUser = (username: string, password: string) =>
  API.post('/register', { username, password });

/**
 * --------------------------------------------
 * fetchUserAuth
 * --------------------------------------------
 * Sends a GET request to verify the user's token and fetch current user info.
 *
 * Parameters:
 * - token: string -> JWT stored in sessionStorage
 *
 * Returns:
 * - Axios response with user data if token is valid
 * - Error if token is invalid or expired
 *
 * Why:
 * - Used in useAuth hook to verify that a session token is valid
 * - Ensures that the front-end never trusts local/session storage blindly
 * - Supports persistent login after page refresh
 */
export const fetchUserAuth = (token: string) =>
  API.get('/auth', { headers: { accessToken: token } });
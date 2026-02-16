/**
 * --------------------------------------------
 * Axios instance for User API
 * --------------------------------------------
 * Pre-configured Axios instance with the base URL pointing
 * to the user API endpoint.
 *
 * Benefits:
 * - Centralizes the API base URL for all user requests
 * - Makes it easy to switch between development and production URLs
 */

import axios from "axios";
import type {
  UserCreationAttributes,
  UserLoginResponse,
} from "../types/user.types";

const API = axios.create({ baseURL: "http://localhost:3002/api/users" });

/**
 * --------------------------------------------
 * loginUser
 * --------------------------------------------
 * Authenticates a user with the backend.
 *
 * Parameters:
 * - username: string -> the user's login username
 * - password: string -> the user's password
 *
 * Returns:
 * - Promise<UserLoginResponse> -> object containing:
 *   - token (JWT)
 *   - user info (username, id, role)
 *
 * Notes:
 * - Throws an error if login fails (invalid credentials)
 * - Centralized for use in login forms
 */

export const loginUser = (
  username: string,
  password: string,
): Promise<UserLoginResponse> =>
  API.post("/login", { username, password }).then((res) => res.data);

/**
 * --------------------------------------------
 * registerUser
 * --------------------------------------------
 * Creates a new user account.
 *
 * Parameters:
 * - userData: UserCreationAttributes -> object containing all user registration info
 *
 * Returns:
 * - Axios promise -> response containing the newly created user info
 *
 * Notes:
 * - Handles front-end registration forms
 * - Any server validation errors will be thrown as Axios errors
 */
export const registerUser = (
  userData: UserCreationAttributes,
): Promise<UserLoginResponse> =>
  API.post("/register", userData).then((res) => res.data);

/**
 * --------------------------------------------
 * fetchUserAuth
 * --------------------------------------------
 * Verifies the user's JWT token and fetches current user info.
 *
 * Parameters:
 * - token: string -> JWT stored in sessionStorage
 *
 * Returns:
 * - Promise<UserLoginResponse> -> user data if token is valid
 * - Throws error if token is invalid/expired
 *
 * Notes:
 * - Used in auth hooks to maintain persistent login
 * - Front-end should never trust token without verification
 */
export const fetchUserAuth = (token: string) =>
  API.get<UserLoginResponse>("/auth", {
    headers: { accessToken: token },
  }).then((res) => res.data);

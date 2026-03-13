/**
 * ==============================
 * user.api.ts
 * ------------------------------
 * API layer for all user-related backend interactions.
 *
 * Responsibilities:
 * 1. Login users
 * 2. Register new users
 * 3. Verify JWT & fetch authenticated user
 *
 * Benefits:
 * - Centralizes API calls for user management
 * - Provides consistent error handling
 * - Simplifies integration with front-end forms/hooks
 * ==============================
 */

import axios from "axios";
import type {
  UserCreationAttributes,
  UserLoginResponse,
} from "../types/user.types";

/**
 * ============================================
 * AXIOS INSTANCE
 * --------------------------------------------
 * Pre-configured Axios instance pointing to the user API.
 * Adjust `baseURL` for dev vs production environments.
 * ============================================
 */
const API = axios.create({ baseURL: "http://localhost:3002/api/users" });

/**
 * ============================================
 * loginUser
 * --------------------------------------------
 * Authenticate a user with username & password.
 *
 * Parameters:
 * - username: string -> user's login username
 * - password: string -> user's password
 *
 * Returns:
 * - Promise<UserLoginResponse> -> JWT token + user info
 *
 * Notes:
 * - Throws Axios error if credentials are invalid
 * - Centralized for use in login forms or auth hooks
 * ============================================
 */

export const loginUser = (
  email: string,
  password: string,
): Promise<UserLoginResponse> =>
  API.post("/login", { email, password }).then((res) => res.data);

/**
 * ============================================
 * registerUser
 * --------------------------------------------
 * Register a new user account.
 *
 * Parameters:
 * - userData: UserCreationAttributes -> full registration info
 *
 * Returns:
 * - Promise<UserLoginResponse> -> token + newly created user info
 *
 * Notes:
 * - Handles front-end registration forms
 * - Any server validation errors will propagate as Axios errors
 * ============================================
 */
export const registerUser = (
  userData: UserCreationAttributes,
): Promise<UserLoginResponse> =>
  API.post("/register", userData).then((res) => res.data);

/**
 * ============================================
 * fetchUserAuth
 * --------------------------------------------
 * Verify a JWT token and retrieve current user info.
 *
 * Parameters:
 * - token: string -> JWT stored in front-end (local/session storage)
 *
 * Returns:
 * - Promise<UserLoginResponse> -> user info if token is valid
 *
 * Notes:
 * - Used in auth hooks to maintain persistent login
 * - Always validate token server-side before trusting user data
 * ============================================
 */
export const fetchUserAuth = (token: string) =>
  API.get<UserLoginResponse>("/auth", {
    headers: { accessToken: token },
  }).then((res) => res.data);

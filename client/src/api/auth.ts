/**
 * ==============================
 * login.api.ts
 * ------------------------------
 * Centralized API layer for login & authentication endpoints.
 *
 * Responsibilities:
 * 1. Login users, shelters, and admins
 * 2. Verify JWT and fetch authenticated profiles
 *
 * Benefits:
 * - Consolidates all login/auth requests in one place
 * - Simplifies front-end integration
 * - Provides clear separation of access tokens per role
 * ==============================
 */
import axios from "axios";

/**
 * ============================================
 * AXIOS INSTANCE
 * --------------------------------------------
 * Pre-configured Axios instance for all login/auth calls.
 * Adjust `baseURL` for development vs production environments.
 * ============================================
 */
const API = axios.create({
  baseURL: "http://localhost:3002/api", // Adjust the baseURL as needed
});

/**
 * ============================================
 * loginUser
 * --------------------------------------------
 * Authenticate a regular user with username & password.
 *
 * Parameters:
 * - username: string
 * - password: string
 *
 * Returns:
 * - Promise -> Axios response containing user info + JWT token
 *
 * Notes:
 * - Throws Axios error if credentials are invalid
 * - Use in login forms/hooks for users
 * ============================================
 */
export const loginUser = (username: string, password: string) =>
  API.post("/users/login", { username, password });

/**
 * ============================================
 * loginShelter
 * --------------------------------------------
 * Authenticate a shelter with username & password.
 *
 * Parameters:
 * - username: string
 * - password: string
 *
 * Returns:
 * - Promise -> Axios response containing shelter info + JWT token
 *
 * Notes:
 * - Throws Axios error if credentials are invalid
 * - Use in shelter login forms/hooks
 * ============================================
 */
export const loginShelter = (username: string, password: string) =>
  API.post("/shelters/login", { username, password });

/**
 * ============================================
 * loginAdmin
 * --------------------------------------------
 * Authenticate an admin with username & password.
 *
 * Parameters:
 * - username: string
 * - password: string
 *
 * Returns:
 * - Promise -> Axios response containing admin info + JWT token
 *
 * Notes:
 * - Throws Axios error if credentials are invalid
 * - Use in admin login forms/hooks
 * ============================================
 */
export const loginAdmin = (username: string, password: string) =>
  API.post("/admins/login", { username, password });

/**
 * ============================================
 * fetchUserAuth
 * --------------------------------------------
 * Verify a user's JWT and fetch authenticated user profile.
 *
 * Parameters:
 * - token: string -> JWT stored in front-end
 *
 * Returns:
 * - Promise -> Axios response containing user profile
 *
 * Notes:
 * - Use in auth hooks to maintain persistent login
 * - Always validate token server-side
 * ============================================
 */
export const fetchUserAuth = async (token: string) =>
  API.get("/users/auth", {
    headers: { accessToken: token },
  });

/**
 * ============================================
 * fetchShelterAuth
 * --------------------------------------------
 * Verify a shelter's JWT and fetch authenticated shelter profile.
 *
 * Parameters:
 * - token: string -> JWT stored in front-end
 *
 * Returns:
 * - Promise -> Axios response containing shelter profile
 *
 * Notes:
 * - Use in shelter auth hooks for persistent login
 * ============================================
 */
export const fetchShelterAuth = async (token: string) =>
  API.get("/shelters/authShelter", {
    headers: { accessShelterToken: token },
  });

/**
 * ============================================
 * fetchAdminAuth
 * --------------------------------------------
 * Verify an admin's JWT and fetch authenticated admin profile.
 *
 * Parameters:
 * - token: string -> JWT stored in front-end
 *
 * Returns:
 * - Promise -> Axios response containing admin profile
 *
 * Notes:
 * - Use in admin auth hooks for persistent login
 * ============================================
 */
export const fetchAdminAuth = async (token: string) =>
  API.get("/admins/authAdmin", {
    headers: { accessAdminToken: token },
  });

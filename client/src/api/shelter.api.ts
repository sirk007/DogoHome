/**
 * ==============================
 * shelter.api.ts
 * ------------------------------
 * API layer for all shelter-related backend interactions.
 *
 * Responsibilities:
 * 1. Login shelters
 * 2. Register new shelters
 * 3. Fetch shelter profiles (public & authenticated)
 *
 * Benefits:
 * - Centralizes API calls for shelter management
 * - Simplifies integration with front-end forms/hooks
 * - Provides consistent error handling
 * ==============================
 */
import axios from "axios";
import type {
  ShelterProfile,
  ShelterCreationAttributes,
  ShelterLoginResponse,
} from "../types/shelter.types";

/**
 * ============================================
 * AXIOS INSTANCE
 * --------------------------------------------
 * Pre-configured Axios instance pointing to the shelter API.
 * Adjust `baseURL` for dev vs production environments.
 * ============================================
 */
const API = axios.create({ baseURL: "http://localhost:3002/api/shelters" });

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
 * - Promise<ShelterLoginResponse> -> JWT + shelter info
 *
 * Notes:
 * - Throws Axios error if credentials are invalid
 * - Centralized for login forms/hooks
 * ============================================
 */
export const loginShelter = (
  email: string,
  password: string,
): Promise<ShelterLoginResponse> =>
  API.post("/login", { email, password }).then((res) => res.data);

/**
 * ============================================
 * registerShelter
 * --------------------------------------------
 * Register a new shelter account.
 *
 * Parameters:
 * - shelterData: ShelterCreationAttributes
 *
 * Returns:
 * - Promise<ShelterLoginResponse> -> token + newly created shelter
 *
 * Notes:
 * - Handles front-end registration forms
 * - Validation errors propagate as Axios errors
 * ============================================
 */
export const registerShelter = (
  shelterData: ShelterCreationAttributes,
): Promise<ShelterLoginResponse> =>
  API.post("/register", shelterData).then((res) => res.data);

/**
 * ============================================
 * fetchPublicShelterById
 * --------------------------------------------
 * Fetches public profile of a shelter by ID.
 *
 * Parameters:
 * - id: number
 *
 * Returns:
 * - Promise<ShelterProfile>
 *
 * Notes:
 * - Publicly accessible info (does not require auth token)
 * ============================================
 */
export const fetchPublicShelterById = (id: number): Promise<ShelterProfile> =>
  API.get(`/public/${id}`).then((res) => res.data);

/**
 * ============================================
 * fetchShelterProfile
 * --------------------------------------------
 * Verify JWT and fetch authenticated shelter info.
 *
 * Parameters:
 * - token: string -> JWT stored in front-end
 *
 * Returns:
 * - Promise<ShelterProfile>
 *
 * Notes:
 * - Used in auth hooks for persistent login
 * - Always validate token server-side
 * ============================================
 */

export const fetchShelterProfile = (token: string): Promise<ShelterProfile> =>
  API.get("/profile", {
    headers: { accessShelterToken: token },
  }).then((res) => res.data);

/**
 * ============================================
 * fetchPublicShelters
 * --------------------------------------------
 * Fetch all public shelters, optionally filtered by county.
 *
 * Parameters:
 * - countyId?: number -> optional county filter
 *
 * Returns:
 * - Promise<ShelterProfile[]>
 *
 * Notes:
 * - Public endpoint; no auth required
 * - Useful for lists/maps in front-end
 * ============================================
 */
export const fetchPublicShelters = (
  countyId?: number,
): Promise<ShelterProfile[]> =>
  API.get("/public", {
    params: countyId ? { countyId } : undefined,
  }).then((res) => res.data);

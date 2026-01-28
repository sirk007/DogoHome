/**
 * --------------------------------------------
 * Axios instance for Shelter API
 * --------------------------------------------
 * Pre-configured Axios instance with the base URL pointing
 * to the user API endpoint.
 *
 * Benefits:
 * - Centralizes the API base URL for all shelter requests
 * - Makes it easy to switch between development and production URLs
 */

import axios from "axios";
import type {
  ShelterProfile,
  ShelterCreationAttributes,
  ShelterLoginResponse,
} from "../types/shelter.types";

const API = axios.create({ baseURL: "http://localhost:3002/api/shelters" });

/**
 * --------------------------------------------
 * loginShelter
 * --------------------------------------------
 * Authenticates a shelter with the backend.
 *
 * Parameters:
 * - username: string -> the shelter's login username
 * - password: string -> the shelter's password
 *
 * Returns:
 * - Promise<ShelterLoginResponse> -> object containing:
 *   - token (JWT)
 *   - shelter info (username, id, role)
 *
 * Notes:
 * - Throws an error if login fails (invalid credentials)
 * - Centralized for use in login forms
 */
export const loginShelter = (
  username: string,
  password: string,
): Promise<ShelterLoginResponse> =>
  API.post("/login", { username, password }).then((res) => res.data);

/**
 * --------------------------------------------
 * registerShelter
 * --------------------------------------------
 * Creates a new shelter account.
 *
 * Parameters:
 * - shelterData: ShelterCreationAttributes -> object containing all shelter registration info
 *
 * Returns:
 * - Axios promise -> response containing the newly created shelter info
 *
 * Notes:
 * - Handles front-end registration forms
 * - Any server validation errors will be thrown as Axios errors
 */
export const registerShelter = (
  shelterData: ShelterCreationAttributes,
): Promise<ShelterLoginResponse> =>
  API.post("/register", shelterData).then((res) => res.data);

/**
 * --------------------------------------------
 * fetchShelterAuth
 * --------------------------------------------
 * Verifies the shelter's JWT token and fetches current shelter info.
 *
 * Parameters:
 * - token: string -> JWT stored in sessionStorage
 *
 * Returns:
 * - Promise<ShelterLoginResponse> -> shelter data if token is valid
 * - Throws error if token is invalid/expired
 *
 * Notes:
 * - Used in auth hooks to maintain persistent login
 * - Front-end should never trust token without verification
 */

export const fetchShelterProfile = (token: string): Promise<ShelterProfile> =>
  API.get("/profile", {
    headers: { accessShelterToken: token },
  }).then((res) => res.data);

// --------------------------------------------
// fetchPublicShelters (PUBLIC)
// --------------------------------------------
// Fetches all shelters, optionally filtered by county
export const fetchPublicShelters = (
  countyId?: number,
): Promise<ShelterProfile[]> =>
  API.get("/public", {
    params: countyId ? { countyId } : undefined,
  }).then((res) => res.data);

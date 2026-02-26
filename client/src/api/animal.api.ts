/**
 * ==============================
 * animal.api.ts
 * ------------------------------
 * Centralized API layer for all animal-related requests.
 *
 * Responsibilities:
 * 1. Shelter-protected CRUD operations
 * 2. Public animal fetching
 *
 * Benefits:
 * - Centralizes all animal API calls
 * - Simplifies integration with front-end forms/hooks
 * - Provides consistent access control via shelter JWT
 * ==============================
 */
import axios from "axios";
import type {
  Animal,
  AnimalCreationAttributes,
  AnimalUpdateAttributes,
} from "../types/animal.types";

/**
 * ============================================
 * AXIOS INSTANCE
 * --------------------------------------------
 * Pre-configured Axios instance pointing to animal API.
 * Adjust `baseURL` for dev vs production environments.
 * ============================================
 */
const API = axios.create({
  baseURL: "http://localhost:3002/api/animals",
});

/**
 * ============================================
 * HELPERS
 * --------------------------------------------
 * Headers for shelter-protected routes.
 * Injects shelter JWT token for authorization.
 * ============================================
 */
const shelterAuthHeader = (token: string) => ({
  headers: { accessShelterToken: token },
});

/**
 * ============================================
 * SHELTER-PROTECTED ROUTES
 * --------------------------------------------
 * Routes that require shelter authentication (JWT).
 * Used for CRUD operations on animals by the owning shelter.
 * ============================================
 */

/**
 * Create a new animal (Shelter only)
 *
 * Parameters:
 * - animalData: AnimalCreationAttributes
 * - token: string -> shelter JWT
 *
 * Returns:
 * - Promise<Animal> -> newly created animal
 */
export const createAnimal = (
  animalData: AnimalCreationAttributes,
  token: string,
): Promise<Animal> =>
  API.post("/", animalData, shelterAuthHeader(token)).then((res) => res.data);

/**
 * Fetch all animals for the authenticated shelter
 *
 * Parameters:
 * - token: string -> shelter JWT
 *
 * Returns:
 * - Promise<Animal[]> -> array of animals owned by the shelter
 */
export const fetchMyAnimals = (token: string): Promise<Animal[]> =>
  API.get("/mine", shelterAuthHeader(token)).then((res) => res.data);

/**
 * Update an existing animal (Shelter only)
 *
 * Parameters:
 * - animalId: number
 * - updates: AnimalUpdateAttributes
 * - token: string -> shelter JWT
 *
 * Returns:
 * - Promise<{ message: string; animal: Animal }>
 */
export const updateAnimal = (
  animalId: number,
  updates: AnimalUpdateAttributes,
  token: string,
): Promise<{ message: string; animal: Animal }> =>
  API.put(`/${animalId}`, updates, shelterAuthHeader(token)).then(
    (res) => res.data,
  );

/**
 * Delete an animal (Shelter only)
 *
 * Parameters:
 * - animalId: number
 * - token: string -> shelter JWT
 *
 * Returns:
 * - Promise<{ message: string }>
 */
export const deleteAnimal = (
  animalId: number,
  token: string,
): Promise<{ message: string }> =>
  API.delete(`/${animalId}`, shelterAuthHeader(token)).then((res) => res.data);

/**
 * ============================================
 * PUBLIC ROUTES
 * --------------------------------------------
 * Routes accessible without authentication.
 * Used for fetching animal data publicly.
 * ============================================
 */

/**
 * Fetch all animals for a given shelter (Public)
 *
 * Parameters:
 * - shelterId: number
 *
 * Returns:
 * - Promise<Animal[]> -> array of animals for the shelter
 */
export const fetchAnimalsByShelterId = (shelterId: number): Promise<Animal[]> =>
  API.get(`/byShelterId/${shelterId}`).then((res) => res.data);

/**
 * Fetch a single animal by ID (Public)
 *
 * Parameters:
 * - id: number
 *
 * Returns:
 * - Promise<Animal> -> single animal object
 */
export const fetchAnimalById = (id: number): Promise<Animal> =>
  API.get(`/byId/${id}`).then((res) => res.data);

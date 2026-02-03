/**
 * --------------------------------------------
 * Axios instance for Animal API
 * --------------------------------------------
 * Centralized API layer for all animal-related requests
 * Handles:
 * - Public animal fetching
 * - Shelter-protected CRUD operations
 */

import axios from "axios";
import type {
  Animal,
  AnimalCreationAttributes,
  AnimalUpdateAttributes,
} from "../types/animal.types";

const API = axios.create({
  baseURL: "http://localhost:3002/api/animals",
});

// --------------------------------------------
// HELPERS
// --------------------------------------------
const shelterAuthHeader = (token: string) => ({
  headers: { accessShelterToken: token },
});

// --------------------------------------------
// SHELTER-PROTECTED ROUTES
// --------------------------------------------

/**
 * Create a new animal (Shelter only)
 */
export const createAnimal = (
  animalData: AnimalCreationAttributes,
  token: string,
): Promise<Animal> =>
  API.post("/", animalData, shelterAuthHeader(token)).then((res) => res.data);

/**
 * Fetch all animals for the authenticated shelter
 */
export const fetchMyAnimals = (token: string): Promise<Animal[]> =>
  API.get("/mine", shelterAuthHeader(token)).then((res) => res.data);

/**
 * Update an existing animal (Shelter only)
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
 */
export const deleteAnimal = (
  animalId: number,
  token: string,
): Promise<{ message: string }> =>
  API.delete(`/${animalId}`, shelterAuthHeader(token)).then((res) => res.data);

// --------------------------------------------
// PUBLIC ROUTES
// --------------------------------------------

/**
 * Fetch all animals for a given shelter (Public)
 */
export const fetchAnimalsByShelterId = (shelterId: number): Promise<Animal[]> =>
  API.get(`/byShelterId/${shelterId}`).then((res) => res.data);

/**
 * Fetch a single animal by ID (Public)
 */
export const fetchAnimalById = (id: number): Promise<Animal> =>
  API.get(`/byId/${id}`).then((res) => res.data);

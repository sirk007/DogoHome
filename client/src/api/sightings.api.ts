/**
 * ==============================
 * sighting.api.ts
 * ------------------------------
 * Centralized API layer for all sighting-related requests.
 *
 * Responsibilities:
 * 1. Fetch all sightings or filter by type
 * 2. Create new sightings
 * 3. Fetch a single sighting by ID
 *
 * Benefits:
 * - Consolidates all sighting API calls
 * - Simplifies front-end integration
 * - Provides consistent data structures for sightings
 * ==============================
 */
import axios from "axios";
import type {
  SightingBase,
  SightingCreationAttributes,
} from "../types/sighting.types";

/**
 * ============================================
 * AXIOS INSTANCE
 * --------------------------------------------
 * Pre-configured Axios instance pointing to sighting API.
 * Adjust `baseURL` for dev vs production environments.
 * ============================================
 */
const API = axios.create({ baseURL: "http://localhost:3002/api/sightings" });

/**
 * ============================================
 * fetchAllSightings
 * --------------------------------------------
 * Fetch all sightings from the backend.
 *
 * Returns:
 * - Promise<SightingBase[]> -> array of all sightings
 *
 * Notes:
 * - Public endpoint; no authentication required
 * ============================================
 */
export const fetchAllSightings = (): Promise<SightingBase[]> =>
  API.get("/").then((res) => res.data);

/**
 * ============================================
 * fetchSightingsByType
 * --------------------------------------------
 * Fetch sightings filtered by type.
 *
 * Parameters:
 * - type: "Lost" | "Found" | "Sighting" -> type filter
 *
 * Returns:
 * - Promise<SightingBase[]> -> array of sightings matching type
 *
 * Notes:
 * - Public endpoint; no authentication required
 * ============================================
 */
export const fetchSightingsByType = (
  type: "Lost" | "Found" | "Sighting",
): Promise<SightingBase[]> =>
  API.get("/", { params: { type } }).then((res) => res.data);

/**
 * ============================================
 * createSighting
 * --------------------------------------------
 * Create a new sighting report.
 *
 * Parameters:
 * - sighting: SightingCreationAttributes -> data for the new sighting
 *
 * Returns:
 * - Promise<SightingBase> -> newly created sighting
 *
 * Notes:
 * - Can be called by any user reporting a sighting
 * ============================================
 */
export const createSighting = (
  sighting: SightingCreationAttributes,
): Promise<SightingBase> => API.post("/", sighting).then((res) => res.data);

/**
 * ============================================
 * fetchSightingById
 * --------------------------------------------
 * Fetch a single sighting by its ID.
 *
 * Parameters:
 * - id: number -> unique identifier of the sighting
 *
 * Returns:
 * - Promise<SightingBase> -> sighting object
 *
 * Notes:
 * - Public endpoint; no authentication required
 * ============================================
 */
export const fetchSightingById = (id: number): Promise<SightingBase> =>
  API.get(`/${id}`).then((res) => res.data);

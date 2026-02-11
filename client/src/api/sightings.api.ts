import axios from "axios";
import type {
  SightingBase,
  SightingCreationAttributes,
} from "../types/sighting.types";

const API = axios.create({ baseURL: "http://localhost:3002/api/sightings" });

export const fetchAllSightings = (): Promise<SightingBase[]> =>
  API.get("/").then((res) => res.data);

export const fetchSightingsByType = (
  type: "Lost" | "Found" | "Sighting",
): Promise<SightingBase[]> =>
  API.get("/", { params: { type } }).then((res) => res.data);

export const createSighting = (
  sighting: SightingCreationAttributes,
): Promise<SightingBase> => API.post("/", sighting).then((res) => res.data);

export const fetchSightingById = (id: number): Promise<SightingBase> =>
  API.get(`/${id}`).then((res) => res.data);

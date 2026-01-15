import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3002/api/admins" });

// --- Admin Login ---
export const loginAdmin = (username: string, password: string) =>
  API.post("/login", { username, password });

// --- Fetch Authenticated Admin ---
export const fetchAdminAuth = (token: string) =>
  API.get("/authAdmin", { headers: { accessAdminToken: token } });

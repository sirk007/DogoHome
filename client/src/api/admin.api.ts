/**
 * ==============================
 * admin.api.ts
 * ------------------------------
 * API layer for admin-related backend interactions.
 *
 * Responsibilities:
 * 1. Login admins
 * 2. Verify JWT & fetch authenticated admin info
 *
 * Benefits:
 * - Centralizes API calls for admin management
 * - Simplifies integration with front-end admin forms/hooks
 * - Provides consistent error handling
 * ==============================
 */

import type { AdminCreationAttributes } from "@models/admin.types";
import type { AdminLoginResponse } from "@models/admin.types";
import axios from "axios";

/**
 * ============================================
 * AXIOS INSTANCE
 * --------------------------------------------
 * Pre-configured Axios instance pointing to the admin API.
 * Adjust `baseURL` for dev vs production environments.
 * ============================================
 */
const API = axios.create({ baseURL: "http://localhost:3002/api/admins" });

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
 * - Promise -> Axios response with admin info + JWT token
 *
 * Notes:
 * - Throws Axios error if credentials are invalid
 * - Centralized for admin login forms/hooks
 * ============================================
 */
export const loginAdmin = (username: string, password: string) =>
  API.post("/login", { username, password });

/**
 * ============================================
 * registerAdmin
 * --------------------------------------------
 * Register a new admin account.
 *
 * Parameters:
 * - adminData: AdminCreationAttributes
 *
 * Returns:
 * - Promise<AdminLoginResponse> -> token + newly created admin
 *
 * Notes:
 * - Handles front-end registration forms
 * - Validation errors propagate as Axios errors
 * ============================================
 */
export const registerAdmin = (
  adminData: AdminCreationAttributes,
): Promise<AdminLoginResponse> =>
  API.post("/register", adminData).then((res) => res.data);

/**
 * ============================================
 * fetchAdminAuth
 * --------------------------------------------
 * Verify JWT and fetch authenticated admin info.
 *
 * Parameters:
 * - token: string -> JWT stored in front-end
 *
 * Returns:
 * - Promise -> Axios response with admin info
 *
 * Notes:
 * - Used in admin auth hooks for persistent login
 * - Always validate token server-side
 * ============================================
 */
export const fetchAdminAuth = (token: string) =>
  API.get("/authAdmin", { headers: { accessAdminToken: token } });

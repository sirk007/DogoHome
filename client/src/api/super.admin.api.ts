/**
 * ==============================
 * super.admin.api.ts
 * ------------------------------
 * API layer for super admin-related backend interactions.
 *
 * Responsibilities:
 * 1. Login super admins
 * 2. Verify JWT & fetch authenticated super admin info
 *
 * Benefits:
 * - Centralizes API calls for super admin management
 * - Simplifies integration with front-end super admin forms/hooks
 * - Provides consistent error handling
 * ==============================
 */

import type { SuperAdminCreationAttributes } from "@models/super.admin.types";
import type { SuperAdminLoginResponse } from "@models/super.admin.types";
import axios from "axios";

/**
 * ============================================
 * AXIOS INSTANCE
 * --------------------------------------------
 * Pre-configured Axios instance pointing to the super admin API.
 * Adjust `baseURL` for dev vs production environments.
 * ============================================
 */
const API = axios.create({ baseURL: "http://localhost:3002/api/super-admins" });

/**
 * ============================================
 * loginSuperAdmin
 * --------------------------------------------
 * Authenticate a super admin with email & password.
 *
 * Parameters:
 * - email: string
 * - password: string
 *
 * Returns:
 * - Promise -> Axios response with super admin info + JWT token
 *
 * Notes:
 * - Throws Axios error if credentials are invalid
 * - Centralized for super admin login forms/hooks
 * ===========================================
 */

export const loginSuperAdmin = (email: string, password: string) =>
  API.post("/login", { email, password });

/**
 * ============================================
 * registerSuperAdmin
 * --------------------------------------------
 * Register a new super admin account.
 *
 * Parameters:
 * - superAdminData: SuperAdminCreationAttributes
 *
 * Returns:
 * - Promise -> Axios response with new super admin info
 *
 * Notes:
 * - Handles front-end registration forms
 * - Validation error propagates as Axios error
 * ===========================================
 */
export const registerSuperAdmin = (
  superAdminData: SuperAdminCreationAttributes,
): Promise<SuperAdminLoginResponse> =>
  API.post("/register", superAdminData).then((res) => res.data);

/**
 * ============================================
 * fetchSuperAdminAuth
 * --------------------------------------------
 * Verify JWT and fetch authenticated super admin info.
 *
 * Parameters:
 * - token: string -> JWT stored in front-end
 *
 * Returns:
 * - Promise -> Axios response with super admin info
 *
 * Notes:
 * - Used in AuthContext to maintain super admin session
 * - Always validate token server-side for security
 * ===========================================
 */
export const fetchSuperAdminAuth = (token: string) =>
  API.get("/auth", { headers: { accessSuperAdminToken: token } });

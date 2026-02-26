/**
 * ==============================
 * post.api.ts
 * ------------------------------
 * Centralized API layer for all post-related requests.
 *
 * Responsibilities:
 * 1. Create new posts
 * 2. Fetch posts (all or filtered by type)
 * 3. Fetch a single post by ID
 *
 * Notes:
 * - Requires user JWT stored in sessionStorage for all routes
 * - Returns structured data including likedPosts where applicable
 * ==============================
 */
import axios from "axios";
import type { Post } from "../types/post.types";

/**
 * ============================================
 * AXIOS INSTANCE
 * --------------------------------------------
 * Pre-configured Axios instance pointing to post API.
 * Adjust `baseURL` for dev vs production environments.
 * ============================================
 */
const API = axios.create({
  baseURL: "http://localhost:3002/api/posts",
});

/**
 * ============================================
 * createPost
 * --------------------------------------------
 * Create a new post (User only).
 *
 * Parameters:
 * - data: any -> post payload (title, description, type, coordinates)
 *
 * Returns:
 * - Promise<Post> -> newly created post
 *
 * Notes:
 * - Requires JWT stored in sessionStorage under "accessToken"
 * - Throws Axios error if creation fails
 * ============================================
 */
export const createPost = async (data: any): Promise<Post> => {
  const token = sessionStorage.getItem("accessToken");

  const res = await API.post("/", data, {
    headers: { accessToken: token || "" },
  });

  return res.data;
};

/**
 * ============================================
 * fetchPosts
 * --------------------------------------------
 * Fetch all posts, optionally filtered by type.
 *
 * Parameters:
 * - type?: string -> optional filter (e.g., "FOUND" or "LOST")
 *
 * Returns:
 * - Promise<{ listOfPosts: Post[], likedPosts: number[] }>
 *
 * Notes:
 * - Requires JWT in sessionStorage
 * - Returns liked posts separately for front-end use
 * ============================================
 */
export const fetchPosts = async (type?: string) => {
  const token = sessionStorage.getItem("accessToken");

  const res = await API.get("/", {
    params: type ? { type } : {},
    headers: { accessToken: token || "" },
  });

  return res.data; // returns { listOfPosts, likedPosts }
};

/**
 * ============================================
 * fetchPostById
 * --------------------------------------------
 * Fetch a single post by ID.
 *
 * Parameters:
 * - id: number -> unique post identifier
 *
 * Returns:
 * - Promise<Post> -> post object
 *
 * Notes:
 * - Requires JWT in sessionStorage
 * - Throws Axios error if post not found
 * ============================================
 */
export const fetchPostById = async (id: number): Promise<Post> => {
  const token = sessionStorage.getItem("accessToken");
  const res = await API.get(`/${id}`, {
    headers: { accessToken: token || "" },
  });
  return res.data;
};

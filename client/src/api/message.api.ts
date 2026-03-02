/**
 * ==============================
 * message.api.ts
 * ------------------------------
 * Centralized API layer for message-related requests.
 *
 * Responsibilities:
 * - Send a message from User to Shelter
 * - Fetch conversations between User and Shelter
 *
 * Notes:
 * - Requires JWT stored in sessionStorage under "userToken"
 * ==============================
 */
import axios from "axios";
import type {
  MessageCreationAttributes,
  Message,
} from "../types/message.types";

/**
 * ============================================
 * AXIOS INSTANCE
 * --------------------------------------------
 * Pre-configured Axios instance pointing to message API.
 * ============================================
 */
const API = axios.create({
  baseURL: "http://localhost:3002/api/messages",
});

/**
 * ============================================
 * sendMessageUser
 * --------------------------------------------
 * Send a message from User to a Shelter
 *
 * Parameters:
 * - data: { receiverId: number; content: string; animalId?: number }
 *
 * Returns:
 * - Promise<Message> -> the newly created message
 *
 * Notes:
 * - Requires JWT stored in sessionStorage under "userToken"
 * - Throws error if user not authenticated or request fails
 * ============================================
 */
export const sendMessageUser = async (
  data: MessageCreationAttributes,
): Promise<Message> => {
  // Use sessionStorage (not localStorage) and match your server middleware
  const token = sessionStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  const res = await API.post("/user/send", data, {
    headers: { accessToken: token }, // matches your validateUserToken middleware
  });

  return res.data;
};

/**
 * ============================================
 * fetchUserConversation
 * --------------------------------------------
 * Fetch conversation between current user and another user/shelter
 *
 * Parameters:
 * - otherId: number -> ID of other participant
 * - animalId?: number -> optional filter by animal
 *
 * Returns:
 * - Promise<Message[]> -> array of messages sorted by createdAt
 *
 * Notes:
 * - Requires JWT stored in sessionStorage
 * ============================================
 */
export const fetchUserConversation = async (
  otherId: number,
  animalId?: number,
): Promise<Message[]> => {
  const token = sessionStorage.getItem("userToken");
  if (!token) throw new Error("User not authenticated");

  const res = await API.get("/user/conversation", {
    params: { otherId, animalId },
    headers: { accessToken: token },
  });

  return res.data;
};

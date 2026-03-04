/**
 * ==============================
 * message.api.ts
 * ------------------------------
 * Centralized API layer for message-related requests.
 *
 * Responsibilities:
 * - Send a message from User to Shelter
 * - Send a message from Shelter to User
 * - Fetch conversations between User and Shelter
 *
 * Notes:
 * - Requires JWT stored in sessionStorage under "accessToken"
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
 * USER API
 * ============================================
 */

/**
 * Send a message from User to a Shelter
 */
export const sendMessageUser = async (
  data: MessageCreationAttributes,
): Promise<Message> => {
  const token = sessionStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  const res = await API.post("/user/send", data, {
    headers: { accessToken: token },
  });

  return res.data;
};

/**
 * Fetch conversation for the User
 */
export const fetchUserConversation = async (
  otherId: number,
  animalId?: number,
): Promise<Message[]> => {
  const token = sessionStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  const res = await API.get("/user/conversation", {
    params: { otherId, animalId },
    headers: { accessToken: token },
  });

  return res.data;
};

export const fetchUserConversationsList = async (): Promise<
  { userId: number; lastMessage: string }[]
> => {
  const token = sessionStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  const res = await API.get("/user/conversations", {
    headers: { accessToken: token },
  });

  return res.data;
};

/**
 * ============================================
 * SHELTER API
 * ============================================
 */

/**
 * Send a message from Shelter to a User
 */
export const sendMessageShelter = async (
  data: MessageCreationAttributes,
): Promise<Message> => {
  const token = sessionStorage.getItem("accessShelterToken");
  if (!token) throw new Error("Shelter not authenticated");

  const res = await API.post("/shelter/send", data, {
    headers: { accessShelterToken: token },
  });

  return res.data;
};

export const fetchShelterConversationsList = async (): Promise<
  { userId: number; lastMessage: string }[]
> => {
  const token = sessionStorage.getItem("accessShelterToken");
  if (!token) throw new Error("Shelter not authenticated");

  const res = await API.get("/shelter/conversations", {
    headers: { accessShelterToken: token },
  });

  return res.data;
};

/**
 * Fetch conversation for the Shelter
 */
export const fetchShelterConversation = async (
  otherId: number,
  animalId?: number,
): Promise<Message[]> => {
  const token = sessionStorage.getItem("accessShelterToken");
  if (!token) throw new Error("Shelter not authenticated");

  const res = await API.get("/shelter/conversation", {
    params: { otherId, animalId },
    headers: { accessShelterToken: token },
  });

  return res.data;
};

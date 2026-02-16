import axios from "axios";
import type { Post } from "../types/post.types";

const API = axios.create({
  baseURL: "http://localhost:3002/api/posts",
});

export const createPost = async (data: any): Promise<Post> => {
  const token = sessionStorage.getItem("accessToken");

  const res = await API.post("/", data, {
    headers: { accessToken: token || "" },
  });

  return res.data;
};

export const fetchPosts = async (type?: string): Promise<Post[]> => {
  const token = sessionStorage.getItem("accessToken");
  const res = await API.get("/", {
    params: type ? { type } : {},
    headers: { accessToken: token || "" },
  });
  return res.data;
};

export const fetchPostById = async (id: number): Promise<Post> => {
  const token = sessionStorage.getItem("accessToken");
  const res = await API.get(`/${id}`, {
    headers: { accessToken: token || "" },
  });
  return res.data;
};

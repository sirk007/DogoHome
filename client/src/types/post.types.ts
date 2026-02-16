export type PostType = "LOST" | "FOUND" | "SIGHTING";

export interface Post {
  id: number;
  title: string;
  postText: string;
  picture?: string | null;
  userId: number;
  type: PostType;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostCreationAttributes {
  title: string;
  postText: string;
  type: PostType;
  latitude?: number;
  longitude?: number;
  picture?: File | null;
}

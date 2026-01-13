import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3002/api/animals" });

// Create a new animal
export const createAnimal = (data: any, token: string) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null)
      formData.append(key, value as any);
  });
  return API.post("/", formData, {
    headers: {
      accessShelterToken: token,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get animals for current shelter
export const fetchShelterAnimals = (token: string) =>
  API.get("/mine", { headers: { accessShelterToken: token } });

// Delete animal
export const deleteAnimal = (id: number, token: string) =>
  API.delete(`/${id}`, { headers: { accessShelterToken: token } });

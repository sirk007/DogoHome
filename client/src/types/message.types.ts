// types/message.types.ts

export interface Message {
  id: number;
  senderId: number; // User or Shelter who sent the message
  receiverId: number; // User or Shelter who receives the message
  animalId?: number | null; // Optional: message tied to a specific animal
  content: string;
  readStatus: boolean; // false = unread, true = read
  createdAt: string;
  updatedAt: string;
}

// For creating/sending a message
export interface MessageCreationAttributes {
  receiverId: number;
  content: string;
  animalId?: number;
}

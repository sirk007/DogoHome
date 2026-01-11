export type UserRole = "" | "User" | "Admin" | "Shelter";


export interface AuthState {
  username: string;
  id: number;
  userType: UserRole;
  status: boolean;
}
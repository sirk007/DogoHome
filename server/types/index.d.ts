import { UserAttributes } from "../../models/Users.model";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        userType: string;
      };
      shelter?: {
        id: number;
        username: string;
        userType: string;
      };
    }
  }
}
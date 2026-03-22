// ----------------------------------------------
// ----------------   IMPORTS   -----------------
// ----------------------------------------------
// Express Router for defining route endpoints
// bcrypt for password hashing
// JWT signing for authentication
// dotenv for loading environment variables from .env
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

// ----------------------------------------------
// Database models (Sequelize instance)
// ----------------------------------------------
// db is the Sequelize instance that contains all models
// Importing Users model from db for CRUD operations
import db from "../models";

// Middleware to protect routes
// validateUserToken checks JWT and sets req.user if valid
// validateAdminToken ensures the user is an admin before allowing access
import { AuthRequest, validateUserToken } from "../middleware/user.middleware";
import { validateAdminToken } from "../middleware/admin.middleware";

// Enum imports
import {
  ACTIVITY_LEVELS,
  PET_EXPERIENCE_LEVELS,
  DOG_SIZES,
} from "../models/enums/user.enums";
import type {
  ActivityLevel,
  PetExperienceLevel,
  DogSize,
} from "../models/enums/user.enums";

// ----------------------------------------------
// -------------  CONFIG/SETUP    ---------------
// ----------------------------------------------
// Load environment variables from .env into process.env
dotenv.config();

// Create a new router instance
const router = Router();

// Secret key for signing JWTs for user authentication
// Fallback string is only for development if env variable is missing
const JWT_SECRET = process.env.USER_JWT_SECRET || "fallbackSecret"; // fallback for dev

// Destructure the Users model from the Sequelize instance
// Users model will be used to query/create/update/delete users
const { User } = db;

/**
 * Backend type for login response
 */
interface UserLoginResponse {
  id: number;
  email: string;
  userType: "User";
  token: string;
}

/**
 * Request body type for user registration
 */
interface RegisterBody {
  username: string;
  password: string;
  email: string;
  age: number;
  countyId?: number;
  activityLevel: ActivityLevel;
  hasGarden?: boolean;
  hasOtherPets?: boolean;
  hasKids?: boolean;
  petExperienceLevel: PetExperienceLevel;
  maxDogSize: DogSize;
  preferredEnergyLevel?: ActivityLevel;
  preferredAgeRangeMin?: number;
  preferredAgeRangeMax?: number;
}

/**
 * Request body type for user update (Partial updates allowed)
 */
interface UpdateBody {
  password?: string;
  email?: string;
  age?: number;
  countyId?: number;
  activityLevel?: ActivityLevel;
  hasGarden?: boolean;
  hasOtherPets?: boolean;
  hasKids?: boolean;
  petExperienceLevel?: PetExperienceLevel;
  maxDogSize?: DogSize;
  preferredEnergyLevel?: ActivityLevel;
  preferredAgeRangeMin?: number;
  preferredAgeRangeMax?: number;
}

/**
 * Type for update data object (Matches UpdateBody)
 */
interface UpdateData {
  password?: string;
  email?: string;
  age?: number;
  countyId?: number;
  activityLevel?: ActivityLevel;
  hasGarden?: boolean;
  hasOtherPets?: boolean;
  hasKids?: boolean;
  petExperienceLevel?: PetExperienceLevel;
  maxDogSize?: DogSize;
  preferredEnergyLevel?: ActivityLevel;
  preferredAgeRangeMin?: number;
  preferredAgeRangeMax?: number;
}

// ----------------------------------------------
// ----------------   ROUTES   -----------------
// ----------------------------------------------

// ---------------------------
// CREATE A NEW USER (Public)
// ---------------------------
// Route: POST /register
// Access: Public
// Middleware: None
// Description: Creates a new user with hashed password
router.post("/register", async (req: Request, res: Response) => {
  const {
    username,
    password,
    email,
    age,
    countyId,
    activityLevel,
    hasGarden = false,
    hasOtherPets = false,
    hasKids = false,
    petExperienceLevel,
    maxDogSize,
    preferredEnergyLevel,
    preferredAgeRangeMin,
    preferredAgeRangeMax,
  } = req.body as RegisterBody;
  try {
    // Validation / Hygiene
    if (!username || typeof username !== "string" || username.length > 50) {
      return res.status(400).json({ error: "Invalid username" });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Password too short" });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (typeof age !== "number" || age < 0 || age > 120) {
      return res.status(400).json({ error: "Invalid age" });
    }
    if (
      countyId !== undefined &&
      (typeof countyId !== "number" || countyId < 0)
    ) {
      return res.status(400).json({ error: "Invalid county ID" });
    }
    if (!ACTIVITY_LEVELS.includes(activityLevel)) {
      return res.status(400).json({ error: "Invalid activity level" });
    }
    if (!PET_EXPERIENCE_LEVELS.includes(petExperienceLevel)) {
      return res.status(400).json({ error: "Invalid pet experience level" });
    }
    if (!DOG_SIZES.includes(maxDogSize)) {
      return res.status(400).json({ error: "Invalid max dog size" });
    }
    if (
      preferredEnergyLevel &&
      !ACTIVITY_LEVELS.includes(preferredEnergyLevel)
    ) {
      return res.status(400).json({ error: "Invalid preferred energy level" });
    }
    // Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hash the password with bcrypt before saving
    // Salt rounds = 10 (moderate security, reasonable speed)
    const hash = await bcrypt.hash(password, 10);

    // Store the new user in the database
    // Password stored is hashed, never store plain text
    await User.create({
      username,
      password: hash,
      email,
      age,
      countyId,
      activityLevel,
      hasGarden,
      hasOtherPets,
      hasKids,
      petExperienceLevel,
      maxDogSize,
      preferredEnergyLevel: preferredEnergyLevel,
      preferredAgeRangeMin: preferredAgeRangeMin,
      preferredAgeRangeMax: preferredAgeRangeMax,
    });
    // Respond with a success message (JSON)
    res.json({ message: "User created successfully!" });
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------
// USER LOGIN (Public)
// ---------------------------
// Route: POST /login
// Access: Public
// Middleware: None
// Description: Authenticates user and returns JWT token
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Search for user by email in the database
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare submitted password with stored hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    // Destructure user info for JWT payload
    const { id, userType } = user;

    // Sign a JWT token that encodes id, username, and userType
    // Token expires in 1 hour
    const accessToken = sign({ id, email, userType }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Response with backend type
    const loginResponse: UserLoginResponse = {
      id,
      email,
      userType, // TS will ensure this is "User"
      token: accessToken,
    };

    // Respond with JWT and basic user info
    // Client can store token for authenticated requests
    res.json(loginResponse);
  } catch (error) {
    // Handle DB or unexpected errors
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------
// GET AUTHENTICATED USER INFO (Protected)
// ---------------------------
// Route: GET /auth
// Access: Protected (User only)
// Middleware: validateUserToken
// Description: Returns info for the currently authenticated user
router.get("/auth", validateUserToken, (req: AuthRequest, res: Response) => {
  // validateUserToken sets req.user from decoded JWT
  // Return only non-sensitive user info
  res.json({
    id: req.user!.id,
    email: req.user!.email,
    userType: req.user!.userType,
  });
});

// ---------------------------
// GET BASIC INFO OF USER BY ID (Public)
// ---------------------------
// Route: GET /basicinfo/:id
// Access: Public
// Middleware: None
// Description: Returns user info excluding password
router.get("/basicinfo/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Find user by primary key (id)
    const user = await User.findByPk(id, {
      // Exclude password field from the returned object
      attributes: { exclude: ["password"] },
    });

    // Return 404 if the requested user does not exist in the database
    if (!user) return res.status(404).json({ error: "User not found" });

    // Respond with user data
    res.json(user);
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------
// GET ALL USERS (Admin Only)
// ---------------------------
// Route: GET /
// Access: Protected (Admin only)
// Middleware: validateAdminToken
// Description: Returns all users excluding passwords
router.get("/", validateAdminToken, async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      where: { userType: "User" },
      attributes: { exclude: ["password"] },
    });

    // Return the list of users
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------
// UPDATE AUTHENTICATED USER (Self)
// ---------------------------
// Route: PUT /me
// Access: Protected (User only)
// Middleware: validateUserToken
// Description:
//  - Allows a user to update their own profile/preferences
//  - Partial updates supported
router.put(
  "/me",
  validateUserToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id; // decoded JWT sets req.user
      const {
        email,
        password,
        age,
        countyId,
        activityLevel,
        hasGarden,
        hasOtherPets,
        hasKids,
        petExperienceLevel,
        maxDogSize,
        preferredEnergyLevel,
        preferredAgeRangeMin,
        preferredAgeRangeMax,
      } = req.body as UpdateBody;

      const updateData: UpdateData = {};

      // ---------------------------
      // Validation (Only if provided)
      // ---------------------------
      if (email !== undefined) {
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          return res.status(400).json({ error: "Invalid email" });
        }
        updateData.email = email;
      }

      if (password !== undefined) {
        if (typeof password !== "string" || password.length < 6) {
          return res.status(400).json({ error: "Password too short" });
        }
        updateData.password = await bcrypt.hash(password, 10);
      }

      if (age !== undefined) {
        if (typeof age !== "number" || age < 0 || age > 120) {
          return res.status(400).json({ error: "Invalid age" });
        }
        updateData.age = age;
      }

      if (countyId !== undefined) {
        if (typeof countyId !== "number" || countyId < 0) {
          return res.status(400).json({ error: "Invalid county ID" });
        }
        updateData.countyId = countyId;
      }

      if (activityLevel !== undefined) {
        if (!ACTIVITY_LEVELS.includes(activityLevel)) {
          return res.status(400).json({ error: "Invalid activity level" });
        }
        updateData.activityLevel = activityLevel;
      }

      if (petExperienceLevel !== undefined) {
        if (!PET_EXPERIENCE_LEVELS.includes(petExperienceLevel)) {
          return res
            .status(400)
            .json({ error: "Invalid pet experience level" });
        }
        updateData.petExperienceLevel = petExperienceLevel;
      }

      if (maxDogSize !== undefined) {
        if (!DOG_SIZES.includes(maxDogSize)) {
          return res.status(400).json({ error: "Invalid max dog size" });
        }
        updateData.maxDogSize = maxDogSize;
      }

      if (preferredEnergyLevel !== undefined) {
        if (
          preferredEnergyLevel !== null &&
          !ACTIVITY_LEVELS.includes(preferredEnergyLevel)
        ) {
          return res
            .status(400)
            .json({ error: "Invalid preferred energy level" });
        }
        updateData.preferredEnergyLevel = preferredEnergyLevel;
      }

      if (preferredAgeRangeMin !== undefined)
        updateData.preferredAgeRangeMin = preferredAgeRangeMin;
      if (preferredAgeRangeMax !== undefined)
        updateData.preferredAgeRangeMax = preferredAgeRangeMax;

      if (hasGarden !== undefined) updateData.hasGarden = hasGarden;
      if (hasOtherPets !== undefined) updateData.hasOtherPets = hasOtherPets;
      if (hasKids !== undefined) updateData.hasKids = hasKids;

      // ---------------------------
      // Perform update
      // ---------------------------
      await User.update(updateData, { where: { id: userId } });

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// ---------------------------
// DELETE USER BY ID (Admin Only)
// ---------------------------
// Route: DELETE /:id
// Access: Protected (Admin only)
// Middleware: validateAdminToken
// Description: Deletes a user by ID
router.delete(
  "/:id",
  validateAdminToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // Destroy user record
      await User.destroy({ where: { id } });

      // Confirm deletion
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;

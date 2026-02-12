// ----------------------------------------------
// ----------------   IMPORTS   -----------------
// ----------------------------------------------
// Express Router to define endpoints
// bcrypt to hash passwords securely
// jsonwebtoken to generate JWTs for authentication
// dotenv to load environment variables from .env
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

// ----------------------------------------------
// Database models (Sequelize instance)
// ----------------------------------------------
// db is the Sequelize instance that contains all models
// Importing Shelters model from db for CRUD operations
import db from "../models";

// Middleware to protect routes
// validateShelterToken ensures the request has a valid shelter JWT
// validateAdminToken ensures only admins can access certain endpoints
import { validateShelterToken } from "../middleware/shelter.middleware";
import { validateAdminToken } from "../middleware/admin.middleware";

// ----------------------------------------------
// -------------  CONFIG/SETUP    ---------------
// ----------------------------------------------
// Load environment variables from .env into process.env
dotenv.config();

// Create a new Express router instance
const router = Router();

// Destructure the Shelter model from the Sequelize instance
// Shelter model will be used to query/create/update/delete shelters
const { Shelter } = db;

// Secret key for signing JWTs for shelter authentication
// Fallback string is only for development if env variable is missing
const JWT_SECRET = process.env.SHELTER_JWT_SECRET || "fallbackSecret";

const MAX_USERNAME_LENGTH = 50;
const MIN_PASSWORD_LENGTH = 6;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

// Backend type for login response
interface ShelterLoginResponse {
  id: number;
  username: string;
  userType: "Shelter";
  token: string; // JWT
}

// ----------------------------------------------
// ---------------- SHELTER ROUTES -------------
// ----------------------------------------------

// ---------------------------
// CREATE A NEW SHELTER
// ---------------------------
// Route: POST /
// Access: Public
// Middleware: None
// Description: Creates a new shelter account with hashed password
router.post("/register", async (req: Request, res: Response) => {
  const {
    username,
    password,
    email,
    shelterName,
    countyId,
    address,
    phoneNumber,
  } = req.body;
  try {
    // Validation / Hygiene
    if (
      !username ||
      typeof username !== "string" ||
      username.length > MAX_USERNAME_LENGTH
    ) {
      return res.status(400).json({ error: "Invalid username" });
    }

    if (
      !password ||
      typeof password !== "string" ||
      password.length < MIN_PASSWORD_LENGTH
    ) {
      return res.status(400).json({ error: "Password too short" });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (!shelterName || typeof shelterName !== "string") {
      return res.status(400).json({ error: "Invalid shelter name" });
    }

    if (typeof countyId !== "number" || countyId <= 0) {
      return res.status(400).json({ error: "Invalid county ID" });
    }

    if (!address || typeof address !== "string") {
      return res.status(400).json({ error: "Invalid address" });
    }

    if (!phoneNumber || !PHONE_REGEX.test(phoneNumber)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    // Hash the password with bcrypt before saving
    // Salt rounds = 10 (moderate security, reasonable speed)
    const hash = await bcrypt.hash(password, 10);

    // Store the new Shelter in the database
    // Password stored is hashed, never store plain text
    const shelter = await Shelter.create({
      username,
      password: hash,
      email,
      shelterName,
      countyId, // numeric ID linking to county
      address,
      phoneNumber,
    });

    // Respond with a success message (JSON)
    res.json({ message: "Shelter created successfully!" });
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error creating shelter:", error);
    res.status(500).json({ error: "Failed to create shelter" });
  }
});

// ---------------------------
// SHELTER LOGIN
// ---------------------------
// Route: POST /login
// Access: Public
// Middleware: None
// Description: Authenticates a shelter and returns JWT
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    // Search for Shelter by username in the database
    const shelter = await Shelter.findOne({ where: { username } });
    if (!shelter) return res.status(404).json({ error: "Shelter not found" });

    // Compare submitted password with stored hashed password
    const match = await bcrypt.compare(password, shelter.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    // Destructure shelter info for JWT payload
    const { id, username: uname, userType } = shelter.get();

    // Sign a JWT token that encodes id, username, and userType
    // Token expires in 1 hour
    const accessShelterToken = sign(
      { id, username: uname, userType },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    //Build response object
    const loginResponse: ShelterLoginResponse = {
      id,
      username,
      userType,
      token: accessShelterToken,
    };

    // Respond with JWT and basic Shelters info
    // Client can store token for authenticated requests
    res.json(loginResponse);
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error during shelter login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------
// GET PUBLIC SHELTER BY ID
// ---------------------------
// Route: GET /public/:id
// Access: Public
// Description:
//   - Returns a single shelter for public viewing
//   - Used for UserShelterView page
router.get("/public/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const shelter = await Shelter.findByPk(id, {
      attributes: [
        "id",
        "shelterName",
        "countyId",
        "address",
        "email",
        "phoneNumber",
      ],
    });

    if (!shelter) {
      return res.status(404).json({ error: "Shelter not found" });
    }

    res.json(shelter);
  } catch (err) {
    console.error("Error fetching shelter:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------
// GET AUTHENTICATED SHELTER INFO
// ---------------------------
// Route: GET /authShelter
// Access: Protected (Shelter only)
// Middleware: validateShelterToken
// Description: Returns info for the currently authenticated shelter
router.get(
  "/authShelter",
  validateShelterToken,
  async (req: Request, res: Response) => {
    // validateShelterToken sets req.shelter from decoded JWT
    // Here we just return it
    res.json(req.shelter);
  },
);

// ---------------------------
// GET AUTHENTICATED SHELTER PROFILE (Self)
// ---------------------------
// Route: GET /profile
// Access: Protected (Shelter Only)
// Description:
//   - Returns the full profile of the currently authenticated shelter
//   - Shelter ID is derived from the JWT (not from request params)
//   - Excludes sensitive fields such as password
router.get(
  "/profile",
  validateShelterToken,
  async (req: any, res: Response) => {
    try {
      const shelterId = req.shelter.id;

      const shelter = await Shelter.findByPk(shelterId, {
        attributes: { exclude: ["password"] },
      });

      if (!shelter) return res.status(404).json({ error: "Shelter not found" });

      res.json(shelter);
    } catch (err) {
      console.error("Error fetching shelter profile:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// ---------------------------
// GET PUBLIC SHELTERS (DISCOVERY / SEARCH)
// ---------------------------
// Route: GET /public
// Access: Public
// Middleware: None
// Description:
//   - Returns a list of shelters for public discovery
//   - Can optionally be filtered by county via query parameter (?countyId=)
//   - Intended for maps, browsing, and general user search
//   - Only exposes public-facing shelter information
router.get("/public", async (req: Request, res: Response) => {
  const { countyId } = req.query;

  try {
    const where = countyId ? { countyId: Number(countyId) } : {};

    const shelters = await Shelter.findAll({
      where,
      attributes: [
        "id",
        "shelterName",
        "countyId",
        "address",
        "email",
        "phoneNumber",
      ],
    });

    res.json(shelters);
  } catch (err) {
    console.error("Error fetching public shelters:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------
// UPDATE AUTHENTICATED SHELTER (Self)
// ---------------------------
// Route: PUT /me
// Access: Protected (Shelter only)
// Middleware: validateShelterToken
// Description:
//  - Allows a shelter to update its own profile
//  - Partial updates supported (only fields provided will be changed)
router.put(
  "/me",
  validateShelterToken,
  async (req: Request | any, res: Response) => {
    try {
      const shelterId = req.shelter.id; // Decoded JWT sets req.shelter

      const {
        username,
        password,
        email,
        shelterName,
        countyId,
        address,
        phoneNumber,
      } = req.body;

      const updateData: any = {};

      // ---------------------------
      // Validation (Only if provided)
      // ---------------------------
      if (username !== undefined) {
        if (
          typeof username !== "string" ||
          username.length > MAX_USERNAME_LENGTH
        ) {
          return res.status(400).json({ error: "Invalid username" });
        }
        updateData.username = username;
      }

      if (password !== undefined) {
        if (
          typeof password !== "string" ||
          password.length < MIN_PASSWORD_LENGTH
        ) {
          return res.status(400).json({ error: "Password too short" });
        }
        updateData.password = await bcrypt.hash(password, 10);
      }

      if (email !== undefined) {
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          return res.status(400).json({ error: "Invalid email" });
        }
        updateData.email = email;
      }

      if (shelterName !== undefined) {
        if (typeof shelterName !== "string" || shelterName.trim() === "") {
          return res.status(400).json({ error: "Invalid shelter name" });
        }
        updateData.shelterName = shelterName;
      }

      if (countyId !== undefined) {
        if (typeof countyId !== "number" || countyId <= 0) {
          return res.status(400).json({ error: "Invalid county ID" });
        }
        updateData.countyId = countyId;
      }

      if (address !== undefined) {
        if (typeof address !== "string" || address.trim() === "") {
          return res.status(400).json({ error: "Invalid address" });
        }
        updateData.address = address;
      }

      if (phoneNumber !== undefined) {
        if (!PHONE_REGEX.test(phoneNumber)) {
          return res.status(400).json({ error: "Invalid phone number" });
        }
        updateData.phoneNumber = phoneNumber;
      }

      // ---------------------------
      // Perform update
      // ---------------------------
      await Shelter.update(updateData, { where: { id: shelterId } });

      res.json({ message: "Shelter profile updated successfully" });
    } catch (error) {
      console.error("Error updating shelter:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// ---------------------------
// DELETE SHELTER (ADMIN ONLY)
// ---------------------------
// Route: DELETE /:id
// Access: Protected (Admin only)
// Middleware: validateAdminToken
// Description: Deletes a shelter record by ID
router.delete(
  "/:id",
  validateAdminToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      // Delete the shelter from the DB
      await Shelter.destroy({ where: { id } });

      // Confirm deletion
      res.json({ message: "Shelter deleted successfully" });
    } catch (err) {
      // Log any error and respond with generic 500
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;

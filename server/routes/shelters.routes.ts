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
router.post("/", async (req: Request, res: Response) => {
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
      }
    );
    // Respond with JWT and basic Shelters info
    // Client can store token for authenticated requests
    res.json({ token: accessShelterToken, username: uname, id, userType });
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error during shelter login:", error);
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
  }
);

// ---------------------------
// GET BASIC SHELTER INFO BY ID
// ---------------------------
// Route: GET /basicinfo/:id
// Access: Public
// Middleware: None
// Description: Returns shelter info excluding password
router.get("/basicinfo/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Find Shelter by primary key (id)
    const shelter = await Shelter.findByPk(id, {
      // Exclude password field from the returned object
      attributes: { exclude: ["password"] },
    });
    // Return 404 if the requested shelter does not exist in the database
    if (!shelter) return res.status(404).json({ error: "Shelter not found" });
    // Respond with shelter data
    res.json(shelter);
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error fetching shelter info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
  }
);

export default router;

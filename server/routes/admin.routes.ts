// ----------------------------------------------
// ----------------   IMPORTS   -----------------
// ----------------------------------------------
// Express Router for defining route endpoints
// bcrypt for password hashing
// jsonwebtoken for JWT authentication
// dotenv for loading environment variables from .env
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

// ----------------------------------------------
// Database models (Sequelize instance)
// ----------------------------------------------
// db is the Sequelize instance that contains all models
// Importing Admins model from db for CRUD operations
import db from "../models";

// Middleware to protect routes
// validateAdminToken ensures only admins can access certain endpoints
import {
  validateAdminToken,
  AdminAuthRequest,
} from "../middleware/admin.middleware";
import { validateSuperAdminToken } from "../middleware/super.admin.middleware";
// ----------------------------------------------
// -------------  CONFIG/SETUP    ---------------
// ----------------------------------------------
// Load environment variables from .env into process.env
dotenv.config();

// Create a new Express router instance
const router = Router();

// Destructure the Admins model from the Sequelize instance
// Admin model will be used to query/create/update/delete admin
const { Admin } = db;

// Secret key for signing JWTs for Admin authentication
// Fallback string is only for development if env variable is missing
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "fallbackSecret";

// Backend type for login response
interface AdminLoginResponse {
  id: number;
  username: string;
  email: string;
  userType: "Admin";
  token: string; // JWT
}

// ----------------------------------------------
// ---------------- ADMIN ROUTES ---------------
// ----------------------------------------------

// ---------------------------
// CREATE A NEW ADMIN
// ---------------------------
// Route: POST /register
// Access: Protected (Super Admin only)
// Middleware: validateSuperAdminToken
// Description: Creates a new admin account with hashed password
router.post(
  "/register",
  validateSuperAdminToken,
  async (req: Request, res: Response) => {
    const { username, password, email } = req.body;
    try {
      if (!username || typeof username !== "string" || username.length > 50) {
        return res.status(400).json({ error: "Invalid username" });
      }

      if (!password || typeof password !== "string" || password.length < 8) {
        return res.status(400).json({ error: "Password too short" });
      }

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email" });
      }

      // Check if email already exists
      const existingAdmin = await Admin.findOne({ where: { email } });
      if (existingAdmin) {
        return res.status(409).json({ error: "Email already in use" });
      }

      // Get the Super Admin's ID from the validated token
      const createdBySuperAdminId = req.superAdmin!.id;

      // Hash the password with bcrypt before saving
      // Salt rounds = 10 (moderate security, reasonable speed)
      const hash = await bcrypt.hash(password, 10);

      // Store the new Admin in the database
      // Password stored is hashed, never store plain text
      await Admin.create({
        username,
        password: hash,
        email,
        createdBySuperAdminId,
      });

      // Respond with a success message (JSON)
      res.json({ message: "Admin created successfully!" });
    } catch (error) {
      // Log any error and respond with generic 500
      console.error("Error creating admin:", error);
      res.status(500).json({ error: "Failed to create admin" });
    }
  },
);

// ---------------------------
// ADMIN LOGIN
// ---------------------------
// Route: POST /login
// Access: Public
// Middleware: None
// Description: Authenticates an admin and returns a JWT token
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Search for Admin by email in the database
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    // Compare submitted password with stored hashed password
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    // Destructure Admin info for JWT payload
    const { id, username, userType } = admin;

    // Sign a JWT token that encodes id, email, and userType
    // Token expires in 1 hour
    const accessAdminToken = sign({ id, email, userType }, JWT_SECRET, {
      expiresIn: "1h",
    });

    //Build response object
    const loginResponse: AdminLoginResponse = {
      id,
      username,
      email,
      userType,
      token: accessAdminToken,
    };
    // Respond with JWT and basic user info
    // Client can store token for authenticated requests
    res.json(loginResponse);
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error during admin login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------
// GET AUTHENTICATED ADMIN INFO
// ---------------------------
// Route: GET /authAdmin
// Access: Protected (Admin only)
// Middleware: validateAdminToken
// Description: Returns info for the currently authenticated admin
router.get(
  "/authAdmin",
  validateAdminToken,
  async (req: Request, res: Response) => {
    // validateAdminToken sets req.admin from decoded JWT
    // Here we just return it
    res.json(req.admin);
  },
);

// ---------------------------
// GET BASIC ADMIN INFO BY ID
// ---------------------------
// Route: GET /basicinfo/:id
// Access: Protected (Admin only)
// Middleware: validateAdminToken
// Description: Returns info for a specific admin excluding password
router.get(
  "/basicinfo/:id",
  validateAdminToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      // Find Admin by primary key (id)
      const admin = await Admin.findByPk(id, {
        // Exclude password field from the returned object
        attributes: { exclude: ["password"] },
      });

      // Return 404 if the requested admin does not exist in the database
      if (!admin) return res.status(404).json({ error: "Admin not found" });

      // Respond with shelter data
      res.json(admin);

      // Log any error and respond with generic 500
    } catch (error) {
      console.error("Error fetching admin info:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// ---------------------------
// UPDATE AUTHENTICATED ADMIN (Self)
// ---------------------------
// Route: PUT /me
// Access: Protected (Admin only)
// Middleware: validateAdminToken
// Description:
//  -- Allows an admin to update their own profile
//  -- Supports partial updates (Only fields provided are updated)
router.put("/me", validateAdminToken, async (req: Request, res: Response) => {
  try {
    const adminId = req.admin!.id; // decoded JWT sets req.admin

    const { username, email, password } = req.body;

    const updateData: any = {};

    // Validation (only if provided)
    if (username !== undefined) {
      if (typeof username !== "string" || username.length > 50) {
        return res.status(400).json({ error: "Invalid username" });
      }
      updateData.username = username;
    }

    if (email !== undefined) {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email" });
      }
      updateData.email = email;
    }

    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({ error: "Password too short" });
      }
      // Hash the new password
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Perform the update
    await Admin.update(updateData, { where: { id: adminId } });

    res.json({ message: "Admin profile updated successfully" });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

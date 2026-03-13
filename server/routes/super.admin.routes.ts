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
// validateSuperAdminToken ensures only super admins can access certain endpoints
import { validateSuperAdminToken } from "../middleware/super.admin.middleware";

// ----------------------------------------------
// -------------  CONFIG/SETUP    ---------------
// ----------------------------------------------
// Load environment variables from .env into process.env
dotenv.config();

// Create a new Express router instance
const router = Router();

// Destructure the SuperAdmin model from the Sequelize instance
// SuperAdmin model will be used to query/create/update/delete super admin
const { SuperAdmin } = db;

// Secret key for signing JWTs for SuperAdmin authentication
// Fallback string is only for development if env variable is missing
const JWT_SECRET = process.env.SUPER_ADMIN_JWT_SECRET || "fallbackSecret";

// Backend type for login response
interface SuperAdminLoginResponse {
  id: number;
  email: string;
  userType: "SuperAdmin";
  token: string; // JWT
}

// ----------------------------------------------
// ---------------- SUPER ADMIN ROUTES ---------------
// ----------------------------------------------

// ---------------------------
// CREATE A NEW SUPER ADMIN
// ---------------------------
// Route: POST /
// Access: Public (or protected depending on design)
// Middleware: None
// Description: Creates a new super admin account with hashed password
router.post("/", async (req: Request, res: Response) => {
  const { username, password, email, age } = req.body;
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
    if (typeof age !== "number" || age < 18 || age > 120) {
      return res.status(400).json({ error: "Invalid age" });
    }

    const existingSuperAdmin = await SuperAdmin.findOne({ where: { email } });
    if (existingSuperAdmin) {
      return res.status(409).json({ error: "Email already in use" });
    }
    // Hash the password with bcrypt before saving
    // Salt rounds = 10 (moderate security, reasonable speed)
    const hash = await bcrypt.hash(password, 10);

    // Store the new SuperAdmin in the database
    // Password stored is hashed, never store plain text
    await SuperAdmin.create({
      username,
      password: hash,
      email,
      age,
    });

    // Respond with a success message (JSON)
    res.json({ message: "Super Admin created successfully!" });
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error creating super admin:", error);
    res.status(500).json({ error: "Failed to create super admin" });
  }
});

// ---------------------------
// SUPER ADMIN LOGIN
// ---------------------------
// Route: POST /login
// Access: Public
// Middleware: None
// Description: Authenticates a super admin and returns a JWT token
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Search for SuperAdmin by email in the database
    const superAdmin = await SuperAdmin.findOne({ where: { email } });
    if (!superAdmin)
      return res.status(404).json({ error: "Super Admin not found" });

    // Compare submitted password with stored hashed password
    const match = await bcrypt.compare(password, superAdmin.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    // Destructure SuperAdmin info for JWT payload
    const { id, userType } = superAdmin;

    // Sign a JWT token that encodes id, email, and userType
    // Token expires in 1 hour
    const accessSuperAdminToken = sign({ id, email, userType }, JWT_SECRET, {
      expiresIn: "1h",
    });

    //Build response object
    const loginResponse: SuperAdminLoginResponse = {
      id,
      email,
      userType,
      token: accessSuperAdminToken,
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
  "/authSuperAdmin",
  validateSuperAdminToken,
  async (req: Request | any, res: Response) => {
    // validateSuperAdminToken sets req.superAdmin from decoded JWT
    // Here we just return it
    res.json(req.superAdmin);
  },
);

// ---------------------------
// GET BASIC ADMIN INFO BY ID
// ---------------------------
// Route: GET /basicinfo/:id
// Access: Protected (Admin only)
// Middleware: validateSuperAdminToken
// Description: Returns info for a specific admin excluding password
router.get(
  "/basicinfo/:id",
  validateSuperAdminToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      // Find SuperAdmin by primary key (id)
      const superAdmin = await SuperAdmin.findByPk(id, {
        // Exclude password field from the returned object
        attributes: { exclude: ["password"] },
      });

      // Return 404 if the requested super admin does not exist in the database
      if (!superAdmin)
        return res.status(404).json({ error: "Super Admin not found" });

      // Respond with shelter data
      res.json(superAdmin);

      // Log any error and respond with generic 500
    } catch (error) {
      console.error("Error fetching super admin info:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// ---------------------------
// UPDATE AUTHENTICATED SUPER ADMIN (Self)
// ---------------------------
// Route: PUT /me
// Access: Protected (Super Admin only)
// Middleware: validateSuperAdminToken
// Description:
//  -- Allows a super admin to update their own profile
//  -- Supports partial updates (Only fields provided are updated)
router.put(
  "/me",
  validateSuperAdminToken,
  async (req: Request | any, res: Response) => {
    try {
      const superAdminId = req.superAdmin.id; // decoded JWT sets req.superAdmin

      const { username, email, password, age } = req.body;

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

      if (age !== undefined) {
        if (typeof age !== "number" || age < 18 || age > 120) {
          return res.status(400).json({ error: "Invalid age" });
        }
        updateData.age = age;
      }

      // Perform the update
      await SuperAdmin.update(updateData, { where: { id: superAdminId } });

      res.json({ message: "Super Admin profile updated successfully" });
    } catch (error) {
      console.error("Error updating super admin:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;

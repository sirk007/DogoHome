import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

import db from "../models"; // Import the database connection
import { validateUserToken } from "../middleware/AuthMiddlewareUser";
import { validateAdminToken } from "../middleware/AuthMiddlewareAdmin";

dotenv.config(); // Load environment variables

const router = Router();
const JWT_SECRET = process.env.USER_JWT_SECRET || "fallbackSecret"; // fallback for dev

const { Users } = db; // Destructure Users model from db

// --------------------------- User Routes ---------------------------

// ---------------------------
// CREATE A NEW USER
// ---------------------------
router.post("/", async (req: Request, res: Response) => {
  const { username, password, email, age } = req.body;
  try {
    // Hash the password before storing
    const hash = await bcrypt.hash(password, 10);
    // Create the user in the database
    await Users.create({
      username,
      password: hash,
      email,
      age,
    });
    res.json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------
// USER LOGIN
// ---------------------------
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await Users.findOne({ where: { username } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    const { id, userType } = user;
    // Generate JWT token
    const accessToken = sign({ id, username, userType }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token: accessToken, username, id, userType });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------
// GET AUTHENTICATED USER INFO
// ---------------------------
router.get("/auth", validateUserToken, (req: Request, res: Response) => {
  res.json(req.user); // TypeScript knows req.user from middleware
});

// ---------------------------
// GET BASIC INFO OF USER BY ID
// ---------------------------
router.get("/basicinfo/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await Users.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ----------------------
// GET ALL USERS (ADMIN ONLY)
// ----------------------
router.get("/", validateAdminToken, async (req: Request, res: Response) => {
  try {
    const users = await Users.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ----------------------
// DELETE USER (ADMIN ONLY)
// ----------------------
router.delete(
  "/:id",
  validateAdminToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await Users.destroy({ where: { id } });
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;

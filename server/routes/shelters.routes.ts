import {Router, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';

import db from "../models"; // Import the database connection
import { validateShelterToken } from "../middleware/AuthMiddlewareShelter";
import { validateAdminToken } from '../middleware/AuthMiddlewareAdmin';

dotenv.config(); // Load environment variables

const router = Router();

const { Shelter } = db; // Destructure Shelter model from db
const JWT_SECRET = process.env.SHELTER_JWT_SECRET || "fallbackSecret"; // fallback for dev


// --------------------------- Shelter Routes ---------------------------

// ---------------------------
// CREATE A NEW SHELTER
// ---------------------------
router.post("/", async (req: Request, res: Response) => {
    const { username, password, email, shelterName, countyId, address, phoneNumber} = req.body;
    try {
        // Hash the password before storing
        const hash = await bcrypt.hash(password, 10);
        // Create the shelter in the database
        await Shelter.create({
            username,
            password: hash,
            email,
            shelterName,
            countyId,
            address,
            phoneNumber,
        });
        res.json({ message: "Shelter created successfully!" });
    } catch (error) {
        console.error("Error creating shelter:", error);
        res.status(500).json({ error: "Failed to create shelter" });
    }
});

// ---------------------------
// SHELTER LOGIN
// ---------------------------
router.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const shelter = await Shelter.findOne({ where: { username } });
        if (!shelter)
            return res.status(404).json({ error: "Shelter not found" });

        const match = await bcrypt.compare(password, shelter.password);
        if (!match)
            return res.status(401).json({ error: "Incorrect password" });

        const {id, userType} = shelter;
        // Generate JWT token
        const accessShelterToken = sign({ id, username, userType }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token: accessShelterToken, username, id, userType });
    } catch (error) {
        console.error("Error during shelter login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ---------------------------
// GET AUTHENTICATED SHELTER INFO
// ---------------------------

router.get("/authShelter", validateShelterToken, async (req: Request, res: Response) => {
    res.json(req.shelter); // TypeScript knows req.shelter from middleware
});

// ---------------------------
// GET BASIC SHELTER INFO BY ID
// ---------------------------

router.get("/basicinfo/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const shelter = await Shelter.findByPk(id, { attributes: { exclude: ["password"] } });
    if (!shelter) return res.status(404).json({ error: "Shelter not found" });
    res.json(shelter);
  } catch (error) {
    console.error("Error fetching shelter info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ----------------------
// DELETE Shelter (ADMIN ONLY)
// ----------------------
router.delete("/:id", validateAdminToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await Shelter.destroy({ where: { id } });
        res.json({ message: "Shelter deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;

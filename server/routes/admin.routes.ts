import {Router, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';

import db from "../models"; // Import the database connection
import { validateAdminToken } from '../middleware/AuthMiddlewareAdmin';
//import { validateAdminToken } from '../middleware/AuthMiddlewareAdmin';

dotenv.config(); // Load environment variables

const router = Router();
const { Admin } = db; // Destructure Admin model from db
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "fallbackSecret"; // fallback for dev

// --------------------------- Admin Routes ---------------------------

// ---------------------------
// CREATE A NEW ADMIN
// ---------------------------
router.post("/", async (req: Request, res: Response) => {
    const { username, password, email, age} = req.body;
    try {
        // Hash the password before storing
        const hash = await bcrypt.hash(password, 10);
        // Create the admin in the database
        await Admin.create({
            username,
            password: hash,
            email,
            age,
        });
        res.json({ message: "Admin created successfully!" });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({ error: "Failed to create admin" });
    }
});

// ---------------------------
// ADMIN LOGIN
// ---------------------------
router.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ where: { username } });
        if (!admin)
            return res.status(404).json({ error: "Admin not found" });

        const match = await bcrypt.compare(password, admin.password);
        if (!match)
            return res.status(401).json({ error: "Incorrect password" });

        const {id, userType} = admin;
        // Generate JWT token
        const accessAdminToken = sign({ id, username, userType }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token: accessAdminToken, username, id, userType });
    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ---------------------------
// GET AUTHENTICATED ADMIN INFO
// ---------------------------
router.get("/authAdmin", validateAdminToken, async (req: Request | any, res: Response) => {
    res.json(req.admin);
});

// ---------------------------
// GET BASIC ADMIN INFO BY ID
// ---------------------------
router.get("/basicinfo/:id", validateAdminToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const admin = await Admin.findByPk(id, {
            attributes: { exclude: ["password"] }});
        if (!admin)
            return res.status(404).json({ error: "Admin not found" });
        res.json(admin);
    } catch (error) {
        console.error("Error fetching admin info:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export default router;

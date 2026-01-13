// ----------------------------------------------
// ----------------   IMPORTS   -----------------
// ----------------------------------------------
// Express Router for defining route endpoints
// Response type for HTTP responses
import { Router, Request, Response } from "express";

// ----------------------------------------------
// Database models (Sequelize instance)
// ----------------------------------------------
// db is the Sequelize instance that contains all models
// Importing Counties model from db for CRUD operations
import db from "../models";

// ----------------------------------------------
// -------------  CONFIG/SETUP    ---------------
// ----------------------------------------------

// Create a new router instance
const router = Router();

// Destructure the Counties model from the Sequelize instance
// Counties model will be used to query/create/update/delete county
const { County } = db;

// ---------------------------
// GET ALL COUNTIES (Public)
// ---------------------------
// Route: GET /
// Access: Public
// Middleware: None
// Description: Returns a list of all counties with only their ID and name
router.get("/", async (req: Request, res: Response) => {
  try {
    // Fetch all counties, selecting only the id and countyName fields
    const counties = await County.findAll({ attributes: ["id", "countyName"] });

    // Respond with the list of counties
    res.json(counties);
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error fetching counties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

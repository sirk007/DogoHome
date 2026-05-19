// ----------------------------------------------
// Server Entry Point
// This file bootstraps the backend application:
// - Loads environment variables
// - Initializes Express
// - Registers middleware & routes
// - Connects to the database
// - Starts the HTTP server
// ----------------------------------------------

// ----------------------------------------------
// IMPORT LIBRARIES
// ----------------------------------------------

// Express: core web framework for handling HTTP requests & routing
import express, { Application, Request, Response } from "express";

// CORS: allows the frontend (different origin) to communicate with this server
import cors from "cors";

// dotenv: loads environment variables from .env into process.env
import dotenv from "dotenv";

// Sequelize instance used to connect & sync with the database
import sequelize from "./config/database";

// Importing all models here ensures:
// - Models are registered with Sequelize
// - Associations (relationships) are set up before syncing
import "./models";

// ----------------------------------------------
// IMPORT ROUTES
// Each route file owns a specific domain of the API
// ----------------------------------------------

import userRoutes from "./routes/users.routes";
import shelterRoutes from "./routes/shelters.routes";
import adminRoutes from "./routes/admin.routes";
import superAdminRoutes from "./routes/superAdmin.routes";
import postRoutes from "./routes/posts.route";
import likeRoutes from "./routes/likes.route";
import commentRoutes from "./routes/comments.route";
import animalRoutes from "./routes/animals.routes";
import countyRoutes from "./routes/county.routes";
import sightingRoutes from "./routes/sightings.routes";
import messageRoutes from "./routes/message.routes";

// ----------------------------------------------
// CONFIGURATION
// ----------------------------------------------

// Load environment variables early
dotenv.config();

// Create the Express application instance
const app: Application = express();

// Use PORT from environment or fallback to 3002 for local development
const PORT = process.env.PORT || 3002;

// ----------------------------------------------
// GLOBAL MIDDLEWARE
// These run on every incoming request
// ----------------------------------------------

// Parse incoming JSON payloads (req.body)
app.use(express.json());

// Enable Cross-Origin Resource Sharing
// Required for frontend (React) to call backend APIs
app.use(cors());

// ----------------------------------------------
// ROUTES
// API endpoints
// ----------------------------------------------
app.use("/api/users", userRoutes);
app.use("/api/shelters", shelterRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/superAdmins", superAdminRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/counties", countyRoutes);
app.use("/api/sightings", sightingRoutes);
app.use("/api/messages", messageRoutes);

// ----------------------------------------------
// HEALTH CHECK
// Simple endpoint to verify server is running
// ----------------------------------------------
app.get("/", (req: Request, res: Response) => {
  res.send("DogoHome Server is running!");
});

// ----------------------------------------------
// DATABASE CONNECTION & SERVER STARTUP
// ----------------------------------------------

// Self-invoking async function keeps startup logic isolated
(async () => {
  try {
    // Synchronize Sequelize models with the database
    // This ensures tables exist and match model definitions
    await sequelize.sync();
    console.log("Database Connected Successfully");

    // Start listening for HTTP requests
    app.listen(PORT, () => console.log(`Server active on port ${PORT}`));
  } catch (err) {
    // Fail fast if database connection fails
    console.error("Unable to connect to database:", err);
  }
})();

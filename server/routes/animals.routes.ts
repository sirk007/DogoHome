// ----------------------------------------------
// ----------------   IMPORTS   -----------------
// ----------------------------------------------
// Express Router to define endpoints
import { Router, Request, Response } from "express";

// ----------------------------------------------
// Database models (Sequelize instance)
// ----------------------------------------------
// db is the Sequelize instance that contains all models
// Importing Animals model from db for CRUD operations
import db from "../models";

// Middleware to protect shelter-specific routes
// validateShelterToken ensures a valid JWT for the shelter
// ShelterAuthRequest is a custom TypeScript type that includes req.shelter
import {
  validateShelterToken,
  ShelterAuthRequest,
} from "../middleware/shelter.middleware";

// ----------------------------------------------
// -------------  CONFIG/SETUP    ---------------
// ----------------------------------------------
// Create a new Express router instance
const router = Router();

// Destructure the Animals model from the Sequelize instance
// Animals model will be used to query/create/update/delete animals
const { Animal } = db;

// ----------------------------------------------
// ---------------- ANIMAL ROUTES ---------------
// ----------------------------------------------

// ---------------------------
// CREATE A NEW ANIMAL (Shelter Only)
// ---------------------------
// Route: POST /
// Access: Protected (Shelter only)
// Middleware: validateShelterToken
//   - Ensures request includes valid shelter JWT
//   - Populates req.shelter with the authenticated shelter
router.post(
  "/",
  validateShelterToken,
  async (req: ShelterAuthRequest, res: Response) => {
    try {
      // Extract animal info from request body
      const {
        species,
        name,
        age,
        ageUnit,
        health,
        size,
        activityLevel,
        goodWithKids = false,
        goodWithPets = false,
        description,
        pictureUrl,
      } = req.body;

      // Validation / Hygiene
      const speciesValues = ["Dog", "Cat", "Rabbit", "Other"];
      const ageUnits = ["Months", "Years"];
      const healthStates = ["Good", "Needs Medication", "Critical"];
      const sizes = ["Small", "Medium", "Large"];
      const activityLevels = ["Low", "Medium", "High"];

      if (!speciesValues.includes(species)) {
        return res.status(400).json({ error: "Invalid species" });
      }

      if (!name || typeof name !== "string" || name.length > 100) {
        return res.status(400).json({ error: "Invalid name" });
      }

      if (typeof age !== "number" || age < 0) {
        return res.status(400).json({ error: "Invalid age" });
      }

      if (!ageUnits.includes(ageUnit)) {
        return res.status(400).json({ error: "Invalid age unit" });
      }

      if (!healthStates.includes(health)) {
        return res.status(400).json({ error: "Invalid health state" });
      }

      if (!sizes.includes(size)) {
        return res.status(400).json({ error: "Invalid size" });
      }

      if (!activityLevels.includes(activityLevel)) {
        return res.status(400).json({ error: "Invalid activity level" });
      }

      // Check if req.shelter exists (set by middleware). If not, return 401 Unauthorized
      if (!req.shelter) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Create new animal record in the database
      // Optional fields (description, picture) default to null if not provided
      // shelterId links the animal to the authenticated shelter
      const newAnimal = await Animal.create({
        species,
        name,
        age,
        ageUnit,
        health,
        size,
        activityLevel,
        goodWithKids,
        goodWithPets,
        description: description || null,
        pictureUrl: pictureUrl || null,
        shelterId: req.shelter.id,
      });
      // Respond with 201 Created and return the new animal object
      res.status(201).json(newAnimal);
    } catch (error) {
      // Log any error and respond with generic 500
      console.error("Error creating animal:", error);
      res.status(500).json({ error: "Failed to create animal" });
    }
  },
);

// ---------------------------
// GET ALL ANIMALS FOR THE AUTHENTICATED SHELTER
// ---------------------------
// Route: GET /mine
// Access: Protected (Shelter only)
// Middleware: validateShelterToken
//   - Checks that the request includes a valid JWT for a shelter
//   - Populates req.shelter with the authenticated shelter's data
router.get(
  "/mine",
  validateShelterToken,
  async (req: ShelterAuthRequest, res: Response) => {
    try {
      // Check if req.shelter exists (set by middleware). If not, return 401 Unauthorized
      if (!req.shelter) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Find all animals where shelterId matches the authenticated shelter
      const animals = await Animal.findAll({
        where: { shelterId: req.shelter.id },
      });

      // Return the list of animals
      res.json(animals);
    } catch (error) {
      // Log any error and respond with generic 500
      console.error("Error fetching shelter animals:", error);
      res.status(500).json({ error: "Failed to fetch animals" });
    }
  },
);

// ---------------------------
// GET ALL ANIMALS FOR A GIVEN SHELTER (Public)
// ---------------------------
// Route: GET /byShelterId/:shelterId
// Access: Public
// Middleware: None
//   - Fetches all animals associated with the specified shelter ID
router.get("/byShelterId/:shelterId", async (req: Request, res: Response) => {
  try {
    // Convert param to number
    const shelterId = parseInt(req.params.shelterId);

    // Query database for all animals belonging to this shelter
    const animals = await Animal.findAll({ where: { shelterId } });

    // Return the list of animals
    res.json(animals);
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error fetching animals by shelter ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------
// GET ANIMAL BY ID (Public)
// ---------------------------
// Route: GET /byId/:id
// Access: Public
// Middleware: None
//   - Fetches a single animal by its ID
router.get("/byId/:id", async (req: Request, res: Response) => {
  try {
    // Convert param to number
    const id = parseInt(req.params.id);

    // Find animal by primary key
    const animal = await Animal.findByPk(id);

    // Return 404 if animal does not exist
    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    // Return the animal
    res.json(animal);
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error fetching animal by ID:", error);
    res.status(500).json({ error: "Failed to fetch animal" });
  }
});

// ---------------------------
// UPDATE ANIMAL BY ID (Shelter Only)
// ---------------------------
// Route: PUT /:id
// Access: Protected (Shelter only)
// Middleware: validateShelterToken
// Description
//   - Allows a shelter to update one of its own animal resources
//   - Partial updates supported (Only provided fields are updated)
//
router.put(
  "/:id",
  validateShelterToken,
  async (req: ShelterAuthRequest, res: Response) => {
    try {
      // Confirm middleware set req.shelter
      if (!req.shelter) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Convert param to number
      const id = Number(req.params.id);

      // Find the animal by primary key
      const animal = await Animal.findByPk(id);
      if (!animal) return res.status(404).json({ error: "Animal not found" });

      // Check ownership
      if (animal.shelterId !== req.shelter.id) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // Extract fields from body
      const {
        species,
        name,
        age,
        ageUnit,
        health,
        size,
        activityLevel,
        goodWithKids,
        goodWithPets,
        description,
        pictureUrl,
      } = req.body;

      // Validation
      const speciesValues = ["Dog", "Cat", "Rabbit", "Other"];
      const ageUnits = ["Months", "Years"];
      const healthStates = ["Good", "Needs Medication", "Critical"];
      const sizes = ["Small", "Medium", "Large"];
      const activityLevels = ["Low", "Medium", "High"];

      const updateData: any = {};

      if (species !== undefined) {
        if (!speciesValues.includes(species))
          return res.status(400).json({ error: "Invalid species" });
        updateData.species = species;
      }
      if (name !== undefined) {
        if (typeof name !== "string" || name.length > 100)
          return res.status(400).json({ error: "Invalid name" });
        updateData.name = name;
      }
      if (age !== undefined) {
        if (typeof age !== "number" || age < 0)
          return res.status(400).json({ error: "Invalid age" });
        updateData.age = age;
      }
      if (ageUnit !== undefined) {
        if (!ageUnits.includes(ageUnit))
          return res.status(400).json({ error: "Invalid age unit" });
        updateData.ageUnit = ageUnit;
      }
      if (health !== undefined) {
        if (!healthStates.includes(health))
          return res.status(400).json({ error: "Invalid health state" });
        updateData.health = health;
      }
      if (size !== undefined) {
        if (!sizes.includes(size))
          return res.status(400).json({ error: "Invalid size" });
        updateData.size = size;
      }
      if (activityLevel !== undefined) {
        if (!activityLevels.includes(activityLevel))
          return res.status(400).json({ error: "Invalid activity level" });
        updateData.activityLevel = activityLevel;
      }
      if (goodWithKids !== undefined) updateData.goodWithKids = goodWithKids;
      if (goodWithPets !== undefined) updateData.goodWithPets = goodWithPets;
      if (description !== undefined) updateData.description = description;
      if (pictureUrl !== undefined) updateData.pictureUrl = pictureUrl;

      // Perform the update
      await animal.update(updateData);

      res.json({ message: "Animal updated successfully", animal });
    } catch (error) {
      console.error("Error updating animal:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// ---------------------------
// DELETE ANIMAL BY ID (Shelter Only)
// ---------------------------
// Route: DELETE /:id
// Access: Protected (Shelter only)
// Middleware: validateShelterToken
//   - Ensures request includes valid shelter JWT
//   - Populates req.shelter with the authenticated shelter
// Authorization: Only the shelter that owns the animal can delete it
router.delete(
  "/:id",
  validateShelterToken,
  async (req: ShelterAuthRequest, res: Response) => {
    try {
      // Confirm middleware set req.shelter; if not, return 401 Unauthorized
      if (!req.shelter) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Convert the ID param to a number
      const id = Number(req.params.id);

      // Fetch the animal from the database by primary key
      const animal = await Animal.findByPk(id);

      // Return 404 if the animal doesn't exist
      if (!animal) {
        return res.status(404).json({ error: "Animal not found" });
      }

      // Ensure the authenticated shelter owns this animal
      // Return 403 Forbidden if it belongs to a different shelter
      if (animal.shelterId !== req.shelter.id) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // Delete the animal record
      await animal.destroy();
      res.json({ message: "Animal deleted successfully" });
    } catch (error) {
      // Log any error and respond with generic 500
      console.error("Error deleting animal:", error);
      res.status(500).json({ error: "Failed to delete animal" });
    }
  },
);

// ---------------------------
// GET ANIMAL STATS FOR SHELTER (Dashboard)
// ---------------------------
// Route: GET /stats
// Access: Protected (Shelter only)
// Middleware: validateShelterToken
router.get(
  "/stats",
  validateShelterToken,
  async (req: ShelterAuthRequest, res: Response) => {
    try {
      if (!req.shelter) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Count total animals for this shelter
      const total = await Animal.count({
        where: { shelterId: req.shelter.id },
      });

      // Count by species
      const dogs = await Animal.count({
        where: { shelterId: req.shelter.id, species: "Dog" },
      });
      const cats = await Animal.count({
        where: { shelterId: req.shelter.id, species: "Cat" },
      });
      const others = await Animal.count({
        where: {
          shelterId: req.shelter.id,
          species: ["Rabbit", "Other"],
        },
      });

      // Return stats
      res.json({ total, dogs, cats, others });
    } catch (error) {
      console.error("Error fetching animal stats:", error);
      res.status(500).json({ error: "Failed to fetch animal stats" });
    }
  },
);

export default router;

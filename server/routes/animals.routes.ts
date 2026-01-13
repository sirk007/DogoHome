import { Router, Request, Response } from "express";
import db from "../models"; // Import the database connection
import {
  validateShelterToken,
  ShelterAuthRequest,
} from "../middleware/AuthMiddlewareShelter";

const router = Router();
const { Animals } = db; // Destructure Animals model from db

// ---------------------------
// CREATE A NEW ANIMAL ( Shelter Only )
// ---------------------------
router.post(
  "/",
  validateShelterToken,
  async (req: ShelterAuthRequest, res: Response) => {
    try {
      const {
        animal,
        animalName,
        animalAge,
        animalHealth,
        animalDescription,
        picture,
      } = req.body;

      if (!req.shelter) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const newAnimal = await Animals.create({
        animal,
        animalName,
        animalAge,
        animalHealth,
        animalDescription: animalDescription || null,
        picture: picture || null,
        shelterId: req.shelter.id,
      });
      res.status(201).json(newAnimal);
    } catch (error) {
      console.error("Error creating animal:", error);
      res.status(500).json({ error: "Failed to create animal" });
    }
  }
);

// ---------------------------
// GET ALL ANIMALS FOR A SHELTER
// ---------------------------
router.get(
  "/mine",
  validateShelterToken,
  async (req: ShelterAuthRequest, res: Response) => {
    try {
      if (!req.shelter) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const animals = await Animals.findAll({
        where: { shelterId: req.shelter.id },
      });

      res.json(animals);
    } catch (error) {
      console.error("Error fetching shelter animals:", error);
      res.status(500).json({ error: "Failed to fetch animals" });
    }
  }
);

// ---------------------------
// GET ANIMAL BY SHELTER ID
// ---------------------------
router.get("/byShelterId/:shelterId", async (req: Request, res: Response) => {
  try {
    const shelterId = parseInt(req.params.shelterId);
    const animals = await Animals.findAll({ where: { shelterId } });
    res.json(animals);
  } catch (error) {
    console.error("Error fetching animals by shelter ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------
// GET ANIMAL BY ID (Public)
// ---------------------------
router.get("/byId/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const animal = await Animals.findByPk(id);
    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }
    res.json(animal);
  } catch (error) {
    console.error("Error fetching animal by ID:", error);
    res.status(500).json({ error: "Failed to fetch animal" });
  }
});

// ---------------------------
// DELETE ANIMAL BY ID ( SHELTER ONLY )
// ---------------------------
router.delete(
  "/:id",
  validateShelterToken,
  async (req: ShelterAuthRequest, res: Response) => {
    try {
      if (!req.shelter) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = Number(req.params.id);
      const animal = await Animals.findByPk(id);

      if (!animal) {
        return res.status(404).json({ error: "Animal not found" });
      }

      if (animal.shelterId !== req.shelter.id) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await animal.destroy();
      res.json({ message: "Animal deleted successfully" });
    } catch (error) {
      console.error("Error deleting animal:", error);
      res.status(500).json({ error: "Failed to delete animal" });
    }
  }
);

export default router;

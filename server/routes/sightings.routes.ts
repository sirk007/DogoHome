import { Router, Request, Response } from "express";
import db from "../models";
import { validateUserToken } from "../middleware/user.middleware";

const router = Router();
const { Sighting, User, County } = db;

// ---------------------------
// GET ALL SIGHTINGS (Public)
// Optional filters: type, countyId
// Example: /api/sightings?type=Lost&countyId=1
// ---------------------------
router.get("/", async (req: Request, res: Response) => {
  try {
    const { type, countyId } = req.query;

    // Build a where object dynamically
    const whereClause: any = {};
    if (type && ["Lost", "Found", "Reported"].includes(type as string)) {
      whereClause.type = type;
    }
    if (countyId && !isNaN(Number(countyId))) {
      whereClause.countyId = Number(countyId);
    }

    const sightings = await Sighting.findAll({
      where: whereClause,
      include: [
        { model: User, attributes: ["id", "username"] },
        { model: County, attributes: ["id", "countyName"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(sightings);
  } catch (error) {
    console.error("Error fetching sightings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------
// CREATE NEW SIGHTING (Protected)
// ---------------------------
router.post(
  "/",
  validateUserToken,
  async (req: Request | any, res: Response) => {
    try {
      const { title, description, type, lat, lng, location, countyId } =
        req.body;

      // Basic validation
      if (!title || typeof title !== "string") {
        return res.status(400).json({ error: "Invalid title" });
      }
      if (!["Lost", "Found", "Reported"].includes(type)) {
        return res.status(400).json({ error: "Invalid type" });
      }
      if (typeof lat !== "number" || typeof lng !== "number") {
        return res.status(400).json({ error: "Invalid coordinates" });
      }

      const newSighting = await Sighting.create({
        title,
        description,
        type,
        status: "Pending",
        lat,
        lng,
        location: location || null,
        countyId: countyId || null,
        userId: req.user.id, // from JWT middleware
      });

      res.status(201).json(newSighting);
    } catch (error) {
      console.error("Error creating sighting:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// ---------------------------
// GET SIGHTING BY ID (Public)
// ---------------------------
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sighting = await Sighting.findByPk(id, {
      include: [
        { model: User, attributes: ["id", "username"] },
        { model: County, attributes: ["id", "countyName"] },
      ],
    });

    if (!sighting) return res.status(404).json({ error: "Sighting not found" });
    res.json(sighting);
  } catch (error) {
    console.error("Error fetching sighting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

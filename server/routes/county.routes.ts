import { Router, Request, Response } from "express";
import db from "../models";

const router = Router();
const { County } = db;

// GET all counties
router.get("/", async (req: Request, res: Response) => {
  try {
    const counties = await County.findAll({ attributes: ["id", "countyName"] });
    res.json(counties);
  } catch (error) {
    console.error("Error fetching counties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import { Router, Response } from "express";
import db from "../models";
import { validateUserToken, AuthRequest } from "../middleware/AuthMiddlewareUser";

const router = Router();
const { Likes } = db;

// ---------------------------
// TOGGLE LIKE / UNLIKE POST
// ---------------------------
router.post("/", validateUserToken, async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.body;
    const userId = req.user!.id;

    if (!postId) {
      return res.status(400).json({ error: "postId is required" });
    }

    const existingLike = await Likes.findOne({
      where: {
        postId,
        userId,
      },
    });

    if (!existingLike) {
      await Likes.create({ postId, userId });
      return res.json({ liked: true });
    } else {
      await Likes.destroy({
        where: {
          postId,
          userId,
        },
      });
      return res.json({ liked: false });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

export default router;

import { Router, Response } from "express";
import db from "../models";
import {
  validateUserToken,
  AuthRequest,
} from "../middleware/AuthMiddlewareUser";

const router = Router();
const { Comments } = db;

// ---------------------------
// CREATE COMMENT
// ---------------------------
router.post("/", validateUserToken, async (req: AuthRequest, res: Response) => {
  try {
    const { commentBody, postId } = req.body;

    if (!commentBody || !postId) {
      return res
        .status(400)
        .json({ error: "commentBody and postId are required" });
    }

    const newComment = await Comments.create({
      commentBody,
      postId,
      userId: req.user!.id,
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// ---------------------------
// GET COMMENTS BY POST ID
// ---------------------------
router.get("/post/:postId", async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    const comments = await Comments.findAll({
      where: { postId },
      order: [["createdAt", "ASC"]],
    });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// ---------------------------
// DELETE COMMENT
// ---------------------------
router.delete(
  "/:id",
  validateUserToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const comment = await Comments.findByPk(id);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      // Ownership or admin check
      if (comment.userId !== req.user!.id && req.user!.userType !== "Admin") {
        return res
          .status(403)
          .json({ error: "You do not have permission to delete this comment" });
      }

      await comment.destroy();
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  }
);

export default router;

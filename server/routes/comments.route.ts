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
// Route: POST /
// Access: Protected (User only)
// Middleware: validateUserToken
//   - Ensures request includes a valid JWT
//   - Populates req.user with the authenticated user's data
// Description: Allows a user to create a comment associated with a specific post
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
// Route: GET /post/:postId
// Access: Public
// Middleware: None
// Description: Fetches all comments for a given post, ordered by creation date
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
// Route: DELETE /:id
// Access: Protected (User only)
// Middleware: validateUserToken
//   - Ensures request includes a valid JWT
//   - Populates req.user with authenticated user's data
// Authorization: User can delete their own comments; Admins can delete any comment
// Description: Deletes a comment if the authenticated user owns it or is an admin
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

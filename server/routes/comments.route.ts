// ----------------------------------------------
// ----------------   IMPORTS   -----------------
// ----------------------------------------------
// Express Router for defining route endpoints
// Response type for HTTP responses
import { Router, Response } from "express";

// ----------------------------------------------
// Database models (Sequelize instance)
// ----------------------------------------------
// db is the Sequelize instance that contains all models
// Importing Comments model from db for CRUD operations
import db from "../models";

// Middleware to protect user routes
// validateUserToken checks JWT and sets req.user if valid
// AuthRequest extends Express Request with user payload
import { validateUserToken, AuthRequest } from "../middleware/user.middleware";

// ----------------------------------------------
// -------------  CONFIG/SETUP    ---------------
// ----------------------------------------------
// Create a new Express router instance
const router = Router();

// Destructure the Comments model from the Sequelize instance
// Comments model will be used to query/create/update/delete comments
const { Comment } = db;

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

    // Validate required fields
    if (!commentBody || !postId) {
      return res
        .status(400)
        .json({ error: "commentBody and postId are required" });
    }

    // Create new comment tied to authenticated user
    const newComment = await Comment.create({
      commentBody,
      postId,
      userId: req.user!.id,
    });

    // Respond with 201 Created and return the new animal object
    res.status(201).json(newComment);
  } catch (error) {
    // Log any error and respond with generic 500
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
    // Fetch comments ordered by creation date
    const comments = await Comment.findAll({
      where: { postId },
      order: [["createdAt", "ASC"]],
    });
    // Return the list of comments
    res.json(comments);
  } catch (error) {
    // Log any error and respond with generic 500
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
      // Find comment by primary key
      const comment = await Comment.findByPk(id);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      // Ownership or admin authorization check
      // Return 403 Forbidden if user is not the owner or an admin
      if (comment.userId !== req.user!.id && req.user!.userType !== "Admin") {
        return res
          .status(403)
          .json({ error: "You do not have permission to delete this comment" });
      }

      // Delete comment
      await comment.destroy();
      // Comfirm delete comment
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      // Log any error and respond with generic 500
      console.error("Error deleting comment:", error);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  }
);

export default router;

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
// Importing Likes model from db for CRUD operations
import db from "../models";

// Middleware to protect user routes
// validateUserToken checks JWT and sets req.user if valid
// AuthRequest extends Express Request with user payload
import { validateUserToken, AuthRequest } from "../middleware/user.middleware";

// ----------------------------------------------
// -------------  CONFIG/SETUP    ---------------
// ----------------------------------------------
// Create a new router instance
const router = Router();

// Destructure the Likes model from the Sequelize instance
// Likes model will be used to query/create/update/delete likes
const { Likes } = db;

// ----------------------------------------------
// ----------------   ROUTES   -----------------
// ----------------------------------------------

// ---------------------------
// TOGGLE LIKE / UNLIKE POST (Protected)
// ---------------------------
// Route: POST /
// Access: Protected (User only)
// Middleware: validateUserToken
// Description:
//   - Likes a post if the user has not liked it yet
//   - Unlikes the post if the user has already liked it
// Response:
//   - { liked: true }  → post was liked
//   - { liked: false } → post was unliked
router.post("/", validateUserToken, async (req: AuthRequest, res: Response) => {
  try {
    // Extract postId from request body
    // Extract userId from JWT (never trust client-provided userId)
    const { postId } = req.body;
    const userId = req.user!.id;

    // Validate required input
    // Prevents unnecessary database queries
    if (!postId) {
      return res.status(400).json({ error: "postId is required" });
    }

    // Check if a like already exists for this user and post
    // This determines whether we are liking or unliking
    const existingLike = await Likes.findOne({
      where: {
        postId,
        userId,
      },
    });

    // Inform the client that the post is now liked
    if (!existingLike) {
      await Likes.create({ postId, userId });
      return res.json({ liked: true });
    } else {
      // If a like already exists, remove it (UNLIKE)
      await Likes.destroy({
        where: {
          postId,
          userId,
        },
      });

      // Inform the client that the post is now unliked
      return res.json({ liked: false });
    }
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

export default router;

// ----------------------------------------------
// ----------------   IMPORTS   -----------------
// ----------------------------------------------
// Express Router for defining route endpoints
// Response type for HTTP responses
import { Router, Request, Response } from "express";

// ----------------------------------------------
// Database models (Sequelize instance)
// ----------------------------------------------
// db is the Sequelize instance that contains all models
// Importing Posts model from db for CRUD operations
import db from "../models"; //

// Middleware to protect user routes
// validateUserToken checks JWT and sets req.user if valid
// AuthRequest extends Express Request with user payload
import { validateUserToken } from "../middleware/user.middleware";
import { AuthRequest } from "../middleware/user.middleware";

// ----------------------------------------------
// -------------  CONFIG/SETUP    ---------------
// ----------------------------------------------
// Create a new router instance
const router = Router();

// Destructure the Posts model from the Sequelize instance
// Posts model will be used to query/create/update/delete posts
const { Posts, Likes } = db;

// ----------------------------------------------
// ----------------   ROUTES   -----------------
// ----------------------------------------------

// ---------------------------
// CREATE POST (Protected)
// ---------------------------
// Route: POST /
// Access: Protected (User only)
// Middleware: validateUserToken
// Description:
//   - Creates a new post associated with the authenticated user
//   - Optional picture can be included
//   - Returns the created post object
router.post("/", validateUserToken, async (req: AuthRequest, res: Response) => {
  try {
    // Destructure post fields from request body
    // `title` and `postText` are required, `picture` is optional
    const { title, postText, picture } = req.body;

    // Create a new post in the database
    // - title: the post title
    // - postText: main content
    // - picture: optional, defaults to null if not provided
    // - userId: associated with the authenticated user from JWT
    const newPost = await Posts.create({
      title,
      postText,
      picture: picture || null,
      userId: req.user!.id,
    });

    // Respond with 201 Created and return the new post object
    res.status(201).json(newPost);
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// ---------------------------
// GET ALL POSTS (Protected)
// ---------------------------
// Route: GET /
// Access: Protected (User only)
// Middleware: validateUserToken
// Description:
//   - Returns all posts including associated likes
//   - Also returns which posts are liked by the authenticated user
router.get("/", validateUserToken, async (req: AuthRequest, res: Response) => {
  try {
    // Fetch all posts from the database
    // Include associated Likes for each post
    const listOfPosts = await Posts.findAll({ include: [Likes] });

    // Fetch likes specifically for the authenticated user
    // This allows the frontend to know which posts the current user has liked
    const likedPosts = await Likes.findAll({
      where: { userId: req.user!.id },
    });

    // Respond with both:
    // - listOfPosts: all posts with their associated likes
    // - likedPosts: posts the current user has liked
    res.json({ listOfPosts, likedPosts });
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// ---------------------------
// GET POST BY ID (Public)
// ---------------------------
// Route: GET /ById/:id
// Access: Public
// Middleware: None
// Description:
//   - Fetches a single post by its ID
//   - Includes all associated Likes for that post
//   - Useful for displaying post details and like count
router.get("/ById/:id", async (req: Request, res: Response) => {
  try {
    // Retrieve the post by primary key (ID)
    // Include associated Likes so frontend can display total likes or user-like info
    const post = await Posts.findByPk(req.params.id, { include: [Likes] });

    // If the post does not exist, return 404 Not Found
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Respond with the post object including likes
    res.json(post);
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error fetching post by ID:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// ---------------------------
// GET POSTS BY USER ID (Public)
// ---------------------------
// Route: GET /byUserId/:id
// Access: Public
// Middleware: None
// Description:
//   - Fetches all posts created by a specific user
//   - Includes all associated Likes for each post
//   - Useful for user profile pages or dashboards
router.get("/byUserId/:id", async (req: Request, res: Response) => {
  try {
    // Fetch all posts where the userId matches the provided ID
    // Include Likes for each post so frontend can show like counts
    const posts = await Posts.findAll({
      where: { userId: req.params.id },
      include: [Likes],
    });

    // Respond with array of posts (empty array if no posts exist)
    res.json(posts);
  } catch (error) {
    // Log any error and respond with generic 500
    console.error("Error fetching posts by user ID:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// ---------------------------
// UPDATE POST (Protected)
// ---------------------------
// Route: PUT /:id
// Access: Protected (User only)
// Middleware: validateUserToken
// Description:
//   - Updates the title and postText of a specific post
//   - Only the post owner or an Admin can perform this action
//   - Returns the updated post object
router.put(
  "/:id",
  validateUserToken,
  async (req: AuthRequest, res: Response) => {
    try {
      // Extract updated fields from request body
      const { title, postText } = req.body;

      // Get post ID from URL parameter
      const postId = req.params.id;

      // Find the post by primary key
      const post = await Posts.findByPk(postId);

      // Return 404 if post does not exist
      if (!post) return res.status(404).json({ error: "Post not found" });

      // ---------------------------
      // Ownership / Admin Check
      // ---------------------------
      // Ensure only the post owner or an Admin can update the post
      if (post.userId !== req.user!.id && req.user!.userType !== "Admin") {
        return res
          .status(403)
          .json({ error: "You do not have permission to update this post" });
      }

      // Update the post
      // - Only update fields provided in the request body
      // - Retain existing values if no new data is provided
      await post.update({
        title: title || post.title,
        postText: postText || post.postText,
      });

      // Respond with the updated post
      res.json(post);
    } catch (error) {
      // Log any error and respond with generic 500
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  }
);

// ---------------------------
// DELETE POST (Protected)
// ---------------------------
// Route: DELETE /:id
// Access: Protected (User only)
// Middleware: validateUserToken
// Description:
//   - Deletes a specific post by its ID
//   - Only the post owner or an Admin can perform this action
//   - Returns a confirmation message upon successful deletion
router.delete(
  "/:id",
  validateUserToken,
  async (req: AuthRequest, res: Response) => {
    try {
      // Find the post by primary key (ID from URL parameter)
      const post = await Posts.findByPk(req.params.id);

      // Return 404 if the post does not exist
      if (!post) return res.status(404).json({ error: "Post not found" });

      // ---------------------------
      // Ownership / Admin Check
      // ---------------------------
      // Only the creator of the post or an admin can delete it
      if (post.userId !== req.user!.id && req.user!.userType !== "Admin") {
        return res
          .status(403)
          .json({ error: "You do not have permission to delete this post" });
      }

      // Delete the post from the database
      await post.destroy();
      // Respond with a success message
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      // Log any error and respond with generic 500
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  }
);

export default router;

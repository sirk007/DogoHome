import {Router, Request, Response} from 'express';
import db from "../models"; // Import the database connection
import { validateUserToken } from "../middleware/AuthMiddlewareUser";
import { AuthRequest } from "../middleware/AuthMiddlewareUser";

const router = Router();
const { Posts, Likes } = db; // Destructure Posts model from db

// ---------------------------
// CREATE POST
// ---------------------------
router.post("/", validateUserToken,  async (req: AuthRequest, res: Response) => {
    try {
        const { title, postText, picture } = req.body;

        const newPost = await Posts.create({
            title,
            postText,
            picture: picture || null,
            userId: req.user!.id,
        });
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
});

// ---------------------------
// GET ALL POSTS
// ---------------------------
router.get("/", validateUserToken, async (req: AuthRequest, res: Response) => {
    try {
        const listOfPosts = await Posts.findAll({ include: [Likes] });

        // Likes of current user
        const likedPosts = await Likes.findAll({
            where: { userId: req.user!.id },
        });
        res.json({ listOfPosts, likedPosts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
        }
});

// ---------------------------
// GET POST BY ID
// ---------------------------
router.get("/ById/:id", async (req: Request, res: Response) => {
    try {
        const post = await Posts.findByPk(req.params.id, { include: [Likes] });
        if (!post) return res.status(404).json({ error: "Post not found" });
        res.json(post);
    } catch (error) {
        console.error("Error fetching post by ID:", error);
        res.status(500).json({ error: "Failed to fetch post" });
    }
});

// ---------------------------
// GET POST BY USER ID
// ---------------------------
router.get("/byUserId/:id", async (req: Request, res: Response) => {
    try {
        const posts = await Posts.findAll({
            where: { userId: req.params.id },
            include: [Likes],
        });
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts by user ID:", error);
        res.status(500).json({ error: "Failed to fetch posts" });        
    }
});

// ---------------------------
// UPDATE POST
// ---------------------------
router.put("/:id", validateUserToken, async (req: AuthRequest, res: Response) => {
    try {
        const { title, postText } = req.body;
        const postId = req.params.id;

        const post = await Posts.findByPk(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        // Check ownership or admin

        if(post.userId !== req.user!.id && req.user!.userType !== 'Admin') {
            return res.status(403).json({ error: "You do not have permission to update this post" });
        }
        await post.update({title: title || post.title, postText: postText || post.postText});
        res.json(post);
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ error: "Failed to update post" });
    }
});

// ---------------------------
// DELETE POST
// ---------------------------
router.delete("/:id", validateUserToken, async (req: AuthRequest, res: Response) => {
    try {
        const post = await Posts.findByPk(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        // Check ownership or admin
        if(post.userId !== req.user!.id && req.user!.userType !== 'Admin') {
            return res.status(403).json({ error: "You do not have permission to delete this post" });
        }

        await post.destroy();
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Failed to delete post" });
    }
});

export default router;

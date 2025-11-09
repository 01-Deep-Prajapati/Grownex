import express from "express";
import auth from "../middleware/auth.js";
import Post from "../models/post.js";
import User from "../models/user.js";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";

const router = express.Router();

// Like a post
router.post("/:postId/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if post is already liked
    if (post.likes && post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: "Post already liked" });
    }

    // Initialize likes array if it doesn't exist
    if (!post.likes) {
      post.likes = [];
    }

    // Add like
    post.likes.push(req.user.id);
    await post.save();

    // Return updated post with populated user info
    const updatedPost = await Post.findById(post._id)
      .populate("userId", "name profileImage")
      .populate("likes", "name profileImage");

    res.json(updatedPost);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Error liking post" });
  }
});

// Unlike a post
router.delete("/:postId/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if post is not liked
    if (!post.likes || !post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: "Post not liked yet" });
    }

    // Remove like
    post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    await post.save();

    // Return updated post with populated user info
    const updatedPost = await Post.findById(post._id)
      .populate("userId", "name profileImage")
      .populate("likes", "name profileImage");

    res.json(updatedPost);
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ message: "Error unliking post" });
  }
});

// Create a post
router.post("/", auth, upload.single("media"), async (req, res) => {
  try {
    const { content } = req.body;
    const post = new Post({
      content,
      userId: req.user.id,
    });

    // Handle media upload if present
    if (req.file) {
      const mediaUrl = await uploadMedia(req.file);
      post.media = {
        url: mediaUrl,
        type: req.file.mimetype.startsWith("image/") ? "image" : "video",
      };
    }

    await post.save();

    // Populate user info before sending response
    const populatedPost = await Post.findById(post._id).populate(
      "userId",
      "name profileImage"
    );
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post" });
  }
});

// Get all posts
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name profileImage");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Get posts by user ID
router.get("/user/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all posts by the user
    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "name profileImage");

    res.json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Error fetching user posts" });
  }
});

// Update a post
router.put("/:postId", auth, upload.single("media"), async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Find post and check ownership
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this post" });
    }

    // Update post content
    post.content = content;

    // Handle media upload if present
    if (req.file) {
      const mediaUrl = await uploadMedia(req.file);
      post.media = {
        url: mediaUrl,
        type: req.file.mimetype.startsWith("image/") ? "image" : "video",
      };
    }

    await post.save();

    // Return updated post with populated user info
    const updatedPost = await Post.findById(postId).populate(
      "userId",
      "name profileImage"
    );
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
router.delete("/:postId", auth, async (req, res) => {
  try {
    const { postId } = req.params;

    // Find post and check ownership
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post" });
  }
});

export default router;

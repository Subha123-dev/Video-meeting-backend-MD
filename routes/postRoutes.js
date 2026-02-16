import express from "express";
import {
  createPost,
  getAllPosts,
  likePost,
  commentPost,
  deletePost,
  deleteComment,
  uploadPostImage
} from "../controllers/postController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create post (text + imageUrl)
router.post("/", protect, createPost);

// Get all posts
router.get("/", protect, getAllPosts);

// Like post
router.put("/like/:id", protect, likePost);

// Comment post
router.post("/comment/:id", protect, commentPost);

// Delete post
router.delete("/:id", protect, deletePost);

// Delete comment
router.delete("/:postId/comment/:commentId", protect, deleteComment);

// Upload image
router.post("/upload", protect, upload.single("image"), uploadPostImage);

export default router;

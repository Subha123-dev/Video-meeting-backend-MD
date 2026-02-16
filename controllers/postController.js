import Post from "../models/Post.js";

// ✅ Upload Image Controller
export const uploadPostImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create Post
export const createPost = async (req, res) => {
  try {
    const { text, imageUrl } = req.body;

    if (!text && !imageUrl) {
      return res.status(400).json({ message: "Post text or image is required" });
    }

    const newPost = await Post.create({
      user: req.user._id,
      text: text || "",
      imageUrl: imageUrl || "",
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Like / Unlike Post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id.toString();

    if (post.likes.includes(userId)) {
      // unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // like
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: "Like updated",
      likesCount: post.likes.length,
      likes: post.likes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Comment Post
export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: req.user._id,
      text,
    });

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate("user", "name email")
      .populate("comments.user", "name email");

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // only owner can delete
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete post" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.find((c) => c._id.toString() === commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only comment owner OR post owner can delete comment
    if (
      comment.user.toString() !== req.user._id.toString() &&
      post.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete comment" });
    }

    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);

    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

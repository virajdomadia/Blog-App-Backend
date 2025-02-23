const express = require("express");

const Comment = require("../models/Comment");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/api/blogs/:id/comments", protect, async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.id }).populate(
      "user",
      "username"
    );
    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

router.post("/api/blogs/:id/comments", protect, async (req, res) => {
  try {
    const newComment = new Comment({
      content: req.body.content,
      user: req.user.id,
      blog: req.params.id,
    });
    await newComment.save();
    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

module.exports = router;

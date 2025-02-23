const express = require("express");
const Blog = require("../models/Blog");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new blog post
router.post("/", protect, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    // Validate required fields
    if (!title || !content || !category || !tags) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new blog post
    const newBlog = new Blog({ title, content, category, tags });
    await newBlog.save();

    // Send response after successful creation
    res.status(201).json({
      message: "Blog post created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all blog posts
router.get("/", protect, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a single blog post by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ blog });
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a blog post
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    // Find and update the blog post
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, category, tags },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog post updated successfully",
      updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a blog post
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

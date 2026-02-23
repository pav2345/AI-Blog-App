import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from "../models/comment.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: true, token });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 }); // FIXED
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .sort({ createdAt: -1 })
      .populate("blog");

    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getDashboard = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments(); // FIXED (Component → Comment)
    const drafts = await Blog.countDocuments({ isPublished: false });

    const dashboardDate = {   // kept your variable name
      blogs,
      comments,
      drafts,
      recentBlogs
    };

    res.json({ success: true, dashboardDate }); // FIXED typo (dashboardDara)

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;

    await Comment.findByIdAndDelete(id); // FIXED (awaitComment → await Comment)

    await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Comment deleted successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const approveCommentById = async (req, res) => { // FIXED name
  try {
    const { id } = req.body;

    await Comment.findByIdAndUpdate(id, { isApproved: true });

    res.json({ success: true, message: "comment approved successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
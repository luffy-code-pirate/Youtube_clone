import express from "express";
import { getComments, addComment, updateComment, deleteComment } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:videoId", getComments);  // public: view comments
router.post("/", protect, addComment); // private: post comment
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

export default router;
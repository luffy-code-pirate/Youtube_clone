import express from "express";
import {
  getVideos, getVideoById, createVideo, updateVideo, deleteVideo, likeVideo, dislikeVideo,
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getVideos);             // public: browse/search/filter
router.get("/:id", getVideoById);       // public: watch a video
router.post("/", protect, createVideo); // private: upload
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);
router.put("/:id/like", protect, likeVideo);
router.put("/:id/dislike", protect, dislikeVideo);

export default router;
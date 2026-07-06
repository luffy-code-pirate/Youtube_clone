import express from "express";
import {
  getVideos,
  getTrendingVideos,
  getLikedVideos,
  getSubscriptionVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Special routes MUST come before /:id ──
// otherwise Express matches "trending" as an ID
router.get("/trending", getTrendingVideos);
router.get("/liked", protect, getLikedVideos);
router.get("/subscriptions", protect, getSubscriptionVideos);

// ── General routes ──
router.get("/", getVideos);
router.get("/:id", getVideoById);
router.post("/", protect, createVideo);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);
router.put("/:id/like", protect, likeVideo);
router.put("/:id/dislike", protect, dislikeVideo);

export default router;
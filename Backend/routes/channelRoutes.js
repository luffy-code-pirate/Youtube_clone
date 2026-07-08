import express from "express";
import {
  createChannel,
  getChannelById,
  getMyChannel,
  subscribeChannel,
} from "../controllers/channelController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CRITICAL: /mine and /subscribe must be defined BEFORE /:id
// Express matches routes top to bottom — if /:id comes first,
// it treats "mine" as a channel ID and fails

router.post("/", protect, createChannel);
router.get("/mine", protect, getMyChannel);
router.put("/:id/subscribe", protect, subscribeChannel);
router.get("/:id", getChannelById);

export default router;
import express from "express";
import { createChannel, getChannelById, getMyChannel } from "../controllers/channelController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createChannel); // must be logged in to create
router.get("/mine", protect, getMyChannel);
router.get("/:id", getChannelById);       // public viewing

export default router;
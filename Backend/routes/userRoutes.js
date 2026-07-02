import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);          // public
router.post("/login", loginUser);                 // public
router.get("/profile", protect, getUserProfile);  // private (needs token)

export default router;
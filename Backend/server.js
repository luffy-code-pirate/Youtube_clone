// Import required packages
import express from "express";       // web framework
import mongoose from "mongoose";     // MongoDB connector
import cors from "cors";             // allows frontend to call backend
import dotenv from "dotenv";         // reads .env file

// Import our route files (we'll create these next)
import userRoutes from "./routes/userRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config(); // load variables from .env into process.env

const app = express(); // create the express application

app.use(cors());           // enable cross-origin requests (frontend <-> backend)
app.use(express.json());  // parse incoming JSON request bodies automatically

// Mount each route group under its own URL prefix
// e.g. all user-auth routes will start with /api/users
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/comments", commentRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
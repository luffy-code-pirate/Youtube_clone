import mongoose from "mongoose";

// Schema = blueprint for what a "User" document looks like in MongoDB
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true }, // must be unique
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // will store the HASHED password, not plain text
    avatar: { type: String, default: "" },
    // reference to channels owned by this user (stores ObjectIds, not full data)
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
  },
  { timestamps: true } // automatically adds createdAt & updatedAt fields
);

// "User" here becomes the MongoDB collection name (pluralized to "users")
export default mongoose.model("User", userSchema);
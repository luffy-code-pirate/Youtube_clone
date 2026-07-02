import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true }, // which video this belongs to
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   // who wrote it
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
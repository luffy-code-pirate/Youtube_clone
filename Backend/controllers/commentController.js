import Comment from "../models/Comment.js";

// GET /api/comments/:videoId
export const getComments = async (req, res) => {
  const comments = await Comment.find({ videoId: req.params.videoId })
    .populate("userId", "username avatar") // bring in commenter's name/avatar
    .sort({ createdAt: -1 });
  res.json(comments);
};

// POST /api/comments (protected)
export const addComment = async (req, res) => {
  const { videoId, text } = req.body;
  const comment = await Comment.create({ videoId, text, userId: req.userId });
  const populated = await comment.populate("userId", "username avatar");
  res.status(201).json(populated);
};

// PUT /api/comments/:id (only the author can edit)
export const updateComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.userId.toString() !== req.userId)
    return res.status(403).json({ message: "Not authorized" });

  comment.text = req.body.text;
  await comment.save();
  res.json(comment);
};

// DELETE /api/comments/:id (only the author can delete)
export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.userId.toString() !== req.userId)
    return res.status(403).json({ message: "Not authorized" });

  await comment.deleteOne();
  res.json({ message: "Comment deleted" });
};
import Comment from "../models/Comment.js";

// GET /api/comments/:videoId
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/comments
export const addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;

    // validate required fields
    if (!videoId || !text) {
      return res.status(400).json({ message: "videoId and text are required" });
    }
    if (!text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const comment = await Comment.create({
      videoId,
      text: text.trim(),
      userId: req.userId,
    });

    // populate userId so frontend gets username immediately
    const populated = await Comment.findById(comment._id).populate(
      "userId",
      "username avatar"
    );

    res.status(201).json(populated);
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/comments/:id
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (String(comment.userId) !== String(req.userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (!req.body.text?.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    comment.text = req.body.text.trim();
    await comment.save();

    const populated = await Comment.findById(comment._id).populate(
      "userId",
      "username avatar"
    );
    res.json(populated);
  } catch (err) {
    console.error("Update comment error:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/comments/:id
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (String(comment.userId) !== String(req.userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ message: err.message });
  }
};
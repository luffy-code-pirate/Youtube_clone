import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

// GET /api/videos?search=...&category=...
export const getVideos = async (req, res) => {
  const { search, category } = req.query;
  let filter = {};

  // case-insensitive partial match on title (for the search bar)
  if (search) filter.title = { $regex: search, $options: "i" };
  // only apply category filter if it's not "All"
  if (category && category !== "All") filter.category = category;

  const videos = await Video.find(filter)
    .populate("channelId", "channelName") // only bring in the channel's name field
    .sort({ createdAt: -1 }); // newest first

  res.json(videos);
};

// GET /api/videos/:id
export const getVideoById = async (req, res) => {
  const video = await Video.findById(req.params.id).populate("channelId", "channelName");
  if (!video) return res.status(404).json({ message: "Video not found" });

  video.views += 1; // increment view count every time someone opens it
  await video.save();

  res.json(video);
};

// POST /api/videos (protected)
export const createVideo = async (req, res) => {
  try {
    const { title, thumbnailUrl, videoUrl, description, category, channelId } = req.body;

    const video = await Video.create({
      title, thumbnailUrl, videoUrl, description, category,
      channelId, uploader: req.userId,
    });

    // add this video's ID to the channel's video list
    await Channel.findByIdAndUpdate(channelId, { $push: { videos: video._id } });

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/videos/:id (only the uploader can edit)
export const updateVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: "Video not found" });
  if (video.uploader.toString() !== req.userId)
    return res.status(403).json({ message: "Not authorized" });

  Object.assign(video, req.body); // overwrite fields with new data
  await video.save();
  res.json(video);
};

// DELETE /api/videos/:id (only the uploader can delete)
export const deleteVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: "Video not found" });
  if (video.uploader.toString() !== req.userId)
    return res.status(403).json({ message: "Not authorized" });

  // remove from channel's video list too
  await Channel.findByIdAndUpdate(video.channelId, { $pull: { videos: video._id } });
  await video.deleteOne();

  res.json({ message: "Video deleted" });
};

// PUT /api/videos/:id/like (toggle like)
export const likeVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  const uid = req.userId;

  // remove from dislikes if present (can't like AND dislike at once)
  video.dislikedBy = video.dislikedBy.filter((id) => id.toString() !== uid);

  if (video.likedBy.some((id) => id.toString() === uid)) {
    // already liked -> clicking again removes the like
    video.likedBy = video.likedBy.filter((id) => id.toString() !== uid);
  } else {
    video.likedBy.push(uid);
  }

  video.likes = video.likedBy.length;
  video.dislikes = video.dislikedBy.length;
  await video.save();
  res.json(video);
};

// PUT /api/videos/:id/dislike (toggle dislike) — mirror of likeVideo
export const dislikeVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  const uid = req.userId;

  video.likedBy = video.likedBy.filter((id) => id.toString() !== uid);

  if (video.dislikedBy.some((id) => id.toString() === uid)) {
    video.dislikedBy = video.dislikedBy.filter((id) => id.toString() !== uid);
  } else {
    video.dislikedBy.push(uid);
  }

  video.likes = video.likedBy.length;
  video.dislikes = video.dislikedBy.length;
  await video.save();
  res.json(video);
};
import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

// GET /api/videos?search=...&category=...&sort=...
export const getVideos = async (req, res) => {
  const { search, category, sort } = req.query;
  let filter = {};

  // search filter — case insensitive partial match
  if (search) filter.title = { $regex: search, $options: "i" };

  // category filter
  if (category && category !== "All") filter.category = category;

  // sort options
  let sortOption = { createdAt: -1 }; // default: newest first
  if (sort === "trending") sortOption = { views: -1 }; // most viewed first

  const videos = await Video.find(filter)
    .populate("channelId", "channelName")
    .sort(sortOption);

  res.json(videos);
};

// GET /api/videos/trending — most viewed videos
export const getTrendingVideos = async (req, res) => {
  const videos = await Video.find()
    .populate("channelId", "channelName")
    .sort({ views: -1 }) // sort by views descending
    .limit(20);
  res.json(videos);
};

// GET /api/videos/liked — videos liked by logged in user
export const getLikedVideos = async (req, res) => {
  try {
    // find all videos where the user's ID is in the likedBy array
    const videos = await Video.find({ likedBy: req.userId })
      .populate("channelId", "channelName")
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/videos/subscriptions — videos from subscribed channels
export const getSubscriptionVideos = async (req, res) => {
  try {
    // find all channels the user has subscribed to
    const subscribedChannels = await Channel.find({
      subscribedBy: req.userId,
    });

    // get all video IDs from those channels
    const channelIds = subscribedChannels.map((c) => c._id);

    // fetch videos from those channels
    const videos = await Video.find({ channelId: { $in: channelIds } })
      .populate("channelId", "channelName")
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/videos/:id — single video + increment views
export const getVideoById = async (req, res) => {
  const video = await Video.findById(req.params.id).populate(
    "channelId",
    "channelName subscribers"
  );
  if (!video) return res.status(404).json({ message: "Video not found" });
  video.views += 1;
  await video.save();
  res.json(video);
};

// POST /api/videos — upload video (protected)
export const createVideo = async (req, res) => {
  try {
    const { title, thumbnailUrl, videoUrl, description, category, channelId } =
      req.body;
    const video = await Video.create({
      title,
      thumbnailUrl,
      videoUrl,
      description,
      category,
      channelId,
      uploader: req.userId,
    });
    // add video to channel's videos array
    await Channel.findByIdAndUpdate(channelId, {
      $push: { videos: video._id },
    });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/videos/:id — update video (owner only)
export const updateVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: "Video not found" });
  if (video.uploader.toString() !== req.userId)
    return res.status(403).json({ message: "Not authorized" });
  Object.assign(video, req.body);
  await video.save();
  res.json(video);
};

// DELETE /api/videos/:id — delete video (owner only)
export const deleteVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: "Video not found" });
  if (video.uploader.toString() !== req.userId)
    return res.status(403).json({ message: "Not authorized" });
  await Channel.findByIdAndUpdate(video.channelId, {
    $pull: { videos: video._id },
  });
  await video.deleteOne();
  res.json({ message: "Video deleted" });
};

// PUT /api/videos/:id/like — toggle like
export const likeVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  const uid = req.userId;
  // remove from dislikes if present
  video.dislikedBy = video.dislikedBy.filter(
    (id) => String(id) !== String(uid)
  );
  if (video.likedBy.some((id) => String(id) === String(uid))) {
    // already liked → unlike
    video.likedBy = video.likedBy.filter((id) => String(id) !== String(uid));
  } else {
    video.likedBy.push(uid);
  }
  video.likes = video.likedBy.length;
  video.dislikes = video.dislikedBy.length;
  await video.save();
  res.json(video);
};

// PUT /api/videos/:id/dislike — toggle dislike
export const dislikeVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  const uid = req.userId;
  // remove from likes if present
  video.likedBy = video.likedBy.filter((id) => String(id) !== String(uid));
  if (video.dislikedBy.some((id) => String(id) === String(uid))) {
    // already disliked → remove
    video.dislikedBy = video.dislikedBy.filter(
      (id) => String(id) !== String(uid)
    );
  } else {
    video.dislikedBy.push(uid);
  }
  video.likes = video.likedBy.length;
  video.dislikes = video.dislikedBy.length;
  await video.save();
  res.json(video);
};
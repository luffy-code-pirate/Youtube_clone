import Channel from "../models/Channel.js";
import User from "../models/User.js";

// POST /api/channels (must be logged in)
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    const channel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: req.userId, // comes from the protect middleware
    });

    // also link this channel to the user's "channels" array
    await User.findByIdAndUpdate(req.userId, { $push: { channels: channel._id } });

    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/channels/:id (anyone can view a channel)
export const getChannelById = async (req, res) => {
  try {
    // .populate("videos") replaces video IDs with full video documents
    const channel = await Channel.findById(req.params.id).populate("videos");
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/channels/mine (logged-in user's own channel)
export const getMyChannel = async (req, res) => {
  const channel = await Channel.findOne({ owner: req.userId }).populate("videos");
  res.json(channel);
};
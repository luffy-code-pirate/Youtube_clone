import Channel from "../models/Channel.js";
import User from "../models/User.js";

// POST /api/channels
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    if (!channelName?.trim()) {
      return res.status(400).json({ message: "Channel name is required" });
    }

    // check if user already has a channel
    const existing = await Channel.findOne({ owner: req.userId });
    if (existing) {
      return res.status(400).json({ message: "You already have a channel" });
    }

    const channel = await Channel.create({
      channelName: channelName.trim(),
      description: description?.trim() || "",
      channelBanner: channelBanner?.trim() || "",
      owner: req.userId,
    });

    await User.findByIdAndUpdate(req.userId, {
      $push: { channels: channel._id },
    });

    res.status(201).json(channel);
  } catch (err) {
    console.error("Create channel error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/channels/mine
export const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.userId }).populate("videos");
    // return null if no channel — frontend handles this
    res.json(channel || null);
  } catch (err) {
    console.error("Get my channel error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/channels/:id
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate("videos");
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    res.json(channel);
  } catch (err) {
    console.error("Get channel error:", err);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/channels/:id/subscribe
export const subscribeChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (String(channel.owner) === String(req.userId)) {
      return res.status(400).json({
        message: "You cannot subscribe to your own channel",
      });
    }

    const alreadySubscribed = channel.subscribedBy.some(
      (id) => String(id) === String(req.userId)
    );

    if (alreadySubscribed) {
      channel.subscribedBy = channel.subscribedBy.filter(
        (id) => String(id) !== String(req.userId)
      );
    } else {
      channel.subscribedBy.push(req.userId);
    }

    channel.subscribers = channel.subscribedBy.length;
    await channel.save();
    res.json(channel);
  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ message: err.message });
  }
};
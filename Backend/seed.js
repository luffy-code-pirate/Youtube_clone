import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Channel from "./models/Channel.js";
import Video from "./models/Video.js";
import Comment from "./models/Comment.js";

dotenv.config();

const seed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Clear existing data
    await User.deleteMany();
    await Channel.deleteMany();
    await Video.deleteMany();
    await Comment.deleteMany();
    console.log("Existing data cleared");

    // ── Create 2 users ──
    const hashedPassword = await bcrypt.hash("123456", 10);

    const user1 = await User.create({
      username: "JohnDoe",
      email: "john@example.com",
      password: hashedPassword,
    });

    const user2 = await User.create({
      username: "JaneSmith",
      email: "jane@example.com",
      password: hashedPassword,
    });

    console.log("Users created");

    // ── Create 2 channels ──
    const channel1 = await Channel.create({
      channelName: "Code with John",
      owner: user1._id,
      description: "Coding tutorials and tech reviews by John Doe.",
      channelBanner: "https://picsum.photos/seed/channel1/1200/200",
      subscribers: 5200,
    });

    const channel2 = await Channel.create({
      channelName: "Jane Learns Tech",
      owner: user2._id,
      description: "Learning web development one step at a time.",
      channelBanner: "https://picsum.photos/seed/channel2/1200/200",
      subscribers: 1800,
    });

    // Link channels to users
    await User.findByIdAndUpdate(user1._id, { $push: { channels: channel1._id } });
    await User.findByIdAndUpdate(user2._id, { $push: { channels: channel2._id } });

    console.log("Channels created");

    // ── Create videos ──
    const videosData = [
      {
        title: "Learn React in 30 Minutes",
        thumbnailUrl: "https://picsum.photos/seed/react/320/180",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "A quick tutorial to get started with React.",
        category: "Web Development",
        channelId: channel1._id,
        uploader: user1._id,
        views: 15200,
        likes: 1023,
        dislikes: 45,
      },
      {
        title: "JavaScript ES6 Features Explained",
        thumbnailUrl: "https://picsum.photos/seed/js/320/180",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Learn all the modern JavaScript ES6 features.",
        category: "JavaScript",
        channelId: channel1._id,
        uploader: user1._id,
        views: 8900,
        likes: 654,
        dislikes: 12,
      },
      {
        title: "Data Structures for Beginners",
        thumbnailUrl: "https://picsum.photos/seed/ds/320/180",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Learn arrays, linked lists, stacks and queues.",
        category: "Data Structures",
        channelId: channel1._id,
        uploader: user1._id,
        views: 12400,
        likes: 890,
        dislikes: 23,
      },
      {
        title: "Top 10 Programming Music Playlists",
        thumbnailUrl: "https://picsum.photos/seed/music/320/180",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Best music to listen to while coding.",
        category: "Music",
        channelId: channel2._id,
        uploader: user2._id,
        views: 5600,
        likes: 432,
        dislikes: 8,
      },
      {
        title: "Gaming Setup Tour 2024",
        thumbnailUrl: "https://picsum.photos/seed/gaming/320/180",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "My complete gaming and coding setup tour.",
        category: "Gaming",
        channelId: channel2._id,
        uploader: user2._id,
        views: 3200,
        likes: 287,
        dislikes: 5,
      },
      {
        title: "How to Learn Web Development in 2024",
        thumbnailUrl: "https://picsum.photos/seed/edu/320/180",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Complete roadmap to become a web developer.",
        category: "Education",
        channelId: channel2._id,
        uploader: user2._id,
        views: 21000,
        likes: 1800,
        dislikes: 34,
      },
    ];

    const videos = await Video.insertMany(videosData);
    console.log("Videos created");

    // Link videos to channels
    await Channel.findByIdAndUpdate(channel1._id, {
      $push: { videos: { $each: [videos[0]._id, videos[1]._id, videos[2]._id] } },
    });
    await Channel.findByIdAndUpdate(channel2._id, {
      $push: { videos: { $each: [videos[3]._id, videos[4]._id, videos[5]._id] } },
    });

    // ── Create sample comments ──
    await Comment.create({
      videoId: videos[0]._id,
      userId: user2._id,
      text: "Great video! Very helpful for beginners.",
    });

    await Comment.create({
      videoId: videos[0]._id,
      userId: user1._id,
      text: "Thanks for watching! More videos coming soon.",
    });

    await Comment.create({
      videoId: videos[1]._id,
      userId: user2._id,
      text: "ES6 features are so powerful, great explanation!",
    });

    console.log("Comments created");

    console.log("\n✅ Database seeded successfully!");
    console.log("──────────────────────────────────");
    console.log("Test Login Credentials:");
    console.log("Email: john@example.com  | Password: 123456");
    console.log("Email: jane@example.com  | Password: 123456");
    console.log("──────────────────────────────────");

    process.exit(0); // exit script after seeding
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();
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
    // Two videos per homepage category (All, Web Development, JavaScript,
    // Data Structures, Music, Gaming, Education, News) so every filter
    // button returns results instead of showing an empty grid.
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
        title: "Build a REST API with Express",
        thumbnailUrl: "https://picsum.photos/seed/express/320/180",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Step-by-step guide to building a backend API with Node and Express.",
        category: "Web Development",
        channelId: channel2._id,
        uploader: user2._id,
        views: 9700,
        likes: 712,
        dislikes: 19,
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
        title: "Async/Await vs Promises",
        thumbnailUrl: "https://picsum.photos/seed/async/320/180",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Understanding asynchronous JavaScript once and for all.",
        category: "JavaScript",
        channelId: channel2._id,
        uploader: user2._id,
        views: 6300,
        likes: 401,
        dislikes: 9,
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
        title: "Binary Trees Explained Visually",
        thumbnailUrl: "https://picsum.photos/seed/trees/320/180",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "A visual walkthrough of binary trees and traversal methods.",
        category: "Data Structures",
        channelId: channel2._id,
        uploader: user2._id,
        views: 7100,
        likes: 533,
        dislikes: 14,
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
        title: "Lo-fi Beats for Deep Focus",
        thumbnailUrl: "https://picsum.photos/seed/lofi/320/180",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Two hours of lo-fi beats to help you concentrate.",
        category: "Music",
        channelId: channel1._id,
        uploader: user1._id,
        views: 18400,
        likes: 1502,
        dislikes: 21,
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
        title: "Top 5 Indie Games of the Year",
        thumbnailUrl: "https://picsum.photos/seed/indiegames/320/180",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Our picks for the best indie games this year.",
        category: "Gaming",
        channelId: channel1._id,
        uploader: user1._id,
        views: 4400,
        likes: 356,
        dislikes: 11,
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
      {
        title: "5 Study Techniques That Actually Work",
        thumbnailUrl: "https://picsum.photos/seed/study/320/180",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Science-backed study techniques for better retention.",
        category: "Education",
        channelId: channel1._id,
        uploader: user1._id,
        views: 13700,
        likes: 980,
        dislikes: 27,
      },
      {
        title: "Tech News Weekly Roundup",
        thumbnailUrl: "https://picsum.photos/seed/technews/320/180",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "This week's biggest stories from the tech world.",
        category: "News",
        channelId: channel1._id,
        uploader: user1._id,
        views: 6800,
        likes: 512,
        dislikes: 16,
      },
      {
        title: "AI Announcements You Missed This Month",
        thumbnailUrl: "https://picsum.photos/seed/ainews/320/180",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Catching up on the latest AI industry announcements.",
        category: "News",
        channelId: channel2._id,
        uploader: user2._id,
        views: 9100,
        likes: 674,
        dislikes: 22,
      },
    ];

    const videos = await Video.insertMany(videosData);
    console.log(`${videos.length} videos created`);

    // Link videos back to their channels dynamically (works no matter
    // how many videos are added above, no hard-coded indices needed).
    const channel1VideoIds = videos
      .filter((v) => v.channelId.toString() === channel1._id.toString())
      .map((v) => v._id);
    const channel2VideoIds = videos
      .filter((v) => v.channelId.toString() === channel2._id.toString())
      .map((v) => v._id);

    await Channel.findByIdAndUpdate(channel1._id, {
      $push: { videos: { $each: channel1VideoIds } },
    });
    await Channel.findByIdAndUpdate(channel2._id, {
      $push: { videos: { $each: channel2VideoIds } },
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
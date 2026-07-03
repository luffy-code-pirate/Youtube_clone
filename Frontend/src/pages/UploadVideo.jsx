import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Must match the categories in Home.jsx filter buttons
const CATEGORIES = [
  "Web Development",
  "JavaScript",
  "Data Structures",
  "Music",
  "Gaming",
  "Education",
  "News",
];

export default function UploadVideo() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);     // user's channel
  const [channelLoading, setChannelLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    thumbnailUrl: "",
    videoUrl: "",
    description: "",
    category: "Web Development", // default category
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) return navigate("/login");

    // Check if user has a channel
    const fetchChannel = async () => {
      try {
        const res = await api.get("/channels/mine");
        setChannel(res.data); // null if no channel yet
      } catch (err) {
        console.error(err);
      } finally {
        setChannelLoading(false);
      }
    };
    fetchChannel();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.title.trim()) return setError("Title is required");
    if (!form.videoUrl.trim()) return setError("Video URL is required");
    if (!form.thumbnailUrl.trim()) return setError("Thumbnail URL is required");

    try {
      setLoading(true);
      await api.post("/videos", {
        ...form,
        channelId: channel._id, // link video to user's channel
      });
      // After upload go to their channel to see the new video
      navigate(`/channel/${channel._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload video");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking for channel
  if (channelLoading) {
    return <p style={{ color: "white", padding: "20px" }}>Loading...</p>;
  }

  // If user has no channel yet, prompt them to create one
  if (!channel) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2 style={{ color: "white", marginBottom: "16px" }}>
          You need a channel to upload videos
        </h2>
        <button
          onClick={() => navigate("/create-channel")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#ff0000",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Create Channel
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ color: "white", marginBottom: "24px" }}>Upload Video</h2>
      <p style={{ color: "#aaa", marginBottom: "24px", fontSize: "14px" }}>
        Uploading to: <strong style={{ color: "white" }}>{channel.channelName}</strong>
      </p>

      {error && (
        <div style={{
          backgroundColor: "#3a1a1a",
          color: "#ff6b6b",
          padding: "10px",
          borderRadius: "6px",
          marginBottom: "16px",
          fontSize: "14px",
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter video title"
            style={inputStyle}
          />
        </div>

        {/* Video URL */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Video URL *</label>
          <input
            type="text"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            placeholder="https://example.com/video.mp4"
            style={inputStyle}
          />
        </div>

        {/* Thumbnail URL */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Thumbnail URL *</label>
          <input
            type="text"
            value={form.thumbnailUrl}
            onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
            placeholder="https://example.com/thumbnail.jpg"
            style={inputStyle}
          />
          {/* Preview thumbnail */}
          {form.thumbnailUrl && (
            <img
              src={form.thumbnailUrl}
              alt="Thumbnail preview"
              style={{
                width: "100%",
                maxHeight: "180px",
                objectFit: "cover",
                borderRadius: "6px",
                marginTop: "8px",
              }}
            />
          )}
        </div>

        {/* Description */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Tell viewers about your video"
            rows={4}
            style={{ ...inputStyle, resize: "vertical", lineHeight: "1.5" }}
          />
        </div>

        {/* Category dropdown */}
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={{
              ...inputStyle,
              cursor: "pointer",
            }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} style={{ backgroundColor: "#121212" }}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => navigate(`/channel/${channel._id}`)}
            style={{
              padding: "10px 20px",
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid #303030",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ff0000",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              fontWeight: "bold",
            }}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </div>
      </form>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#aaa",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  backgroundColor: "#121212",
  border: "1px solid #303030",
  borderRadius: "6px",
  color: "white",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};
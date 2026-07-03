import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Channel() {
  const { id } = useParams();       // channel ID from URL
  const { user } = useAuth();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState(null); // which video is being edited
  const [editForm, setEditForm] = useState({});           // edit form values

  // Fetch channel — handles both /channel/mine and /channel/:id
  const fetchChannel = async () => {
    try {
      setLoading(true);
      let res;
      if (id === "mine") {
        // Get the logged in user's own channel
        res = await api.get("/channels/mine");
        // If they have no channel yet, send them to create one
        if (!res.data) return navigate("/create-channel");
      } else {
        res = await api.get(`/channels/${id}`);
      }
      setChannel(res.data);
    } catch (err) {
      console.error("Error fetching channel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [id]);

  // ── Delete a video ──
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await api.delete(`/videos/${videoId}`);
      fetchChannel(); // refresh channel to remove deleted video from list
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  // ── Start editing a video ──
  const handleStartEdit = (video) => {
    setEditingVideo(video._id);
    // Pre-fill form with current video values
    setEditForm({
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      category: video.category,
    });
  };

  // ── Save edited video ──
  const handleSaveEdit = async (videoId) => {
    try {
      await api.put(`/videos/${videoId}`, editForm);
      setEditingVideo(null); // exit edit mode
      fetchChannel();        // refresh to show updated data
    } catch (err) {
      console.error("Error updating video:", err);
    }
  };

  // Check if the logged in user owns this channel
  const isOwner = user && channel && channel.owner === user.id;

  if (loading) return <p style={{ color: "white", padding: "20px" }}>Loading...</p>;
  if (!channel) return <p style={{ color: "white", padding: "20px" }}>Channel not found</p>;

  return (
    <div>
      {/* ── Channel Banner ── */}
      {channel.channelBanner ? (
        <img
          src={channel.channelBanner}
          alt="Channel banner"
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        />
      ) : (
        // Default banner if no image provided
        <div style={{
          width: "100%",
          height: "180px",
          backgroundColor: "#272727",
          borderRadius: "8px",
          marginBottom: "20px",
        }} />
      )}

      {/* ── Channel Info ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "24px",
        flexWrap: "wrap",
      }}>
        {/* Channel avatar (first letter of name) */}
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "#ff0000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "32px",
          fontWeight: "bold",
          flexShrink: 0,
        }}>
          {channel.channelName?.[0]?.toUpperCase()}
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ color: "white", margin: "0 0 4px" }}>{channel.channelName}</h2>
          <p style={{ color: "#aaa", margin: "0 0 4px", fontSize: "14px" }}>
            {channel.subscribers} subscribers • {channel.videos?.length || 0} videos
          </p>
          <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>
            {channel.description}
          </p>
        </div>

        {/* Upload button — only visible to channel owner */}
        {isOwner && (
          <button
            onClick={() => navigate("/upload")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ff0000",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            + Upload Video
          </button>
        )}
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #272727", marginBottom: "24px" }} />

      {/* ── Videos Section ── */}
      <h3 style={{ color: "white", marginBottom: "16px" }}>Videos</h3>

      {channel.videos?.length === 0 && (
        <p style={{ color: "#aaa" }}>No videos yet.</p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {channel.videos?.map((video) => (
          <div
            key={video._id}
            style={{
              width: "280px",
              backgroundColor: "#1f1f1f",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {/* ── Edit Mode ── */}
            {editingVideo === video._id ? (
              <div style={{ padding: "12px" }}>
                <h4 style={{ color: "white", marginBottom: "12px" }}>Edit Video</h4>

                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Title"
                  style={inputStyle}
                />
                <input
                  value={editForm.thumbnailUrl}
                  onChange={(e) => setEditForm({ ...editForm, thumbnailUrl: e.target.value })}
                  placeholder="Thumbnail URL"
                  style={{ ...inputStyle, marginTop: "8px" }}
                />
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Description"
                  rows={3}
                  style={{ ...inputStyle, marginTop: "8px", resize: "vertical" }}
                />

                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <button
                    onClick={() => setEditingVideo(null)}
                    style={cancelBtnStyle}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(video._id)}
                    style={saveBtnStyle}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              // ── Display Mode ──
              <>
                {/* Thumbnail — clicking opens video player */}
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  onClick={() => navigate(`/video/${video._id}`)}
                  style={{
                    width: "100%",
                    height: "158px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
                <div style={{ padding: "10px" }}>
                  <h4 style={{
                    color: "white",
                    fontSize: "14px",
                    margin: "0 0 4px",
                    // Truncate long titles
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}>
                    {video.title}
                  </h4>
                  <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 10px" }}>
                    {video.views} views
                  </p>

                  {/* Edit/Delete buttons — only for owner */}
                  {isOwner && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleStartEdit(video)}
                        style={cancelBtnStyle}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video._id)}
                        style={{ ...cancelBtnStyle, color: "#ff6b6b" }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  backgroundColor: "#121212",
  border: "1px solid #303030",
  borderRadius: "6px",
  color: "white",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const cancelBtnStyle = {
  padding: "6px 14px",
  backgroundColor: "#272727",
  color: "white",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "13px",
};

const saveBtnStyle = {
  padding: "6px 14px",
  backgroundColor: "#3ea6ff",
  color: "black",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "13px",
};
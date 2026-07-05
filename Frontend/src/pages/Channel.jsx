import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Channel() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchChannel = async () => {
    try {
      setLoading(true);
      let res;
      if (id === "mine") {
        res = await api.get("/channels/mine");
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

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await api.delete(`/videos/${videoId}`);
      fetchChannel();
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  const handleStartEdit = (video) => {
    setEditingVideo(video._id);
    setEditForm({
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      category: video.category,
    });
  };

  const handleSaveEdit = async (videoId) => {
    try {
      await api.put(`/videos/${videoId}`, editForm);
      setEditingVideo(null);
      fetchChannel();
    } catch (err) {
      console.error("Error updating video:", err);
    }
  };

  // String comparison to handle MongoDB ObjectId vs string mismatch
  const isOwner =
    user &&
    channel &&
    String(channel.owner) === String(user.id);

  const formatViews = (views) => {
    if (!views) return "0";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  if (loading) {
    return (
      <div style={{ color: "white", padding: "40px", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  if (!channel) {
    return (
      <div style={{ color: "white", padding: "40px", textAlign: "center" }}>
        Channel not found.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

      {/* ── Banner ── */}
      {channel.channelBanner ? (
        <img
          src={channel.channelBanner}
          alt="Channel banner"
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "16px",
          }}
        />
      ) : (
        <div style={{
          width: "100%",
          height: "200px",
          background: "linear-gradient(135deg, #1f1f1f, #272727)",
          borderRadius: "12px",
          marginBottom: "16px",
        }} />
      )}

      {/* ── Channel Info Row ── */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "24px",
        marginBottom: "24px",
        flexWrap: "wrap",
      }}>
        {/* Avatar */}
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
          fontWeight: "500",
          flexShrink: 0,
        }}>
          {channel.channelName?.[0]?.toUpperCase()}
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <h1 style={{
            color: "white",
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "4px",
          }}>
            {channel.channelName}
          </h1>
          <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "4px" }}>
            {formatViews(channel.subscribers)} subscribers •{" "}
            {channel.videos?.length || 0} videos
          </p>
          <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "12px" }}>
            {channel.description}
          </p>

          {/* Subscribe button */}
          <button style={{
            padding: "0 16px",
            height: "36px",
            backgroundColor: "white",
            color: "#0f0f0f",
            border: "none",
            borderRadius: "18px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
          }}>
            Subscribe
          </button>
        </div>

        {/* Upload button — owner only */}
        {isOwner && (
          <button
            onClick={() => navigate("/upload")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0 20px",
              height: "40px",
              backgroundColor: "#ff0000",
              color: "white",
              border: "none",
              borderRadius: "20px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            + Upload Video
          </button>
        )}
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #272727", marginBottom: "24px" }} />

      {/* ── Videos Section ── */}
      <h2 style={{
        color: "white",
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "16px",
      }}>
        Videos
      </h2>

      {/* No videos message */}
      {channel.videos?.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <p style={{ color: "#aaa", fontSize: "16px" }}>
            No videos yet.
          </p>
          {isOwner && (
            <button
              onClick={() => navigate("/upload")}
              style={{
                marginTop: "16px",
                padding: "0 20px",
                height: "40px",
                backgroundColor: "#ff0000",
                color: "white",
                border: "none",
                borderRadius: "20px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Upload your first video
            </button>
          )}
        </div>
      )}

      {/* Video grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "16px",
      }}>
        {channel.videos?.map((video) => (
          <div
            key={video._id}
            style={{
              backgroundColor: "#1f1f1f",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* Edit mode */}
            {editingVideo === video._id ? (
              <div style={{ padding: "16px" }}>
                <h4 style={{
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "12px",
                }}>
                  Edit Video
                </h4>

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
                  style={{ ...inputStyle, marginTop: "8px", resize: "vertical", lineHeight: "1.5" }}
                />
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  style={{ ...inputStyle, marginTop: "8px", cursor: "pointer" }}
                >
                  {["Web Development","JavaScript","Data Structures","Music","Gaming","Education","News"].map((c) => (
                    <option key={c} value={c} style={{ backgroundColor: "#121212" }}>{c}</option>
                  ))}
                </select>

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
              /* Display mode */
              <>
                {/* Thumbnail */}
                <div
                  onClick={() => navigate(`/video/${video._id}`)}
                  style={{
                    position: "relative",
                    paddingTop: "56.25%",
                    overflow: "hidden",
                    cursor: "pointer",
                    backgroundColor: "#272727",
                  }}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    style={{
                      position: "absolute",
                      top: 0, left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>

                {/* Info */}
                <div style={{ padding: "12px" }}>
                  <h4
                    onClick={() => navigate(`/video/${video._id}`)}
                    style={{
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginBottom: "4px",
                      cursor: "pointer",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {video.title}
                  </h4>
                  <p style={{ color: "#aaa", fontSize: "12px", marginBottom: "10px" }}>
                    {formatViews(video.views)} views
                  </p>

                  {/* Edit/Delete — owner only */}
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

/* ── Reusable styles ── */
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
  borderRadius: "18px",
  cursor: "pointer",
  fontSize: "13px",
};

const saveBtnStyle = {
  padding: "6px 14px",
  backgroundColor: "#3ea6ff",
  color: "#0f0f0f",
  border: "none",
  borderRadius: "18px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "13px",
};
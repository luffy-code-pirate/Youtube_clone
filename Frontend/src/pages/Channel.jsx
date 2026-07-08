import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Channel() {
  const { id } = useParams();
  const { user, authLoading } = useAuth(); // authLoading prevents premature fetches
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noChannel, setNoChannel] = useState(false);
  const [error, setError] = useState("");
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchChannel = async () => {
    try {
      setLoading(true);
      setError("");
      setNoChannel(false);

      let res;

      if (id === "mine") {
        // must be logged in to view own channel
        if (!user) {
          navigate("/login");
          return;
        }
        res = await api.get("/channels/mine");

        // null means user has no channel yet
        if (!res.data) {
          setNoChannel(true);
          setLoading(false);
          return;
        }
      } else {
  if (!id || id === "undefined") {
    // instead of showing error, redirect to home
    navigate("/");
    return;
  }
  res = await api.get(`/channels/${id}`);
}

      setChannel(res.data);
    } catch (err) {
      console.error("Error fetching channel:", err);
      setError("Failed to load channel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // don't fetch until auth state is fully loaded from localStorage
    // this is what fixes the /channels/undefined bug on refresh
    if (authLoading) return;
    fetchChannel();
  }, [id, user, authLoading]);

  // ── Delete video ──
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await api.delete(`/videos/${videoId}`);
      fetchChannel();
    } catch (err) {
      alert("Failed to delete: " + (err.response?.data?.message || err.message));
    }
  };

  // ── Start editing ──
  const handleStartEdit = (video) => {
    setEditingVideo(video._id);
    setEditForm({
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      category: video.category,
    });
  };

  // ── Save edit ──
  const handleSaveEdit = async (videoId) => {
    try {
      await api.put(`/videos/${videoId}`, editForm);
      setEditingVideo(null);
      fetchChannel();
    } catch (err) {
      alert("Failed to update: " + (err.response?.data?.message || err.message));
    }
  };

  // ── Subscribe toggle ──
  const handleSubscribe = async () => {
    if (!user) return navigate("/login");
    try {
      const res = await api.put(`/channels/${channel._id}/subscribe`);
      setChannel(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Subscribe failed");
    }
  };

  // string comparison handles MongoDB ObjectId vs string mismatch
  const isOwner =
    user && channel && String(channel.owner) === String(user.id);

  const isSubscribed =
    user &&
    channel?.subscribedBy?.some(
      (sid) => String(sid) === String(user.id)
    );

  const formatCount = (n) => {
    if (!n) return "0";
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  // ── Loading state ──
  if (authLoading || loading) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "60px" }}>
        Loading...
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <p style={{ color: "#ff6b6b", marginBottom: "16px", fontSize: "16px" }}>
          {error}
        </p>
        <button
          onClick={fetchChannel}
          style={{
            padding: "0 20px",
            height: "36px",
            backgroundColor: "#272727",
            color: "white",
            border: "none",
            borderRadius: "18px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── No channel yet ──
  if (noChannel) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ color: "white", fontSize: "20px", marginBottom: "8px" }}>
          You don't have a channel yet
        </p>
        <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "24px" }}>
          Create a channel to upload videos and reach viewers
        </p>
        <button
          onClick={() => navigate("/create-channel")}
          style={{
            padding: "0 24px",
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
          Create Channel
        </button>
      </div>
    );
  }

  // ── Channel not found ──
  if (!channel) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "60px" }}>
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
          onError={(e) => { e.target.style.display = "none"; }}
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

      {/* ── Channel Info ── */}
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
            {formatCount(channel.subscribers)} subscribers •{" "}
            {channel.videos?.length || 0} videos
          </p>
          <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "16px" }}>
            {channel.description}
          </p>

          {/* Subscribe button — hidden from owner */}
          {!isOwner && (
            <button
              onClick={handleSubscribe}
              style={{
                padding: "0 20px",
                height: "36px",
                backgroundColor: isSubscribed ? "#272727" : "white",
                color: isSubscribed ? "white" : "#0f0f0f",
                border: isSubscribed ? "1px solid #717171" : "none",
                borderRadius: "18px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isSubscribed
                  ? "#3f3f3f"
                  : "#e0e0e0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isSubscribed
                  ? "#272727"
                  : "white";
              }}
            >
              {isSubscribed ? "✓ Subscribed" : "Subscribe"}
            </button>
          )}
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

      <hr style={{
        border: "none",
        borderTop: "1px solid #272727",
        marginBottom: "24px",
      }} />

      {/* ── Videos ── */}
      <h2 style={{
        color: "white",
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "16px",
      }}>
        Videos
      </h2>

      {channel.videos?.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <p style={{ color: "#aaa", fontSize: "16px", marginBottom: "16px" }}>
            No videos yet.
          </p>
          {isOwner && (
            <button
              onClick={() => navigate("/upload")}
              style={{
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
            {/* ── Edit mode ── */}
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
                  style={{
                    ...inputStyle,
                    marginTop: "8px",
                    resize: "vertical",
                    lineHeight: "1.5",
                  }}
                />
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  style={{ ...inputStyle, marginTop: "8px", cursor: "pointer" }}
                >
                  {[
                    "Web Development",
                    "JavaScript",
                    "Data Structures",
                    "Music",
                    "Gaming",
                    "Education",
                    "News",
                  ].map((c) => (
                    <option key={c} value={c} style={{ backgroundColor: "#121212" }}>
                      {c}
                    </option>
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
              /* ── Display mode ── */
              <>
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
                  <p style={{
                    color: "#aaa",
                    fontSize: "12px",
                    marginBottom: "10px",
                  }}>
                    {formatCount(video.views)} views
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
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function VideoPlayer() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/videos/${id}`);
      setVideo(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRelated = async () => {
    try {
      const res = await api.get("/videos");
      setRelatedVideos(res.data.filter((v) => v._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVideo();
    fetchComments();
    fetchRelated();
    window.scrollTo(0, 0);
  }, [id]);

  const handleLike = async () => {
    if (!user) return navigate("/login");
    const res = await api.put(`/videos/${id}/like`);
    setVideo(res.data);
  };

  const handleDislike = async () => {
    if (!user) return navigate("/login");
    const res = await api.put(`/videos/${id}/dislike`);
    setVideo(res.data);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await api.post("/comments", { videoId: id, text: commentText });
    setCommentText("");
    fetchComments();
  };

  const handleStartEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return;
    await api.put(`/comments/${commentId}`, { text: editText });
    setEditingId(null);
    setEditText("");
    fetchComments();
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    await api.delete(`/comments/${commentId}`);
    fetchComments();
  };

  // Check if logged in user is the author of a comment
  // String() conversion handles MongoDB ObjectId vs string mismatch
  const isCommentOwner = (comment) => {
    if (!user) return false;
    return (
      String(user.id) === String(comment.userId?._id) ||
      String(user.id) === String(comment.userId)
    );
  };

  const formatViews = (views) => {
    if (!views) return "0";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
  };

  const hasLiked = video?.likedBy?.some(
    (uid) => String(uid) === String(user?.id)
  );
  const hasDisliked = video?.dislikedBy?.some(
    (uid) => String(uid) === String(user?.id)
  );

  const channelInitial = video?.channelId?.channelName?.[0]?.toUpperCase() || "C";

  if (loading) {
    return (
      <div style={{ color: "white", padding: "40px", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  if (!video) {
    return (
      <div style={{ color: "white", padding: "40px", textAlign: "center" }}>
        Video not found.
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      gap: "24px",
      maxWidth: "1800px",
      margin: "0 auto",
    }}>

      {/* ══════════════════════════════════
          LEFT — Video + Info + Comments
      ══════════════════════════════════ */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* ── Video Player ── */}
        <div style={{
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#000",
          aspectRatio: "16/9",
        }}>
          <video
            src={video.videoUrl}
            controls
            autoPlay
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        </div>

        {/* ── Video Title ── */}
        <h1 style={{
          color: "white",
          fontSize: "20px",
          fontWeight: "600",
          lineHeight: "28px",
          marginTop: "16px",
          marginBottom: "8px",
        }}>
          {video.title}
        </h1>

        {/* ── Channel row + Actions ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
        }}>

          {/* Channel info + Subscribe */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Avatar */}
            <div
              onClick={() => {
  if (video.channelId?._id) {
    navigate(`/channel/${video.channelId._id}`);
  }
}}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#ff0000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "500",
                fontSize: "16px",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {channelInitial}
            </div>

            {/* Channel name + subscribers */}
            <div
              onClick={() => {
  if (video.channelId?._id) {
    navigate(`/channel/${video.channelId._id}`);
  }
}}
              style={{ cursor: "pointer" }}
            >
              <p style={{
                color: "white",
                fontSize: "15px",
                fontWeight: "600",
                margin: 0,
              }}>
                {video.channelId?.channelName || "Unknown Channel"}
              </p>
              <p style={{ color: "#aaa", fontSize: "13px", margin: 0 }}>
                {formatViews(video.channelId?.subscribers || 0)} subscribers
              </p>
            </div>

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
              marginLeft: "8px",
            }}>
              Subscribe
            </button>
          </div>

          {/* Like / Dislike / Share / Download */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

            {/* Like + Dislike pill */}
            <div style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#272727",
              borderRadius: "20px",
              overflow: "hidden",
            }}>
              {/* Like button */}
              <button
                onClick={handleLike}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0 16px",
                  height: "36px",
                  backgroundColor: hasLiked ? "#3f3f3f" : "transparent",
                  border: "none",
                  borderRight: "1px solid #3f3f3f",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3f3f3f"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = hasLiked ? "#3f3f3f" : "transparent"}
              >
                <svg viewBox="0 0 24 24" style={{ width: "20px", fill: "white" }}>
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                </svg>
                {formatViews(video.likes)}
              </button>

              {/* Dislike button */}
              <button
                onClick={handleDislike}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 16px",
                  height: "36px",
                  backgroundColor: hasDisliked ? "#3f3f3f" : "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3f3f3f"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = hasDisliked ? "#3f3f3f" : "transparent"}
              >
                <svg viewBox="0 0 24 24" style={{ width: "20px", fill: "white" }}>
                  <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                </svg>
              </button>
            </div>

            {/* Share button */}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0 16px",
                height: "36px",
                backgroundColor: "#272727",
                border: "none",
                borderRadius: "18px",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3f3f3f"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#272727"}
            >
              <svg viewBox="0 0 24 24" style={{ width: "18px", fill: "white" }}>
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              Share
            </button>

            {/* Download button */}
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0 16px",
                height: "36px",
                backgroundColor: "#272727",
                border: "none",
                borderRadius: "18px",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3f3f3f"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#272727"}
            >
              <svg viewBox="0 0 24 24" style={{ width: "18px", fill: "white" }}>
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Download
            </button>

            {/* More options */}
            <button
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#272727",
                border: "none",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3f3f3f"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#272727"}
            >
              <svg viewBox="0 0 24 24" style={{ width: "20px", fill: "white" }}>
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Description box ── */}
        <div
          style={{
            backgroundColor: "#272727",
            borderRadius: "12px",
            padding: "12px 16px",
            marginBottom: "24px",
            cursor: "pointer",
          }}
          onClick={() => setShowFullDesc(!showFullDesc)}
        >
          <p style={{
            color: "white",
            fontSize: "14px",
            fontWeight: "500",
            marginBottom: "8px",
          }}>
            {formatViews(video.views)} views &nbsp;
            {new Date(video.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>

          <p style={{
            color: "white",
            fontSize: "14px",
            lineHeight: "20px",
            whiteSpace: "pre-wrap",
            display: showFullDesc ? "block" : "-webkit-box",
            WebkitLineClamp: showFullDesc ? "unset" : 3,
            WebkitBoxOrient: "vertical",
            overflow: showFullDesc ? "visible" : "hidden",
          }}>
            {video.description || "No description provided."}
          </p>

          <p style={{
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            marginTop: "8px",
          }}>
            {showFullDesc ? "Show less" : "...more"}
          </p>
        </div>

        {/* ══════════════
            Comments
        ══════════════ */}
        <div>
          <h3 style={{
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "20px",
          }}>
            {comments.length} Comments
          </h3>

          {/* Add comment */}
          {user ? (
            <div style={{
              display: "flex",
              gap: "16px",
              marginBottom: "32px",
              alignItems: "flex-start",
            }}>
              {/* User avatar */}
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#3ea6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "500",
                fontSize: "16px",
                flexShrink: 0,
              }}>
                {user.username?.[0]?.toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  style={{
                    width: "100%",
                    padding: "8px 0",
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: "1px solid #3f3f3f",
                    color: "white",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = "white"}
                  onBlur={(e) => e.target.style.borderBottomColor = "#3f3f3f"}
                />

                {commentText && (
                  <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                    marginTop: "8px",
                  }}>
                    <button
                      onClick={() => setCommentText("")}
                      style={ghostBtnStyle}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddComment}
                      style={blueBtnStyle}
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: "#aaa", marginBottom: "24px", fontSize: "14px" }}>
              <span
                onClick={() => navigate("/login")}
                style={{ color: "#3ea6ff", cursor: "pointer" }}
              >
                Sign in
              </span>{" "}
              to add a comment.
            </p>
          )}

          {/* Comment list */}
          {comments.map((comment) => (
            <div
              key={comment._id}
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {/* Avatar */}
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: getColor(comment.userId?.username?.[0]),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "500",
                fontSize: "14px",
                flexShrink: 0,
              }}>
                {comment.userId?.username?.[0]?.toUpperCase() || "U"}
              </div>

              <div style={{ flex: 1 }}>
                {/* Name + time */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}>
                  <span style={{
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}>
                    @{comment.userId?.username || "Unknown"}
                  </span>
                  <span style={{ color: "#aaa", fontSize: "12px" }}>
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>

                {/* Edit mode */}
                {editingId === comment._id ? (
                  <div>
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 0",
                        backgroundColor: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        color: "white",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    <div style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "8px",
                      justifyContent: "flex-end",
                    }}>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}
                        style={ghostBtnStyle}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(comment._id)}
                        style={blueBtnStyle}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Comment text */}
                    <p style={{
                      color: "white",
                      fontSize: "14px",
                      lineHeight: "20px",
                      marginBottom: "8px",
                    }}>
                      {comment.text}
                    </p>

                    {/* Action buttons row */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                      {/* Like icon */}
                      <button style={iconBtnStyle}>
                        <svg viewBox="0 0 24 24" style={{ width: "16px", fill: "#aaa" }}>
                          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                        </svg>
                      </button>

                      {/* Dislike icon */}
                      <button style={iconBtnStyle}>
                        <svg viewBox="0 0 24 24" style={{ width: "16px", fill: "#aaa" }}>
                          <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                        </svg>
                      </button>

                      {/* Reply */}
                      <button style={{
                        ...iconBtnStyle,
                        color: "#aaa",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}>
                        Reply
                      </button>

                      {/* Edit / Delete — only for comment owner */}
                      {isCommentOwner(comment) && (
                        <>
                          <button
                            onClick={() => handleStartEdit(comment)}
                            style={{
                              ...iconBtnStyle,
                              color: "#aaa",
                              fontSize: "13px",
                              padding: "4px 8px",
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            style={{
                              ...iconBtnStyle,
                              color: "#ff6b6b",
                              fontSize: "13px",
                              padding: "4px 8px",
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════
          RIGHT — Related Videos
      ══════════════════════════════════ */}
      <div style={{
        width: "400px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        <h3 style={{
          color: "white",
          fontSize: "16px",
          fontWeight: "600",
          marginBottom: "8px",
        }}>
          Up next
        </h3>

        {relatedVideos.map((v) => (
          <div
            key={v._id}
            onClick={() => navigate(`/video/${v._id}`)}
            style={{
              display: "flex",
              gap: "8px",
              cursor: "pointer",
              borderRadius: "8px",
              padding: "4px",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#272727"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            {/* Thumbnail */}
            <div style={{
              width: "168px",
              height: "94px",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#272727",
              flexShrink: 0,
            }}>
              <img
                src={v.thumbnailUrl}
                alt={v.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0, paddingTop: "2px" }}>
              <p style={{
                color: "white",
                fontSize: "13px",
                fontWeight: "500",
                lineHeight: "18px",
                marginBottom: "6px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {v.title}
              </p>
              <p style={{ color: "#aaa", fontSize: "12px", marginBottom: "2px" }}>
                {v.channelId?.channelName || "Unknown"}
              </p>
              <p style={{ color: "#aaa", fontSize: "12px" }}>
                {formatViews(v.views)} views
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

/* ── Helper: consistent avatar color by letter ── */
function getColor(letter) {
  const colors = [
    "#ff0000", "#ff6d00", "#ffab00",
    "#2e7d32", "#1565c0", "#6a1b9a",
    "#ad1457", "#00838f",
  ];
  const index = (letter?.charCodeAt(0) || 0) % colors.length;
  return colors[index];
}

/* ── Reusable button styles ── */
const ghostBtnStyle = {
  padding: "0 16px",
  height: "36px",
  backgroundColor: "transparent",
  border: "none",
  borderRadius: "18px",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
};

const blueBtnStyle = {
  padding: "0 16px",
  height: "36px",
  backgroundColor: "#3ea6ff",
  border: "none",
  borderRadius: "18px",
  color: "#0f0f0f",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

const iconBtnStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
};
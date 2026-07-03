import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function VideoPlayer() {
  const { id } = useParams();   // gets video ID from the URL e.g. /video/abc123
  const { user } = useAuth();   // logged in user (or null)
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);       // video data
  const [comments, setComments] = useState([]);   // list of comments
  const [commentText, setCommentText] = useState(""); // new comment input
  const [editingId, setEditingId] = useState(null);   // which comment is being edited
  const [editText, setEditText] = useState("");        // text in edit input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch video details when page loads or ID changes
  const fetchVideo = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/videos/${id}`);
      setVideo(res.data);
    } catch (err) {
      setError("Video not found");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all comments for this video
  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // Run both fetches when component mounts
  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [id]);

  // ── Like button handler ──
  const handleLike = async () => {
    if (!user) return navigate("/login"); // must be logged in
    try {
      const res = await api.put(`/videos/${id}/like`);
      setVideo(res.data); // update like count instantly
    } catch (err) {
      console.error("Error liking video:", err);
    }
  };

  // ── Dislike button handler ──
  const handleDislike = async () => {
    if (!user) return navigate("/login");
    try {
      const res = await api.put(`/videos/${id}/dislike`);
      setVideo(res.data);
    } catch (err) {
      console.error("Error disliking video:", err);
    }
  };

  // ── Add new comment ──
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return; // ignore empty comments
    try {
      await api.post("/comments", { videoId: id, text: commentText });
      setCommentText(""); // clear input
      fetchComments();    // refresh comment list
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // ── Start editing a comment ──
  const handleStartEdit = (comment) => {
    setEditingId(comment._id);   // track which comment is being edited
    setEditText(comment.text);   // pre-fill edit input with current text
  };

  // ── Save edited comment ──
  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return;
    try {
      await api.put(`/comments/${commentId}`, { text: editText });
      setEditingId(null); // exit edit mode
      setEditText("");
      fetchComments();    // refresh list
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  // ── Cancel editing ──
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // ── Delete a comment ──
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments(); // refresh list
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // Check if logged in user has liked/disliked this video
  const hasLiked = video?.likedBy?.includes(user?.id);
  const hasDisliked = video?.dislikedBy?.includes(user?.id);

  if (loading) return <p style={{ color: "white", padding: "20px" }}>Loading...</p>;
  if (error) return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

  return (
    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>

      {/* ── LEFT: Video + info + comments ── */}
      <div style={{ flex: 1, minWidth: "300px" }}>

        {/* Video Player */}
        <video
          src={video.videoUrl}
          controls
          style={{
            width: "100%",
            borderRadius: "8px",
            backgroundColor: "#000",
            maxHeight: "500px",
          }}
        />

        {/* Video Title */}
        <h2 style={{ color: "white", marginTop: "16px", fontSize: "18px" }}>
          {video.title}
        </h2>

        {/* Views + date */}
        <p style={{ color: "#aaa", fontSize: "14px", margin: "6px 0" }}>
          {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
        </p>

        {/* ── Like / Dislike bar ── */}
        <div style={{
          display: "flex",
          gap: "12px",
          margin: "12px 0",
          padding: "12px 0",
          borderTop: "1px solid #272727",
          borderBottom: "1px solid #272727",
        }}>
          {/* Like button — highlighted if user already liked */}
          <button
            onClick={handleLike}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              backgroundColor: hasLiked ? "#ffffff" : "#272727",
              color: hasLiked ? "#000000" : "#ffffff",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            👍 {video.likes}
          </button>

          {/* Dislike button */}
          <button
            onClick={handleDislike}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              backgroundColor: hasDisliked ? "#ffffff" : "#272727",
              color: hasDisliked ? "#000000" : "#ffffff",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            👎 {video.dislikes}
          </button>
        </div>

        {/* Channel name — clickable */}
        <div
          onClick={() => navigate(`/channel/${video.channelId?._id}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "16px 0",
            cursor: "pointer",
          }}
        >
          {/* Channel avatar circle */}
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#ff0000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
          }}>
            {video.channelId?.channelName?.[0]?.toUpperCase() || "C"}
          </div>
          <div>
            <p style={{ color: "white", fontWeight: "bold", margin: 0 }}>
              {video.channelId?.channelName || "Unknown Channel"}
            </p>
            <p style={{ color: "#aaa", fontSize: "13px", margin: 0 }}>
              Click to view channel
            </p>
          </div>
        </div>

        {/* Video description */}
        <div style={{
          backgroundColor: "#272727",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}>
          <p style={{ color: "white", fontSize: "14px", lineHeight: "1.6" }}>
            {video.description || "No description provided."}
          </p>
        </div>

        {/* ── Comments Section ── */}
        <h3 style={{ color: "white", marginBottom: "16px" }}>
          {comments.length} Comments
        </h3>

        {/* Add comment form — only visible when logged in */}
        {user ? (
          <form
            onSubmit={handleAddComment}
            style={{ display: "flex", gap: "10px", marginBottom: "24px" }}
          >
            {/* User avatar */}
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#3ea6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
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
                  borderBottom: "1px solid #272727",
                  color: "white",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {/* Show submit button only when typing */}
              {commentText && (
                <div style={{ display: "flex", gap: "8px", marginTop: "8px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setCommentText("")}
                    style={cancelBtnStyle}
                  >
                    Cancel
                  </button>
                  <button type="submit" style={submitBtnStyle}>
                    Comment
                  </button>
                </div>
              )}
            </div>
          </form>
        ) : (
          // Prompt to login if not authenticated
          <p style={{ color: "#aaa", marginBottom: "16px" }}>
            <span
              onClick={() => navigate("/login")}
              style={{ color: "#3ea6ff", cursor: "pointer" }}
            >
              Sign in
            </span>{" "}
            to add a comment
          </p>
        )}

        {/* ── Comment List ── */}
        {comments.map((comment) => (
          <div
            key={comment._id}
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            {/* Commenter avatar */}
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#ff6b35",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              flexShrink: 0,
            }}>
              {comment.userId?.username?.[0]?.toUpperCase() || "U"}
            </div>

            <div style={{ flex: 1 }}>
              {/* Username + timestamp */}
              <p style={{ color: "white", fontSize: "13px", margin: "0 0 4px" }}>
                <strong>{comment.userId?.username || "Unknown"}</strong>{" "}
                <span style={{ color: "#aaa", fontWeight: "normal" }}>
                  • {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </p>

              {/* Edit mode vs display mode */}
              {editingId === comment._id ? (
                // ── Edit mode ──
                <div>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "6px",
                      backgroundColor: "#1f1f1f",
                      border: "1px solid #303030",
                      borderRadius: "4px",
                      color: "white",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                    <button onClick={handleCancelEdit} style={cancelBtnStyle}>
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(comment._id)}
                      style={submitBtnStyle}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                // ── Display mode ──
                <>
                  <p style={{ color: "white", fontSize: "14px", margin: "0 0 6px" }}>
                    {comment.text}
                  </p>

                  {/* Edit/Delete buttons — only show for comment author */}
                  {user && user.id === comment.userId?._id && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleStartEdit(comment)}
                        style={{ ...cancelBtnStyle, fontSize: "12px", padding: "4px 10px" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        style={{ ...cancelBtnStyle, fontSize: "12px", padding: "4px 10px", color: "#ff6b6b" }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Reusable button styles
const cancelBtnStyle = {
  padding: "6px 14px",
  backgroundColor: "transparent",
  color: "white",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "13px",
};

const submitBtnStyle = {
  padding: "6px 14px",
  backgroundColor: "#3ea6ff",
  color: "black",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "13px",
};
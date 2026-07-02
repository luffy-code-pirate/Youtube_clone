import { useNavigate } from "react-router-dom";

// This component renders ONE video card
// It receives a "video" object as a prop from the Home page
export default function VideoCard({ video }) {
  const navigate = useNavigate();

  // Format view count nicely: 15200 → "15.2K views"
  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  // Format date nicely: "2024-09-20" → "Sep 20, 2024"
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      onClick={() => navigate(`/video/${video._id}`)}
      style={{
        width: "300px",
        cursor: "pointer",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#0f0f0f",
      }}
      // Hover effect
      onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
      onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
    >
      {/* Thumbnail image */}
      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
        {/* 56.25% = 16:9 aspect ratio trick */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",  /* crop image to fill box without stretching */
            borderRadius: "8px",
          }}
          // If image fails to load, show a placeholder color
          onError={(e) => {
            e.target.style.backgroundColor = "#272727";
            e.target.src = "";
          }}
        />
      </div>

      {/* Video info below thumbnail */}
      <div style={{ padding: "10px 4px" }}>
        {/* Title — clamp to 2 lines max */}
        <h4 style={{
          color: "white",
          fontSize: "14px",
          marginBottom: "6px",
          display: "-webkit-box",
          WebkitLineClamp: 2,        /* max 2 lines */
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          lineHeight: "1.4",
        }}>
          {video.title}
        </h4>

        {/* Channel name */}
        <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "2px" }}>
          {video.channelId?.channelName || "Unknown Channel"}
          {/* ?. is optional chaining — won't crash if channelId is null */}
        </p>

        {/* Views + upload date */}
        <p style={{ color: "#aaa", fontSize: "12px" }}>
          {formatViews(video.views)} • {formatDate(video.createdAt)}
        </p>
      </div>
    </div>
  );
}
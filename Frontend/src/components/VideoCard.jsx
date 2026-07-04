import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const navigate = useNavigate();

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return `${views}`;
  };

  const timeAgo = (dateStr) => {
    const now = new Date();
    const then = new Date(dateStr);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
  };

  // Get first letter of channel name for avatar
  const channelInitial = video.channelId?.channelName?.[0]?.toUpperCase() || "C";

  return (
    <div
      onClick={() => navigate(`/video/${video._id}`)}
      style={{ cursor: "pointer", width: "100%" }}
    >
      {/* Thumbnail container — 16:9 ratio */}
      <div style={{
        position: "relative",
        width: "100%",
        paddingTop: "56.25%",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#272727",
      }}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.03)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </div>

      {/* Video info row */}
      <div style={{
        display: "flex",
        gap: "12px",
        padding: "12px 0",
      }}>
        {/* Channel avatar */}
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "#ff0000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "14px",
          flexShrink: 0,
          marginTop: "2px",
        }}>
          {channelInitial}
        </div>

        {/* Title + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title — max 2 lines */}
          <h4 style={{
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            lineHeight: "1.4",
            marginBottom: "6px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {video.title}
          </h4>

          {/* Channel name */}
          <p style={{
            color: "#aaa",
            fontSize: "13px",
            marginBottom: "2px",
          }}
            onClick={(e) => {
              e.stopPropagation(); // don't trigger video click
              navigate(`/channel/${video.channelId?._id}`);
            }}
          >
            {video.channelId?.channelName || "Unknown Channel"}
          </p>

          {/* Views • time ago */}
          <p style={{ color: "#aaa", fontSize: "13px" }}>
            {formatViews(video.views)} views • {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
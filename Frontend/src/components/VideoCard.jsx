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
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
  };

  const channelInitial = video.channelId?.channelName?.[0]?.toUpperCase() || "C";

  return (
    <div style={{ cursor: "pointer", width: "100%" }}>
      {/* Thumbnail */}
      <div
        onClick={() => navigate(`/video/${video._id}`)}
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%",
          borderRadius: "12px",
          overflow: "hidden",
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

      {/* Info row */}
      <div style={{
        display: "flex",
        gap: "12px",
        padding: "12px 0 20px",
      }}>
        {/* Channel avatar */}
        <div
          onClick={() => navigate(`/channel/${video.channelId?._id}`)}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: getColor(channelInitial),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "500",
            fontSize: "14px",
            flexShrink: 0,
            marginTop: "2px",
            cursor: "pointer",
          }}
        >
          {channelInitial}
        </div>

        {/* Text info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          <h4
            onClick={() => navigate(`/video/${video._id}`)}
            style={{
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "20px",
              maxHeight: "40px",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              marginBottom: "6px",
            }}
          >
            {video.title}
          </h4>

          {/* Channel name */}
          <p
            onClick={() => navigate(`/channel/${video.channelId?._id}`)}
            style={{
              color: "#aaaaaa",
              fontSize: "13px",
              lineHeight: "18px",
              marginBottom: "2px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "white"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#aaaaaa"}
          >
            {video.channelId?.channelName || "Unknown Channel"}
          </p>

          {/* Views • time */}
          <p style={{ color: "#aaaaaa", fontSize: "13px", lineHeight: "18px" }}>
            {formatViews(video.views)} views • {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

// Give each channel a consistent color based on first letter
function getColor(letter) {
  const colors = [
    "#ff0000","#ff6d00","#ffab00","#2e7d32",
    "#1565c0","#6a1b9a","#ad1457","#00838f",
  ];
  const index = (letter?.charCodeAt(0) || 0) % colors.length;
  return colors[index];
}
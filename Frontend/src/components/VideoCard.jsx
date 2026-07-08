import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const navigate = useNavigate();

  // format view count: 15200 → "15.2K"
  const formatViews = (views) => {
    if (!views) return "0";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  // format time ago: "2 days ago"
  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
  };

  const channelInitial = video.channelId?.channelName?.[0]?.toUpperCase() || "C";

  // navigate to video player
  const handleVideoClick = () => {
    if (video._id) navigate(`/video/${video._id}`);
  };

  // navigate to channel — guard against undefined ID
  const handleChannelClick = (e) => {
    e.stopPropagation(); // don't trigger video click
    if (video.channelId?._id) {
      navigate(`/channel/${video.channelId._id}`);
    }
  };

  return (
    <div style={{ cursor: "pointer", width: "100%" }}>

      {/* ── Thumbnail — 16:9 ratio ── */}
      <div
        onClick={handleVideoClick}
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
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </div>

      {/* ── Info row below thumbnail ── */}
      <div style={{
        display: "flex",
        gap: "12px",
        padding: "12px 0 20px",
      }}>

        {/* Channel avatar — clicking goes to channel page */}
        <div
          onClick={handleChannelClick}
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
            cursor: video.channelId?._id ? "pointer" : "default",
          }}
        >
          {channelInitial}
        </div>

        {/* Text info */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Video title — clicking opens video player */}
          <h4
            onClick={handleVideoClick}
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
              cursor: "pointer",
            }}
          >
            {video.title}
          </h4>

          {/* Channel name — clicking goes to channel */}
          <p
            onClick={handleChannelClick}
            style={{
              color: "#aaaaaa",
              fontSize: "13px",
              lineHeight: "18px",
              marginBottom: "2px",
              cursor: video.channelId?._id ? "pointer" : "default",
            }}
            onMouseEnter={(e) => {
              if (video.channelId?._id) e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#aaaaaa";
            }}
          >
            {video.channelId?.channelName || "Unknown Channel"}
          </p>

          {/* Views + time ago */}
          <p style={{
            color: "#aaaaaa",
            fontSize: "13px",
            lineHeight: "18px",
          }}>
            {formatViews(video.views)} views • {timeAgo(video.createdAt)}
          </p>

        </div>
      </div>
    </div>
  );
}

// gives each channel a consistent color based on first letter
function getColor(letter) {
  const colors = [
    "#ff0000", "#ff6d00", "#ffab00",
    "#2e7d32", "#1565c0", "#6a1b9a",
    "#ad1457", "#00838f",
  ];
  const index = (letter?.charCodeAt(0) || 0) % colors.length;
  return colors[index];
}
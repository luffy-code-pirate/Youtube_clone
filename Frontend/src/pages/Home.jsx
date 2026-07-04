import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";

const CATEGORIES = [
  "All", "Web Development", "JavaScript",
  "Data Structures", "Music", "Gaming",
  "Education", "News",
];

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await api.get("/videos", { params: { search, category } });
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [search, category]);

  return (
    <div>
      {/* ── Filter chips ── */}
      <div style={{
        display: "flex",
        gap: "12px",
        overflowX: "auto",
        padding: "12px 0",
        marginBottom: "16px",
        scrollbarWidth: "none", /* hide scrollbar on Firefox */
        position: "sticky",
        top: "56px",
        backgroundColor: "#0f0f0f",
        zIndex: 10,
      }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontSize: "14px",
              fontWeight: "500",
              flexShrink: 0,
              backgroundColor: category === cat ? "#ffffff" : "#272727",
              color: category === cat ? "#000000" : "#ffffff",
              transition: "background-color 0.1s ease",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search label */}
      {search && (
        <p style={{ color: "#aaa", marginBottom: "16px", fontSize: "14px" }}>
          Results for: <strong style={{ color: "white" }}>"{search}"</strong>
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <p style={{ color: "#aaa" }}>Loading...</p>
        </div>
      )}

      {/* No videos */}
      {!loading && videos.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <p style={{ fontSize: "24px", marginBottom: "8px" }}>📭</p>
          <p style={{ color: "white", fontWeight: "600", marginBottom: "4px" }}>
            No videos found
          </p>
          <p style={{ color: "#aaa", fontSize: "14px" }}>
            Try a different search or filter
          </p>
        </div>
      )}

      {/* Video grid — matches YouTube's layout */}
      {!loading && videos.length > 0 && (
        <div
          className="video-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
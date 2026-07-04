import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import VideoCard from "../components/VideoCard";

// Filter categories — must match backend category names
const CATEGORIES = [
  "All",
  "Web Development",
  "JavaScript",
  "Data Structures",
  "Music",
  "Gaming",
  "Education",
  "News",
];

export default function Home() {
  const [videos, setVideos] = useState([]);       // all fetched videos
  const [category, setCategory] = useState("All"); // active filter
  const [loading, setLoading] = useState(true);   // loading state

  // reads ?search=... from the URL (set by Header search form)
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  // Re-fetch videos whenever search or category changes
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await api.get("/videos", {
          params: { search, category },
        });
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

      {/* ── Filter chips bar ── */}
      <div
        className="filter-bar"
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          padding: "12px 0",
          marginBottom: "20px",
          position: "sticky",
          top: "56px",         /* sticks just below the header */
          backgroundColor: "#0f0f0f",
          zIndex: 10,
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontSize: "14px",
              fontWeight: "500",
              flexShrink: 0,
              /* active = white bg, inactive = dark bg */
              backgroundColor: category === cat ? "#ffffff" : "#272727",
              color: category === cat ? "#000000" : "#ffffff",
              transition: "background-color 0.1s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Search result label ── */}
      {search && (
        <p style={{ color: "#aaa", marginBottom: "20px", fontSize: "14px" }}>
          Search results for:{" "}
          <strong style={{ color: "white" }}>"{search}"</strong>
        </p>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div style={{ textAlign: "center", paddingTop: "80px" }}>
          <p style={{ color: "#aaa", fontSize: "16px" }}>Loading...</p>
        </div>
      )}

      {/* ── No videos found ── */}
      {!loading && videos.length === 0 && (
        <div style={{ textAlign: "center", paddingTop: "80px" }}>
          <svg
            viewBox="0 0 24 24"
            style={{ width: "80px", fill: "#aaa", marginBottom: "16px" }}
          >
            <path d="M4 6.47L5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4z" />
          </svg>
          <p style={{ color: "white", fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>
            No videos found
          </p>
          <p style={{ color: "#aaa", fontSize: "14px" }}>
            Try a different search or category
          </p>
        </div>
      )}

      {/* ── Video grid — 3 columns handled by CSS class ── */}
      {!loading && videos.length > 0 && (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

    </div>
  );
}